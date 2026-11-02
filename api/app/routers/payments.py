import re
import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Annotated
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import current_user
from app.config import get_settings
from app.db import get_db
from app.models import Payment, Subscription, User

router = APIRouter(tags=["payments"])
DbDep = Annotated[Session, Depends(get_db)]
UserDep = Annotated[User, Depends(current_user)]

CODE_PREFIX = "IQ"
CODE_RE = re.compile(rf"{CODE_PREFIX}[A-Z0-9]{{8}}")
PENDING_TTL = timedelta(minutes=30)


def now() -> datetime:
    return datetime.now(timezone.utc)


class PaymentOut(BaseModel):
    order_code: str
    amount_vnd: int
    status: str
    qr_url: str
    bank: str
    account: str
    expires_at: datetime
    subscription_ends_at: datetime | None = None


def _qr_url(code: str, amount: int) -> str:
    s = get_settings()
    q = urlencode({"acc": s.sepay_bank_account, "bank": s.sepay_bank, "amount": amount, "des": code, "template": "compact"})
    return f"https://qr.sepay.vn/img?{q}"


def _out(db: Session, p: Payment) -> PaymentOut:
    s = get_settings()
    ends = db.scalar(select(func.max(Subscription.ends_at)).where(Subscription.user_id == p.user_id))
    return PaymentOut(
        order_code=p.order_code, amount_vnd=p.amount_vnd, status=p.status, qr_url=_qr_url(p.order_code, p.amount_vnd),
        bank=s.sepay_bank, account=s.sepay_bank_account, expires_at=p.created_at + PENDING_TTL,
        subscription_ends_at=ends,
    )


@router.post("/payments", response_model=PaymentOut, status_code=201)
def create_payment(user: UserDep, db: DbDep) -> PaymentOut:
    s = get_settings()
    if not s.sepay_bank_account or not s.sepay_bank:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Payments are not configured")
    # reuse a recent pending order so refreshing the page does not create new codes
    recent = db.scalar(
        select(Payment).where(Payment.user_id == user.id, Payment.status == "pending", Payment.created_at > now() - PENDING_TTL)
        .order_by(Payment.created_at.desc()).limit(1)
    )
    if recent:
        return _out(db, recent)
    alphabet = string.ascii_uppercase + string.digits
    code = CODE_PREFIX + "".join(secrets.choice(alphabet) for _ in range(8))
    p = Payment(user_id=user.id, order_code=code, amount_vnd=s.subscription_price_vnd, status="pending")
    db.add(p)
    db.commit()
    db.refresh(p)
    return _out(db, p)


@router.get("/payments/{order_code}", response_model=PaymentOut)
def get_payment(order_code: str, user: UserDep, db: DbDep) -> PaymentOut:
    p = db.scalar(select(Payment).where(Payment.order_code == order_code, Payment.user_id == user.id))
    if p is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Payment not found")
    return _out(db, p)


class SepayIn(BaseModel):
    id: int
    transferType: str
    transferAmount: int
    content: str = ""
    code: str | None = None


@router.post("/webhooks/sepay")
def sepay_webhook(body: SepayIn, db: DbDep, authorization: Annotated[str | None, Header()] = None) -> dict:
    """SePay calls this for every bank transaction. Must answer {"success": true} or SePay retries."""
    key = get_settings().sepay_webhook_api_key
    if not key or not authorization or not secrets.compare_digest(authorization.strip(), f"Apikey {key}"):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Bad API key")
    ok = {"success": True}
    if body.transferType != "in":
        return ok
    text = f"{body.code or ''} {body.content}".upper().replace(" ", "")
    m = CODE_RE.search(text)
    if not m:
        return ok
    p = db.scalar(select(Payment).where(Payment.order_code == m.group(0)).with_for_update())
    # unknown code, already paid (replayed webhook) or underpaid: acknowledge and ignore
    if p is None or p.status == "paid" or body.transferAmount < p.amount_vnd:
        return ok
    p.status = "paid"
    p.paid_at = now()
    p.provider_ref = str(body.id)
    current_end = db.scalar(select(func.max(Subscription.ends_at)).where(Subscription.user_id == p.user_id))
    start = max(now(), current_end) if current_end else now()
    db.add(Subscription(user_id=p.user_id, starts_at=start, ends_at=start + timedelta(days=get_settings().subscription_days), payment_id=p.id))
    try:
        db.commit()
    except IntegrityError:  # same SePay transaction id processed concurrently
        db.rollback()
    return ok
