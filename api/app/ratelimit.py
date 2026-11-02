"""Small in-process sliding-window limiter keyed by client IP.

The API is only reachable from the Next.js server, which forwards the visitor's IP (from Traefik's
X-Real-Ip) as X-Client-Ip. Limits are per worker process, so the effective limit is N x workers.
"""

import threading
import time
from collections import defaultdict, deque
from typing import Annotated

from fastapi import Header, HTTPException

_lock = threading.Lock()
_hits: dict[tuple[str, str], deque[float]] = defaultdict(deque)
_last_sweep = 0.0


def hit(bucket: str, key: str | None, limit: int, window_s: int, message: str) -> None:
    if not key:
        return
    global _last_sweep
    now = time.monotonic()
    with _lock:
        if now - _last_sweep > 600:  # drop idle keys so memory stays bounded
            for k in [k for k, q in _hits.items() if not q or now - q[-1] > 3600]:
                del _hits[k]
            _last_sweep = now
        q = _hits[(bucket, key)]
        while q and now - q[0] > window_s:
            q.popleft()
        if len(q) >= limit:
            raise HTTPException(429, message)
        q.append(now)


def reset() -> None:
    with _lock:
        _hits.clear()


ClientIp = Annotated[str | None, Header(alias="X-Client-Ip")]
