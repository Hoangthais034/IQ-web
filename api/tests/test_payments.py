import uuid

import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.main import app
from tests.test_auth import token

client = TestClient(app)


@pytest.fixture(autouse=True)
def sepay_settings(monkeypatch):
    s = get_settings()
    monkeypatch.setattr(s, "sepay_webhook_api_key", "k123")
    monkeypatch.setattr(s, "sepay_bank_account", "0123456789")
    monkeypatch.setattr(s, "sepay_bank", "MBBank")


def hook(payload, key="k123"):
    return client.post("/webhooks/sepay", json=payload, headers={"Authorization": f"Apikey {key}"})


def test_payment_activates_subscription_once_and_unlocks():
    auth = {"Authorization": f"Bearer {token(f'payer-{uuid.uuid4()}@example.com')}"}
    p = client.post("/payments", headers=auth).json()
    assert p["amount_vnd"] == 30000 and p["order_code"] in p["qr_url"]
    # same order returned while pending
    assert client.post("/payments", headers=auth).json()["order_code"] == p["order_code"]

    tx = {"id": int(uuid.uuid4().int % 10**9), "transferType": "in", "transferAmount": 30000,
          "content": f"MBVCB.123 {p['order_code'].lower()} chuyen tien", "code": None}
    assert hook(tx, key="wrong").status_code == 401
    assert hook(tx).json() == {"success": True}
    assert hook(tx).json() == {"success": True}  # replay is a no-op
    me = client.get("/me", headers=auth).json()
    assert me["subscription_ends_at"] is not None
    assert client.get(f"/payments/{p['order_code']}", headers=auth).json()["status"] == "paid"

    # subscriber's full test is unlocked on submit, no ad needed
    a = client.post("/attempts", json={"mode": "full"}, headers=auth).json()
    assert client.post(f"/attempts/{a['id']}/submit", headers=auth).json()["unlocked"] is True


def test_underpaid_or_unknown_ignored():
    auth = {"Authorization": f"Bearer {token(f'cheap-{uuid.uuid4()}@example.com')}"}
    p = client.post("/payments", headers=auth).json()
    tx = {"id": int(uuid.uuid4().int % 10**9), "transferType": "in", "transferAmount": 10000, "content": p["order_code"]}
    assert hook(tx).json() == {"success": True}
    assert client.get(f"/payments/{p['order_code']}", headers=auth).json()["status"] == "pending"
    assert hook({"id": 1, "transferType": "in", "transferAmount": 30000, "content": "random"}).json() == {"success": True}
