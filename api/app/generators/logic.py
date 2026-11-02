"""Vietnamese logic questions built from templates, so every answer is correct by construction.

Three families: ordering from pairwise comparisons, day-of-week reasoning, and syllogisms
over fictional groups (so real-world knowledge never conflicts with the premises).
"""

import random

from app.generators.common import build_options

TIP = "logic"
NAMES = ["An", "Bình", "Chi", "Dũng", "Hà", "Khoa", "Lan", "Minh", "Nam", "Phương", "Quân", "Trang", "Tuấn", "Vy", "Hùng", "Mai"]

# (more, less, most, least)
SCALES = [
    ("cao hơn", "thấp hơn", "cao nhất", "thấp nhất"),
    ("lớn tuổi hơn", "nhỏ tuổi hơn", "lớn tuổi nhất", "nhỏ tuổi nhất"),
    ("chạy nhanh hơn", "chạy chậm hơn", "chạy nhanh nhất", "chạy chậm nhất"),
    ("nặng hơn", "nhẹ hơn", "nặng nhất", "nhẹ nhất"),
    ("được nhiều điểm hơn", "được ít điểm hơn", "được nhiều điểm nhất", "được ít điểm nhất"),
]

DAYS = ["thứ Hai", "thứ Ba", "thứ Tư", "thứ Năm", "thứ Sáu", "thứ Bảy", "Chủ nhật"]

GROUPS = [
    "thành viên câu lạc bộ Sao Mai", "người đeo kính", "học sinh lớp 7B", "người thích đọc sách",
    "người biết bơi", "thành viên đội bóng Hoa Sen", "người dậy trước 6 giờ", "người nuôi mèo",
    "nhân viên công ty Minh Long", "người chơi cờ vua", "người đi làm bằng xe buýt", "người biết chơi đàn",
]


def _ordering(rng: random.Random) -> dict:
    n = rng.choice([4, 4, 5, 5])
    people = rng.sample(NAMES, n)  # people[0] is the most
    more, less, most, least = rng.choice(SCALES)
    clues = []
    for i in range(n - 1):
        a, b = people[i], people[i + 1]
        clues.append(f"{a} {more} {b}" if rng.random() < 0.5 else f"{b} {less} {a}")
    rng.shuffle(clues)
    kind = rng.choice(["most", "least", "second"]) if n == 5 else rng.choice(["most", "least"])
    if kind == "most":
        ask, answer = f"Ai {most}?", people[0]
    elif kind == "least":
        ask, answer = f"Ai {least}?", people[-1]
    else:
        ask, answer = f"Ai đứng thứ hai nếu xếp từ người {most} xuống?", people[1]
    others = [p for p in people if p != answer]
    rng.shuffle(others)
    options, key, values = build_options(rng, answer, others)
    for o, v in zip(options, values):
        o["text"] = v
    order = " > ".join(people)
    return {
        "type": "logic",
        "difficulty": {4: 1, 5: 2}[n] + (1 if kind == "second" else 0) + (1 if any(less in c for c in clues) else 0),
        "prompt": ". ".join(clues) + f". {ask}",
        "options": options,
        "answer_key": key,
        "explanation": f"Đổi hết các câu về cùng một chiều rồi nối lại: {order} (từ {most} đến {least}). Đáp án là {answer}.",
        "tip_slug": TIP,
        "source": "generator",
    }


def _day(i: int) -> str:
    return DAYS[i % 7]


def _days(rng: random.Random) -> dict:
    today = rng.randrange(7)
    variant = rng.randrange(4)
    if variant == 0:
        k = rng.randint(3, 20)
        prompt = f"Hôm nay là {_day(today)}. Hỏi {k} ngày nữa là thứ mấy?"
        answer, diff = today + k, 2
        why = f"{k} ngày = {k // 7} tuần và {k % 7} ngày, nên chỉ cần đếm thêm {k % 7} ngày từ {_day(today)}."
    elif variant == 1:
        prompt = f"Nếu ngày mai của hôm qua là {_day(today)}, thì ngày kia là thứ mấy?"
        answer, diff = today + 2, 2
        why = f"Ngày mai của hôm qua chính là hôm nay, tức {_day(today)}. Ngày kia là hôm nay cộng 2 ngày."
    elif variant == 2:
        prompt = f"Hôm kia là {_day(today - 2)}. Hỏi ngày mai là thứ mấy?"
        answer, diff = today + 1, 2
        why = f"Hôm kia là hôm nay trừ 2 ngày, nên hôm nay là {_day(today)}, ngày mai là {_day(today + 1)}."
    else:
        prompt = f"Ngày hôm kia của ngày kia là {_day(today)}. Hỏi hôm qua là thứ mấy?"
        answer, diff = today - 1, 3
        why = f"Hôm kia của ngày kia là cộng 2 rồi trừ 2, tức chính hôm nay ({_day(today)}). Hôm qua là {_day(today - 1)}."
    correct = _day(answer)
    distractors = [_day(answer + d) for d in (1, -1, 2, -2, 3)]
    options, key, values = build_options(rng, correct, distractors)
    for o, v in zip(options, values):
        o["text"] = v[0].upper() + v[1:]
    return {
        "type": "logic",
        "difficulty": diff,
        "prompt": prompt,
        "options": options,
        "answer_key": key,
        "explanation": why + f" Đáp án: {correct}.",
        "tip_slug": TIP,
        "source": "generator",
    }


def _syllogism(rng: random.Random) -> dict:
    a, b, c = rng.sample(GROUPS, 3)
    x = rng.choice(NAMES)
    form = rng.randrange(6)
    cant = "Không đủ thông tin để kết luận"
    if form == 0:
        prompt = f"Mọi {a} đều là {b}. {x} là {a}. Kết luận nào chắc chắn đúng?"
        correct, wrong = f"{x} là {b}", [f"{x} không phải {b}", f"Mọi {b} đều là {a}", cant]
        why, diff = f"{x} thuộc nhóm {a}, mà cả nhóm {a} nằm trong nhóm {b}.", 1
    elif form == 1:
        prompt = f"Mọi {a} đều là {b}. Mọi {b} đều là {c}. Kết luận nào chắc chắn đúng?"
        correct, wrong = f"Mọi {a} đều là {c}", [f"Mọi {c} đều là {a}", f"Không {a} nào là {c}", f"Mọi {c} đều là {b}"]
        why, diff = f"Nhóm {a} nằm trong {b}, nhóm {b} nằm trong {c}, nên {a} nằm trong {c}. Chiều ngược lại không chắc đúng.", 2
    elif form == 2:
        prompt = f"Mọi {a} đều là {b}. {x} không phải là {b}. Kết luận nào chắc chắn đúng?"
        correct, wrong = f"{x} không phải là {a}", [f"{x} là {a}", f"{x} có thể là {a}", cant]
        why, diff = f"Nếu {x} là {a} thì {x} phải là {b}. {x} không phải {b} nên không thể là {a}.", 3
    elif form == 3:
        prompt = f"Mọi {a} đều là {b}. {x} là {b}. Kết luận nào đúng?"
        correct, wrong = cant + f" {x} có phải {a} hay không", [f"{x} là {a}", f"{x} không phải là {a}", f"Mọi {b} đều là {a}"]
        why, diff = f"Nhóm {b} có thể rộng hơn nhóm {a}, nên {x} là {b} chưa chắc đã là {a}. Đây là bẫy hay gặp.", 4
    elif form == 4:
        prompt = f"Một số {a} là {b}. Mọi {b} đều là {c}. Kết luận nào chắc chắn đúng?"
        correct, wrong = f"Một số {a} là {c}", [f"Mọi {a} đều là {c}", f"Không {a} nào là {c}", f"Mọi {c} đều là {a}"]
        why, diff = f"Những {a} thuộc nhóm {b} thì cũng thuộc {c}, nên ít nhất một số {a} là {c}. Không chắc là tất cả.", 4
    else:
        prompt = f"Không {a} nào là {b}. Mọi {c} đều là {a}. Kết luận nào chắc chắn đúng?"
        correct, wrong = f"Không {c} nào là {b}", [f"Một số {c} là {b}", f"Mọi {b} đều là {c}", f"Mọi {b} đều là {a}"]
        why, diff = f"Nhóm {c} nằm trọn trong {a}, mà {a} không giao với {b}, nên {c} cũng không giao với {b}.", 5
    options, key, values = build_options(rng, correct, wrong)
    for o, v in zip(options, values):
        o["text"] = v
    return {
        "type": "logic",
        "difficulty": diff,
        "prompt": prompt,
        "options": options,
        "answer_key": key,
        "explanation": why,
        "tip_slug": TIP,
        "source": "generator",
    }


def generate_logic(rng: random.Random) -> dict:
    return rng.choice([_ordering, _ordering, _days, _syllogism, _syllogism])(rng)
