import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import admin_user
from app.db import get_db
from datetime import datetime, timezone

from app.models import Payment, Question, QuestionStatus, UnmatchedTransaction, User
from app.routers.payments import grant_subscription

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(admin_user)])
DbDep = Annotated[Session, Depends(get_db)]


class AdminQuestion(BaseModel):
    id: uuid.UUID
    type: str
    difficulty: int
    prompt: str
    prompt_svg: str | None
    options: list[dict]
    answer_key: str
    explanation: str
    source: str
    status: str


class StatusIn(BaseModel):
    status: QuestionStatus


@router.get("/questions", response_model=list[AdminQuestion])
def list_questions(db: DbDep, status: QuestionStatus = QuestionStatus.pending, limit: int = 50):
    rows = db.scalars(select(Question).where(Question.status == status).order_by(Question.created_at).limit(min(limit, 200)))
    return [AdminQuestion.model_validate(q, from_attributes=True) for q in rows]


@router.post("/questions/{question_id}/status", status_code=204)
def set_status(question_id: uuid.UUID, body: StatusIn, db: DbDep, _: Annotated[User, Depends(admin_user)]):
    q = db.get(Question, question_id)
    if q is None:
        raise HTTPException(404, "Question not found")
    q.status = body.status
    db.commit()


class UnmatchedOut(BaseModel):
    id: uuid.UUID
    amount_vnd: int
    content: str
    reason: str
    received_at: datetime


class ResolveIn(BaseModel):
    email: str | None = None  # activate for this user; omit to just dismiss


@router.get("/transactions/unmatched", response_model=list[UnmatchedOut])
def list_unmatched(db: DbDep):
    rows = db.scalars(
        select(UnmatchedTransaction).where(UnmatchedTransaction.resolved_at.is_(None)).order_by(UnmatchedTransaction.received_at.desc())
    )
    return [UnmatchedOut.model_validate(t, from_attributes=True) for t in rows]


@router.post("/transactions/{tx_id}/resolve", status_code=204)
def resolve_unmatched(tx_id: uuid.UUID, body: ResolveIn, db: DbDep):
    t = db.get(UnmatchedTransaction, tx_id)
    if t is None or t.resolved_at is not None:
        raise HTTPException(404, "Transaction not found")
    if body.email:
        user = db.scalar(select(User).where(User.email == body.email.strip().lower()))
        if user is None:
            raise HTTPException(404, "No user with that email (they must log in once first)")
        p = Payment(user_id=user.id, order_code=f"MANUAL{t.provider_ref}"[:32], amount_vnd=t.amount_vnd,
                    status="paid", provider_ref=t.provider_ref, paid_at=datetime.now(timezone.utc))
        db.add(p)
        db.flush()
        grant_subscription(db, p)
        t.resolved_user_id = user.id
    t.resolved_at = datetime.now(timezone.utc)
    db.commit()
