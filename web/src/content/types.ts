import type { QuestionType } from "@/lib/types";

// One place that describes each question type: used by the home page, tips, practice and result pages.
export type TypeMeta = {
  type: QuestionType;
  label: string;
  blurb: string;
  tipSlug: string;
  // full class names (Tailwind only keeps classes it can see in the source)
  tint: string; // soft background for icon tiles
  ink: string; // icon / text color
  bar: string; // progress bar fill
  ring: string; // hover ring
};

export const TYPE_META: Record<QuestionType, TypeMeta> = {
  number_series: {
    type: "number_series", label: "Dãy số", tipSlug: "day-so",
    blurb: "Tìm số tiếp theo của một dãy số theo quy luật.",
    tint: "bg-blue-50", ink: "text-blue-600", bar: "bg-blue-500", ring: "hover:border-blue-300",
  },
  matrix: {
    type: "matrix", label: "Ma trận hình", tipSlug: "ma-tran-hinh",
    blurb: "Điền hình còn thiếu vào lưới 3x3.",
    tint: "bg-teal-50", ink: "text-teal-600", bar: "bg-teal-500", ring: "hover:border-teal-300",
  },
  odd_one_out: {
    type: "odd_one_out", label: "Tìm hình khác loại", tipSlug: "hinh-khac-loai",
    blurb: "Chọn hình không cùng quy luật với các hình còn lại.",
    tint: "bg-amber-50", ink: "text-amber-600", bar: "bg-amber-500", ring: "hover:border-amber-300",
  },
  rotation: {
    type: "rotation", label: "Xoay hình", tipSlug: "xoay-hinh",
    blurb: "Hình nào là hình gốc sau khi xoay, không bị lật.",
    tint: "bg-violet-50", ink: "text-violet-600", bar: "bg-violet-500", ring: "hover:border-violet-300",
  },
  logic: {
    type: "logic", label: "Logic", tipSlug: "logic",
    blurb: "Suy luận từ vài điều kiện cho trước.",
    tint: "bg-rose-50", ink: "text-rose-600", bar: "bg-rose-500", ring: "hover:border-rose-300",
  },
  verbal: {
    type: "verbal", label: "Ngôn ngữ", tipSlug: "ngon-ngu",
    blurb: "Quan hệ giữa các từ: tương tự, trái nghĩa, khác nhóm.",
    tint: "bg-emerald-50", ink: "text-emerald-600", bar: "bg-emerald-500", ring: "hover:border-emerald-300",
  },
};

export const TYPE_ORDER: QuestionType[] = ["number_series", "matrix", "odd_one_out", "rotation", "logic", "verbal"];

export const typeForTipSlug = (slug: string) => TYPE_ORDER.find((t) => TYPE_META[t].tipSlug === slug);
