import { startAttempt } from "@/app/test/actions";
import { TYPE_LABELS, type QuestionType } from "@/lib/types";

export const metadata = { title: "Luyện theo dạng đề" };

// Types that have questions in the bank today; logic and verbal come from the Claude skill after review.
const AVAILABLE: QuestionType[] = ["number_series", "matrix", "odd_one_out", "rotation"];

export default function PracticePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Luyện theo dạng đề</h1>
      <p className="mb-6 text-neutral-600">10 câu mỗi lượt, có giải thích ngay sau mỗi câu.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {AVAILABLE.map((t) => (
          <form key={t} action={startAttempt.bind(null, "practice", t)}>
            <button className="w-full rounded-lg border border-neutral-300 px-4 py-4 text-left font-medium hover:bg-neutral-50">
              {TYPE_LABELS[t]}
            </button>
          </form>
        ))}
      </div>
    </main>
  );
}
