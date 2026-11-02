// Tips content, one entry per question type. Plain data so it renders statically and is easy to edit.
export type Tip = {
  slug: string;
  title: string;
  intro: string;
  recognize: string[];
  rules: { name: string; detail: string }[];
  steps: string[];
  example: { question: string; answer: string; why: string };
  practiceType?: "number_series" | "matrix" | "odd_one_out" | "rotation";
};

export const TIPS: Tip[] = [
  {
    slug: "day-so",
    title: "Mẹo làm dạng dãy số",
    intro: "Dãy số kiểm tra khả năng tìm quy luật. Hầu hết đề chỉ dùng 6 quy luật quen thuộc, nên nhận ra nhanh là thắng.",
    recognize: ["Đề cho 4 đến 6 số và hỏi số tiếp theo.", "Các số tăng hoặc giảm không đều, có khi xen kẽ."],
    rules: [
      { name: "Cộng đều", detail: "Hiệu giữa hai số liên tiếp không đổi: 3, 7, 11, 15." },
      { name: "Nhân đều", detail: "Tỉ số không đổi, số tăng rất nhanh: 2, 6, 18, 54." },
      { name: "Hiệu tăng dần", detail: "Hiệu lần lượt là 2, 4, 6...: 1, 3, 7, 13." },
      { name: "Hai dãy xen kẽ", detail: "Vị trí lẻ và chẵn là hai dãy riêng: 2, 30, 4, 27, 6, 24." },
      { name: "Kiểu Fibonacci", detail: "Mỗi số bằng tổng hai số trước: 2, 3, 5, 8, 13." },
      { name: "Bình phương, lập phương", detail: "Số gần 1, 4, 9, 16, 25 hoặc 1, 8, 27, 64, có thể cộng/trừ thêm." },
    ],
    steps: [
      "Viết hiệu giữa các số liên tiếp. Nếu đều nhau thì xong.",
      "Hiệu không đều: viết tiếp hiệu của hiệu (hiệu bậc 2).",
      "Số tăng rất nhanh: thử chia số sau cho số trước.",
      "Dãy lên xuống thất thường: tách vị trí lẻ và chẵn.",
      "Vẫn chưa ra: thử cộng hai số trước, hoặc so với các số chính phương.",
    ],
    example: {
      question: "5, 8, 13, 20, 29, ?",
      answer: "40",
      why: "Hiệu là 3, 5, 7, 9 nên hiệu tiếp theo là 11. 29 + 11 = 40.",
    },
    practiceType: "number_series",
  },
  {
    slug: "ma-tran-hinh",
    title: "Mẹo làm dạng ma trận hình",
    intro: "Ma trận 3x3 thiếu một ô. Mỗi thuộc tính của hình (số lượng, loại hình, kiểu tô) có quy luật riêng theo hàng.",
    recognize: ["Lưới 3x3, ô cuối có dấu ?", "Có 6 đến 8 đáp án là hình."],
    rules: [
      { name: "Giữ nguyên", detail: "Thuộc tính giống nhau trên cả hàng." },
      { name: "Tăng dần", detail: "Số hình tăng 1 qua mỗi cột." },
      { name: "Đủ bộ ba", detail: "Mỗi hàng có đủ 3 giá trị khác nhau, mỗi giá trị xuất hiện một lần." },
    ],
    steps: [
      "Tách từng thuộc tính: số lượng, loại hình, kiểu tô. Xét riêng từng cái.",
      "Đọc theo hàng trước, nếu không ra thì đọc theo cột.",
      "Với mỗi thuộc tính, xác định giá trị của ô còn thiếu.",
      "Loại các đáp án sai ở bất kỳ thuộc tính nào. Đáp án còn lại là đúng.",
    ],
    example: {
      question: "Hàng 3: 1 hình vuông kẻ sọc, 2 hình vuông kẻ sọc, ?",
      answer: "3 hình vuông kẻ sọc",
      why: "Số hình tăng 1 theo cột, loại hình và kiểu tô giữ nguyên trong hàng.",
    },
    practiceType: "matrix",
  },
  {
    slug: "hinh-khac-loai",
    title: "Mẹo làm dạng tìm hình khác loại",
    intro: "Bốn hình giống nhau ở một điểm, một hình thì không. Điểm chung đó thường chỉ là một thuộc tính.",
    recognize: ["Đề cho 5 hình và hỏi hình nào khác loại."],
    rules: [
      { name: "Loại hình", detail: "Bốn hình tròn, một hình vuông." },
      { name: "Số lượng", detail: "Bốn ô có 3 hình, một ô có 2 hình." },
      { name: "Kiểu tô", detail: "Bốn hình rỗng, một hình kẻ sọc." },
    ],
    steps: [
      "Xét lần lượt từng thuộc tính: loại hình, số lượng, kiểu tô.",
      "Với mỗi thuộc tính, đếm xem giá trị nào chỉ xuất hiện một lần.",
      "Thuộc tính nào có đúng một hình lệch là thuộc tính của đề. Các thuộc tính khác chỉ để gây nhiễu.",
    ],
    example: {
      question: "2 lục giác đen, 2 lục giác sọc, 4 hình vuông đen, 4 lục giác đen, 2 lục giác sọc",
      answer: "4 hình vuông đen",
      why: "Loại hình: bốn hình là lục giác, chỉ một hình vuông. Số lượng và kiểu tô đều lặp lại.",
    },
    practiceType: "odd_one_out",
  },
  {
    slug: "xoay-hinh",
    title: "Mẹo làm dạng xoay hình",
    intro: "Phải phân biệt hình xoay với hình bị lật như qua gương. Hình lật không bao giờ xoay về được hình gốc.",
    recognize: ["Đề cho một hình gốc và hỏi hình nào là nó sau khi xoay."],
    rules: [
      { name: "Xoay", detail: "Giữ nguyên chiều, chỉ đổi hướng: 90, 180, 270 độ." },
      { name: "Lật gương", detail: "Đảo trái phải. Trông giống nhưng là hình khác." },
    ],
    steps: [
      "Chọn một điểm mốc dễ thấy ở hình gốc, ví dụ phần nhô ra.",
      "Đi theo chiều kim đồng hồ quanh hình gốc, ghi thứ tự các phần.",
      "Ở mỗi đáp án, tìm điểm mốc rồi đi theo chiều kim đồng hồ. Thứ tự giống hình gốc là hình xoay, ngược lại là hình lật.",
    ],
    example: {
      question: "Hình chữ L xoay 90 độ.",
      answer: "Chữ L nằm ngang, phần ngắn chĩa xuống",
      why: "Chữ L lật gương sẽ có phần ngắn chĩa sang hướng ngược lại dù xoay thế nào.",
    },
    practiceType: "rotation",
  },
  {
    slug: "logic",
    title: "Mẹo làm dạng logic",
    intro: "Câu logic cho vài mệnh đề và hỏi kết luận nào chắc chắn đúng. Bẫy thường nằm ở chữ \"mọi\" và \"một số\".",
    recognize: ["Đề có các mệnh đề như \"mọi A là B\", \"một số B là C\".", "Hoặc sắp xếp thứ tự: cao hơn, đứng trước, ngồi cạnh."],
    rules: [
      { name: "Mọi A là B", detail: "Không suy ra được mọi B là A." },
      { name: "Một số A là B", detail: "Không suy ra được một số A không phải B." },
      { name: "Thứ tự bắc cầu", detail: "A > B và B > C thì A > C." },
    ],
    steps: [
      "Vẽ sơ đồ Venn hoặc một đường thẳng thứ tự ra giấy.",
      "Chỉ dùng thông tin trong đề, bỏ qua hiểu biết thực tế.",
      "Với mỗi đáp án, hỏi: có trường hợp nào đề vẫn đúng mà đáp án này sai không? Có thì loại.",
    ],
    example: {
      question: "Mọi con mèo là động vật. Tom là mèo. Kết luận chắc chắn đúng?",
      answer: "Tom là động vật",
      why: "Tom nằm trong nhóm mèo, nhóm mèo nằm trọn trong nhóm động vật.",
    },
  },
  {
    slug: "ngon-ngu",
    title: "Mẹo làm dạng ngôn ngữ",
    intro: "Câu ngôn ngữ hỏi quan hệ giữa các từ. Hãy gọi tên quan hệ bằng một câu ngắn rồi áp vào đáp án.",
    recognize: ["Dạng \"A : B = C : ?\".", "Hoặc tìm từ không cùng nhóm."],
    rules: [
      { name: "Công cụ và việc làm", detail: "Bút : viết, dao : cắt." },
      { name: "Bộ phận và tổng thể", detail: "Bánh xe : xe đạp." },
      { name: "Trái nghĩa, cùng nhóm", detail: "Nóng : lạnh; táo, cam, chuối là trái cây." },
    ],
    steps: [
      "Đặt một câu nối hai từ đầu: \"bút dùng để viết\".",
      "Thay từ thứ ba vào câu đó: \"dao dùng để ...\".",
      "Nếu nhiều đáp án hợp, làm câu nối cụ thể hơn.",
    ],
    example: { question: "Bút : viết = dao : ?", answer: "cắt", why: "Quan hệ là công cụ và việc nó dùng để làm." },
  },
];

export const tipBySlug = (slug: string) => TIPS.find((t) => t.slug === slug);
