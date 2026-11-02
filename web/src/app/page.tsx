import Link from "next/link";

import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-4">
      <h1 className="text-3xl font-bold">Test IQ và mẹo làm bài</h1>
      <p className="text-neutral-600">
        40 câu, 35 phút. Kết quả chỉ mang tính tham khảo, không phải bài test IQ chuẩn hóa.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/test" className="rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white">
          Làm bài test
        </Link>
        <Link href="/practice" className="rounded-lg border px-5 py-3 font-medium">
          Luyện theo dạng
        </Link>
        <Link href="/meo" className="rounded-lg border px-5 py-3 font-medium">
          Mẹo làm bài
        </Link>
      </div>
      {session?.user ? (
        <div className="flex items-center gap-4">
          <span>Xin chào, {session.user.name ?? session.user.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="underline">Đăng xuất</button>
          </form>
        </div>
      ) : (
        <Link href="/login" className="w-fit underline">
          Đăng nhập
        </Link>
      )}
    </main>
  );
}
