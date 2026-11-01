# Input schemas

AST table (TSV): biosample, drug, sign, measurement, unit, method, platform, standard,
submitter_phenotype, year, country, bioproject.

Breakpoint table (TSV): drug, organism_group, S_le_mg_L, R_gt_mg_L, source, version.
Users supply their own copy of copyrighted breakpoint tables (e.g. EUCAST, free reuse with
citation); nothing is bundled.

Model artefact (JSON): {"m0_mapping": {drug: [features]}, "lineage": {isolate: group},
"cluster": {isolate: cluster}, "metrics": ..., "training_manifest_sha256": ...}
