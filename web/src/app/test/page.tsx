import { Icon, type IconName } from "@/components/icons";
import { Callout, IconTile, PageShell } from "@/components/ui";

import { startAttempt } from "./actions";

export const metadata = { title: "Làm bài test IQ" };

const RULES: { icon: IconName; t: string; d: string }[] = [
  { icon: "list", t: "40 câu, 6 dạng đề", d: "Độ khó tăng dần từ dễ đến khó." },
  { icon: "clock", t: "35 phút", d: "Đồng hồ chạy theo thời gian thực. Hết giờ bài tự nộp." },
  { icon: "rotate", t: "Bỏ qua và quay lại", d: "Tải lại trang không mất bài, đáp án được lưu liên tục." },
  { icon: "login", t: "Đăng nhập để xem điểm", d: "Đăng nhập Google sau khi nộp. Bài của bạn được gắn vào tài khoản." },
];

export default function TestIntro() {
  return (
    <PageShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-ink">Bài test IQ</h1>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((r) => (
            <li key={r.t} className="card flex flex-col gap-3 p-4">
              <IconTile name={r.icon} />
              <div><p className="font-bold text-ink">{r.t}</p><p className="text-sm text-muted">{r.d}</p></div>
            </li>
          ))}
        </ul>
        <Callout tone="warn" icon="shield">Kết quả chỉ mang tính tham khảo, không phải bài test IQ chuẩn hóa.</Callout>
        <form action={startAttempt.bind(null, "full", undefined)}>
          <button className="btn btn-primary w-full sm:w-auto"><Icon name="play" className="h-5 w-5" /> Bắt đầu</button>
        </form>
      </div>
    </PageShell>
  );
}
