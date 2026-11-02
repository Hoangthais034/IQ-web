import Link from "next/link";

import { LegalPage, contactEmail } from "@/components/LegalPage";

export const metadata = { title: "Chính sách bảo mật" };

export default function PrivacyPage() {
  const email = contactEmail();
  return (
    <LegalPage title="Chính sách bảo mật">
      <p>
        Trang này giải thích Test IQ (iqtest.limcogito.com) thu thập dữ liệu gì, dùng để làm gì và bạn có quyền gì với dữ
        liệu của mình. Chúng tôi chỉ thu thập những gì cần để web hoạt động.
      </p>

      <section>
        <h2>1. Dữ liệu chúng tôi thu thập</h2>
        <ul>
          <li>
            <b>Khi bạn đăng nhập bằng Google:</b> email, tên hiển thị và ảnh đại diện từ tài khoản Google. Chúng tôi không
            nhận và không lưu mật khẩu Google của bạn.
          </li>
          <li>
            <b>Khi bạn làm bài:</b> câu trả lời, thời gian làm bài và kết quả. Nếu bạn làm bài khi chưa đăng nhập, bài làm
            được gắn với một mã ngẫu nhiên lưu trong cookie, và tự chuyển vào tài khoản khi bạn đăng nhập trên cùng trình
            duyệt.
          </li>
          <li>
            <b>Khi bạn mua gói tháng:</b> mã đơn, số tiền, thời điểm thanh toán và nội dung chuyển khoản do ngân hàng gửi về
            qua SePay. Bạn chuyển khoản qua ứng dụng ngân hàng của mình, nên chúng tôi không thấy và không lưu số thẻ hay
            mật khẩu ngân hàng.
          </li>
          <li>
            <b>Dữ liệu kỹ thuật:</b> địa chỉ IP và thông tin trình duyệt trong log máy chủ, dùng để chống lạm dụng và sửa lỗi.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Mục đích sử dụng</h2>
        <ul>
          <li>Chấm điểm, lưu lịch sử làm bài và cho bạn xem lại kết quả.</li>
          <li>Kích hoạt gói tháng và tắt quảng cáo cho tài khoản đã trả phí.</li>
          <li>Giới hạn tần suất quảng cáo, ví dụ quảng cáo dạng tab mới chỉ hiện tối đa một lần mỗi 48 giờ.</li>
          <li>Giữ an toàn cho hệ thống và cải thiện chất lượng câu hỏi.</li>
        </ul>
        <p className="mt-2">Chúng tôi không bán dữ liệu cá nhân của bạn và không gửi email quảng cáo.</p>
      </section>

      <section>
        <h2>3. Cookie và lưu trữ trên trình duyệt</h2>
        <ul>
          <li>Cookie đăng nhập, để giữ phiên đăng nhập của bạn.</li>
          <li>Cookie mã ẩn danh, để gắn bài làm khi bạn chưa đăng nhập.</li>
          <li>Bộ nhớ trình duyệt (localStorage), để nhớ lần cuối quảng cáo được hiển thị.</li>
        </ul>
      </section>

      <section>
        <h2>4. Quảng cáo của bên thứ ba</h2>
        <p>
          Web hiển thị quảng cáo của Adsterra. Adsterra và các nhà quảng cáo của họ có thể dùng cookie hoặc công nghệ tương
          tự để hiển thị và đo lường quảng cáo, theo chính sách bảo mật riêng của họ. Quảng cáo được tải trong khung riêng
          tại ads.limcogito.com, nên không đọc được phiên đăng nhập của bạn trên web này. Người dùng gói tháng không thấy
          quảng cáo.
        </p>
      </section>

      <section>
        <h2>5. Bên thứ ba khác</h2>
        <ul>
          <li>Google: xác thực đăng nhập.</li>
          <li>SePay: thông báo giao dịch chuyển khoản để kích hoạt gói tháng tự động.</li>
        </ul>
      </section>

      <section>
        <h2>6. Lưu trữ và thời hạn</h2>
        <p>
          Dữ liệu được lưu trên máy chủ do chúng tôi quản lý. Tài khoản và lịch sử làm bài được giữ cho đến khi bạn yêu cầu
          xóa. Bài làm ẩn danh không được gắn vào tài khoản nào có thể bị xóa định kỳ. Thông tin thanh toán được giữ theo yêu
          cầu kế toán.
        </p>
      </section>

      <section>
        <h2>7. Quyền của bạn</h2>
        <p>
          Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, bạn có quyền xem, sửa, yêu cầu xóa dữ liệu và rút lại sự
          đồng ý. Gửi yêu cầu qua <Link href="/lien-he?chu_de=du_lieu" className="text-blue-600 underline">trang liên hệ</Link> hoặc email <b>{email}</b>, dùng đúng email bạn đăng nhập. Chúng tôi phản hồi trong vòng 7 ngày làm
          việc. Bạn cũng có thể gỡ quyền truy cập của web trong phần Bảo mật của tài khoản Google.
        </p>
      </section>

      <section>
        <h2>8. Trẻ em</h2>
        <p>
          Web không dành cho trẻ dưới 13 tuổi tự đăng ký tài khoản. Nếu bạn là phụ huynh và phát hiện con mình đã đăng ký,
          hãy liên hệ để chúng tôi xóa dữ liệu.
        </p>
      </section>

      <section>
        <h2>9. Thay đổi chính sách</h2>
        <p>
          Khi chính sách thay đổi, chúng tôi cập nhật ngày ở đầu trang. Xem thêm{" "}
          <Link href="/dieu-khoan" className="text-blue-600 underline">Điều khoản sử dụng</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
