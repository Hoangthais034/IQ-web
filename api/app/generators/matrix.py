"""3x3 shape-matrix questions (Raven-style), drawn as SVG.

Rules follow the attribute/relation vocabulary from the PGM and RAVEN papers
(count, shape, fill; constant, progression, distribute-three) but the code is our own.
"""

import random

from app.generators.common import build_options

TIP = "ma-tran-hinh"
SHAPES = ["circle", "square", "triangle", "diamond"]
SHAPE_VI = {"circle": "hình tròn", "square": "hình vuông", "triangle": "tam giác", "diamond": "hình thoi"}
FILLS = ["none", "half", "solid"]
FILL_VI = {"none": "rỗng", "half": "kẻ sọc", "solid": "tô đặc"}
CELL = 90


def _shape(kind: str, cx: float, cy: float, r: float, fill: str, uid: str) -> str:
    paint = {"none": "none", "solid": "currentColor", "half": f"url(#h{uid})"}[fill]
    attrs = f'fill="{paint}" stroke="currentColor" stroke-width="2"'
    if kind == "circle":
        return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" {attrs}/>'
    if kind == "square":
        return f'<rect x="{cx - r:.1f}" y="{cy - r:.1f}" width="{2 * r:.1f}" height="{2 * r:.1f}" {attrs}/>'
    if kind == "triangle":
        return f'<polygon points="{cx:.1f},{cy - r:.1f} {cx + r:.1f},{cy + r:.1f} {cx - r:.1f},{cy + r:.1f}" {attrs}/>'
    return f'<polygon points="{cx:.1f},{cy - r:.1f} {cx + r:.1f},{cy:.1f} {cx:.1f},{cy + r:.1f} {cx - r:.1f},{cy:.1f}" {attrs}/>'


def _cell_body(cell: dict, ox: float, oy: float, uid: str) -> str:
    n = cell["count"]
    slots = {1: [(0.5, 0.5)], 2: [(0.3, 0.5), (0.7, 0.5)], 3: [(0.5, 0.28), (0.28, 0.72), (0.72, 0.72)],
             4: [(0.3, 0.3), (0.7, 0.3), (0.3, 0.7), (0.7, 0.7)]}[n]
    r = {1: 22, 2: 15, 3: 13, 4: 13}[n]
    return "".join(_shape(cell["shape"], ox + sx * CELL, oy + sy * CELL, r, cell["fill"], uid) for sx, sy in slots)


def _defs(uid: str) -> str:
    return (f'<defs><pattern id="h{uid}" width="6" height="6" patternUnits="userSpaceOnUse" '
            f'patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" '
            f'stroke-width="2"/></pattern></defs>')


def _grid_svg(cells: list[dict | None], uid: str) -> str:
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {3 * CELL} {3 * CELL}" role="img">', _defs(uid)]
    for i, cell in enumerate(cells):
        ox, oy = (i % 3) * CELL, (i // 3) * CELL
        parts.append(f'<rect x="{ox}" y="{oy}" width="{CELL}" height="{CELL}" fill="none" stroke="currentColor" stroke-opacity="0.3"/>')
        if cell is None:
            parts.append(f'<text x="{ox + CELL / 2}" y="{oy + CELL / 2 + 10}" text-anchor="middle" font-size="30" fill="currentColor">?</text>')
        else:
            parts.append(_cell_body(cell, ox, oy, uid))
    parts.append("</svg>")
    return "".join(parts)


def _cell_svg(cell: dict, uid: str) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CELL} {CELL}" role="img">{_defs(uid)}'
            f'{_cell_body(cell, 0, 0, uid)}</svg>')


def generate_matrix(rng: random.Random) -> dict:
    # count: progression along each row (+1) or constant per row
    count_rule = rng.choice(["progression", "constant"])
    shape_rule = rng.choice(["row_constant", "distribute"])
    fill_rule = rng.choice(["constant", "distribute"])
    shapes = rng.sample(SHAPES, 3)
    fills = rng.sample(FILLS, 3)
    base_fill = rng.choice(FILLS)

    grid = []
    for r in range(3):
        for c in range(3):
            count = (c + 1) if count_rule == "progression" else (r + 1)
            shape = shapes[r] if shape_rule == "row_constant" else shapes[(r + c) % 3]
            fill = base_fill if fill_rule == "constant" else fills[(c + 2 * r) % 3]
            grid.append({"count": count, "shape": shape, "fill": fill})

    answer = grid[8]
    alts = []
    for cnt in {1, 2, 3, 4} - {answer["count"]}:
        alts.append({**answer, "count": cnt})
    for sh in set(SHAPES) - {answer["shape"]}:
        alts.append({**answer, "shape": sh})
    for fl in set(FILLS) - {answer["fill"]}:
        alts.append({**answer, "fill": fl})
    rng.shuffle(alts)

    to_key = lambda d: (d["count"], d["shape"], d["fill"])  # noqa: E731
    options, key, values = build_options(rng, to_key(answer), [to_key(a) for a in alts], n=6)
    uid = f"{rng.randrange(16**6):06x}"
    for o, (cnt, sh, fl) in zip(options, values):
        o["svg"] = _cell_svg({"count": cnt, "shape": sh, "fill": fl}, f"{uid}{o['key']}")

    rules = []
    rules.append("số hình tăng 1 theo mỗi cột" if count_rule == "progression" else "số hình giống nhau trong cùng một hàng")
    rules.append("mỗi hàng dùng một loại hình" if shape_rule == "row_constant" else "mỗi hàng có đủ 3 loại hình, mỗi loại một lần")
    rules.append("kiểu tô giữ nguyên" if fill_rule == "constant" else "mỗi hàng có đủ 3 kiểu tô")
    difficulty = 1 + sum([count_rule == "constant", shape_rule == "distribute", fill_rule == "distribute"]) + (1 if fill_rule == "distribute" and shape_rule == "distribute" else 0)
    return {
        "type": "matrix",
        "difficulty": min(difficulty, 5),
        "prompt": "Chọn hình phù hợp để điền vào ô có dấu ?",
        "prompt_svg": _grid_svg(grid[:8] + [None], uid),
        "options": options,
        "answer_key": key,
        "explanation": (
            "Quy luật: " + "; ".join(rules) + f". Ô còn thiếu có {answer['count']} {SHAPE_VI[answer['shape']]}, "
            f"{FILL_VI[answer['fill']]}."
        ),
        "tip_slug": TIP,
        "source": "generator",
    }
