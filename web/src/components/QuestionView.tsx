import type { Option, Question } from "@/lib/types";

function OptionBody({ option }: { option: Option }) {
  if (option.svg) {
    // SVG comes from our own generator and is stored server-side, never from user input.
    return <span className="block h-20 w-20" dangerouslySetInnerHTML={{ __html: option.svg }} />;
  }
  return <span className="text-lg">{option.text}</span>;
}

export function QuestionView({
  question,
  chosen,
  correctKey,
  disabled,
  onChoose,
}: {
  question: Question;
  chosen: string | null;
  correctKey?: string | null;
  disabled?: boolean;
  onChoose: (key: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-lg font-medium">{question.prompt}</p>
      {question.prompt_svg && (
        <div
          className={`mx-auto w-full text-neutral-900 ${question.type === "rotation" ? "max-w-[180px]" : "max-w-xs"}`}
          dangerouslySetInnerHTML={{ __html: question.prompt_svg }}
        />
      )}
      <div
        className={`grid gap-3 ${
          !question.options.some((o) => o.svg)
            ? "grid-cols-2"
            : question.options.length === 4
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-3"
        }`}
      >
        {question.options.map((o) => {
          const isChosen = chosen === o.key;
          const isCorrect = correctKey === o.key;
          const tone = correctKey
            ? isCorrect
              ? "border-green-600 bg-green-50"
              : isChosen
                ? "border-red-600 bg-red-50"
                : "border-neutral-200"
            : isChosen
              ? "border-neutral-900 bg-neutral-100"
              : "border-neutral-200 hover:border-neutral-400";
          return (
            <button
              key={o.key}
              type="button"
              disabled={disabled}
              onClick={() => onChoose(o.key)}
              className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left ${tone}`}
            >
              <span className="text-sm font-semibold text-neutral-500">{o.key}</span>
              <OptionBody option={o} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
