import { NEW_GUIDES } from "./guides-more";
import type { Section } from "./tip-articles";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Section[];
  related: string[]; // tip slugs
  faq?: { q: string; a: string }[]; // rendered on the page and as FAQPage structured data
  published: string; // ISO date
  updated: string; // ISO date, bump when the text changes meaningfully
};

export const GUIDES: Guide[] = [
  {
    slug: "thang-diem-iq",
    title: "Điểm IQ bao nhiêu là bình thường? Giải thích thang điểm",
    description: "Giải thích thang điểm IQ: vì sao trung bình là 100, bao nhiêu phần trăm người nằm ở từng khoảng, và cách đọc điểm ước tính trên Test IQ.",
    intro: "Nhiều người làm xong bài test thấy con số 100 hoặc 115 mà không biết nó nghĩa là gì. Bài này giải thích nhanh cách đọc thang điểm IQ và con số trên web này.",
    sections: [
      {
        h: "Thang điểm được dựng như thế nào?",
        p: [
          "Điểm IQ không phải là số câu đúng. Nó cho biết kết quả của bạn đứng ở đâu so với đa số người cùng làm một bài test. Các bài test chuẩn hóa được dựng sao cho điểm trung bình của dân số là 100 và độ lệch chuẩn là 15 điểm.",
          "Nói đơn giản: ai làm đúng khoảng bằng mức trung bình thì được 100. Cứ cao hơn hoặc thấp hơn mức trung bình một độ lệch chuẩn thì điểm tăng hoặc giảm 15.",
        ],
      },
      {
        h: "Bao nhiêu người nằm ở từng khoảng?",
        list: [
          "Khoảng 68% số người có điểm từ 85 đến 115.",
          "Khoảng 95% số người có điểm từ 70 đến 130.",
          "Chỉ khoảng 2% số người có điểm trên 130, và cũng chừng đó người dưới 70.",
        ],
        after: ["Vì vậy một điểm như 95 hay 108 vẫn hoàn toàn bình thường. Đa số mọi người nằm quanh vùng giữa, rất ít người ở hai đầu."],
      },
      {
        h: "Điểm trên Test IQ được tính ra sao?",
        p: [
          "Mỗi câu có độ khó khác nhau, câu khó được tính nhiều điểm hơn. Web lấy tỉ lệ điểm bạn đạt được, rồi quy ra thang 100 và 15 điểm như trên, giới hạn trong khoảng 55 đến 145.",
          "Cần nói rõ: đường quy đổi này hiện là ước tính ban đầu, chưa được hiệu chỉnh bằng dữ liệu thật của nhiều người làm bài. Vì thế con số chỉ để tham khảo và so sánh các lần làm của chính bạn. Nó không phải điểm IQ chính thức.",
        ],
      },
      {
        h: "Nên làm gì với con số này?",
        p: [
          "Đừng xem nó là kết luận về con người bạn. Hãy dùng phần phân tích theo dạng đề: dạng nào bạn làm tốt, dạng nào hay sai, rồi luyện đúng dạng yếu. Đó là phần có ích hơn một con số.",
        ],
      },
    ],
    related: ["day-so", "ma-tran-hinh"],
    faq: [
      { q: "IQ trung bình là bao nhiêu?", a: "Theo cách dựng thang điểm của các bài test chuẩn hóa, IQ trung bình là 100. Khoảng hai phần ba số người có điểm từ 85 đến 115." },
      { q: "IQ 120 có cao không?", a: "Có. 120 cao hơn khoảng 90% số người trên thang trung bình 100, độ lệch chuẩn 15. Với bài test online, hãy coi đây là mức tham khảo." },
      { q: "IQ dưới 100 có phải là kém không?", a: "Không. Điểm từ 85 đến 100 vẫn nằm trong vùng bình thường, và một bài test online có sai số khá lớn." },
    ],
    published: "2026-11-03",
    updated: "2026-11-04",
  },
  {
    slug: "bai-test-iq-bao-lau",
    title: "Bài test IQ mất bao lâu? Phân bổ thời gian cho 40 câu",
    description: "Bài test IQ 40 câu trong 35 phút nên chia thời gian thế nào: câu dễ, câu khó, khi nào nên bỏ qua và cách rà soát lại cuối giờ.",
    intro: "Bài test trên web gồm 40 câu và có 35 phút. Tính ra chưa đến 53 giây mỗi câu, nên cách chia thời gian ảnh hưởng khá nhiều đến kết quả.",
    sections: [
      {
        h: "Chia thời gian cho 40 câu",
        p: [
          "Câu dễ nằm ở đầu bài, câu khó nằm cuối. Một cách chia hợp lý là làm nhanh phần đầu để dành thời gian cho phần sau.",
        ],
        list: [
          "Khoảng 15 câu đầu: dưới 30 giây mỗi câu, tổng chừng 7 đến 8 phút.",
          "Khoảng 15 câu giữa: 50 đến 60 giây mỗi câu, tổng chừng 13 đến 15 phút.",
          "10 câu cuối: dành 10 phút còn lại, nhưng đừng sa lầy quá 1,5 phút ở một câu.",
        ],
      },
      {
        h: "Khi nào nên bỏ qua?",
        p: [
          "Quá một phút mà chưa thấy hướng đi thì bỏ qua, bấm sang câu sau. Web cho phép quay lại câu trước, và các câu đã làm được lưu liên tục. Bỏ một câu khó để làm được hai câu dễ luôn có lợi hơn.",
          "Đừng để trống câu nào khi hết giờ. Làm sai không bị trừ điểm, nên nếu không chắc, hãy loại các đáp án chắc chắn sai rồi chọn một trong số còn lại.",
        ],
      },
      {
        h: "Những phút cuối",
        p: [
          "Nếu còn thời gian, rà lại các câu đã bỏ qua trước, sau đó mới kiểm tra các câu đã làm. Câu đã làm xong thường không đáng xem lại trừ khi bạn nhớ mình chọn vội.",
        ],
      },
    ],
    related: ["day-so", "logic"],
    published: "2026-11-03",
    updated: "2026-11-03",
  },
  {
    slug: "cach-tang-diem-test-iq",
    title: "Cách làm bài test IQ tốt hơn: 7 việc nên luyện",
    description: "Những việc thực tế giúp làm bài test IQ tốt hơn: làm quen dạng đề, nhận quy luật nhanh, loại trừ đáp án và quản lý thời gian.",
    intro: "Có một điều cần nói thẳng: luyện tập giúp bạn quen dạng đề và làm bài hiệu quả hơn. Chưa có bằng chứng chắc chắn rằng luyện vài tuần sẽ làm tăng trí thông minh thật. Nhưng điểm số trong một bài test thì cải thiện được.",
    sections: [
      {
        h: "Vì sao điểm tăng khi luyện?",
        p: [
          "Người làm bài lần thứ hai thường đạt điểm cao hơn lần đầu, vì đã quen cách ra đề, quen áp lực thời gian và biết các quy luật hay lặp lại. Đây là hiệu ứng luyện tập, và nó là phần bạn kiểm soát được.",
        ],
      },
      {
        h: "7 việc nên làm",
        list: [
          "Học các quy luật hay gặp của từng dạng đề, bắt đầu từ dãy số và ma trận hình.",
          "Luyện theo dạng, mỗi lượt 10 câu, đọc kỹ lời giải của câu sai.",
          "Tập tách thuộc tính khi gặp câu hình: số lượng, loại hình, kiểu tô, hướng.",
          "Tập loại trừ đáp án thay vì tìm đáp án đúng ngay.",
          "Bấm giờ khi luyện để quen nhịp 50 giây mỗi câu.",
          "Ghi lại dạng đề mình hay sai, ưu tiên luyện dạng đó.",
          "Làm bài khi tỉnh táo, ở nơi yên tĩnh, không bị ngắt quãng.",
        ],
      },
      {
        h: "Luyện bao nhiêu là đủ?",
        p: [
          "Mỗi ngày 10 đến 20 phút, đều đặn trong một hai tuần hiệu quả hơn là dồn một buổi dài. Sau đó làm lại bài đầy đủ 40 câu và so sánh phần phân tích theo dạng với lần trước.",
        ],
      },
    ],
    related: ["day-so", "ma-tran-hinh", "hinh-khac-loai"],
    published: "2026-11-03",
    updated: "2026-11-03",
  },
  {
    slug: "test-iq-online-co-chinh-xac-khong",
    title: "Test IQ online có chính xác không?",
    description: "Giải thích vì sao bài test IQ online chỉ mang tính tham khảo, khác gì bài test chuẩn hóa do chuyên gia thực hiện và nên dùng kết quả thế nào.",
    intro: "Câu trả lời ngắn gọn: các bài test IQ online, trong đó có bài trên web này, chỉ nên coi là tham khảo và giải trí. Lý do nằm ở cách một bài test chuẩn hóa được xây dựng.",
    sections: [
      {
        h: "Bài test chuẩn hóa khác gì bài test online?",
        list: [
          "Được thử nghiệm trên hàng nghìn người, từ đó xây dựng bảng quy đổi điểm chính xác.",
          "Do chuyên gia tâm lý thực hiện trong điều kiện kiểm soát: thời gian, phòng làm bài, hướng dẫn.",
          "Có nhiều phần kiểm tra các khía cạnh khác nhau, và được kiểm định độ tin cậy qua nhiều năm.",
          "Kết quả được diễn giải bởi người có chuyên môn.",
        ],
      },
      {
        h: "Bài test online thiếu gì?",
        p: [
          "Bài online thường chưa có bảng quy đổi điểm dựa trên dữ liệu thực, người làm bài không bị kiểm soát điều kiện, và số câu ít hơn nhiều. Với Test IQ, đường quy đổi hiện là ước tính ban đầu và chúng tôi sẽ điều chỉnh khi có đủ dữ liệu làm bài.",
          "Vì vậy điểm có thể lệch đáng kể so với một bài test chuẩn hóa. Đừng dùng nó để đánh giá năng lực học tập, tuyển dụng hay đưa ra bất kỳ quyết định quan trọng nào.",
        ],
      },
      {
        h: "Vậy dùng kết quả thế nào cho hợp lý?",
        list: [
          "Xem như một bài luyện tư duy có tính điểm cho vui.",
          "So sánh giữa các lần làm của chính bạn để xem mình có tiến bộ không.",
          "Dùng phần phân tích theo dạng đề để biết nên luyện gì.",
          "Nếu bạn thực sự cần một đánh giá trí tuệ, hãy liên hệ chuyên gia tâm lý được đào tạo.",
        ],
      },
    ],
    related: ["logic", "ngon-ngu"],
    faq: [
      { q: "Có bài test IQ online nào chính xác tuyệt đối không?", a: "Không. Bài test chính thức như WAIS hay Stanford-Binet phải do chuyên gia thực hiện trực tiếp. Bài online chỉ cho kết quả ước tính." },
      { q: "Vì sao làm hai trang web lại ra hai điểm khác nhau?", a: "Mỗi trang dùng bộ câu hỏi, thời gian và cách quy đổi điểm khác nhau. Điểm chênh 10 đến 15 giữa các trang là chuyện bình thường." },
    ],
    published: "2026-11-03",
    updated: "2026-11-04",
  },
  {
    slug: "luyen-tu-duy-logic-moi-ngay",
    title: "Luyện tư duy logic mỗi ngày với 15 phút",
    description: "Cách luyện tư duy logic đều đặn: lịch luyện 15 phút mỗi ngày theo dạng đề, kèm cách tự kiểm tra tiến bộ.",
    intro: "Không cần giờ học dài. Luyện đều 15 phút mỗi ngày với đúng dạng đề thường hiệu quả hơn nhiều so với một buổi cuối tuần. Dưới đây là một lịch luyện đơn giản bạn có thể dùng ngay.",
    sections: [
      {
        h: "Lịch luyện gợi ý trong một tuần",
        list: [
          "Thứ hai: dãy số. Đọc mẹo rồi làm 10 câu.",
          "Thứ ba: ma trận hình.",
          "Thứ tư: tìm hình khác loại.",
          "Thứ năm: xoay hình.",
          "Thứ sáu: logic và ngôn ngữ, mỗi dạng 5 câu.",
          "Cuối tuần: làm lại dạng bạn sai nhiều nhất, hoặc làm một bài đầy đủ 40 câu.",
        ],
      },
      {
        h: "Cách luyện cho có hiệu quả",
        p: [
          "Sau mỗi câu, nhất là câu sai, hãy đọc phần giải thích và tự hỏi: lần sau mình nhận ra quy luật này bằng cách nào? Việc nói ra được cách nhận ra quan trọng hơn việc làm thật nhiều câu.",
          "Đừng nhìn đáp án quá sớm. Cho mình ít nhất một phút suy nghĩ rồi mới xem lời giải.",
        ],
      },
      {
        h: "Tự kiểm tra tiến bộ",
        p: [
          "Sau hai tuần, làm lại bài 40 câu và so sánh số câu đúng theo từng dạng với lần đầu. Nếu dạng yếu cải thiện, bạn đang luyện đúng hướng. Nếu chưa, đổi cách: đọc lại mẹo của dạng đó trước khi làm tiếp.",
        ],
      },
    ],
    related: ["day-so", "xoay-hinh", "logic"],
    published: "2026-11-03",
    updated: "2026-11-03",
  },
  ...NEW_GUIDES,
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
