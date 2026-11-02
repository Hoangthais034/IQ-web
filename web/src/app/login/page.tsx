import { signIn } from "@/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/" } = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <p className="text-neutral-600">Đăng nhập bằng Google để xem điểm và lưu lịch sử làm bài.</p>
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
