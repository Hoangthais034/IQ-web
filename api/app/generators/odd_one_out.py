"""'Which figure is different?' Four figures share one attribute; the fifth breaks it.

The other attributes are spread so that each value appears at least twice,
which keeps the odd one out unique.
"""

import random

from app.generators.common import KEYS
from app.generators.shapes import FILL_VI, FILLS, SHAPE_VI, SHAPES, group, svg

TIP = "hinh-khac-loai"
SIZE = 90
ATTRS = {"shape": SHAPES, "fill": FILLS, "count": [1, 2, 3, 4]}
ATTR_VI = {"shape": "loại hình", "fill": "kiểu tô", "count": "số lượng hình"}


def _spread(rng: random.Random, values: list, n: int = 5) -> list:
    """n values using exactly two distinct values, each at least twice (3+2)."""
    a, b = rng.sample(values, 2)
    out = [a, a, a, b, b]
    rng.shuffle(out)
    return out[:n]


def generate_odd_one_out(rng: random.Random) -> dict:
    rule = rng.choice(list(ATTRS))
    common, odd = rng.sample(ATTRS[rule], 2)
    figures = [{} for _ in range(5)]
    odd_idx = rng.randrange(5)
    for i, f in enumerate(figures):
        f[rule] = odd if i == odd_idx else common
    for other in ATTRS:
        if other == rule:
            continue
        for f, v in zip(figures, _spread(rng, ATTRS[other])):
            f[other] = v

    uid = f"{rng.randrange(16**6):06x}"
    options = [
        {"key": KEYS[i], "svg": svg(group(f["shape"], f["count"], f["fill"], SIZE, f"{uid}{i}"), SIZE, f"{uid}{i}")}
        for i, f in enumerate(figures)
    ]

    def say(v):
        return {"shape": SHAPE_VI, "fill": FILL_VI}.get(rule, {}).get(v, f"{v} hình")

    return {
        "type": "odd_one_out",
        "difficulty": {"shape": 1, "count": 2, "fill": 3}[rule],
        "prompt": "Hình nào khác loại với các hình còn lại?",
        "options": options,
        "answer_key": KEYS[odd_idx],
        "explanation": (
            f"Xét {ATTR_VI[rule]}: bốn hình đều là {say(common)}, riêng hình {KEYS[odd_idx]} là {say(odd)}. "
            "Các thuộc tính khác đều lặp lại ít nhất hai lần nên không phải điểm khác biệt."
        ),
        "tip_slug": TIP,
        "source": "generator",
    }
