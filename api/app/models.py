import enum
import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class QuestionType(str, enum.Enum):
    number_series = "number_series"
    matrix = "matrix"
    odd_one_out = "odd_one_out"
    rotation = "rotation"
    logic = "logic"
    verbal = "verbal"


class QuestionStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class QuestionSource(str, enum.Enum):
    generator = "generator"
    claude = "claude"
    manual = "manual"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    name: Mapped[str | None] = mapped_column(String(200))
    avatar_url: Mapped[str | None] = mapped_column(String(1000))
    popunder_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    type: Mapped[QuestionType] = mapped_column(Enum(QuestionType, name="question_type"), index=True)
    difficulty: Mapped[int] = mapped_column(Integer)  # 1..5
    prompt: Mapped[str] = mapped_column(Text)
    prompt_svg: Mapped[str | None] = mapped_column(Text)
    # [{"key": "A", "text": "...", "svg": "..."}]
    options: Mapped[list] = mapped_column(JSON)
    answer_key: Mapped[str] = mapped_column(String(8))
    explanation: Mapped[str] = mapped_column(Text, default="")
    tip_slug: Mapped[str | None] = mapped_column(String(100))
    source: Mapped[QuestionSource] = mapped_column(Enum(QuestionSource, name="question_source"))
    status: Mapped[QuestionStatus] = mapped_column(
        Enum(QuestionStatus, name="question_status"), default=QuestionStatus.pending, index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Attempt(Base):
    __tablename__ = "attempts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), index=True)
    # set for attempts started before login; claimed into user_id on login
    anon_id: Mapped[uuid.UUID | None] = mapped_column(index=True)
    mode: Mapped[str] = mapped_column(String(20))  # full | practice
    question_type: Mapped[QuestionType | None] = mapped_column(Enum(QuestionType, name="question_type"))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deadline_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    raw_score: Mapped[float | None]
    iq_estimate: Mapped[int | None]
    # how the score was unlocked: "ad" | "subscription"; None = still locked
    unlocked_via: Mapped[str | None] = mapped_column(String(20))
    ad_gate_started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    answers: Mapped[list["AttemptAnswer"]] = relationship(back_populates="attempt", order_by="AttemptAnswer.position")


class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    attempt_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("attempts.id", ondelete="CASCADE"), primary_key=True)
    position: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("questions.id"))
    # shuffled option order shown to this user, e.g. ["C", "A", "D", "B"]
    option_order: Mapped[list] = mapped_column(JSON)
    chosen_key: Mapped[str | None] = mapped_column(String(8))
    is_correct: Mapped[bool | None]

    attempt: Mapped[Attempt] = relationship(back_populates="answers")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    payment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("payments.id"), unique=True)


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    # short code the user puts in the transfer note, matched by the SePay IPN
    order_code: Mapped[str] = mapped_column(String(32), unique=True)
    amount_vnd: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | paid | expired
    provider_ref: Mapped[str | None] = mapped_column(String(100), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
