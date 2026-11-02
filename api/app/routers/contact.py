import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal

from fastapi import APIRouter, BackgroundTasks, Depends, Header, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app import mailer, ratelimit
from app.auth import optional_user
from app.config import get_settings
from app.db import ReleaseDbRoute, SessionLocal, get_db
from app.models import ContactMessage, User
from app.ratelimit import ClientIp

log = logging.getLogger(__name__)
router = APIRouter(route_class=ReleaseDbRoute, tags=["contact"])

TOPICS = {
    "gop_y": "Góp ý",
    "bao_loi": "Báo lỗi câu hỏi",
    "thanh_toan": "Thanh toán / gói tháng",
    "du_lieu": "Dữ liệu cá nhân",
    "khac": "Khác",
}


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    topic: Literal["gop_y", "bao_loi", "thanh_toan", "du_lieu", "khac"]
    message: str = Field(min_length=10, max_length=4000)


def _deliver(message_id: uuid.UUID) -> None:
    if not mailer.smtp_configured():
        log.warning("contact message %s stored but SMTP is not configured", message_id)
        return
    with SessionLocal() as db:
        m = db.get(ContactMessage, message_id)
        if m is None or m.emailed_at:
            return
        user_line = f"Tài khoản: {m.user_id}\n" if m.user_id else "Chưa đăng nhập\n"
        body = (
            f"Tên: {m.name}\nEmail: {m.email}\nChủ đề: {TOPICS.get(m.topic, m.topic)}\n{user_line}"
            f"Thời gian: {m.created_at:%Y-%m-%d %H:%M} UTC\n\n{m.message}\n"
        )
        try:
            mailer.send_mail(f"[Test IQ] {TOPICS.get(m.topic, m.topic)}: {m.name}", body, reply_to=m.email)
        except Exception:
            log.exception("failed to email contact message %s", message_id)
            return
        m.emailed_at = datetime.now(timezone.utc)
        db.commit()


@router.post("/contact", status_code=201)
def create_contact(
    body: ContactIn,
    background: BackgroundTasks,
    db: Annotated[Session, Depends(get_db, scope="function")],
    user: Annotated[User | None, Depends(optional_user)],
    x_anon_id: Annotated[str | None, Header()] = None,
    ip: ClientIp = None,
) -> dict:
    s = get_settings()
    too_many = "Bạn gửi hơi nhiều, thử lại sau 1 giờ nhé."
    ratelimit.hit("contact", ip, limit=s.contact_max_per_hour, window_s=3600, message=too_many)
    # global cap so rotating emails/IPs can't flood the owner's inbox
    ratelimit.hit("contact", "*", limit=s.contact_global_per_hour, window_s=3600, message="Hệ thống đang bận, thử lại sau nhé.")
    since = datetime.now(timezone.utc) - timedelta(hours=1)
    who = [ContactMessage.email == body.email.lower()]
    if user:
        who.append(ContactMessage.user_id == user.id)
    if x_anon_id:
        who.append(ContactMessage.anon_id == x_anon_id[:64])
    recent = db.scalar(select(func.count()).select_from(ContactMessage).where(ContactMessage.created_at > since, or_(*who)))
    if recent >= s.contact_max_per_hour:
        raise HTTPException(429, too_many)
    m = ContactMessage(
        user_id=user.id if user else None,
        anon_id=x_anon_id[:64] if x_anon_id else None,
        name=" ".join(body.name.split()),  # no CR/LF: the name goes into the email subject
        email=body.email.lower(),
        topic=body.topic,
        message=body.message.strip(),
    )
    db.add(m)
    db.commit()
    background.add_task(_deliver, m.id)
    return {"ok": True}
