// Longer write-ups shown under each tip. Written in natural Vietnamese; keep examples checked by hand.
export type Section = { h: string; p?: string[]; list?: string[]; after?: string[] };
export type TipMore = { sections: Section[]; mistakes: string[] };

export const TIP_MORE: Record<string, TipMore> = {
  "day-so": {
    sections: [
      {
        h: "Dãy số kiểm tra điều gì?",
        p: [
          "Gần như bài test IQ nào cũng có dãy số, vì đây là cách nhanh nhất để xem bạn có nhìn ra được quy luật hay không. Đề thường cho bốn đến sáu số và hỏi số tiếp theo. Không cần giỏi toán, chỉ cần biết cộng, trừ, nhân, chia và bình tĩnh thử từng hướng.",
          "Tin tốt là số quy luật được dùng lại rất nhiều. Làm quen khoảng sáu kiểu ở trên là bạn xử lý được phần lớn câu dễ và trung bình. Câu khó thường chỉ là hai quy luật ghép lại với nhau.",
        ],
      },
      {
        h: "Soi một dãy số theo thứ tự nào?",
        p: ["Nên có một thứ tự cố định để không bị rối. Mỗi bước chỉ mất vài giây:"],
        list: [
          "Nhìn nhanh xem dãy tăng hay giảm, tăng chậm hay tăng vọt.",
          "Tăng chậm: lấy số sau trừ số trước. Nếu hiệu bằng nhau thì là cộng đều, nếu hiệu tăng dần thì viết tiếp hiệu của hiệu.",
          "Tăng vọt: lấy số sau chia số trước. Ra cùng một số thì là nhân đều.",
          "Lên xuống thất thường: tách các số ở vị trí lẻ và vị trí chẵn thành hai dãy riêng.",
          "Các số quen quen như 1, 4, 9, 16 hoặc 1, 8, 27: nghĩ tới bình phương và lập phương.",
          "Vẫn không ra: thử cộng hai số liền trước (kiểu Fibonacci) hoặc kết hợp hai phép, ví dụ nhân 2 rồi cộng 1.",
        ],
      },
      {
        h: "Ví dụ có lời giải",
        list: [
          "2, 5, 10, 17, 26, ? Hiệu lần lượt là 3, 5, 7, 9 nên hiệu tiếp theo là 11. Đáp án 26 + 11 = 37. Cách nhìn khác: các số là 1² + 1, 2² + 1, 3² + 1... nên số thứ sáu là 6² + 1 = 37.",
          "3, 6, 12, 24, ? Số sau gấp đôi số trước nên đáp án là 48.",
          "2, 10, 4, 20, 6, 30, ? Tách hai dãy: vị trí lẻ là 2, 4, 6 (cộng 2), vị trí chẵn là 10, 20, 30 (cộng 10). Số thứ bảy ở vị trí lẻ nên là 8.",
          "1, 1, 2, 3, 5, 8, ? Mỗi số bằng tổng hai số trước nên đáp án là 5 + 8 = 13.",
        ],
      },
    ],
    mistakes: [
      "Chỉ so hai số đầu rồi kết luận ngay. Hãy kiểm tra quy luật đó với tất cả các cặp số trong dãy.",
      "Quên tách vị trí lẻ và chẵn khi dãy lên xuống bất thường.",
      "Mất quá một phút cho một câu. Đánh dấu, bỏ qua và quay lại sau khi đã làm hết câu dễ.",
      "Tính nhẩm sai. Với dãy dài, viết các hiệu ra giấy nháp cho chắc.",
    ],
  },
  "ma-tran-hinh": {
    sections: [
      {
        h: "Ma trận hình là gì?",
        p: [
          "Đây là dạng đề quen thuộc nhất trong các bài test IQ kiểu hình. Bạn thấy một lưới 3x3, tám ô đã có hình, ô cuối bị che. Nhiệm vụ là chọn hình đúng để điền vào ô trống.",
          "Mẹo lớn nhất: đừng cố nhìn cả bức tranh cùng lúc. Hãy tách hình ra thành từng thuộc tính nhỏ rồi tìm quy luật cho từng thuộc tính.",
        ],
      },
      {
        h: "Những thuộc tính nên tách ra xét riêng",
        list: [
          "Số lượng hình trong ô.",
          "Loại hình: tròn, vuông, tam giác...",
          "Kiểu tô: rỗng, đặc, kẻ sọc.",
          "Kích thước hoặc độ đậm nhạt.",
          "Hướng hoặc vị trí của hình trong ô.",
        ],
        after: ["Mỗi thuộc tính thường tuân theo đúng một quy luật. Khi đã biết quy luật của từng thuộc tính, bạn suy ra được ô cuối trông thế nào, rồi loại dần đáp án sai."],
      },
      {
        h: "Cách đọc theo hàng và theo cột",
        p: [
          "Thử đọc theo hàng ngang trước. Nếu hàng 1 và hàng 2 cho cùng một quy luật thì áp dụng cho hàng 3. Nếu đọc hàng không ra, chuyển sang đọc theo cột.",
          "Có bài dùng quy luật cộng hình: ô thứ ba của mỗi hàng là hai ô đầu chồng lên nhau. Cũng có bài dùng quy luật đủ bộ ba: mỗi hàng có đủ ba kiểu tô khác nhau, mỗi kiểu một lần. Khi hai hàng đầu đã dùng hết hai kiểu, ô còn thiếu của hàng cuối phải là kiểu còn lại.",
        ],
      },
      {
        h: "Ví dụ có lời giải",
        p: [
          "Hàng 1: 1 hình tròn đặc, 2 hình tròn đặc, 3 hình tròn đặc. Hàng 2: 1 hình vuông rỗng, 2 hình vuông rỗng, 3 hình vuông rỗng. Hàng 3: 1 tam giác sọc, 2 tam giác sọc, ?",
          "Số lượng tăng thêm 1 theo cột, loại hình và kiểu tô giữ nguyên trong cả hàng. Đáp án là 3 tam giác sọc.",
        ],
      },
    ],
    mistakes: [
      "Nhìn tổng thể rồi chọn theo cảm giác thay vì tách từng thuộc tính.",
      "Chỉ đọc theo hàng mà không thử đọc theo cột.",
      "Chọn đáp án đầu tiên có vẻ hợp lý. Hãy kiểm tra đáp án đó với đủ mọi thuộc tính, chỉ cần một thuộc tính sai là loại.",
    ],
  },
  "hinh-khac-loai": {
    sections: [
      {
        h: "Dạng đề này hỏi gì?",
        p: [
          "Đề cho năm hình, bốn hình giống nhau ở một điểm nào đó và một hình khác. Bạn cần tìm hình lạc loài. Nghe dễ nhưng bẫy nằm ở chỗ các hình thường khác nhau ở nhiều thuộc tính cùng lúc, nên rất dễ chọn nhầm tiêu chí.",
        ],
      },
      {
        h: "Cách làm chắc tay",
        list: [
          "Liệt kê các thuộc tính của từng hình: loại hình, số lượng, kiểu tô, kích thước, số cạnh.",
          "Với mỗi thuộc tính, đếm xem có giá trị nào chỉ xuất hiện đúng một lần.",
          "Chỉ có một thuộc tính cho kết quả như vậy: đó là tiêu chí của đề, hình lệch là đáp án.",
          "Nếu hai thuộc tính cùng chỉ ra hai hình khác nhau, thuộc tính nào có bốn hình giống hệt nhau mới là tiêu chí thật. Thuộc tính còn lại chỉ để gây nhiễu.",
        ],
      },
      {
        h: "Ví dụ có lời giải",
        p: [
          "Năm hình gồm: 2 lục giác đen, 2 lục giác sọc, 4 hình vuông đen, 4 lục giác đen, 2 lục giác sọc. Xét loại hình: bốn hình là lục giác, chỉ một hình vuông. Xét số lượng: có 2 và 4, mỗi giá trị lặp lại nhiều lần. Xét kiểu tô: đen và sọc cũng lặp lại. Chỉ loại hình có đúng một hình lệch, nên đáp án là 4 hình vuông đen.",
        ],
      },
    ],
    mistakes: [
      "Chọn hình trông nổi bật nhất. Hình nổi bật chưa chắc là hình khác loại.",
      "Chỉ xét một thuộc tính rồi dừng. Hãy xét hết rồi so sánh.",
      "Bỏ qua thuộc tính số lượng vì nghĩ nó không quan trọng.",
    ],
  },
  "xoay-hinh": {
    sections: [
      {
        h: "Xoay hình khác lật hình",
        p: [
          "Đề cho một hình gốc, bạn chọn hình nào chính là hình đó sau khi xoay. Các đáp án sai thường là hình lật như soi gương. Nhìn thoáng qua rất giống, nhưng bạn không thể xoay hình lật về lại hình gốc, dù xoay thế nào.",
          "Cách phân biệt đáng tin nhất là không tưởng tượng cả hình, mà bám vào một điểm mốc.",
        ],
      },
      {
        h: "Dùng điểm mốc và thứ tự các phần",
        list: [
          "Chọn một chi tiết dễ nhận ra ở hình gốc, ví dụ phần nhô ra hoặc góc nhọn.",
          "Đi vòng quanh hình theo chiều kim đồng hồ và nhớ thứ tự các phần gặp được.",
          "Ở mỗi đáp án, tìm điểm mốc rồi đi vòng theo chiều kim đồng hồ.",
          "Thứ tự giống hình gốc: đúng là hình xoay. Thứ tự ngược lại: đó là hình lật, loại ngay.",
        ],
      },
      {
        h: "Mẹo nhận biết nhanh",
        p: [
          "Các chữ không đối xứng như L, F, R rất hay được dùng làm hình mẫu. Chữ L lật gương sẽ có phần chân chĩa sang bên ngược lại, và dù bạn xoay thế nào cũng không khớp lại với chữ L gốc.",
          "Nếu muốn kiểm tra thật chắc, hãy tưởng tượng xoay từng bước 90 độ thay vì xoay một phát 180 hay 270 độ. Mỗi bước nhỏ dễ hình dung hơn nhiều.",
        ],
      },
    ],
    mistakes: [
      "Chọn hình trông giống nhất mà không kiểm tra có bị lật hay không.",
      "So sánh cả hình bằng mắt thay vì bám vào một điểm mốc.",
      "Xoay nhầm chiều kim đồng hồ. Hãy dùng đúng một chiều từ đầu đến cuối.",
    ],
  },
  logic: {
    sections: [
      {
        h: "Câu logic kiểm tra điều gì?",
        p: [
          "Câu logic không cần kiến thức bên ngoài. Đề cho vài điều kiện, bạn chỉ được dùng đúng những gì đề nói để kết luận. Điều quan trọng là chỉ chọn kết luận chắc chắn đúng, chứ không phải kết luận có vẻ hợp lý.",
        ],
      },
      {
        h: "Hai chữ dễ gây nhầm: \"mọi\" và \"một số\"",
        list: [
          "\"Mọi mèo là động vật\" cho biết nhóm mèo nằm trọn trong nhóm động vật. Từ đó không suy ra được \"mọi động vật là mèo\".",
          "\"Một số học sinh thích toán\" chỉ cho biết có ít nhất một người thích toán. Nó không nói rằng những người còn lại không thích toán.",
          "\"Không ai trong nhóm A thuộc nhóm B\" nghĩa là hai nhóm không có phần chung. Khi đó vẽ hai vòng tròn tách rời nhau.",
        ],
      },
      {
        h: "Bài sắp xếp thứ tự",
        p: [
          "Với bài kiểu \"An cao hơn Bình, Bình cao hơn Chi\", hãy vẽ một đường thẳng và đặt từng người lên. Làm vậy bạn thấy ngay An cao hơn Chi mà không cần nghĩ nhiều. Với bài ngồi cạnh nhau, vẽ các ghế thành hàng rồi thử xếp các trường hợp có thể xảy ra.",
        ],
      },
      {
        h: "Ví dụ có lời giải",
        p: [
          "Mọi con mèo là động vật. Tom là mèo. Kết luận nào chắc chắn đúng? Tom nằm trong nhóm mèo, nhóm mèo nằm trọn trong nhóm động vật, nên Tom là động vật. Còn \"mọi động vật là mèo\" thì không suy ra được.",
        ],
      },
    ],
    mistakes: [
      "Dùng hiểu biết ngoài đời để chọn đáp án. Chỉ dùng thông tin trong đề.",
      "Đảo ngược mệnh đề: từ \"mọi A là B\" suy ra \"mọi B là A\".",
      "Chọn kết luận nghe hợp lý nhưng đề không đảm bảo. Hãy hỏi: có trường hợp nào đề vẫn đúng mà đáp án này sai không?",
    ],
  },
  "ngon-ngu": {
    sections: [
      {
        h: "Câu ngôn ngữ trong bài test IQ",
        p: [
          "Dạng này hỏi về quan hệ giữa các từ, chứ không phải đo vốn từ vựng khó. Hai kiểu hay gặp là tìm từ tương tự theo dạng \"A : B = C : ?\" và tìm từ không cùng nhóm với các từ còn lại.",
        ],
      },
      {
        h: "Gọi tên quan hệ bằng một câu ngắn",
        p: ["Đây là mẹo hiệu quả nhất. Đặt một câu nối hai từ đầu, rồi thay từ thứ ba vào câu đó."],
        list: [
          "Bút : viết, dao : ? Câu nối: \"bút dùng để viết\". Thay vào: \"dao dùng để cắt\". Đáp án là cắt.",
          "Bánh xe : xe đạp, trang : ? Câu nối: \"bánh xe là một bộ phận của xe đạp\". Thay vào: \"trang là một bộ phận của sách\". Đáp án là sách.",
          "Nóng : lạnh, cao : ? Quan hệ trái nghĩa, đáp án là thấp.",
        ],
      },
      {
        h: "Tìm từ không cùng nhóm",
        p: [
          "Thử gọi tên nhóm trước, ví dụ \"trái cây\", \"dụng cụ\", \"nghề nghiệp\". Từ nào không đi vào nhóm đó là đáp án. Khi có hai cách chia nhóm, chọn cách chia có bốn từ chung và một từ lẻ.",
        ],
      },
    ],
    mistakes: [
      "Chọn từ nghe quen tai thay vì kiểm tra quan hệ.",
      "Đặt câu nối quá chung chung nên đáp án nào cũng hợp. Hãy làm câu nối cụ thể hơn.",
      "Đảo ngược quan hệ: nhầm giữa \"A dùng để B\" và \"B dùng để A\".",
    ],
  },
};
