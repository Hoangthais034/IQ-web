import pytest

from app.seed.build import initial_bank
from app.svg_safety import check_svg

OK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="5" height="5" fill="url(#p)"/></svg>'


def test_generated_bank_passes():
    from app.schemas import QuestionIn

    bank = initial_bank()
    assert len(bank) >= 600
    for q in bank:
        QuestionIn.model_validate(q)  # runs check_svg on every SVG


@pytest.mark.parametrize("bad", [
    '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><img src=x onerror=alert(1)></foreignObject></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><rect/></a></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="url(https://evil.example/x)"/></svg>',
    '<!DOCTYPE svg [<!ENTITY x "y">]><svg xmlns="http://www.w3.org/2000/svg"/>',
    '<svg xmlns="http://www.w3.org/2000/svg"><rect style="background:url(x)"/></svg>',
    'not svg',
])
def test_rejects_unsafe(bad):
    with pytest.raises(ValueError):
        check_svg(bad)


def test_accepts_safe():
    assert check_svg(OK) == OK
