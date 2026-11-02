import Link from "next/link";

import { LegalPage, contactEmail } from "@/components/LegalPage";

export const metadata = { title: "Điều khoản sử dụng" };

export default function TermsPage() {
  const email = contactEmail();
  return (
    <LegalPage title="Điều khoản sử dụng">
      <p>
        Khi dùng Test IQ (iqtest.limcogito.com), bạn đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử
        dụng web.
      </p>

      <section>
        <h2>1. Dịch vụ</h2>
        <p>
          Web cung cấp bài test IQ, bài luyện tập và mẹo làm bài cho từng dạng câu hỏi. Bạn có thể làm bài khi chưa đăng
          nhập. Để xem điểm, bạn cần đăng nhập bằng Google và xem một quảng cáo ngắn hoặc dùng gói tháng.
        </p>
      </section>

      <section>
        <h2>2. Kết quả chỉ mang tính tham khảo</h2>
        <p>
          Điểm IQ trên web được tính từ bài test trực tuyến của chúng tôi, dùng để giải trí và tự rèn luyện. Đây không phải
          bài đánh giá tâm lý chuẩn hóa và không thay thế đánh giá của chuyên gia. Đừng dùng kết quả này cho quyết định tuyển
          dụng, học tập hay y tế.
        </p>
      </section>

      <section>
        <h2>3. Tài khoản</h2>
        <ul>
          <li>Bạn đăng nhập bằng tài khoản Google của chính mình và chịu trách nhiệm về hoạt động trên tài khoản đó.</li>
          <li>
            Không dùng công cụ tự động để làm bài, thu thập câu hỏi hàng loạt, hay tìm cách vượt qua bước mở khóa điểm.
          </li>
          <li>Chúng tôi có thể khóa tài khoản vi phạm các điều trên.</li>
        </ul>
      </section>

      <section>
        <h2>4. Gói tháng</h2>
        <ul>
          <li>Gói tháng giá 30.000đ, có hiệu lực 30 ngày kể từ khi thanh toán được xác nhận, không tự gia hạn.</li>
          <li>Trong thời gian gói còn hiệu lực, bạn xem được điểm ngay mà không cần xem quảng cáo, và web không hiện quảng cáo.</li>
          <li>Mua thêm khi gói còn hạn thì thời gian được cộng dồn.</li>
          <li>
            Thanh toán bằng chuyển khoản ngân hàng qua mã QR, kèm đúng nội dung chuyển khoản hiển thị trên web. Hệ thống tự
            kích hoạt sau khi nhận được giao dịch.
          </li>
          <li>
            Nếu bạn chuyển sai nội dung, thiếu tiền, hoặc đã chuyển mà gói chưa kích hoạt sau 15 phút, hãy báo qua{" "}
            <Link href="/lien-he?chu_de=thanh_toan" className="text-blue-600 underline">trang liên hệ</Link> hoặc gửi ảnh biên lai tới <b>{email}</b>. Chúng tôi sẽ kích hoạt thủ công hoặc hoàn tiền.
          </li>
          <li>
            Gói đã kích hoạt không được hoàn tiền, trừ khi web gặp lỗi khiến bạn không dùng được quyền lợi của gói.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Quảng cáo</h2>
        <p>
          Web có quảng cáo của bên thứ ba để duy trì hoạt động miễn phí. Chúng tôi không chịu trách nhiệm về nội dung, sản
          phẩm hay dịch vụ trong quảng cáo. Hãy cẩn thận trước khi cung cấp thông tin cho trang quảng cáo.
        </p>
      </section>

      <section>
        <h2>6. Nội dung</h2>
        <p>
          Câu hỏi, hình vẽ, mẹo và giao diện của web thuộc về Test IQ. Bạn được chia sẻ kết quả và đường dẫn tới web, nhưng
          không được sao chép hàng loạt câu hỏi để đăng lại hoặc bán.
        </p>
      </section>

      <section>
        <h2>7. Giới hạn trách nhiệm</h2>
        <p>
          Web được cung cấp theo hiện trạng. Chúng tôi cố gắng giữ web hoạt động ổn định nhưng không bảo đảm web luôn không có
          lỗi hay gián đoạn.
        </p>
      </section>

      <section>
        <h2>8. Thay đổi và liên hệ</h2>
        <p>
          Chúng tôi có thể cập nhật điều khoản và sẽ ghi ngày cập nhật ở đầu trang. Điều khoản này áp dụng theo pháp luật Việt
          Nam. Mọi câu hỏi gửi về <b>{email}</b>. Xem thêm{" "}
          <Link href="/bao-mat" className="text-blue-600 underline">Chính sách bảo mật</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
