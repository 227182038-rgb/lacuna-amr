# CLI reference

    lacuna audit-dataset --ast ast.tsv --breakpoints bp.tsv [--out audit.json]
    lacuna predict --amrfinder *.tsv --model model.json --breakpoints bp.tsv
    lacuna validate --ast ast.tsv --breakpoints bp.tsv --amrfinder *.tsv --model model.json
    lacuna report --inputs r1.json r2.json --out report.html
    lacuna manifest --paths ... --out manifest.tsv

Every command prints an RUO notice in its output. No network access at run time.
