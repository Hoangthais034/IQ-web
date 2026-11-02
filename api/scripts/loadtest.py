"""Simulate N users doing a full test at once against the API: start, answer 40, submit.

Usage: uv run python scripts/loadtest.py 200 [http://127.0.0.1:38721]
"""
import asyncio, random, statistics, sys, time, uuid
import httpx

N = int(sys.argv[1]); BASE = sys.argv[2] if len(sys.argv) > 2 else "http://127.0.0.1:38721"
lat = {"start": [], "answer": [], "submit": []}; errors = []

async def user(c, i):
    h = {"X-Anon-Id": str(uuid.uuid4()), "X-Client-Ip": f"10.0.{i // 250}.{i % 250}"}
    t = time.perf_counter(); r = await c.post(f"{BASE}/attempts", json={"mode": "full"}, headers=h); lat["start"].append(time.perf_counter() - t)
    if r.status_code != 201: errors.append(("start", r.status_code)); return
    a = r.json()
    for q in a["questions"]:
        t = time.perf_counter()
        r = await c.put(f"{BASE}/attempts/{a['id']}/answers/{q['position']}", json={"key": random.choice(q["options"])["key"]}, headers=h)
        lat["answer"].append(time.perf_counter() - t)
        if r.status_code >= 300: errors.append(("answer", r.status_code))
    t = time.perf_counter(); r = await c.post(f"{BASE}/attempts/{a['id']}/submit", headers=h); lat["submit"].append(time.perf_counter() - t)
    if r.status_code != 200: errors.append(("submit", r.status_code))

async def main():
    async with httpx.AsyncClient(timeout=60, limits=httpx.Limits(max_connections=N)) as c:
        t = time.perf_counter(); await asyncio.gather(*(user(c, i) for i in range(N))); total = time.perf_counter() - t
    reqs = sum(len(v) for v in lat.values())
    print(f"users={N} requests={reqs} time={total:.1f}s throughput={reqs/total:.0f} req/s errors={len(errors)} {errors[:3]}")
    for k, v in lat.items():
        if v: v.sort(); print(f"  {k:7s} p50={statistics.median(v)*1000:.0f}ms p95={v[int(len(v)*.95)-1]*1000:.0f}ms max={v[-1]*1000:.0f}ms")

asyncio.run(main())
