import random

from app.generators import GENERATORS
from app.generators.rotation import PIECES, _mirror, _rot
from app.schemas import QuestionIn


def test_every_generator_produces_valid_questions():
    rng = random.Random(42)
    for gen in GENERATORS.values():
        for _ in range(300):
            QuestionIn(**gen(rng))


def test_rotation_pieces_are_chiral():
    for cells in PIECES.values():
        rotations = {_rot(cells, k) for k in range(4)}
        assert not rotations & {_rot(_mirror(cells), k) for k in range(4)}


def test_odd_one_out_unique():
    rng = random.Random(1)
    for _ in range(300):
        q = GENERATORS["odd_one_out"](rng)
        assert len(q["options"]) == 5


def test_initial_bank_has_100_valid_per_type():
    from collections import Counter

    from app.seed.build import initial_bank

    bank = initial_bank()
    for q in bank:
        QuestionIn(**q)
    assert Counter(q["type"] for q in bank) == {t: 100 for t in ["number_series", "matrix", "odd_one_out", "rotation", "logic", "verbal"]}
    prompts = [(q["prompt"], tuple(sorted(o["text"] for o in q["options"]))) for q in bank if q["source"] == "claude"]
    assert len(prompts) == len(set(prompts)), "duplicate hand-written questions"
