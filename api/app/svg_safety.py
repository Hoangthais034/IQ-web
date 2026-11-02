"""Allowlist check for question SVGs.

SVG strings are rendered with dangerouslySetInnerHTML on the test and admin pages, so any SVG that
enters the bank (generators, the Claude skill's JSON files, imports) must pass this check first.
"""

import re
import xml.etree.ElementTree as ET

SVG_NS = "{http://www.w3.org/2000/svg}"
ALLOWED_TAGS = {"svg", "g", "defs", "pattern", "rect", "polygon", "polyline", "line", "circle", "ellipse", "path", "text", "tspan"}
ALLOWED_ATTRS = {
    "xmlns", "viewBox", "width", "height", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry",
    "points", "d", "fill", "fill-opacity", "fill-rule", "stroke", "stroke-width", "stroke-opacity",
    "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "opacity", "transform", "id", "role",
    "patternUnits", "patternTransform", "text-anchor", "dominant-baseline", "font-size", "font-weight", "font-family",
}
_URL = re.compile(r"url\(\s*([^)]*)\)", re.I)
MAX_LEN = 50_000


def check_svg(svg: str) -> str:
    """Return the SVG unchanged if it only uses safe elements/attributes, else raise ValueError."""
    if len(svg) > MAX_LEN:
        raise ValueError("svg too large")
    if re.search(r"<!(DOCTYPE|ENTITY)|<\?|<!\[CDATA\[", svg, re.I):
        raise ValueError("svg must not contain DOCTYPE, entities, processing instructions or CDATA")
    try:
        root = ET.fromstring(svg)
    except ET.ParseError as e:
        raise ValueError(f"invalid svg: {e}") from None
    for el in root.iter():
        tag = el.tag.removeprefix(SVG_NS)
        if tag not in ALLOWED_TAGS:
            raise ValueError(f"svg element <{tag}> not allowed")
        for name, value in el.attrib.items():
            if name not in ALLOWED_ATTRS:
                raise ValueError(f"svg attribute {name} not allowed")
            if "javascript:" in value.lower() or "expression(" in value.lower():
                raise ValueError("svg attribute value not allowed")
            for target in _URL.findall(value):
                if not target.strip().strip("'\"").startswith("#"):
                    raise ValueError("svg url() must reference a local #id")
    if root.tag.removeprefix(SVG_NS) != "svg":
        raise ValueError("root element must be <svg>")
    return svg
