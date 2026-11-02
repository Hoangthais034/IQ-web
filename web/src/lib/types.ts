export type QuestionType = "number_series" | "matrix" | "odd_one_out" | "rotation" | "logic" | "verbal";

export const TYPE_LABELS: Record<QuestionType, string> = {
  number_series: "Dãy số",
  matrix: "Ma trận hình",
  odd_one_out: "Tìm hình khác loại",
  rotation: "Xoay hình",
  logic: "Logic",
  verbal: "Ngôn ngữ",
};

export type Option = { key: string; text?: string | null; svg?: string | null };

export type Question = {
  position: number;
  type: QuestionType;
  prompt: string;
  prompt_svg: string | null;
  options: Option[];
  chosen_key: string | null;
};

export type Attempt = {
  id: string;
  mode: "full" | "practice";
  question_type: QuestionType | null;
  deadline_at: string | null;
  submitted_at: string | null;
  unlocked: boolean;
  questions: Question[];
};

export type Feedback = { is_correct: boolean; correct_key: string; explanation: string; tip_slug: string | null };

export type Result = {
  iq_estimate: number | null;
  correct: number;
  total: number;
  by_type: { type: QuestionType; correct: number; total: number }[];
  wrong: {
    position: number;
    prompt: string;
    chosen_key: string | null;
    correct_key: string;
    explanation: string;
    tip_slug: string | null;
  }[];
  weakest_type: QuestionType | null;
};
