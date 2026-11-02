"""Turns the compact seed data into QuestionIn-shaped dicts and builds the initial bank."""

import random

from app.generators import GENERATORS
from app.generators.common import build_options
from app.seed import logic_handwritten, verbal

PER_TYPE = 100


def _mc(rng, qtype, difficulty, prompt, correct, wrong, explanation, tip):
    options, key, values = build_options(rng, correct, wrong)
    for o, v in zip(options, values):
        o["text"] = v
    return {"type": qtype, "difficulty": difficulty, "prompt": prompt, "options": options, "answer_key": key,
            "explanation": explanation, "tip_slug": tip, "source": "claude"}


def handwritten_logic(rng) -> list[dict]:
    return [_mc(rng, "logic", d, p, c, w, e, "logic") for d, p, c, w, e in logic_handwritten.ITEMS]


def handwritten_verbal(rng) -> list[dict]:
    out = []
    for d, a, b, c, ans, wrong, rel in verbal.ANALOGIES:
        out.append(_mc(rng, "verbal", d, f"{a} : {b} giống như {c} : ?", ans, wrong,
                       f"Quan hệ: {rel}. {a} và {b} giống {c} và {ans}.", "ngon-ngu"))
    for d, words, odd, reason in verbal.ODD_WORDS:
        out.append(_mc(rng, "verbal", d, "Từ nào không cùng nhóm với các từ còn lại?", odd,
                       [w for w in words if w != odd], reason, "ngon-ngu"))
    for d, kind, word, ans, wrong in verbal.SYNONYM_ANTONYM:
        out.append(_mc(rng, "verbal", d, f"Từ nào {kind} với “{word}”?", ans, wrong,
                       f"“{word}” và “{ans}” là hai từ {kind}.", "ngon-ngu"))
    return out


def generated_verbal(rng) -> dict:
    cat, other = rng.sample(list(verbal.CATEGORIES), 2)
    same = rng.sample(verbal.CATEGORIES[cat], 3)
    odd = rng.choice(verbal.CATEGORIES[other])
    q = _mc(rng, "verbal", 1, "Từ nào không cùng nhóm với các từ còn lại?", odd.capitalize(),
            [w.capitalize() for w in same], f"{', '.join(w.capitalize() for w in same)} đều là {cat}; {odd} thuộc nhóm {other}.", "ngon-ngu")
    q["source"] = "generator"
    return q


def initial_bank(seed: int = 2026, per_type: int = PER_TYPE) -> list[dict]:
    rng = random.Random(seed)
    bank: list[dict] = []
    for name in ("number_series", "matrix", "odd_one_out", "rotation"):
        bank += [GENERATORS[name](rng) for _ in range(per_type)]
    logic = handwritten_logic(rng)
    bank += logic + [GENERATORS["logic"](rng) for _ in range(max(0, per_type - len(logic)))]
    verb = handwritten_verbal(rng)
    bank += verb + [generated_verbal(rng) for _ in range(max(0, per_type - len(verb)))]
    return bank
