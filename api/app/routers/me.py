import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.auth import current_user
from app.config import get_settings
from app.db import ReleaseDbRoute, get_db
from app.models import Attempt, Subscription, User

router = APIRouter(route_class=ReleaseDbRoute, prefix="/me", tags=["me"])


class MeOut(BaseModel):
    email: str
    name: str | None
    avatar_url: str | None
    is_admin: bool
    popunder_seen_at: datetime | None
    subscription_ends_at: datetime | None


@router.get("", response_model=MeOut)
def read_me(user: Annotated[User, Depends(current_user)], db: Annotated[Session, Depends(get_db, scope="function")]) -> MeOut:
    ends = db.scalar(
        select(func.max(Subscription.ends_at)).where(Subscription.user_id == user.id, Subscription.ends_at > datetime.now(timezone.utc))
    )
    return MeOut(
        email=user.email,
        name=user.name,
        avatar_url=user.avatar_url,
        is_admin=user.email in get_settings().admin_email_set,
        popunder_seen_at=user.popunder_seen_at,
        subscription_ends_at=ends,
    )


@router.post("/popunder-seen", status_code=204)
def mark_popunder_seen(
    user: Annotated[User, Depends(current_user)], db: Annotated[Session, Depends(get_db, scope="function")]
) -> None:
    user.popunder_seen_at = datetime.now(timezone.utc)
    db.add(user)
    db.commit()


class ClaimIn(BaseModel):
    anon_id: uuid.UUID


class ClaimOut(BaseModel):
    claimed: int


@router.post("/claim-anon", response_model=ClaimOut)
def claim_anonymous_attempts(
    body: ClaimIn,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[Session, Depends(get_db, scope="function")],
) -> ClaimOut:
    """Attach attempts made before login to this account.

    Only attempts with no owner are claimed, so attempts that already belong to
    another account on the same browser are never moved. The web app rotates the
    anon_id cookie after calling this.
    """
    result = db.execute(
        update(Attempt)
        .where(Attempt.anon_id == body.anon_id, Attempt.user_id.is_(None))
        .values(user_id=user.id, anon_id=None)
    )
    db.commit()
    return ClaimOut(claimed=result.rowcount or 0)
