"""Hand-written Vietnamese logic questions (kinship terms, classic puzzles).

Format per item: (difficulty, prompt, correct, [3 wrong], explanation).
Kinship follows common northern usage; only relations that are the same across regions
are asked (no "chị gái của mẹ", which is "bác" in the north and "dì" in the south).
"""

ITEMS = [
    (1, "Mẹ của bố em, em gọi là gì?", "Bà nội", ["Bà ngoại", "Cô", "Bác gái"], "Họ hàng bên bố là bên nội, nên mẹ của bố là bà nội."),
    (1, "Bố của mẹ em, em gọi là gì?", "Ông ngoại", ["Ông nội", "Cậu", "Chú"], "Họ hàng bên mẹ là bên ngoại, nên bố của mẹ là ông ngoại."),
    (1, "Em trai của bố, em gọi là gì?", "Chú", ["Cậu", "Bác", "Dượng"], "Em trai của bố gọi là chú. Anh trai của bố mới gọi là bác."),
    (1, "Anh trai hoặc em trai của mẹ, em gọi là gì?", "Cậu", ["Chú", "Dượng", "Bác"], "Anh em trai bên mẹ đều gọi là cậu."),
    (1, "Em gái của bố, em gọi là gì?", "Cô", ["Dì", "Mợ", "Thím"], "Em gái của bố gọi là cô."),
    (2, "Vợ của chú, em gọi là gì?", "Thím", ["Mợ", "Cô", "Dì"], "Chú là em trai của bố, vợ của chú gọi là thím."),
    (2, "Vợ của cậu, em gọi là gì?", "Mợ", ["Thím", "Dì", "Cô"], "Cậu là anh em trai của mẹ, vợ của cậu gọi là mợ."),
    (2, "Con của chú em là gì của em?", "Anh chị em họ", ["Anh chị em ruột", "Cháu", "Chú"], "Con của chú và em có chung ông bà nội, nên là anh chị em họ."),
    (2, "Bố của anh trai em là ai đối với em?", "Bố của em", ["Chú của em", "Ông nội của em", "Bác của em"], "Anh trai ruột và em có chung bố, nên bố của anh trai chính là bố em."),
    (2, "Em là con của bố mẹ em. Con của em sẽ gọi bố em là gì?", "Ông", ["Bác", "Chú", "Cụ"], "Bố em là ông của con em (ông nội nếu em là con trai, ông ngoại nếu em là con gái)."),
    (3, "Lan chỉ vào ảnh và nói: \"Mẹ của người này là mẹ chồng của mẹ tôi.\" Người trong ảnh là ai của Lan, biết người đó là đàn ông?", "Bố hoặc chú, bác của Lan", ["Ông nội của Lan", "Cậu của Lan", "Anh trai của Lan"], "Mẹ chồng của mẹ Lan là bà nội Lan. Con trai của bà nội là bố Lan hoặc chú, bác của Lan."),
    (3, "Nam nói: \"Tôi không có anh em trai. Người trong ảnh là con trai của bố tôi.\" Người trong ảnh là ai?", "Chính Nam", ["Anh trai của Nam", "Bố của Nam", "Chú của Nam"], "Con trai của bố Nam mà Nam không có anh em trai, thì chỉ có thể là chính Nam."),
    (3, "Một gia đình có 2 người bố và 2 người con, nhưng chỉ có 3 người. Điều này có thể vì sao?", "Đó là ông, bố và cháu", ["Có một người được nhận nuôi", "Có hai anh em sinh đôi", "Không thể xảy ra"], "Ông là bố của bố, bố là con của ông: 2 người bố, 2 người con, tổng cộng 3 người."),
    (2, "Có 5 chiếc máy may 5 chiếc áo hết 5 phút. Hỏi 100 chiếc máy may 100 chiếc áo hết bao lâu?", "5 phút", ["100 phút", "20 phút", "1 phút"], "Mỗi máy may một áo trong 5 phút. 100 máy cùng may 100 áo cũng mất 5 phút."),
    (2, "Một sợi dây dài 10 m, mỗi lần cắt ra một đoạn 1 m. Cần cắt bao nhiêu lần để được 10 đoạn?", "9 lần", ["10 lần", "11 lần", "5 lần"], "Lần cắt thứ 9 tạo ra 2 đoạn cuối cùng, nên chỉ cần 9 lần."),
    (2, "Một hàng cây dài 20 m, cứ 5 m trồng một cây, có trồng ở cả hai đầu. Có bao nhiêu cây?", "5 cây", ["4 cây", "6 cây", "20 cây"], "20 m chia thành 4 khoảng, trồng ở cả hai đầu nên số cây bằng số khoảng cộng 1."),
    (3, "Trong một cuộc đua, bạn vượt qua người đang chạy thứ hai. Bây giờ bạn đứng thứ mấy?", "Thứ hai", ["Thứ nhất", "Thứ ba", "Không xác định được"], "Bạn chiếm chỗ của người thứ hai, người thứ nhất vẫn ở phía trước."),
    (3, "Một ốc sên ở đáy giếng sâu 10 m. Ban ngày bò lên 3 m, ban đêm tụt xuống 2 m. Sau bao nhiêu ngày ốc sên lên tới miệng giếng?", "8 ngày", ["10 ngày", "7 ngày", "9 ngày"], "Sau 7 ngày đêm ốc ở độ cao 7 m. Ngày thứ 8 bò thêm 3 m là chạm 10 m, không còn bị tụt nữa."),
    (3, "Có 3 hộp dán nhãn \"Táo\", \"Cam\", \"Táo và Cam\", nhưng cả 3 nhãn đều sai. Được lấy 1 quả từ 1 hộp để đoán đúng cả 3 hộp. Nên lấy từ hộp nào?", "Hộp dán nhãn \"Táo và Cam\"", ["Hộp dán nhãn \"Táo\"", "Hộp dán nhãn \"Cam\"", "Hộp nào cũng được"], "Nhãn sai nên hộp \"Táo và Cam\" chỉ chứa một loại. Lấy ra 1 quả là biết hộp đó, rồi suy ra hai hộp còn lại."),
    (4, "Trên đảo có người luôn nói thật và người luôn nói dối. A nói: \"B là người nói dối.\" B nói: \"Cả hai chúng tôi đều nói thật.\" Ai nói thật?", "Chỉ A nói thật", ["Chỉ B nói thật", "Cả hai nói thật", "Cả hai nói dối"], "Nếu B nói thật thì A cũng nói thật, nhưng A lại bảo B nói dối, mâu thuẫn. Vậy B nói dối, và câu của A đúng nên A nói thật."),
    (4, "An, Bình, Chi mỗi người thích một màu khác nhau: đỏ, xanh, vàng. An không thích đỏ. Bình không thích đỏ và không thích xanh. Chi thích màu gì?", "Đỏ", ["Xanh", "Vàng", "Không xác định được"], "Bình không thích đỏ, không thích xanh nên thích vàng. An không thích đỏ nên thích xanh. Còn lại Chi thích đỏ."),
    (4, "Năm bạn xếp hàng. Hà đứng ngay trước Minh. Minh đứng ở giữa hàng. Lan đứng cuối. Khoa đứng ngay sau Minh. Ai đứng đầu hàng?", "Bạn thứ năm chưa được nhắc tên", ["Hà", "Khoa", "Lan"], "Minh ở vị trí 3, Hà ở 2, Khoa ở 4, Lan ở 5. Vị trí 1 là bạn còn lại, không phải ai trong số được nêu."),
    (3, "Một bố và một con cộng lại 36 tuổi. Bố hơn con 30 tuổi. Con bao nhiêu tuổi?", "3 tuổi", ["6 tuổi", "33 tuổi", "30 tuổi"], "Con = (36 − 30) : 2 = 3 tuổi, bố 33 tuổi."),
    (2, "Nếu 3 con mèo bắt 3 con chuột trong 3 phút, thì cần bao nhiêu con mèo để bắt 30 con chuột trong 30 phút?", "3 con mèo", ["30 con mèo", "10 con mèo", "9 con mèo"], "3 con mèo bắt 1 con chuột mỗi phút, 30 phút là 30 con chuột."),
    (3, "Hôm nay Mai 10 tuổi, em trai Mai bằng nửa tuổi Mai. Khi Mai 30 tuổi, em trai bao nhiêu tuổi?", "25 tuổi", ["15 tuổi", "20 tuổi", "30 tuổi"], "Em kém Mai 5 tuổi và khoảng cách này không đổi, nên khi Mai 30 thì em 25."),
    (4, "Trong một phòng có 4 góc, mỗi góc có 1 con mèo, mỗi con mèo nhìn thấy 3 con mèo khác. Trong phòng có bao nhiêu con mèo?", "4 con", ["12 con", "16 con", "3 con"], "Mỗi con nhìn thấy 3 con ở 3 góc còn lại, tổng vẫn chỉ có 4 con."),
    (2, "Một quyển sách có 100 trang. Để đánh số trang từ 1 đến 100 cần viết chữ số 9 bao nhiêu lần?", "20 lần", ["10 lần", "11 lần", "19 lần"], "Chữ số 9 ở hàng đơn vị có 10 lần (9, 19, ..., 99), ở hàng chục có 10 lần (90 đến 99). Tổng 20 lần."),
    (4, "Có 8 viên bi giống nhau, 1 viên nặng hơn. Dùng cân hai đĩa, ít nhất cần mấy lần cân để chắc chắn tìm ra viên nặng?", "2 lần", ["3 lần", "4 lần", "1 lần"], "Chia 3-3-2. Lần 1 cân 3 với 3: tìm được nhóm chứa viên nặng. Lần 2 cân 1 với 1 trong nhóm đó là ra."),
    (5, "Ba bạn đội mũ, mỗi mũ đỏ hoặc trắng, biết có ít nhất một mũ đỏ. Mỗi bạn chỉ thấy mũ hai bạn kia. Hỏi lần lượt, hai bạn đầu đều nói không biết mũ mình màu gì. Bạn thứ ba thấy hai mũ trắng thì nói gì?", "Mũ mình màu đỏ", ["Mũ mình màu trắng", "Không biết", "Không thể có tình huống này"], "Có ít nhất một mũ đỏ mà hai bạn kia đội mũ trắng, nên mũ của bạn thứ ba chắc chắn đỏ."),
    (3, "Đồng hồ chỉ 3 giờ 15 phút. Góc giữa kim giờ và kim phút là bao nhiêu độ?", "7,5 độ", ["0 độ", "15 độ", "90 độ"], "Kim phút ở số 3. Kim giờ đã đi thêm 1/4 khoảng từ 3 đến 4, tức 30 : 4 = 7,5 độ."),
]
