"""``python -m lacuna`` — same as the ``lacuna`` console script."""
from .cli import main

if __name__ == "__main__":
    raise SystemExit(main())
