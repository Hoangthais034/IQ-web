# IQ Test web

Web test IQ tiếng Việt kèm mẹo làm bài theo từng dạng đề. Monorepo:

| Thư mục | Nội dung |
| --- | --- |
| `web/` | Next.js 15 (App Router, Tailwind), đăng nhập Google bằng Auth.js |
| `api/` | FastAPI + SQLAlchemy 2 + Alembic, quản lý package bằng uv |

Next.js server gọi API qua network nội bộ, kèm JWT HS256 ngắn hạn ký bằng `API_JWT_SECRET`.
Người chưa đăng nhập được cấp cookie `anon_id`; sau khi đăng nhập, `/auth/after-login`
gán các lượt làm bài ẩn danh vào tài khoản rồi cấp `anon_id` mới.

## Chạy local

Port mặc định cố ý không dùng port phổ biến: web 34817, api 38721, db 45329 (đổi qua `WEB_PORT`, `API_PORT`, `DB_PORT`).

```bash
docker compose -f docker-compose.dev.yml up -d      # db + api (hot reload)
cd web && cp .env.example .env.local && npm install && npm run dev
```

Test API: `cd api && uv sync && uv run pytest` (cần Postgres ở `DATABASE_URL`).

## Deploy lên Dokploy

1. Tạo service loại **Docker Compose**, trỏ vào repo này, file `docker-compose.yml`.
2. Khai báo các biến trong `.env.example` ở tab Environment. Biến `NEXT_PUBLIC_*` được đưa vào lúc build.
3. Gắn domain vào service `web`, container port `3000`, bật HTTPS. Compose production không publish port nào ra host nên không trùng service khác.
4. Bật backup cho volume `db-data`.
5. Lần đầu deploy, tạo ngân hàng đề: `docker compose exec api python -m app.cli generate --count 300`.

## Ngân hàng đề

- `python -m app.cli generate --count N`: sinh đề dãy số và ma trận hình bằng code, trạng thái approved.
- `python -m app.cli import file.json [--dry-run] [--approve]`: nhập đề JSON (ví dụ do skill Claude `iq-question-writer` viết), mặc định trạng thái pending chờ duyệt qua `/admin/questions`.
- Định dạng đề: `api/app/schemas.py` (`QuestionIn`).

Frontend không chấm điểm: đáp án không bao giờ gửi xuống trình duyệt; chấm điểm, quy ra IQ, hết giờ và mở khóa đều do API xử lý.

## Cần chuẩn bị

- Bản ghi A của subdomain trỏ về IP server Dokploy.
- Google OAuth client (Web), redirect URI `https://<subdomain>/api/auth/callback/google` và `http://localhost:34817/api/auth/callback/google`.
- Sau này: tài khoản Adsterra, tài khoản SePay.
