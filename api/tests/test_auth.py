import time

import jwt
from fastapi.testclient import TestClient

from app.config import get_settings
from app.main import app

client = TestClient(app)


def token(email: str = "a@example.com", **extra) -> str:
    claims = {"sub": email, "aud": "iq-api", "exp": int(time.time()) + 60, "name": "A", **extra}
    return jwt.encode(claims, get_settings().api_jwt_secret, algorithm="HS256")


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_me_requires_login():
    assert client.get("/me").status_code == 401


def test_me_rejects_bad_token():
    assert client.get("/me", headers={"Authorization": "Bearer nope"}).status_code == 401


def test_me_upserts_user():
    r = client.get("/me", headers={"Authorization": f"Bearer {token()}"})
    assert r.status_code == 200
    assert r.json()["email"] == "a@example.com"
    assert r.json()["is_admin"] is False


def test_popunder_seen():
    h = {"Authorization": f"Bearer {token('b@example.com')}"}
    assert client.post("/me/popunder-seen", headers=h).status_code == 204
    assert client.get("/me", headers=h).json()["popunder_seen_at"] is not None


def test_claim_anon_attempts_only_unowned():
    import uuid

    from app.db import SessionLocal
    from app.models import Attempt, User

    anon = uuid.uuid4()
    email_a, email_b = f"a-{anon}@example.com", f"b-{anon}@example.com"
    ha = {"Authorization": f"Bearer {token(email_a)}"}
    hb = {"Authorization": f"Bearer {token(email_b)}"}
    client.get("/me", headers=ha)
    with SessionLocal() as db:
        a = db.query(User).filter_by(email=email_a).one()
        db.add_all([
            Attempt(mode="full", anon_id=anon),
            Attempt(mode="full", anon_id=anon),
            Attempt(mode="full", anon_id=anon, user_id=a.id),  # already A's
        ])
        db.commit()

    r = client.post("/me/claim-anon", json={"anon_id": str(anon)}, headers=hb)
    assert r.json() == {"claimed": 2}
    # second call claims nothing, A's attempt untouched
    assert client.post("/me/claim-anon", json={"anon_id": str(anon)}, headers=hb).json() == {"claimed": 0}
    with SessionLocal() as db:
        assert db.query(Attempt).filter_by(user_id=a.id).count() == 1
