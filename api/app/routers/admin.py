import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import admin_user
from app.db import get_db
from app.models import Question, QuestionStatus, User

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
