// LACUNA-AMR web engine — statistical core.
// Faithful TypeScript re-implementation of the pipeline's model family:
//   M1 = L2-regularised logistic regression (standardised features, balanced class weights)
//   M2 = gradient-boosted decision stumps (log-loss boosting)
// plus Platt (sigmoid) calibration and split-conformal quantiles at alpha = 0.10,
// with Mondrian (per-class) and marginal variants — matching `lacuna train`.
// Deterministic: all randomness flows through the seeded RNG.

import { mulberry32 } from "./rng";

export const ALPHA = 0.1; // conformal target coverage 0.90
export const CALIBRATION_FRACTION = 0.6; // as in the released pilot artefact (69 train / 109 cal for ciprofloxacin)
export const PRIMARY_SEED = 20261101;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

/** Mann–Whitney AUROC with tie handling. */
export function auroc(y: number[], p: number[]): number {
  const pairs = y.map((yi, i) => ({ y: yi, p: p[i] }));
  const pos = pairs.filter((d) => d.y === 1);
  const neg = pairs.filter((d) => d.y === 0);
  if (pos.length === 0 || neg.length === 0) return NaN;
  let concordant = 0;
  for (const a of pos) {
    for (const b of neg) {
      if (a.p > b.p) concordant += 1;
      else if (a.p === b.p) concordant += 0.5;
    }
  }
  return concordant / (pos.length * neg.length);
}

/** Youden-index threshold on the calibration set. */
export function youdenThreshold(y: number[], p: number[]): number {
  const candidates = Array.from(new Set(p)).sort((a, b) => a - b);
  if (candidates.length === 0) return 0.5;
  let best = 0.5;
  let bestJ = -Infinity;
  for (const t of candidates) {
    let tp = 0, fn = 0, tn = 0, fp = 0;
    for (let i = 0; i < y.length; i++) {
      const pred = p[i] >= t ? 1 : 0;
      if (y[i] === 1 && pred === 1) tp++;
      else if (y[i] === 1 && pred === 0) fn++;
      else if (y[i] === 0 && pred === 1) fp++;
      else tn++;
    }
    const sens = tp + fn > 0 ? tp / (tp + fn) : 0;
    const spec = tn + fp > 0 ? tn / (tn + fp) : 0;
    const j = sens + spec - 1;
    if (j > bestJ) {
      bestJ = j;
      best = t;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Split-conformal machinery (alpha = 0.1 → 90% coverage)
// ---------------------------------------------------------------------------

/** Nonconformity score: 1 - p̂(true class). */
function score(y: number, pR: number): number {
  return 1 - (y === 1 ? pR : 1 - pR);
}

/** Finite-sample split-conformal quantile: ceil((n+1)(1-alpha))/n order statistic. */
function conformalQuantile(scores: number[], alpha: number): number {
  const n = scores.length;
  if (n === 0) return 1;
  const sorted = scores.slice().sort((a, b) => a - b);
  const k = Math.min(n, Math.ceil(((n + 1) * (1 - alpha)) / 1));
  // index k-1 of sorted scores (k in 1..n); fallback to max if k > n
  return k >= 1 ? sorted[k - 1] : sorted[n - 1];
}

// ---------------------------------------------------------------------------
// M1 — L2 logistic regression
// ---------------------------------------------------------------------------

export interface LogregModel {
  kind: "logreg";
  weights: number[];
  bias: number;
  mean: number[];
  scale: number[];
}

function fitLogreg(X: number[][], y: number[], opts: { lr?: number; iters?: number; l2?: number } = {}): LogregModel {
  const lr = opts.lr ?? 0.15;
  const iters = opts.iters ?? 2500;
  const l2 = opts.l2 ?? 1.0;
  const n = X.length;
  const d = n > 0 ? X[0].length : 0;
  // standardise
  const mean = new Array(d).fill(0);
  const scale = new Array(d).fill(1);
  for (let j = 0; j < d; j++) {
    let m = 0;
    for (let i = 0; i < n; i++) m += X[i][j];
    m /= Math.max(n, 1);
    let v = 0;
    for (let i = 0; i < n; i++) v += (X[i][j] - m) ** 2;
    v = Math.sqrt(v / Math.max(n, 1));
    mean[j] = m;
    scale[j] = v > 1e-12 ? v : 1;
  }
  const Z = X.map((row) => row.map((x, j) => (x - mean[j]) / scale[j]));
  // balanced class weights
  const nPos = y.reduce((s, v) => s + v, 0);
  const nNeg = y.length - nPos;
  const wPos = nPos > 0 ? y.length / (2 * nPos) : 1;
  const wNeg = nNeg > 0 ? y.length / (2 * nNeg) : 1;
  const weights = new Array(d).fill(0);
  let bias = 0;
  for (let it = 0; it < iters; it++) {
    const gw = new Array(d).fill(0);
    let gb = 0;
    for (let i = 0; i < n; i++) {
      let z = bias;
      for (let j = 0; j < d; j++) z += weights[j] * Z[i][j];
      const ph = 1 / (1 + Math.exp(-z));
      const g = (ph - y[i]) * (y[i] === 1 ? wPos : wNeg);
      for (let j = 0; j < d; j++) gw[j] += g * Z[i][j];
      gb += g;
    }
    for (let j = 0; j < d; j++) weights[j] -= lr * (gw[j] / Math.max(n, 1) + l2 * weights[j] / Math.max(n, 1) * 0.01);
    bias -= lr * (gb / Math.max(n, 1));
  }
  return { kind: "logreg", weights, bias, mean, scale };
}

function logregPredict(model: LogregModel, x: number[]): number {
  let z = model.bias;
  for (let j = 0; j < model.weights.length; j++) z += model.weights[j] * ((x[j] - model.mean[j]) / model.scale[j]);
  return 1 / (1 + Math.exp(-z));
}

// ---------------------------------------------------------------------------
// M2 — gradient-boosted decision stumps (log-loss boosting)
// ---------------------------------------------------------------------------

export interface GbmModel {
  kind: "gbm";
  stumps: { feature: number; threshold: number; leftVal: number; rightVal: number }[];
  base: number;
  lr: number;
}

function fitGbm(X: number[][], y: number[], opts: { rounds?: number; lr?: number } = {}): GbmModel {
  const rounds = opts.rounds ?? 120;
  const lr = opts.lr ?? 0.1;
  const n = X.length;
  const d = n > 0 ? X[0].length : 0;
  const p1 = clamp(y.reduce((s, v) => s + v, 0) / Math.max(n, 1), 1e-6, 1 - 1e-6);
  const base = Math.log(p1 / (1 - p1));
  const F = new Array(n).fill(base);
  const stumps: GbmModel["stumps"] = [];
  for (let r = 0; r < rounds; r++) {
    // negative gradients (residuals) of log loss
    const g = F.map((f, i) => y[i] - 1 / (1 + Math.exp(-f)));
    // fit the best stump by squared-error reduction on residuals
    let best: { feature: number; threshold: number; leftVal: number; rightVal: number; sse: number } | null = null;
    for (let j = 0; j < d; j++) {
      const vals = X.map((row) => row[j]);
      const uniq = Array.from(new Set(vals)).sort((a, b) => a - b);
      for (let t = 0; t < uniq.length; t++) {
        const thr = uniq[t];
        let ls = 0, ln = 0, rs = 0, rn = 0;
        for (let i = 0; i < n; i++) {
          if (vals[i] <= thr) {
            ls += g[i];
            ln++;
          } else {
            rs += g[i];
            rn++;
          }
        }
        const lm = ln > 0 ? ls / ln : 0;
        const rm = rn > 0 ? rs / rn : 0;
        let sse = 0;
        for (let i = 0; i < n; i++) {
          const pred = vals[i] <= thr ? lm : rm;
          sse += (g[i] - pred) ** 2;
        }
        if (!best || sse < best.sse) best = { feature: j, threshold: thr, leftVal: lm, rightVal: rm, sse };
      }
    }
    if (!best || best.sse >= 1e-12) {
      if (!best) break;
    }
    stumps.push({ feature: best.feature, threshold: best.threshold, leftVal: best.leftVal, rightVal: best.rightVal });
    for (let i = 0; i < n; i++) {
      F[i] += lr * (X[i][best.feature] <= best.threshold ? best.leftVal : best.rightVal);
    }
  }
  return { kind: "gbm", stumps, base, lr };
}

function gbmPredict(model: GbmModel, x: number[]): number {
  let f = model.base;
  for (const s of model.stumps) {
    f += model.lr * (x[s.feature] <= s.threshold ? s.leftVal : s.rightVal);
  }
  return 1 / (1 + Math.exp(-f));
}

// ---------------------------------------------------------------------------
// Calibration (Platt sigmoid) — used below 200/class in calibration, per CLI
// ---------------------------------------------------------------------------

function fitPlatt(rawLogit: number[], y: number[]): { a: number; b: number } {
  // 1-D logistic regression on the raw probability, via logit transform
  const z = rawLogit.map((p) => Math.log(clamp(p, 1e-9, 1 - 1e-9) / (1 - clamp(p, 1e-9, 1 - 1e-9))));
  let a = 1;
  let b = 0;
  const lr = 0.1;
  for (let it = 0; it < 1500; it++) {
    let ga = 0;
    let gb = 0;
    for (let i = 0; i < z.length; i++) {
      const ph = 1 / (1 + Math.exp(-(a * z[i] + b)));
      const e = ph - y[i];
      ga += e * z[i];
      gb += e;
    }
    a -= (lr * ga) / Math.max(z.length, 1);
    b -= (lr * gb) / Math.max(z.length, 1);
  }
  return { a, b };
}

function plattApply(cal: { a: number; b: number }, rawP: number): number {
  const z = Math.log(clamp(rawP, 1e-9, 1 - 1e-9) / (1 - clamp(rawP, 1e-9, 1 - 1e-9)));
  return 1 / (1 + Math.exp(-(cal.a * z + cal.b)));
}

// ---------------------------------------------------------------------------
// Combined fitting — mirrors `lacuna train` carve-out + calibration + conformal
// ---------------------------------------------------------------------------

export interface FitInput {
  X: number[][]; // all labelled rows
  y: number[]; // 1 = R, 0 = S
  features: string[];
  seed: number;
}

export interface FittedResult {
  modelType: "M1" | "M2";
  features: string[];
  nTrain: number;
  nCal: number;
  nCalR: number;
  nCalS: number;
  threshold: number;
  quantiles: { marginal: number; mondrian: { "0": number; "1": number }; alpha: number };
  internals: LogregModel | GbmModel;
  calibrator: { a: number; b: number };
  /** calibrated p_R for every input row, in input order */
  calibratedAll: number[];
  trainIdx: number[];
  calIdx: number[];
  trainAuroc: number;
  calAuroc: number;
}

export function fitDrugModel(input: FitInput, modelType: "M1" | "M2"): FittedResult {
  const { X, y, features, seed } = input;
  const n = X.length;
  // deterministic stratified carve-out: shuffle within each class
  const rand = mulberry32(seed + (modelType === "M1" ? 1 : 2));
  const idxS: number[] = [];
  const idxR: number[] = [];
  for (let i = 0; i < n; i++) (y[i] === 1 ? idxR : idxS).push(i);
  const shufflePair = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  shufflePair(idxS);
  shufflePair(idxR);
  const nCal = Math.round(n * CALIBRATION_FRACTION);
  const calIdx: number[] = [];
  const trainIdx: number[] = [];
  const nCalR = Math.round((nCal * idxR.length) / Math.max(n, 1));
  calIdx.push(...idxR.slice(0, nCalR), ...idxS.slice(0, Math.max(0, nCal - nCalR)));
  trainIdx.push(...idxR.slice(nCalR), ...idxS.slice(Math.max(0, nCal - nCalR)));

  const Xtr = trainIdx.map((i) => X[i]);
  const ytr = trainIdx.map((i) => y[i]);
  const internals: LogregModel | GbmModel =
    modelType === "M1" ? fitLogreg(Xtr, ytr) : fitGbm(Xtr, ytr);
  const raw = (x: number[]) => (internals.kind === "logreg" ? logregPredict(internals, x) : gbmPredict(internals, x));

  // calibrate on the calibration set
  const rawCal = calIdx.map((i) => raw(X[i]));
  const yCal = calIdx.map((i) => y[i]);
  const calibrator = fitPlatt(rawCal, yCal);
  const pCal = rawCal.map((p) => plattApply(calibrator, p));

  const threshold = youdenThreshold(yCal, pCal);

  // split-conformal quantiles from calibration scores
  const scores = yCal.map((yi, i) => score(yi, pCal[i]));
  const scoresR = yCal.map((yi, i) => (yi === 1 ? scores[i] : -1)).filter((v) => v >= 0);
  const scoresS = yCal.map((yi, i) => (yi === 0 ? scores[i] : -1)).filter((v) => v >= 0);
  const quantiles = {
    marginal: conformalQuantile(scores, ALPHA),
    mondrian: { "0": conformalQuantile(scoresS, ALPHA), "1": conformalQuantile(scoresR, ALPHA) },
    alpha: ALPHA,
  };

  const calibratedAll = X.map((x) => plattApply(calibrator, raw(x)));
  const trainAuroc = auroc(ytr, trainIdx.map((i) => calibratedAll[i]));
  const calAuroc = auroc(yCal, pCal);

  return {
    modelType,
    features,
    nTrain: trainIdx.length,
    nCal: calIdx.length,
    nCalR: yCal.reduce((s, v) => s + v, 0),
    nCalS: yCal.length - yCal.reduce((s, v) => s + v, 0),
    threshold,
    quantiles,
    internals,
    calibrator,
    calibratedAll,
    trainIdx,
    calIdx,
    trainAuroc,
    calAuroc,
  };
}

/** Conformal set from calibrated probability and quantiles. */
export function conformalSet(
  pR: number,
  quantiles: { marginal: number; mondrian: { "0": number; "1": number } },
  mode: "mondrian" | "marginal"
): "S" | "R" | "S+R" | "ABSTAIN" {
  const qR = mode === "mondrian" ? quantiles.mondrian["1"] : quantiles.marginal;
  const qS = mode === "mondrian" ? quantiles.mondrian["0"] : quantiles.marginal;
  const inR = 1 - pR <= qR; // score for label R
  const inS = pR <= qS; // score for label S = 1 - pS
  if (inR && inS) return "S+R";
  if (inR) return "R";
  if (inS) return "S";
  return "ABSTAIN";
}
