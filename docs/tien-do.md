# Tiến độ dự án Mail nội bộ (Web)

## Đã xong (đừng làm lại, chỉ sửa khi được yêu cầu)
- Lượt 1: AppShell (header, thanh bên, banner thông báo ghim, banner mất kết nối, snackbar có Hoàn tác), toàn bộ đường dẫn với trang giữ chỗ.
- Lượt 2: Trang Danh sách thư. Mã: HT-02, HT-03, HT-04, HT-05, HT-06, HT-08, HT-09, HT-10, HT-11, HT-12, NH-02, NB-05, NB-06, TB-03.
- Lượt 3: Kho dùng chung mailStore (src/shared/state/mailStore.ts, useMailActions); hộp thư dùng chung NB-02; phím tắt CD-07 (có hộp thoại ?); dấu tích đã đọc ở Đã gửi (NB-03); trạng thái trống từng hộp thư.
- Lượt 4: Trang Đọc thư (23 mã): DT-01 đến DT-11, BM-01, BM-02, NB-03, NB-04, NH-02, NH-07, NH-09, HT-04, HT-05, HT-09, HT-10, NB-06.
- Lượt 5: Cửa sổ Soạn thư nổi (SO-01 đến SO-06, SO-13, NB-01), trình soạn nhúng gửi qua cùng logic, thư gửi vào Đã gửi và vào chuỗi.
- Lượt 6: Soạn thư nâng cao SO-07 đến SO-12 (hoàn tác gửi, hẹn giờ, chữ ký, mẫu thư, chèn ảnh/emoji/bảng, chế độ bảo mật).
- Lượt 7: Tìm kiếm (TM-01 đến TM-09: tìm từ khóa theo URL, hiển thị kết quả tô vàng và viên thuốc hộp thư gốc, lịch sử tìm kiếm 8 mục, thanh phạm vi, bộ lọc nhanh & nâng cao 560px, toán tử & viên thuốc lỗi có tooltip, gợi ý 3 nhóm khi gõ, tạo bộ lọc từ tìm kiếm, tìm kiếm nội dung trong tệp đính kèm).
- Lượt 8: Xác thực và đăng nhập giả lập (TK-01, TK-02, TK-03, TK-04, TK-06, TK-07, TK-09, các trang lỗi /403, /404, /500, bảo vệ đường dẫn RequireAuth, RequireAdmin, chuyển hướng đăng nhập lưu redirect, kích hoạt tài khoản có độ mạnh mật khẩu, quên mật khẩu 3 bước, xác thực 2FA với mã OTP và mã dự phòng, đăng xuất, chuyển & thêm tài khoản, mô phỏng hết phiên).

## Việc đang làm
- Lượt 9: Danh bạ (liên hệ, sơ đồ tổ chức, nhóm liên hệ, chi tiết đồng nghiệp) hoặc tính năng tiếp theo.

## Chưa làm (theo thứ tự dự kiến)
Danh bạ; Cài đặt (2 lượt, nối chữ ký, mẫu thư, thời gian hoàn tác gửi); Nhãn và bộ lọc; Quản trị; Thông báo và ngoại tuyến phần còn lại.

## Ghi chú
- Dữ liệu là mock; "Tải tất cả (.zip)", dịch thư, xem PDF là giả lập.
- Danh sách tài khoản mẫu để đăng nhập và thử nghiệm (authStore):
  + **an.nguyen@congty.vn** / `Matkhau@123`: Nhân viên thường (có email phụ an.nguyen@gmail.com).
  + **admin@congty.vn** / `Admin@12345`: Quản trị viên hệ thống (có quyền truy cập /admin).
  + **binh.tran@congty.vn** / `Matkhau@123`: Tài khoản bật 2FA (mã OTP đúng: `123456`, mã dự phòng: `BACKUP-2026`).
  + **khoa@congty.vn** / `Matkhau@123`: Tài khoản bị khóa (thông báo liên hệ admin).
  + **chuakichhoat@congty.vn** / `Matkhau@123`: Tài khoản chưa kích hoạt (token hợp lệ: `valid-token-123`, token hết hạn: `expired-token`).
- Mã nguồn được tải từ Figma Make (version 5); vite.config.ts có plugin Figma Make, báo nếu nó gây lỗi.
- Đường dẫn /settings/filters/new đang là trang giữ chỗ.
