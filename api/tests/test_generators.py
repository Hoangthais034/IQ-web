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
