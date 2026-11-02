"""Small SVG drawing helpers shared by the figure generators."""

SHAPES = ["circle", "square", "triangle", "diamond", "hexagon"]
SHAPE_VI = {"circle": "hình tròn", "square": "hình vuông", "triangle": "tam giác", "diamond": "hình thoi", "hexagon": "lục giác"}
FILLS = ["none", "half", "solid"]
FILL_VI = {"none": "rỗng", "half": "kẻ sọc", "solid": "tô đặc"}


def defs(uid: str) -> str:
    return (f'<defs><pattern id="h{uid}" width="6" height="6" patternUnits="userSpaceOnUse" '
            f'patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" '
            f'stroke-width="2"/></pattern></defs>')


def shape(kind: str, cx: float, cy: float, r: float, fill: str, uid: str) -> str:
    paint = {"none": "none", "solid": "currentColor", "half": f"url(#h{uid})"}[fill]
    attrs = f'fill="{paint}" stroke="currentColor" stroke-width="2"'
    if kind == "circle":
        return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" {attrs}/>'
    if kind == "square":
        return f'<rect x="{cx - r:.1f}" y="{cy - r:.1f}" width="{2 * r:.1f}" height="{2 * r:.1f}" {attrs}/>'
    if kind == "triangle":
        return f'<polygon points="{cx:.1f},{cy - r:.1f} {cx + r:.1f},{cy + r:.1f} {cx - r:.1f},{cy + r:.1f}" {attrs}/>'
    if kind == "hexagon":
        h = r * 0.866
        pts = f"{cx - r:.1f},{cy:.1f} {cx - r / 2:.1f},{cy - h:.1f} {cx + r / 2:.1f},{cy - h:.1f} {cx + r:.1f},{cy:.1f} {cx + r / 2:.1f},{cy + h:.1f} {cx - r / 2:.1f},{cy + h:.1f}"
        return f'<polygon points="{pts}" {attrs}/>'
    return f'<polygon points="{cx:.1f},{cy - r:.1f} {cx + r:.1f},{cy:.1f} {cx:.1f},{cy + r:.1f} {cx - r:.1f},{cy:.1f}" {attrs}/>'


def group(kind: str, count: int, fill: str, size: float, uid: str) -> str:
    """`count` copies of a shape laid out inside a size x size box at the origin."""
    slots = {1: [(0.5, 0.5)], 2: [(0.3, 0.5), (0.7, 0.5)], 3: [(0.5, 0.28), (0.28, 0.72), (0.72, 0.72)],
             4: [(0.3, 0.3), (0.7, 0.3), (0.3, 0.7), (0.7, 0.7)]}[count]
    r = {1: 0.24, 2: 0.17, 3: 0.14, 4: 0.14}[count] * size
    return "".join(shape(kind, sx * size, sy * size, r, fill, uid) for sx, sy in slots)


def svg(body: str, size: float, uid: str) -> str:
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img">{defs(uid)}{body}</svg>'
