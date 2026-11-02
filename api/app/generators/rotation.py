"""'Which figure is the original turned (not flipped)?' using chiral pentominoes.

A chiral pentomino never matches its mirror image under rotation, so exactly one
option is a pure rotation and the others are rotated mirror images.
"""

import random

from app.generators.common import build_options

TIP = "xoay-hinh"
PIECES = {
    "F": [(1, 0), (2, 0), (0, 1), (1, 1), (1, 2)],
    "L": [(0, 0), (0, 1), (0, 2), (0, 3), (1, 3)],
    "N": [(1, 0), (1, 1), (0, 2), (1, 2), (0, 3)],
    "P": [(0, 0), (1, 0), (0, 1), (1, 1), (0, 2)],
    "Y": [(1, 0), (0, 1), (1, 1), (1, 2), (1, 3)],
}
SIZE = 100


def _norm(cells):
    mx, my = min(x for x, _ in cells), min(y for _, y in cells)
    return tuple(sorted((x - mx, y - my) for x, y in cells))


def _rot(cells, k):
    for _ in range(k % 4):
        cells = [(-y, x) for x, y in cells]
    return _norm(cells)


def _mirror(cells):
    return _norm([(-x, y) for x, y in cells])


def _svg(cells) -> str:
    w = max(x for x, _ in cells) + 1
    h = max(y for _, y in cells) + 1
    unit = (SIZE - 20) / max(w, h, 4)
    ox, oy = (SIZE - w * unit) / 2, (SIZE - h * unit) / 2
    rects = "".join(
        f'<rect x="{ox + x * unit:.1f}" y="{oy + y * unit:.1f}" width="{unit:.1f}" height="{unit:.1f}" '
        f'fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="2"/>'
        for x, y in cells
    )
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}" role="img">{rects}</svg>'


def generate_rotation(rng: random.Random) -> dict:
    name = rng.choice(list(PIECES))
    base = _rot(PIECES[name], rng.randrange(4))
    k = rng.choice([1, 2, 3])
    correct = _rot(base, k)
    mirrors = [_rot(_mirror(base), j) for j in range(4)]
    rng.shuffle(mirrors)
    options, key, values = build_options(rng, correct, mirrors)
    for o, cells in zip(options, values):
        o["svg"] = _svg(cells)
    return {
        "type": "rotation",
        "difficulty": {1: 3, 3: 3, 2: 4}[k],
        "prompt": "Hình nào là hình bên trên sau khi xoay (không lật)?",
        "prompt_svg": _svg(base),
        "options": options,
        "answer_key": key,
        "explanation": (
            f"Hình đúng là hình gốc xoay {90 * k} độ theo chiều kim đồng hồ. "
            "Các hình còn lại là ảnh qua gương của hình gốc nên dù xoay thế nào cũng không trùng."
        ),
        "tip_slug": TIP,
        "source": "generator",
    }
