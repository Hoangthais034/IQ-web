"""Requests from the Next.js server carry a short-lived HS256 JWT signed with API_JWT_SECRET.

Claims: sub (email), name, picture. Google OAuth itself is handled by Auth.js in the web app.
"""

from typing import Annotated

import jwt
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.models import User


def _decode(authorization: str | None) -> dict | None:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1]
    try:
        return jwt.decode(
            token,
            get_settings().api_jwt_secret,
            algorithms=["HS256"],
            audience="iq-api",
            options={"require": ["sub", "exp", "aud"]},
        )
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")


def optional_user(
    db: Annotated[Session, Depends(get_db)],
    authorization: Annotated[str | None, Header()] = None,
) -> User | None:
    claims = _decode(authorization)
    if claims is None:
        return None
    email = claims["sub"].lower()
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(email=email)
        db.add(user)
    user.name = claims.get("name") or user.name
    user.avatar_url = claims.get("picture") or user.avatar_url
    db.commit()
    return user


def current_user(user: Annotated[User | None, Depends(optional_user)]) -> User:
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Login required")
    return user


def admin_user(user: Annotated[User, Depends(current_user)]) -> User:
    if user.email not in get_settings().admin_email_set:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin only")
    return user
