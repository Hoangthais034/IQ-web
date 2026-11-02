---
name: iq-question-writer
description: Write Vietnamese IQ test questions (logic, verbal, number series) as JSON for this repo's question bank, validate them, and import them for admin review. Use when asked to add, write or generate questions for the IQ test.
---

# IQ question writer

Shape questions (matrix, rotation, odd-one-out drawings) and most number series come from the
Python generators in `api/app/generators/`; run `python -m app.cli generate` for those.
This skill writes text questions, mainly `logic` and `verbal`, in natural Vietnamese.

## Output format

One JSON file `{"questions": [ ... ]}`, saved as `api/data/claude-<type>-<YYYYMMDD>.json`. Each question:

```json
{
  "type": "logic",
  "difficulty": 3,
  "prompt": "...",
  "options": [
    {"key": "A", "text": "..."},
    {"key": "B", "text": "..."},
    {"key": "C", "text": "..."},
    {"key": "D", "text": "..."}
  ],
  "answer_key": "C",
  "explanation": "...",
  "tip_slug": "logic",
  "source": "claude"
}
```

- `type`: `logic` | `verbal` | `number_series` | `odd_one_out`
- `difficulty`: 1 (easy) to 5 (hard)
- `options`: 4 options, keys A-D, all different
- `explanation`: 1-3 sentences, the rule first, then why the answer follows
- `tip_slug`: `logic` | `ngon-ngu` | `day-so` | `hinh-khac-loai`
- The schema is enforced by `api/app/schemas.py` (`QuestionIn`).

## Vietnamese writing rules

1. Natural Vietnamese with full diacritics, short sentences, the word order a Vietnamese speaker
   would use. Read each prompt aloud in your head; rewrite anything that sounds translated.
2. Everyday vocabulary only. No rare Hán-Việt words, no English unless unavoidable.
3. Avoid terms that differ by region. Kinship: only ask relations named the same in all regions
   (ông/bà nội, ông/bà ngoại, chú = em trai của bố, cậu = anh/em trai của mẹ, cô = em gái của bố,
   thím, mợ). Do not ask "chị gái của mẹ" (bác vs dì) or similar.
4. Syllogisms use fictional groups ("thành viên câu lạc bộ Sao Mai", "người nuôi mèo") so real-world
   knowledge never conflicts with the premises.
5. Use Vietnamese names (An, Bình, Chi, Dũng, Hà, Lan, Minh, ...).

## Quality rules

1. Exactly one defensible answer. Solve every question yourself before writing it, and state why
   each distractor is wrong.
2. Test reasoning, not trivia or schooling.
3. Distractors come from common mistakes (reversing "mọi A là B", a related but wrong word relation,
   off-by-one).
4. Spread the correct answer across A-D.
5. Difficulty spread per 20 questions: about 4 at 1, 5 at 2, 5 at 3, 4 at 4, 2 at 5.
6. Never copy from existing IQ tests, books or websites. Write new questions.
7. Check `api/app/seed/` so new questions do not duplicate the initial bank.

## Workflow

1. Default: 20 questions of the requested type.
2. Write the JSON file.
3. Validate: `cd api && uv run python -m app.cli import data/<file>.json --dry-run`.
   Fix every invalid item and rerun until it exits 0.
4. Re-solve each question from scratch; drop any with a second plausible answer.
5. Import as pending: `uv run python -m app.cli import data/<file>.json` (needs `DATABASE_URL`).
   On the server: `docker compose exec api python -m app.cli import data/<file>.json`.
   Questions then wait in `/admin` until the owner approves them. Never pass `--approve` unless asked.
6. Report how many were written, the difficulty spread, and any dropped and why.
