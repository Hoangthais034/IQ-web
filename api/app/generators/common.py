import random

KEYS = "ABCDEFGH"


def build_options(rng: random.Random, correct, distractors: list, n: int = 4) -> tuple[list[dict], str, list]:
    """Return (options, answer_key, values) with the correct value at a random position."""
    values = [correct]
    for d in distractors:
        if d not in values:
            values.append(d)
        if len(values) == n:
            break
    if len(values) < n:
        raise ValueError("not enough distinct distractors")
    rng.shuffle(values)
    answer_key = KEYS[values.index(correct)]
    return [{"key": KEYS[i]} for i in range(n)], answer_key, values
