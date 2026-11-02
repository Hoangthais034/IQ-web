import random
import uuid
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import scoring
from app.auth import optional_user
from app.db import get_db
from app.models import Attempt, AttemptAnswer, Question, QuestionStatus, QuestionType, Subscription, User
from app.schemas import Mode

router = APIRouter(prefix="/attempts", tags=["attempts"])

UserDep = Annotated[User | None, Depends(optional_user)]
DbDep = Annotated[Session, Depends(get_db)]
AnonDep = Annotated[uuid.UUID | None, Header(alias="X-Anon-Id")]


def now() -> datetime:
    return datetime.now(timezone.utc)


# ---------- schemas ----------

class StartIn(BaseModel):
    mode: Mode = "full"
    question_type: QuestionType | None = None


class OptionOut(BaseModel):
    key: str
    text: str | None = None
    svg: str | None = None


class QuestionOut(BaseModel):
    position: int
    type: QuestionType
    prompt: str
    prompt_svg: str | None
    options: list[OptionOut]
    chosen_key: str | None


class AttemptOut(BaseModel):
    id: uuid.UUID
    mode: str
    question_type: QuestionType | None
    deadline_at: datetime | None
    submitted_at: datetime | None
    unlocked: bool
    questions: list[QuestionOut]


class AnswerIn(BaseModel):
    key: str


class FeedbackOut(BaseModel):
    is_correct: bool
    correct_key: str
    explanation: str
    tip_slug: str | None


class SubmitOut(BaseModel):
    submitted_at: datetime
    unlocked: bool


class TypeScore(BaseModel):
    type: QuestionType
    correct: int
    total: int


class WrongItem(BaseModel):
    position: int
    prompt: str
    chosen_key: str | None
    correct_key: str
    explanation: str
    tip_slug: str | None


class ResultOut(BaseModel):
    iq_estimate: int | None
    correct: int
    total: int
    by_type: list[TypeScore]
    wrong: list[WrongItem]
    weakest_type: QuestionType | None


class AdGateOut(BaseModel):
    started_at: datetime
    seconds: int


# ---------- helpers ----------

def _visible_options(q: Question, order: list[str]) -> list[OptionOut]:
    """Options in the shuffled order for this attempt, relabelled A, B, C... so the stored key never leaks."""
    by_key = {o["key"]: o for o in q.options}
    return [OptionOut(key="ABCDEFGH"[i], text=by_key[k].get("text"), svg=by_key[k].get("svg")) for i, k in enumerate(order)]


def _shown_to_real(order: list[str], shown: str) -> str:
    idx = "ABCDEFGH".find(shown)
    if idx < 0 or idx >= len(order):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Unknown option")
    return order[idx]


def _real_to_shown(order: list[str], real: str | None) -> str | None:
    return None if real is None else "ABCDEFGH"[order.index(real)]


def _get_owned(db: Session, attempt_id: uuid.UUID, user: User | None, anon: uuid.UUID | None) -> Attempt:
    a = db.get(Attempt, attempt_id)
    if a is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Attempt not found")
    owned = (user is not None and a.user_id == user.id) or (a.user_id is None and anon is not None and a.anon_id == anon)
    if not owned:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Attempt not found")
    return a


def _has_active_sub(db: Session, user: User | None) -> bool:
    if user is None:
        return False
    return db.scalar(select(Subscription.id).where(Subscription.user_id == user.id, Subscription.ends_at > now()).limit(1)) is not None


def _expired(a: Attempt) -> bool:
    return a.deadline_at is not None and now() > a.deadline_at + timedelta(seconds=5)


def _pick_questions(db: Session, mode: str, qtype: QuestionType | None) -> list[Question]:
    approved = select(Question).where(Question.status == QuestionStatus.approved)
    if mode == "practice":
        if qtype is None:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "question_type required for practice")
        pool = list(db.scalars(approved.where(Question.type == qtype)))
        return random.sample(pool, min(scoring.PRACTICE_SIZE, len(pool)))

    pool = list(db.scalars(approved))
    by_type: dict[QuestionType, list[Question]] = defaultdict(list)
    for q in pool:
        by_type[q.type].append(q)
    for qs in by_type.values():
        random.shuffle(qs)
    picked: list[Question] = []
    # round-robin over types so the test is balanced, then order by difficulty
    while len(picked) < scoring.FULL_TEST_SIZE and any(by_type.values()):
        for qs in by_type.values():
            if qs and len(picked) < scoring.FULL_TEST_SIZE:
                picked.append(qs.pop())
    picked.sort(key=lambda q: q.difficulty)
    return picked


def _attempt_out(db: Session, a: Attempt) -> AttemptOut:
    qs = {q.id: q for q in db.scalars(select(Question).where(Question.id.in_([x.question_id for x in a.answers])))}
    return AttemptOut(
        id=a.id,
        mode=a.mode,
        question_type=a.question_type,
        deadline_at=a.deadline_at,
        submitted_at=a.submitted_at,
        unlocked=a.unlocked_via is not None,
        questions=[
            QuestionOut(
                position=x.position,
                type=qs[x.question_id].type,
                prompt=qs[x.question_id].prompt,
                prompt_svg=qs[x.question_id].prompt_svg,
                options=_visible_options(qs[x.question_id], x.option_order),
                chosen_key=_real_to_shown(x.option_order, x.chosen_key),
            )
            for x in a.answers
        ],
    )


# ---------- routes ----------

@router.post("", response_model=AttemptOut, status_code=201)
def start_attempt(body: StartIn, db: DbDep, user: UserDep, anon: AnonDep = None) -> AttemptOut:
    if user is None and anon is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "X-Anon-Id required when not logged in")
    questions = _pick_questions(db, body.mode, body.question_type)
    if not questions:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "No questions available")
    a = Attempt(
        user_id=user.id if user else None,
        anon_id=None if user else anon,
        mode=body.mode,
        question_type=body.question_type,
        deadline_at=now() + timedelta(minutes=scoring.FULL_TEST_MINUTES) if body.mode == "full" else None,
        # practice results are never locked
        unlocked_via="practice" if body.mode == "practice" else None,
    )
    for i, q in enumerate(questions):
        order = [o["key"] for o in q.options]
        random.shuffle(order)
        a.answers.append(AttemptAnswer(position=i, question_id=q.id, option_order=order))
    db.add(a)
    db.commit()
    return _attempt_out(db, a)


@router.get("/{attempt_id}", response_model=AttemptOut)
def get_attempt(attempt_id: uuid.UUID, db: DbDep, user: UserDep, anon: AnonDep = None) -> AttemptOut:
    return _attempt_out(db, _get_owned(db, attempt_id, user, anon))


@router.put("/{attempt_id}/answers/{position}", response_model=FeedbackOut | None)
def answer(attempt_id: uuid.UUID, position: int, body: AnswerIn, db: DbDep, user: UserDep, anon: AnonDep = None):
    a = _get_owned(db, attempt_id, user, anon)
    if a.submitted_at is not None or _expired(a):
        raise HTTPException(status.HTTP_409_CONFLICT, "Attempt is closed")
    row = next((x for x in a.answers if x.position == position), None)
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")
    if a.mode == "practice" and row.chosen_key is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Already answered")
    row.chosen_key = _shown_to_real(row.option_order, body.key)
    q = db.get(Question, row.question_id)
    row.is_correct = row.chosen_key == q.answer_key
    db.commit()
    if a.mode == "practice":
        return FeedbackOut(
            is_correct=row.is_correct,
            correct_key=_real_to_shown(row.option_order, q.answer_key),
            explanation=q.explanation,
            tip_slug=q.tip_slug,
        )
    return None


@router.post("/{attempt_id}/submit", response_model=SubmitOut)
def submit(attempt_id: uuid.UUID, db: DbDep, user: UserDep, anon: AnonDep = None) -> SubmitOut:
    a = _get_owned(db, attempt_id, user, anon)
    if a.submitted_at is None:
        qs = {q.id: q for q in db.scalars(select(Question).where(Question.id.in_([x.question_id for x in a.answers])))}
        results = []
        for x in a.answers:
            x.is_correct = x.chosen_key is not None and x.chosen_key == qs[x.question_id].answer_key
            results.append((qs[x.question_id].difficulty, x.is_correct))
        a.raw_score = scoring.weighted_share(results)
        a.iq_estimate = scoring.iq_estimate(a.raw_score) if a.mode == "full" else None
        a.submitted_at = now()
        if a.unlocked_via is None and _has_active_sub(db, user):
            a.unlocked_via = "subscription"
        db.commit()
    return SubmitOut(submitted_at=a.submitted_at, unlocked=a.unlocked_via is not None)


@router.post("/{attempt_id}/ad-gate", response_model=AdGateOut)
def start_ad_gate(attempt_id: uuid.UUID, db: DbDep, user: UserDep) -> AdGateOut:
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Login required")
    a = _get_owned(db, attempt_id, user, None)
    if a.submitted_at is None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Submit first")
    if a.ad_gate_started_at is None:
        a.ad_gate_started_at = now()
        db.commit()
    return AdGateOut(started_at=a.ad_gate_started_at, seconds=scoring.AD_GATE_SECONDS)


@router.post("/{attempt_id}/unlock", response_model=SubmitOut)
def unlock(attempt_id: uuid.UUID, db: DbDep, user: UserDep) -> SubmitOut:
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Login required")
    a = _get_owned(db, attempt_id, user, None)
    if a.submitted_at is None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Submit first")
    if a.unlocked_via is None:
        if _has_active_sub(db, user):
            a.unlocked_via = "subscription"
        elif a.ad_gate_started_at and now() - a.ad_gate_started_at >= timedelta(seconds=scoring.AD_GATE_SECONDS):
            a.unlocked_via = "ad"
        else:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Watch the ad or subscribe to unlock")
        db.commit()
    return SubmitOut(submitted_at=a.submitted_at, unlocked=True)


@router.get("/{attempt_id}/result", response_model=ResultOut)
def result(attempt_id: uuid.UUID, db: DbDep, user: UserDep, anon: AnonDep = None) -> ResultOut:
    a = _get_owned(db, attempt_id, user, anon)
    if a.submitted_at is None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Submit first")
    if a.mode == "full" and user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Login required")
    if a.unlocked_via is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Locked")
    qs = {q.id: q for q in db.scalars(select(Question).where(Question.id.in_([x.question_id for x in a.answers])))}
    tally: dict[QuestionType, list[int]] = defaultdict(lambda: [0, 0])
    wrong = []
    for x in a.answers:
        q = qs[x.question_id]
        tally[q.type][1] += 1
        if x.is_correct:
            tally[q.type][0] += 1
        else:
            wrong.append(WrongItem(
                position=x.position, prompt=q.prompt,
                chosen_key=_real_to_shown(x.option_order, x.chosen_key),
                correct_key=_real_to_shown(x.option_order, q.answer_key),
                explanation=q.explanation, tip_slug=q.tip_slug,
            ))
    by_type = [TypeScore(type=t, correct=c, total=n) for t, (c, n) in tally.items()]
    weakest = min(by_type, key=lambda s: s.correct / s.total).type if by_type else None
    return ResultOut(
        iq_estimate=a.iq_estimate,
        correct=sum(s.correct for s in by_type),
        total=len(a.answers),
        by_type=by_type,
        wrong=wrong,
        weakest_type=weakest,
    )
