import { startAttempt } from "./actions";

export const metadata = { title: "Làm bài test IQ" };

export default function TestIntro() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-5 px-4 py-10">
      <h1 className="text-3xl font-bold">Bài test IQ</h1>
      <ul className="list-disc space-y-1 pl-5 text-neutral-700">
        <li>40 câu, độ khó tăng dần, làm trong 35 phút.</li>
        <li>Được bỏ qua và quay lại câu trước. Tải lại trang không mất bài.</li>
        <li>Đăng nhập Google để xem điểm sau khi nộp.</li>
      </ul>
      <p className="text-sm text-neutral-500">
        Kết quả chỉ mang tính tham khảo, không phải bài test IQ chuẩn hóa.
      </p>
      <form action={startAttempt.bind(null, "full", undefined)}>
        <button className="rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white">Bắt đầu</button>
      </form>
    </main>
  );
}
