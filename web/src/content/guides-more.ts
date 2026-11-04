import type { Guide } from "./guides";

// Guides added for search intents the competitor pages answer poorly:
// "iq là gì", "iq bao nhiêu là thiên tài", "test iq phỏng vấn", "câu hỏi iq có đáp án".
// Every question below was solved by hand; re-check the answer if you edit one.
export const NEW_GUIDES: Guide[] = [
  {
    slug: "iq-la-gi",
    title: "IQ là gì? Chỉ số IQ đo cái gì và không đo cái gì",
    description: "IQ là gì, chỉ số IQ được tính thế nào, các bài test IQ nổi tiếng như WAIS, Stanford-Binet, Raven, và những điều IQ không nói lên được về bạn.",
    intro: "IQ là viết tắt của Intelligence Quotient, thường dịch là chỉ số thông minh. Nghe thì đơn giản, nhưng con số này đo một phần khá hẹp của trí tuệ. Bài này giải thích IQ đến từ đâu, được tính ra sao và nên hiểu nó thế nào cho đúng.",
    sections: [
      {
        h: "IQ ra đời như thế nào?",
        p: [
          "Năm 1905, hai nhà tâm lý học người Pháp là Alfred Binet và Théodore Simon soạn một bộ câu hỏi để tìm ra những học sinh cần hỗ trợ thêm ở trường. Mục đích ban đầu là giúp đỡ, không phải xếp hạng ai thông minh hơn ai.",
          "Vài năm sau, nhà tâm lý học người Đức William Stern đề xuất cách tính \"thương số trí tuệ\": lấy tuổi trí tuệ chia cho tuổi thật rồi nhân 100. Một đứa trẻ 10 tuổi làm bài được như trẻ 12 tuổi sẽ có IQ là 120. Từ đó cái tên IQ ra đời.",
        ],
      },
      {
        h: "Ngày nay IQ được tính thế nào?",
        p: [
          "Công thức tuổi trí tuệ chỉ hợp với trẻ em, vì với người lớn, tuổi tăng nhưng khả năng làm bài không tăng theo. Các bài test hiện đại dùng cách khác: so điểm của bạn với một nhóm lớn người cùng độ tuổi đã làm bài trước đó.",
          "Thang điểm được dựng sao cho trung bình là 100 và độ lệch chuẩn là 15. Vì vậy IQ 115 nghĩa là bạn làm tốt hơn khoảng 84% số người cùng tuổi, còn IQ 85 là tốt hơn khoảng 16%.",
        ],
      },
      {
        h: "Các bài test IQ nổi tiếng",
        list: [
          "WAIS (cho người lớn) và WISC (cho trẻ em): bộ test của David Wechsler, gồm nhiều phần như từ vựng, trí nhớ làm việc, suy luận hình và tốc độ xử lý. Đây là bộ test được dùng nhiều nhất trong lâm sàng.",
          "Stanford-Binet: phiên bản phát triển từ bài test gốc của Binet, cũng chia nhiều phần và do chuyên gia thực hiện.",
          "Raven's Progressive Matrices: chỉ dùng hình, người làm bài chọn hình còn thiếu trong một lưới. Vì không phụ thuộc ngôn ngữ nên rất hay được dùng để so sánh giữa các nước.",
        ],
        after: [
          "Các bài này đều phải mua bản quyền và do người được đào tạo thực hiện trực tiếp. Bài test IQ online, kể cả trên web này, chỉ mô phỏng một số dạng câu hỏi tương tự.",
        ],
      },
      {
        h: "Bài test IQ thường có những dạng câu hỏi nào?",
        list: [
          "Dãy số: tìm số tiếp theo theo quy luật.",
          "Ma trận hình: điền hình còn thiếu vào lưới 3x3.",
          "Tìm hình khác loại: chọn hình không theo quy luật chung.",
          "Xoay hình: nhận ra hình gốc sau khi xoay.",
          "Logic: suy luận từ các điều kiện cho trước.",
          "Ngôn ngữ: quan hệ giữa các từ như tương tự, trái nghĩa.",
        ],
        after: ["Mỗi dạng có cách giải riêng. Bạn có thể xem mẹo chi tiết ở mục Mẹo làm bài."],
      },
      {
        h: "IQ không nói lên điều gì?",
        p: [
          "IQ đo khá tốt khả năng suy luận trừu tượng, nhận quy luật và ghi nhớ ngắn hạn. Nhưng nó không đo sự sáng tạo, khả năng giao tiếp, cảm xúc, sự kiên trì hay kiến thức chuyên môn. Đây đều là những thứ quan trọng không kém trong học tập và công việc.",
          "Điểm IQ cũng không cố định tuyệt đối. Nó có thể thay đổi theo sức khỏe, giấc ngủ, mức độ quen dạng đề và hoàn cảnh làm bài. Hãy xem nó là một góc nhìn, không phải bản án về con người bạn.",
        ],
      },
    ],
    related: ["day-so", "ma-tran-hinh", "logic"],
    faq: [
      { q: "IQ là viết tắt của từ gì?", a: "IQ là viết tắt của Intelligence Quotient, tiếng Việt thường gọi là chỉ số thông minh." },
      { q: "IQ có thay đổi theo thời gian không?", a: "Có thể. Điểm thay đổi theo tuổi, sức khỏe, mức độ quen dạng đề và điều kiện làm bài. Ở người trưởng thành, điểm từ các bài test chuẩn hóa khá ổn định nhưng không cố định tuyệt đối." },
      { q: "EQ và IQ khác nhau thế nào?", a: "IQ đo khả năng suy luận và giải quyết vấn đề. EQ là khả năng nhận biết và điều chỉnh cảm xúc của mình và người khác. Hai chỉ số này đo hai thứ khác nhau." },
    ],
    published: "2026-11-04",
    updated: "2026-11-04",
  },
  {
    slug: "iq-bao-nhieu-la-thien-tai",
    title: "IQ bao nhiêu là thiên tài? Bảng phân loại chỉ số IQ",
    description: "IQ bao nhiêu là cao, bao nhiêu là thiên tài? Bảng phân loại điểm IQ theo từng khoảng, tỉ lệ dân số và điều kiện vào Mensa, giải thích dễ hiểu.",
    intro: "Câu hỏi \"IQ bao nhiêu là thiên tài\" được tìm rất nhiều, nhưng thật ra không có một mốc chính thức nào gọi là thiên tài. Dưới đây là cách các bài test chuẩn hóa phân loại điểm, kèm tỉ lệ người đạt được mỗi mức.",
    sections: [
      {
        h: "Bảng phân loại chỉ số IQ",
        p: ["Các mốc dưới đây dựa trên thang trung bình 100, độ lệch chuẩn 15, cách mô tả gần với bộ test Wechsler. Tên gọi có thể khác đôi chút giữa các bộ test."],
        list: [
          "130 trở lên: rất cao. Khoảng 2% dân số.",
          "120 đến 129: cao. Khoảng 7% dân số.",
          "110 đến 119: trên trung bình. Khoảng 16% dân số.",
          "90 đến 109: trung bình. Khoảng 50% dân số.",
          "80 đến 89: dưới trung bình. Khoảng 16% dân số.",
          "70 đến 79: thấp. Khoảng 7% dân số.",
          "Dưới 70: rất thấp. Khoảng 2% dân số.",
        ],
        after: ["Các tỉ lệ được làm tròn, nên cộng lại có thể không đúng 100%."],
      },
      {
        h: "Vậy IQ bao nhiêu được gọi là thiên tài?",
        p: [
          "Trong cách nói thường ngày, người ta hay gọi điểm từ 140 trở lên là \"thiên tài\". Đây là cách gọi phổ biến chứ không phải một mốc khoa học. Các nhà tâm lý học hiện đại không dùng từ thiên tài để phân loại điểm IQ.",
          "Về độ hiếm: khoảng 1 trên 260 người có IQ từ 140 trở lên, và chỉ khoảng 1 trên 30.000 người đạt 160. Ở những mức rất cao như vậy, các bài test cũng kém chính xác hơn vì có quá ít người để so sánh.",
        ],
      },
      {
        h: "Điều kiện vào Mensa là bao nhiêu?",
        p: [
          "Mensa là hội những người có IQ cao, lâu đời và nổi tiếng nhất thế giới. Điều kiện là đạt điểm thuộc nhóm 2% cao nhất trên một bài test được chấp nhận và có người giám sát. Trên thang độ lệch chuẩn 15, mức này tương đương khoảng 130 trở lên.",
          "Điểm từ các bài test online không được dùng để đăng ký Mensa.",
        ],
      },
      {
        h: "IQ cao có chắc thành công không?",
        p: [
          "Không chắc. IQ có liên quan đến kết quả học tập, nhưng thành công còn phụ thuộc rất nhiều vào sự chăm chỉ, kỹ năng làm việc với người khác, sức khỏe và cơ hội. Nhiều người có điểm IQ bình thường vẫn rất giỏi trong lĩnh vực của mình.",
          "Nếu bạn vừa làm một bài test online và được điểm cao, hãy vui với nó nhưng đừng quá đặt nặng. Nếu điểm thấp hơn mong đợi, đó thường là dấu hiệu bạn chưa quen dạng đề, và phần này luyện được.",
        ],
      },
    ],
    related: ["ma-tran-hinh", "day-so", "logic"],
    faq: [
      { q: "IQ 130 có phải thiên tài không?", a: "130 là mức rất cao, thuộc khoảng 2% dân số và đủ điều kiện vào Mensa nếu đạt trên bài test được công nhận. Tuy vậy không có định nghĩa khoa học nào gọi 130 là thiên tài." },
      { q: "IQ của Einstein là bao nhiêu?", a: "Không có tài liệu nào cho thấy Einstein từng làm bài test IQ. Các con số như 160 hay 180 hay xuất hiện trên mạng chỉ là ước đoán." },
      { q: "IQ 110 là cao hay thấp?", a: "110 nằm ở ranh giới giữa trung bình và trên trung bình, cao hơn khoảng 75% số người." },
    ],
    published: "2026-11-04",
    updated: "2026-11-04",
  },
  {
    slug: "test-iq-phong-van-xin-viec",
    title: "Bài test IQ khi phỏng vấn xin việc: các dạng đề và cách chuẩn bị",
    description: "Bài test IQ, test tư duy khi phỏng vấn xin việc thường có những dạng nào, mất bao lâu và cách chuẩn bị trong một tuần để không bị bất ngờ.",
    intro: "Nhiều công ty, nhất là ngân hàng, tập đoàn lớn và các chương trình tuyển thực tập sinh, có một vòng làm bài test tư duy trước khi phỏng vấn. Người ta hay gọi chung là test IQ. Biết trước dạng đề giúp bạn bình tĩnh hơn rất nhiều.",
    sections: [
      {
        h: "Test IQ trong tuyển dụng khác gì test IQ thông thường?",
        p: [
          "Bài test tuyển dụng thường không ra điểm IQ. Nó cho biết bạn đứng ở đâu so với các ứng viên khác, và công ty đặt một ngưỡng để chọn người vào vòng sau. Thời gian thường rất gấp, mỗi câu chỉ có khoảng 30 giây đến 1 phút.",
          "Vì vậy ngoài việc giải đúng, tốc độ và khả năng bỏ qua câu khó đúng lúc quan trọng không kém.",
        ],
      },
      {
        h: "Các dạng đề hay gặp",
        list: [
          "Suy luận số (numerical reasoning): đọc bảng, biểu đồ rồi tính phần trăm, tỉ lệ, mức tăng giảm. Đôi khi có dãy số.",
          "Suy luận ngôn ngữ (verbal reasoning): đọc một đoạn văn ngắn rồi chọn Đúng, Sai hoặc Không đủ thông tin cho mỗi nhận định.",
          "Suy luận trừu tượng (abstract reasoning): tìm quy luật trong chuỗi hình, ma trận hình, hình khác loại. Phần này rất giống test IQ.",
          "Suy luận logic: sắp xếp thứ tự, điều kiện nếu thì, tìm kết luận chắc chắn đúng.",
          "Một số nơi có thêm bài kiểm tra sự chú ý, ví dụ so sánh hai dãy ký tự giống hay khác nhau.",
        ],
      },
      {
        h: "Chuẩn bị trong một tuần",
        list: [
          "Ngày 1 đến 2: làm quen dãy số và ma trận hình, vì hai dạng này xuất hiện nhiều nhất.",
          "Ngày 3: luyện suy luận logic, nhất là dạng \"kết luận nào chắc chắn đúng\".",
          "Ngày 4: luyện đọc bảng số liệu và tính phần trăm nhanh bằng tay.",
          "Ngày 5: luyện đọc hiểu đoạn văn với ba lựa chọn Đúng, Sai, Không đủ thông tin.",
          "Ngày 6: làm một bài đầy đủ có bấm giờ.",
          "Ngày 7: xem lại các câu sai, ngủ đủ giấc trước ngày thi.",
        ],
      },
      {
        h: "Mẹo trong lúc làm bài",
        list: [
          "Đọc kỹ hướng dẫn: có bị trừ điểm khi sai không. Nếu không trừ, đừng bỏ trống câu nào.",
          "Câu nào quá 1 phút chưa ra thì đoán đáp án hợp lý nhất rồi đi tiếp.",
          "Với dạng Đúng, Sai, Không đủ thông tin: chỉ dựa vào đoạn văn, không dùng hiểu biết bên ngoài.",
          "Mang máy tính nếu được phép, nhưng luyện tính nhẩm để không phụ thuộc.",
          "Làm bài ở nơi yên tĩnh, đường truyền ổn định nếu thi online.",
        ],
      },
    ],
    related: ["day-so", "ma-tran-hinh", "logic", "ngon-ngu"],
    faq: [
      { q: "Test IQ khi phỏng vấn có khó không?", a: "Mỗi câu thường không quá khó, cái khó là thời gian rất gấp. Người đã luyện trước dạng đề thường làm nhanh hơn hẳn." },
      { q: "Trượt bài test tư duy có được thi lại không?", a: "Tùy công ty. Nhiều nơi cho ứng tuyển lại sau 6 đến 12 tháng. Hãy hỏi bộ phận tuyển dụng nếu bạn chưa rõ." },
      { q: "Có nên đoán khi không biết đáp án?", a: "Nếu bài không trừ điểm khi sai thì nên đoán, sau khi đã loại các đáp án chắc chắn sai." },
    ],
    published: "2026-11-04",
    updated: "2026-11-04",
  },
  {
    slug: "cau-hoi-iq-co-dap-an",
    title: "15 câu hỏi IQ có đáp án và lời giải chi tiết",
    description: "15 câu hỏi trắc nghiệm IQ có đáp án và giải thích: dãy số, logic, ngôn ngữ và hình. Tự làm thử trước khi xem lời giải, rồi làm bài test 40 câu.",
    intro: "Dưới đây là 15 câu hỏi theo các dạng hay gặp trong bài test IQ, từ dễ đến khó. Hãy tự làm từng câu trước, che phần đáp án lại, rồi mới đọc lời giải để biết mình nghĩ đúng hướng chưa.",
    sections: [
      {
        h: "Phần 1: Dãy số",
        list: [
          "Câu 1. 3, 6, 12, 24, ? Đáp án: 48. Mỗi số gấp đôi số trước.",
          "Câu 2. 1, 4, 9, 16, 25, ? Đáp án: 36. Đây là các số chính phương 1², 2², 3², 4², 5², nên tiếp theo là 6².",
          "Câu 3. 2, 3, 5, 8, 13, ? Đáp án: 21. Mỗi số bằng tổng hai số liền trước: 8 + 13 = 21.",
          "Câu 4. 1, 3, 2, 6, 3, 9, ? Đáp án: 4. Tách thành hai dãy xen kẽ. Vị trí lẻ là 1, 2, 3 nên tiếp theo là 4. Vị trí chẵn là 3, 6, 9.",
          "Câu 5. 4, 6, 10, 18, 34, ? Đáp án: 66. Hiệu giữa các số là 2, 4, 8, 16, gấp đôi mỗi lần, nên hiệu tiếp theo là 32. Cách nhìn khác: mỗi số bằng số trước nhân 2 rồi trừ 2.",
        ],
      },
      {
        h: "Phần 2: Logic",
        list: [
          "Câu 6. Tất cả mèo đều là động vật. Một số động vật biết bơi. Có chắc chắn \"một số con mèo biết bơi\" không? Đáp án: Không chắc. Những động vật biết bơi có thể hoàn toàn không phải mèo.",
          "Câu 7. An cao hơn Bình. Bình cao hơn Chi. Dũng thấp hơn Chi. Ai thấp nhất? Đáp án: Dũng. Thứ tự từ cao đến thấp là An, Bình, Chi, Dũng.",
          "Câu 8. Nếu trời mưa thì sân ướt. Hôm nay sân không ướt. Kết luận nào đúng? Đáp án: Hôm nay trời không mưa. Nếu có mưa thì sân phải ướt, mà sân không ướt.",
          "Câu 9. 5 máy làm xong 5 sản phẩm trong 5 phút. Hỏi 100 máy làm 100 sản phẩm mất bao lâu? Đáp án: 5 phút. Mỗi máy làm một sản phẩm mất 5 phút, 100 máy làm song song cùng lúc.",
          "Câu 10. Hôm nay là thứ tư. 100 ngày nữa là thứ mấy? Đáp án: Thứ sáu. 100 ngày gồm 14 tuần và dư 2 ngày, thứ tư cộng 2 ngày là thứ sáu.",
        ],
      },
      {
        h: "Phần 3: Ngôn ngữ",
        list: [
          "Câu 11. Bút với viết giống như dao với? Đáp án: cắt. Quan hệ đồ vật và việc nó dùng để làm.",
          "Câu 12. Từ nào khác nhóm: táo, cam, cà rốt, chuối, xoài? Đáp án: cà rốt. Các từ còn lại là trái cây, cà rốt là củ.",
          "Câu 13. Từ nào trái nghĩa với \"cẩn thận\": chu đáo, cẩu thả, kỹ lưỡng, tỉ mỉ? Đáp án: cẩu thả. Ba từ còn lại gần nghĩa với cẩn thận.",
        ],
      },
      {
        h: "Phần 4: Hình và không gian",
        list: [
          "Câu 14. Một lưới 3x3. Hàng 1: tròn, vuông, tam giác. Hàng 2: vuông, tam giác, tròn. Hàng 3: tam giác, tròn, ? Đáp án: vuông. Mỗi hàng và mỗi cột đều có đủ ba hình, không hình nào lặp lại.",
          "Câu 15. Lúc 3 giờ 30 phút, góc nhỏ giữa kim giờ và kim phút là bao nhiêu độ? Đáp án: 75 độ. Kim phút chỉ số 6, tức 180 độ. Kim giờ đã đi nửa đường từ số 3 sang số 4, tức 90 + 15 = 105 độ. Hiệu là 75 độ.",
        ],
      },
      {
        h: "Bạn làm đúng bao nhiêu câu?",
        list: [
          "12 đến 15 câu: bạn nhận quy luật rất nhanh. Thử sức với bài 40 câu có độ khó tăng dần.",
          "8 đến 11 câu: khá tốt. Xem lại dạng bạn sai và đọc mẹo của dạng đó.",
          "Dưới 8 câu: đừng lo, đa số chỉ là chưa quen dạng đề. Bắt đầu bằng mẹo dãy số và luyện 10 câu mỗi ngày.",
        ],
        after: [
          "15 câu này chỉ để làm quen, không quy ra điểm IQ được. Bài test trên web có 40 câu, 6 dạng đề, câu hình được vẽ trực quan và có giải thích sau khi nộp.",
        ],
      },
    ],
    related: ["day-so", "logic", "ngon-ngu", "ma-tran-hinh"],
    faq: [
      { q: "Có thể tính điểm IQ từ 15 câu này không?", a: "Không. 15 câu là quá ít để quy ra điểm. Hãy làm bài test đầy đủ 40 câu nếu bạn muốn xem điểm ước tính." },
      { q: "Tìm thêm câu hỏi IQ có đáp án ở đâu?", a: "Trên Test IQ, mục Luyện tập cho bạn làm 10 câu mỗi lượt theo từng dạng và hiện lời giải ngay sau mỗi câu." },
    ],
    published: "2026-11-04",
    updated: "2026-11-04",
  },
];
