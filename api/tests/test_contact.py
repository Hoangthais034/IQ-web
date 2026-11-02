import uuid

from fastapi.testclient import TestClient

from app import mailer
from app.config import get_settings
from app.main import app

client = TestClient(app)


def test_contact_stores_emails_and_rate_limits(monkeypatch):
    sent = []
    monkeypatch.setattr(mailer, "smtp_configured", lambda: True)
    monkeypatch.setattr(mailer, "send_mail", lambda subject, body, reply_to=None: sent.append((subject, body, reply_to)))
    monkeypatch.setattr(get_settings(), "contact_max_per_hour", 2)
    email = f"c-{uuid.uuid4()}@example.com"
    body = {"name": "Lan", "email": email, "topic": "bao_loi", "message": "Câu 12 hình như sai đáp án ạ."}
    assert client.post("/contact", json=body).status_code == 201
    assert sent and sent[0][2] == email and "Báo lỗi câu hỏi" in sent[0][0]
    assert client.post("/contact", json=body).status_code == 201
    assert client.post("/contact", json=body).status_code == 429


def test_contact_validation():
    bad = {"name": "A", "email": "not-an-email", "topic": "gop_y", "message": "ngắn"}
    assert client.post("/contact", json=bad).status_code == 422
    assert client.post("/contact", json={**bad, "email": "a@b.co", "topic": "spam", "message": "x" * 20}).status_code == 422


def test_admin_lists_contact_messages():
    from tests.test_auth import token

    s = get_settings()
    admin = f"admin-{uuid.uuid4()}@example.com"
    old = s.admin_emails
    s.admin_emails = admin
    try:
        r = client.get("/admin/contact-messages", headers={"Authorization": f"Bearer {token(admin)}"})
        assert r.status_code == 200 and isinstance(r.json(), list)
        assert client.get("/admin/contact-messages", headers={"Authorization": f"Bearer {token('x@example.com')}"}).status_code == 403
    finally:
        s.admin_emails = old
