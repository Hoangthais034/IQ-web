"""Number-sequence questions. Every answer follows from the rule that built the sequence."""

import random

from app.generators.common import build_options

TIP = "day-so"


def _arithmetic(rng):
    a, d = rng.randint(1, 30), rng.choice([2, 3, 4, 5, 6, 7, 9, 11, -3, -4])
    seq = [a + d * i for i in range(6)]
    return seq, 1, f"Mỗi số cộng thêm {d}." if d > 0 else f"Mỗi số trừ đi {-d}."


def _geometric(rng):
    a, r = rng.randint(1, 5), rng.choice([2, 3])
    seq = [a * r**i for i in range(6)]
    return seq, 2, f"Mỗi số nhân {r}."


def _second_difference(rng):
    a, d, step = rng.randint(1, 10), rng.randint(1, 4), rng.randint(1, 3)
    seq, cur, diff = [], a, d
    for _ in range(6):
        seq.append(cur)
        cur += diff
        diff += step
    return seq, 3, f"Hiệu giữa hai số liên tiếp tăng dần thêm {step} mỗi bước ({d}, {d + step}, {d + 2 * step}, ...)."


def _alternating(rng):
    a, b = rng.randint(1, 20), rng.randint(20, 60)
    da, db = rng.choice([2, 3, 5]), rng.choice([-2, -3, 4, 6])
    seq = [a + da * (i // 2) if i % 2 == 0 else b + db * (i // 2) for i in range(6)]
    return seq, 4, (
        f"Hai dãy xen kẽ: các vị trí lẻ cộng {da}, các vị trí chẵn "
        + (f"cộng {db}." if db > 0 else f"trừ {-db}.")
    )


def _fibonacci_like(rng):
    x, y = rng.randint(1, 6), rng.randint(2, 9)
    seq = [x, y]
    while len(seq) < 6:
        seq.append(seq[-1] + seq[-2])
    return seq, 4, "Mỗi số bằng tổng hai số đứng trước nó."


def _squares_offset(rng):
    start, off = rng.randint(1, 6), rng.choice([0, 1, -1, 2, 3])
    seq = [(start + i) ** 2 + off for i in range(6)]
    tail = "" if off == 0 else (f" cộng {off}" if off > 0 else f" trừ {-off}")
    return seq, 5, f"Các số là bình phương của {start}, {start + 1}, {start + 2}, ...{tail}."


RULES = [_arithmetic, _geometric, _second_difference, _alternating, _fibonacci_like, _squares_offset]


def generate_number_series(rng: random.Random) -> dict:
    seq, difficulty, why = rng.choice(RULES)(rng)
    shown, answer = seq[:5], seq[5]
    gap = max(1, abs(seq[5] - seq[4]))
    distractors = [answer + 1, answer - 1, answer + gap, answer - gap, answer + 2, answer * 2, answer + 10]
    rng.shuffle(distractors)
    options, key, values = build_options(rng, answer, distractors)
    for o, v in zip(options, values):
        o["text"] = str(v)
    return {
        "type": "number_series",
        "difficulty": difficulty,
        "prompt": f"Số tiếp theo của dãy là gì? {', '.join(map(str, shown))}, ?",
        "options": options,
        "answer_key": key,
        "explanation": f"{why} Số tiếp theo là {answer}.",
        "tip_slug": TIP,
        "source": "generator",
    }
