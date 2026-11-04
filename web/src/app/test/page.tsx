import Link from "next/link";

import { Icon, type IconName } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/Prose";
import { Callout, Faq, IconTile, PageShell } from "@/components/ui";
import { TYPE_META, TYPE_ORDER } from "@/content/types";
import { SITE_URL } from "@/lib/site";

import { startAttempt } from "./actions";

export const metadata = {
  title: { absolute: "Test IQ online miễn phí 40 câu tiếng Việt, có lời giải" },
  description: "Làm bài test IQ online miễn phí 40 câu trong 35 phút, 6 dạng đề, độ khó tăng dần, không cần đăng ký để bắt đầu. Có phân tích theo dạng và lời giải sau khi nộp.",
  alternates: { canonical: "/test" },
};

const RULES: { icon: IconName; t: string; d: string }[] = [
  { icon: "list", t: "40 câu, 6 dạng đề", d: "Độ khó tăng dần từ dễ đến khó." },
  { icon: "clock", t: "35 phút", d: "Đồng hồ chạy theo thời gian thực. Hết giờ bài tự nộp." },
  { icon: "rotate", t: "Bỏ qua và quay lại", d: "Tải lại trang không mất bài, đáp án được lưu liên tục." },
  { icon: "login", t: "Đăng nhập để xem điểm", d: "Đăng nhập Google sau khi nộp. Bài của bạn được gắn vào tài khoản." },
];

const FAQ = [
  { q: "Bài test IQ này có miễn phí không?", a: "Có. Bạn làm bài miễn phí và không cần đăng ký để bắt đầu. Để xem điểm, bạn đăng nhập Google rồi xem một quảng cáo 15 giây, hoặc dùng gói tháng không quảng cáo." },
  { q: "Bài kiểm tra IQ có bao nhiêu câu?", a: "40 câu trắc nghiệm, mỗi câu 4 đến 6 lựa chọn, làm trong 35 phút." },
  { q: "Tôi có thể làm lại bài test không?", a: "Được. Mỗi lần làm, câu hỏi được chọn lại từ ngân hàng đề, nên bạn có thể làm nhiều lần và so sánh kết quả." },
  { q: "Điểm IQ trên web có chính xác không?", a: "Điểm chỉ là ước tính để tham khảo và luyện tập. Bài test IQ chuẩn hóa phải do chuyên gia thực hiện trực tiếp." },
];

export default function TestIntro() {
  return (
    <PageShell>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Làm bài test IQ", item: `${SITE_URL}/test` },
        ] },
      ] }} />
      <div className="space-y-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-ink">Test IQ online miễn phí 40 câu</h1>
            <p className="max-w-2xl text-lg text-muted">Bài kiểm tra IQ bằng tiếng Việt, 6 dạng đề từ dãy số đến ma trận hình. Không cần đăng ký để bắt đầu.</p>
          </div>
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
            <button className="btn btn-primary w-full sm:w-auto"><Icon name="play" className="h-5 w-5" /> Bắt đầu làm bài</button>
          </form>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-ink">Bài test gồm những dạng câu hỏi nào?</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TYPE_ORDER.map((t) => (
              <li key={t}>
                <Link href={`/meo/${TYPE_META[t].tipSlug}`} className="card card-link block h-full p-4">
                  <p className="font-bold text-ink">{TYPE_META[t].label}</p>
                  <p className="text-sm text-muted">{TYPE_META[t].blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Prose sections={[
          {
            h: "Điểm được tính như thế nào?",
            p: [
              "Câu khó được tính nhiều điểm hơn câu dễ. Sau khi nộp, điểm của bạn được quy ra thang IQ quen thuộc với trung bình 100, kèm số câu đúng của từng dạng để bạn biết nên luyện gì.",
              "Việc chấm điểm diễn ra trên máy chủ, đáp án không gửi xuống trình duyệt trong lúc làm bài. Sau khi xem kết quả, bạn đọc được lời giải của từng câu.",
            ],
          },
          {
            h: "Chuẩn bị trước khi làm bài",
            list: [
              "Dành ra 35 phút liền, ở nơi yên tĩnh, tắt thông báo điện thoại.",
              "Chuẩn bị giấy nháp để ghi phép tính và đánh dấu quy luật.",
              "Nhịp hợp lý là khoảng 50 giây mỗi câu. Câu nào quá 1 phút thì bỏ qua và quay lại sau.",
              "Không bị trừ điểm khi sai, nên đừng để trống câu nào.",
            ],
          },
        ]} />
        <p className="max-w-3xl text-muted">
          Lần đầu làm test IQ? Đọc nhanh <Link href="/huong-dan/cau-hoi-iq-co-dap-an" className="font-semibold text-brand-800 hover:underline">15 câu hỏi IQ có đáp án</Link> để làm quen,
          hoặc xem <Link href="/huong-dan/thang-diem-iq" className="font-semibold text-brand-800 hover:underline">cách đọc thang điểm IQ</Link>.
        </p>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-xl font-bold text-ink">Câu hỏi thường gặp</h2>
          <Faq items={FAQ} />
        </section>
      </div>
    </PageShell>
  );
}
