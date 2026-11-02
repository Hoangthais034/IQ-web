import functools
import inspect
from collections.abc import AsyncIterator

from fastapi.routing import APIRoute
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings


class Base(DeclarativeBase):
    pass


# Per worker process. main.py caps the sync thread pool at DB_POOL_MAX so threads never wait on the pool.
DB_POOL_MAX = 20
engine = create_engine(get_settings().database_url, pool_pre_ping=True, pool_size=10, max_overflow=DB_POOL_MAX - 10, pool_timeout=30)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


async def get_db() -> AsyncIterator[Session]:
    # Async on purpose: FastAPI runs sync generator dependencies' teardown through a single-slot
    # limiter, so under load sessions (and their DB connections) waited to be closed and the pool ran dry.
    # Creating and closing a Session is cheap and non-blocking enough to do on the event loop.
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


class ReleaseDbRoute(APIRoute):
    """Close the request's Session inside the endpoint's worker thread, right after it returns.

    FastAPI validates a sync endpoint's response_model in another thread-pool job, and only then
    runs dependency teardown. Under load every thread could be waiting for a DB connection while
    every connection belonged to a finished request waiting for a thread: a deadlock. Closing the
    session here returns the connection before the response is serialized.
    """

    def __init__(self, path, endpoint, **kwargs):
        if not inspect.iscoroutinefunction(endpoint):
            original = endpoint

            @functools.wraps(original)
            def endpoint(*args, **kw):
                try:
                    return original(*args, **kw)
                finally:
                    for v in kw.values():
                        if isinstance(v, Session):
                            v.close()

        super().__init__(path, endpoint, **kwargs)
