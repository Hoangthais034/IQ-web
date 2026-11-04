import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Icon, TypeIcon, TypeIllustration } from "@/components/icons";
import { ButtonLink, Callout, Chip, Faq, SectionHeader, Steps, IconTile } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { GUIDES } from "@/content/guides";
import { TYPE_META, TYPE_ORDER } from "@/content/types";

export const metadata = {
  title: { absolute: "Test IQ online miễn phí 40 câu, mẹo làm bài từng dạng đề" },
  alternates: { canonical: "/" },
};

// Guides surfaced on the home page: the ones answering the most searched questions.
const FEATURED = ["iq-la-gi", "iq-bao-nhieu-la-thien-tai", "cau-hoi-iq-co-dap-an", "thang-diem-iq", "test-iq-phong-van-xin-viec", "test-iq-online-co-chinh-xac-khong"];

const FAQ = [
  { q: "Bài test IQ này có miễn phí không?", a: "Có. Làm bài test 40 câu và luyện tập theo dạng đều miễn phí, không cần đăng ký để bắt đầu." },
  { q: "Làm bài kiểm tra IQ mất bao lâu?", a: "Bài đầy đủ có 40 câu trong 35 phút. Nếu chỉ muốn luyện, mỗi lượt luyện tập có 10 câu theo một dạng đề." },
  { q: "Kết quả có chính xác không?", a: "Đây là điểm ước tính để bạn tham khảo và luyện tập, không phải bài test IQ chuẩn hóa hay chẩn đoán." },
  { q: "Làm sao để xem điểm?", a: "Sau khi nộp bài, bạn đăng nhập Google rồi xem một quảng cáo 15 giây, hoặc dùng gói tháng 30.000đ để không phải xem quảng cáo." },
  { q: "IQ trung bình là bao nhiêu?", a: "Trên thang điểm của các bài test chuẩn hóa, IQ trung bình là 100 và khoảng hai phần ba số người có điểm từ 85 đến 115." },
  { q: "Nếu tải lại trang hoặc mất mạng thì sao?", a: "Bài làm được lưu liên tục. Bạn mở lại là làm tiếp được, đồng hồ vẫn chạy theo thời gian thực." },
  { q: "Bài làm khi chưa đăng nhập có mất không?", a: "Không. Bài được giữ lại và gắn vào tài khoản ngay khi bạn đăng nhập." },
];

export default async function Home() {
  const session = await auth();
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-soft to-white">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 sm:py-16 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <Chip icon="star" tone="brand">Miễn phí làm bài và luyện tập</Chip>
            <h1 className="text-balance text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              Test IQ online miễn phí <span className="mt-2 block text-2xl text-brand-600 sm:text-4xl">Thắp sáng tư duy mỗi ngày</span>
            </h1>
            <p className="max-w-lg text-lg text-muted">
              Bài trắc nghiệm IQ 40 câu gồm 6 dạng đề, bằng tiếng Việt, kèm mẹo giải và giải thích chi tiết để bạn hiểu mình sai ở đâu.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/test"><Icon name="play" className="h-5 w-5" /> Làm bài test</ButtonLink>
              <ButtonLink href="/practice" variant="outline">Luyện theo dạng</ButtonLink>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Chip icon="list">40 câu</Chip>
              <Chip icon="clock">35 phút</Chip>
              <Chip icon="grid">6 dạng đề</Chip>
            </div>
          </div>
          {/* Sample question card */}
          <div className="card mx-auto w-full max-w-sm space-y-4 p-5">
            <div className="flex items-center justify-between">
              <Chip icon="hash" tone="brand">Dãy số</Chip>
              <span className="font-mono text-sm text-muted">Câu 7/40</span>
            </div>
            <p className="font-semibold text-ink">Số tiếp theo của dãy: 5, 8, 13, 20, 29, ?</p>
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              {["A. 36", "B. 38", "C. 40", "D. 42"].map((o, i) => (
                <span key={o} className={`option pointer-events-none !p-2.5 ${i === 2 ? "is-correct" : ""}`}>{o}</span>
              ))}
            </div>
            <p className="flex items-center gap-2 text-sm text-success"><Icon name="check" className="h-4 w-4" /> Hiệu là 3, 5, 7, 9 nên số tiếp theo cộng 11.</p>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-12">
        <SectionHeader eyebrow="6 dạng đề" title="Bạn sẽ gặp những dạng nào?" subtitle="Mỗi dạng đều có mẹo riêng. Bấm vào để xem cách nhận ra và cách giải." center />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TYPE_ORDER.map((t) => {
            const m = TYPE_META[t];
            return (
              <li key={t}>
                <Link href={`/meo/${m.tipSlug}`} className="card card-link block h-full space-y-3 p-5">
                  <div className={`rounded-xl ${m.tint} px-2 py-1`}><TypeIllustration type={t} className="h-20 w-full" /></div>
                  <div className="flex items-center gap-3">
                    <TypeIcon type={t} size="sm" />
                    <h3 className="font-bold text-ink">{m.label}</h3>
                  </div>
                  <p className="text-sm text-muted">{m.blurb}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800">Xem mẹo <Icon name="arrow" className="h-4 w-4" /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* How it works */}
      <section className="bg-sunken">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
          <div className="space-y-6">
            <SectionHeader eyebrow="Cách hoạt động" title="Từ làm bài đến biết điểm yếu" />
            <Steps items={[
              <p key="1"><strong className="text-ink">Làm bài test.</strong> 40 câu trong 35 phút, được bỏ qua và quay lại.</p>,
              <p key="2"><strong className="text-ink">Đăng nhập Google.</strong> Bài làm được lưu vào tài khoản của bạn.</p>,
              <p key="3"><strong className="text-ink">Mở khóa kết quả.</strong> Xem quảng cáo 15 giây hoặc dùng gói tháng.</p>,
              <p key="4"><strong className="text-ink">Luyện dạng yếu.</strong> Hệ thống chỉ ra dạng bạn sai nhiều nhất.</p>,
            ]} />
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2 md:grid-cols-1">
            {[
              { icon: "bulb" as const, tone: "sun" as const, t: "Mẹo từng dạng", d: "Quy luật hay gặp và cách giải từng bước." },
              { icon: "chart" as const, tone: "brand" as const, t: "Phân tích theo dạng", d: "Biết ngay dạng nào mạnh, dạng nào cần luyện." },
              { icon: "shield" as const, tone: "teal" as const, t: "Chấm điểm phía máy chủ", d: "Đáp án không lộ ra trình duyệt trong lúc làm bài." },
            ].map((f) => (
              <div key={f.t} className="card flex gap-4 p-4">
                <IconTile name={f.icon} tone={f.tone} />
                <div><p className="font-bold text-ink">{f.t}</p><p className="text-sm text-muted">{f.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-12">
        <SectionHeader eyebrow="Hướng dẫn" title="Tìm hiểu về IQ trước khi làm bài" subtitle="Những câu hỏi được tìm nhiều nhất về chỉ số IQ, trả lời ngắn gọn và thẳng thắn." center />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((slug) => GUIDES.find((g) => g.slug === slug)).filter((g) => !!g).map((g) => (
            <li key={g.slug}>
              <Link href={`/huong-dan/${g.slug}`} className="card card-link block h-full space-y-2 p-5">
                <h3 className="font-bold text-ink">{g.title}</h3>
                <p className="text-sm text-muted">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-center"><ButtonLink href="/huong-dan" variant="outline">Xem tất cả hướng dẫn</ButtonLink></div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <SectionHeader eyebrow="Câu hỏi thường gặp" title="Bạn có thể đang thắc mắc" center />
        <Faq items={FAQ} />
        <Callout tone="warn" icon="shield" title="Lưu ý">Kết quả chỉ mang tính tham khảo, không phải bài test IQ chuẩn hóa.</Callout>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-brand-600 px-6 py-10 text-center text-white sm:py-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Sẵn sàng thử sức?</h2>
          <p className="max-w-md text-white">Chỉ mất 35 phút. Không cần đăng ký để bắt đầu làm bài.</p>
          <ButtonLink href="/test" variant="light">Bắt đầu ngay <Icon name="arrow" className="h-5 w-5" /></ButtonLink>
        </div>
      </section>

      <div className="mx-auto mt-6 flex max-w-5xl items-center justify-center gap-4 px-4 text-sm text-muted">
        {session?.user && (
          <>
            <span>Xin chào, {session.user.name ?? session.user.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button className="btn btn-soft !min-h-9 !py-1">Đăng xuất</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
