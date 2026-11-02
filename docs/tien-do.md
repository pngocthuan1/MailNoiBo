# Tiến độ dự án Mail nội bộ (Web)

## Đã xong (đừng làm lại, chỉ sửa khi được yêu cầu)
- Lượt 1: AppShell (header, thanh bên, banner thông báo ghim, banner mất kết nối, snackbar có Hoàn tác), toàn bộ đường dẫn với trang giữ chỗ.
- Lượt 2: Trang Danh sách thư. Mã: HT-02, HT-03, HT-04, HT-05, HT-06, HT-08, HT-09, HT-10, HT-11, HT-12, NH-02, NB-05, NB-06, TB-03.
- Lượt 3: Kho dùng chung mailStore (src/shared/state/mailStore.ts, useMailActions); hộp thư dùng chung NB-02; phím tắt CD-07 (có hộp thoại ?); dấu tích đã đọc ở Đã gửi (NB-03); trạng thái trống từng hộp thư.
- Lượt 4: Trang Đọc thư (23 mã): DT-01 đến DT-11, BM-01, BM-02, NB-03, NB-04, NH-02, NH-07, NH-09, HT-04, HT-05, HT-09, HT-10, NB-06.
- Lượt 5: Cửa sổ Soạn thư nổi (SO-01 đến SO-06, SO-13, NB-01), trình soạn nhúng gửi qua cùng logic, thư gửi vào Đã gửi và vào chuỗi.
- Lượt 6: Soạn thư nâng cao SO-07 đến SO-12 (hoàn tác gửi, hẹn giờ, chữ ký, mẫu thư, chèn ảnh/emoji/bảng, chế độ bảo mật).

## Việc đang làm
- Lượt 7: Tìm kiếm hoặc các tính năng tiếp theo theo lộ trình.

## Chưa làm (theo thứ tự dự kiến)
Tìm kiếm; Đăng nhập và xác thực; Danh bạ; Cài đặt (2 lượt, nối chữ ký, mẫu thư, thời gian hoàn tác gửi); Nhãn và bộ lọc; Quản trị; Thông báo và ngoại tuyến phần còn lại.

## Ghi chú
- Dữ liệu là mock; "Tải tất cả (.zip)", dịch thư, xem PDF là giả lập.
- Mã nguồn được tải từ Figma Make (version 5); vite.config.ts có plugin Figma Make, báo nếu nó gây lỗi.
- Đường dẫn /settings/filters/new đang là trang giữ chỗ.
