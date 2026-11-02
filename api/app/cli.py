"""Question bank commands.

  python -m app.cli generate --count 300            # code generators -> DB (approved)
  python -m app.cli import questions.json           # e.g. output of the Claude skill -> DB (pending)
  python -m app.cli import questions.json --approve # skip review
  python -m app.cli import questions.json --dry-run # validate only
"""

import argparse
import json
import random
import sys

from pydantic import ValidationError

from app.db import SessionLocal
from app.generators import GENERATORS
from app.models import Question, QuestionStatus
from app.schemas import QuestionIn


def save(items: list[dict], status: QuestionStatus, dry_run: bool = False) -> tuple[int, list[str]]:
    errors, rows = [], []
    for i, raw in enumerate(items):
        try:
            q = QuestionIn(**raw)
        except ValidationError as e:
            errors.append(f"#{i}: {e.errors()[0]['msg']}")
            continue
        rows.append(Question(**q.model_dump(mode="python", exclude={"options"}), options=[o.model_dump(exclude_none=True) for o in q.options], status=status))
    if dry_run:
        return len(rows), errors
    with SessionLocal() as db:
        db.add_all(rows)
        db.commit()
    return len(rows), errors


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="app.cli")
    sub = p.add_subparsers(dest="cmd", required=True)
    g = sub.add_parser("generate")
    g.add_argument("--count", type=int, default=300)
    g.add_argument("--seed", type=int)
    imp = sub.add_parser("import")
    imp.add_argument("file")
    imp.add_argument("--approve", action="store_true")
    imp.add_argument("--dry-run", action="store_true", help="validate only, write nothing")
    args = p.parse_args(argv)

    if args.cmd == "generate":
        rng = random.Random(args.seed)
        gens = list(GENERATORS.values())
        items = [gens[i % len(gens)](rng) for i in range(args.count)]
        n, errors = save(items, QuestionStatus.approved)
    else:
        with open(args.file, encoding="utf-8") as f:
            data = json.load(f)
        items = data["questions"] if isinstance(data, dict) else data
        n, errors = save(items, QuestionStatus.approved if args.approve else QuestionStatus.pending, args.dry_run)
        if args.dry_run:
            print(f"valid {n} question(s), invalid {len(errors)}")
            for e in errors:
                print("invalid", e, file=sys.stderr)
            return 1 if errors else 0

    print(f"saved {n} question(s)")
    for e in errors:
        print("skipped", e, file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
