import { signIn } from "@/auth";

const ERRORS: Record<string, string> = {
  AccessDenied: "Google từ chối đăng nhập. Nếu bạn là người thử nghiệm, hãy kiểm tra email đã được thêm vào danh sách test user chưa.",
  Configuration: "Đăng nhập Google đang cấu hình chưa đúng. Vui lòng thử lại sau hoặc báo cho chúng tôi qua trang liên hệ.",
  MissingCSRF: "Phiên đăng nhập đã hết hạn. Bạn bấm đăng nhập lại nhé.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/", error } = await searchParams;
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-sm flex-col justify-center gap-6 px-4 py-10">
      <div className="card space-y-5 p-6">
      <h1 className="text-2xl font-extrabold text-ink">Đăng nhập</h1>
      <p className="text-muted">Đăng nhập bằng Google để xem điểm và lưu lịch sử làm bài.</p>
      {error && (
        <p role="alert" className="rounded-xl border border-danger bg-danger-soft p-3 text-sm text-danger">
          {ERRORS[error] ?? "Đăng nhập không thành công, bạn thử lại nhé."}
        </p>
      )}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: `/auth/after-login?next=${encodeURIComponent(next)}` });
        }}
      >
        <button className="btn btn-primary w-full">
          Tiếp tục với Google
        </button>
      </form>
      <p className="text-xs text-subtle">Chúng tôi chỉ dùng tên và email Google của bạn để lưu bài làm.</p>
      </div>
    </main>
  );
}
