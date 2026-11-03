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
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <p className="text-neutral-600">Đăng nhập bằng Google để xem điểm và lưu lịch sử làm bài.</p>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {ERRORS[error] ?? "Đăng nhập không thành công, bạn thử lại nhé."}
        </p>
      )}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: `/auth/after-login?next=${encodeURIComponent(next)}` });
        }}
      >
        <button className="w-full rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white">
          Tiếp tục với Google
        </button>
      </form>
    </main>
  );
}
