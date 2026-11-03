from contextlib import asynccontextmanager

import anyio.to_thread
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import get_settings
from app.db import DB_POOL_MAX, engine
from app.routers import admin, attempts, contact, me, payments


@asynccontextmanager
async def lifespan(_: FastAPI):
    s = get_settings()
    # A weak shared secret lets anything on the Docker network forge user/admin tokens.
    if s.app_env == "production" and (len(s.api_jwt_secret) < 32 or s.api_jwt_secret == "change-me"):
        raise RuntimeError(
            f"API_JWT_SECRET is too short ({len(s.api_jwt_secret)} chars, need 32+). Generate one with: openssl rand -hex 32"
        )
    # Sync endpoints run in AnyIO's thread pool (40 by default). Keep it equal to the DB pool so a burst
    # queues for a thread instead of timing out while waiting for a DB connection.
    anyio.to_thread.current_default_thread_limiter().total_tokens = DB_POOL_MAX
    yield


prod = get_settings().app_env == "production"
app = FastAPI(
    title="IQ Test API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url=None if prod else "/docs",
    redoc_url=None,
    openapi_url=None if prod else "/openapi.json",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(me.router)
app.include_router(attempts.router)
app.include_router(admin.router)
app.include_router(payments.router)
app.include_router(contact.router)


@app.get("/health")
def health() -> dict:
    with engine.connect() as conn:
        conn.execute(text("select 1"))
    return {"status": "ok"}
