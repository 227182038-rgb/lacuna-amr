// Drug engine — deterministic per-drug training on the real pilot features,
// mirroring `lacuna train` (M0 catalogue rule + M1/M2 fitted models, sigmoid
// calibration, Mondrian/marginal conformal quantiles at alpha = 0.10).

import { loadAstTable, loadFeatures, loadM0Mapping, RUO_NOTICE } from "./data";
import { conformalSet, fitDrugModel, PRIMARY_SEED, type FittedResult } from "./models";
import type { DrugEngine, PredictionOutput } from "./types";

const engineCache = new Map<string, DrugEngine>();

export function getDrugEngine(drug: string): DrugEngine {
  const cached = engineCache.get(drug);
  if (cached) return cached;

  const ast = loadAstTable();
  const fm = loadFeatures();
  const m0 = loadM0Mapping();

  const rowsByIso = new Map<string, (typeof ast.rows)[number]>();
  for (const r of ast.rows) {
    if (r.drug === drug) rowsByIso.set(r.biosample, r);
  }

  const labelledIsolates: string[] = [];
  const ys: number[] = [];
  for (const iso of fm.isolates) {
    const r = rowsByIso.get(iso);
    if (!r) continue;
    if (r.labelEucast === "S") {
      labelledIsolates.push(iso);
      ys.push(0);
    } else if (r.labelEucast === "R") {
      labelledIsolates.push(iso);
      ys.push(1);
    }
  }

  const isoIndex = new Map(fm.isolates.map((iso, i) => [iso, i]));
  const featIndex = new Map(fm.features.map((f, i) => [f, i]));
  const X: number[][] = labelledIsolates.map((iso) => Array.from(fm.matrix[isoIndex.get(iso)!]));

  const m1 = fitDrugModel({ X, y: ys, features: fm.features, seed: PRIMARY_SEED }, "M1");
  const m2 = fitDrugModel({ X, y: ys, features: fm.features, seed: PRIMARY_SEED }, "M2");

  const labelCounts = { S: 0, R: 0, I: 0, censored: 0 };
  for (const r of ast.rows) {
    if (r.drug !== drug) continue;
    if (r.labelEucast === "S") labelCounts.S++;
    else if (r.labelEucast === "R") labelCounts.R++;
    else if (r.labelEucast === "I") labelCounts.I++;
    else labelCounts.censored++;
  }

  const engine: DrugEngine = {
    drug,
    labelCounts,
    m0Features: m0.feature_sets[drug] ?? [],
    features: fm.features,
    m1: toFitted(m1),
    m2: toFitted(m2),
    labelledIsolates,
    trainIsolates: m1.trainIdx.map((i) => labelledIsolates[i]),
    calIsolates: m1.calIdx.map((i) => labelledIsolates[i]),
  };
  engineCache.set(drug, engine);
  return engine;
}

function toFitted(r: FittedResult) {
  return {
    modelType: r.modelType,
    features: r.features,
    nTrain: r.nTrain,
    nCal: r.nCal,
    nCalR: r.nCalR,
    nCalS: r.nCalS,
    threshold: r.threshold,
    quantiles: r.quantiles,
    trainAuroc: Number.isFinite(r.trainAuroc) ? r.trainAuroc : null,
    calAuroc: Number.isFinite(r.calAuroc) ? r.calAuroc : null,
    internals: r.internals,
    calibrator: r.calibrator,
  };
}

function rawProbability(model: DrugEngine["m1"], x: number[]): number {
  if (model.internals.kind === "logreg") {
    const { weights, bias, mean, scale } = model.internals;
    let z = bias;
    for (let j = 0; j < weights.length; j++) z += weights[j] * ((x[j] - mean[j]) / scale[j]);
    return 1 / (1 + Math.exp(-z));
  }
  const { stumps, base, lr } = model.internals;
  let f = base;
  for (const s of stumps) f += lr * (x[s.feature] <= s.threshold ? s.leftVal : s.rightVal);
  return 1 / (1 + Math.exp(-f));
}

function calibrate(model: DrugEngine["m1"], rawP: number): number {
  const { a, b } = model.calibrator;
  const clamped = Math.min(Math.max(rawP, 1e-9), 1 - 1e-9);
  const z = Math.log(clamped / (1 - clamped));
  return 1 / (1 + Math.exp(-(a * z + b)));
}

export interface PredictInput {
  drug: string;
  isolate?: string; // biosample in the cohort
  toggles?: Record<string, 0 | 1>; // manual feature overrides (gene -> 0/1)
  modelType: "M0" | "M1" | "M2";
}

export function predict(input: PredictInput): PredictionOutput | { error: string } {
  const engine = getDrugEngine(input.drug);
  const fm = loadFeatures();
  const isoIndex = new Map(fm.isolates.map((iso, i) => [iso, i]));
  const featIndex = new Map(fm.features.map((f, i) => [f, i]));

  let x: number[];
  if (input.isolate) {
    const i = isoIndex.get(input.isolate);
    if (i === undefined) return { error: `Isolate ${input.isolate} not in the pilot cohort.` };
    x = Array.from(fm.matrix[i]);
  } else {
    x = new Array(fm.features.length).fill(0);
  }
  if (input.toggles) {
    for (const [gene, val] of Object.entries(input.toggles)) {
      const fi = featIndex.get(gene);
      if (fi !== undefined) x[fi] = val;
    }
  }

  const present: string[] = [];
  for (let j = 0; j < fm.features.length; j++) if (x[j] === 1) present.push(fm.features[j]);

  const m0Call: "S" | "R" = engine.m0Features.some((f) => {
    const fi = featIndex.get(f);
    return fi !== undefined && x[fi] === 1;
  })
    ? "R"
    : "S";

  if (input.modelType === "M0") {
    const pR = m0Call === "R" ? 1 : 0;
    return {
      drug: input.drug,
      isolate: input.isolate ?? null,
      determinants: present,
      m0Call,
      modelType: "M0",
      pS: 1 - pR,
      pR,
      call: m0Call,
      conformalSetMondrian: m0Call,
      conformalSetMarginal: m0Call,
      threshold: 0.5,
      quantiles: engine.m1.quantiles,
      ruoNotice: RUO_NOTICE,
    };
  }

  const fitted = input.modelType === "M1" ? engine.m1 : engine.m2;
  const pR = calibrate(fitted, rawProbability(fitted, x));
  const call: "S" | "R" = pR >= fitted.threshold ? "R" : "S";
  return {
    drug: input.drug,
    isolate: input.isolate ?? null,
    determinants: present,
    m0Call,
    modelType: input.modelType,
    pS: 1 - pR,
    pR,
    call,
    conformalSetMondrian: conformalSet(pR, fitted.quantiles, "mondrian"),
    conformalSetMarginal: conformalSet(pR, fitted.quantiles, "marginal"),
    threshold: fitted.threshold,
    quantiles: fitted.quantiles,
    ruoNotice: RUO_NOTICE,
  };
}

/** Engine meta for the UI (no per-isolate payloads). */
export function engineSummary(drug: string) {
  const e = getDrugEngine(drug);
  return {
    drug: e.drug,
    labelCounts: e.labelCounts,
    nFeatures: e.features.length,
    m0Features: e.m0Features,
    m1: { nTrain: e.m1.nTrain, nCal: e.m1.nCal, nCalR: e.m1.nCalR, nCalS: e.m1.nCalS, threshold: e.m1.threshold, quantiles: e.m1.quantiles, trainAuroc: e.m1.trainAuroc, calAuroc: e.m1.calAuroc },
    m2: { nTrain: e.m2.nTrain, nCal: e.m2.nCal, nCalR: e.m2.nCalR, nCalS: e.m2.nCalS, threshold: e.m2.threshold, quantiles: e.m2.quantiles, trainAuroc: e.m2.trainAuroc, calAuroc: e.m2.calAuroc },
    nLabelled: e.labelledIsolates.length,
  };
}
