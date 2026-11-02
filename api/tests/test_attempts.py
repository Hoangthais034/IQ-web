import uuid
from datetime import timedelta

from fastapi.testclient import TestClient

from app.db import SessionLocal
from app.main import app
from app.models import Attempt, Question
from tests.test_auth import token

client = TestClient(app)


def anon_headers():
    return {"X-Anon-Id": str(uuid.uuid4())}


def correct_shown_key(attempt_id, position):
    with SessionLocal() as db:
        a = db.get(Attempt, uuid.UUID(attempt_id))
        row = next(x for x in a.answers if x.position == position)
        q = db.get(Question, row.question_id)
        return "ABCDEFGH"[row.option_order.index(q.answer_key)]


def test_full_attempt_is_40_balanced_and_hides_answers():
    r = client.post("/attempts", json={"mode": "full"}, headers=anon_headers())
    assert r.status_code == 201, r.text
    body = r.json()
    assert len(body["questions"]) == 40
    types = {q["type"] for q in body["questions"]}
    assert {"number_series", "matrix"} <= types
    assert "answer_key" not in r.text and "explanation" not in r.text
    assert body["deadline_at"] is not None


def test_anonymous_full_flow_locked_until_login_and_ad():
    h = anon_headers()
    a = client.post("/attempts", json={"mode": "full"}, headers=h).json()
    aid = a["id"]
    key = correct_shown_key(aid, 0)
    assert client.put(f"/attempts/{aid}/answers/0", json={"key": key}, headers=h).status_code == 200
    assert client.post(f"/attempts/{aid}/submit", headers=h).json()["unlocked"] is False
    # anonymous cannot see result
    assert client.get(f"/attempts/{aid}/result", headers=h).status_code == 401
    # someone else's anon id cannot see the attempt at all
    assert client.get(f"/attempts/{aid}", headers=anon_headers()).status_code == 404

    # login + claim
    auth = {"Authorization": f"Bearer {token('player@example.com')}"}
    client.post("/me/claim-anon", json={"anon_id": h["X-Anon-Id"]}, headers=auth)
    assert client.get(f"/attempts/{aid}/result", headers=auth).status_code == 403
    assert client.post(f"/attempts/{aid}/unlock", headers=auth).status_code == 403  # ad not watched
    client.post(f"/attempts/{aid}/ad-gate", headers=auth)
    # unlocking right away is refused: 15 seconds have not passed
    assert client.post(f"/attempts/{aid}/unlock", headers=auth).status_code == 403
    with SessionLocal() as db:
        att = db.get(Attempt, uuid.UUID(aid))
        att.ad_gate_started_at -= timedelta(seconds=16)
        db.commit()
    assert client.post(f"/attempts/{aid}/unlock", headers=auth).status_code == 200
    res = client.get(f"/attempts/{aid}/result", headers=auth).json()
    assert res["total"] == 40 and res["correct"] >= 1
    assert 55 <= res["iq_estimate"] <= 145
    assert len(res["wrong"]) == 40 - res["correct"]


def test_practice_gives_feedback_and_blocks_reanswer():
    h = anon_headers()
    a = client.post("/attempts", json={"mode": "practice", "question_type": "matrix"}, headers=h).json()
    assert len(a["questions"]) == 10 and all(q["type"] == "matrix" for q in a["questions"])
    key = correct_shown_key(a["id"], 3)
    fb = client.put(f"/attempts/{a['id']}/answers/3", json={"key": key}, headers=h).json()
    assert fb["is_correct"] is True and fb["correct_key"] == key and fb["explanation"]
    assert client.put(f"/attempts/{a['id']}/answers/3", json={"key": "A"}, headers=h).status_code == 409


def test_closed_after_submit():
    h = anon_headers()
    a = client.post("/attempts", json={"mode": "full"}, headers=h).json()
    client.post(f"/attempts/{a['id']}/submit", headers=h)
    assert client.put(f"/attempts/{a['id']}/answers/0", json={"key": "A"}, headers=h).status_code == 409
