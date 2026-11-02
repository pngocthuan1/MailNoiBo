# Đặc tả giao diện Web (React) - Mail nội bộ

Oct 29, 2026 · @Phạm Vân Nam

Tài liệu mô tả giao diện Web cho đủ 106 chức năng trong bảng chức năng: khung chung, 28 trang, luồng di chuyển giữa các trang, nội dung từng trang và cấu trúc thư mục React. Đây là bản mô tả để vẽ Figma, chưa phải mã nguồn.

## Khung giao diện chung (AppShell)

Mọi trang sau khi đăng nhập nằm trong một khung gồm header, thanh bên và vùng nội dung; cửa sổ soạn thư nổi lên trên cùng.

| Vùng | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Header, bên trái | Nút ba gạch để thu hoặc mở thanh bên, logo công ty, tên ứng dụng. Cao 56 px, dính trên cùng khi cuộn | HT-01 |
| Header, giữa | Ô tìm kiếm rộng khoảng 720 px, có biểu tượng kính lúp và nút bộ lọc ở cuối ô. Bấm vào ô thì xổ xuống lịch sử tìm kiếm gần đây; gõ chữ thì xổ xuống gợi ý theo nhóm (người, nhãn, từ khóa) và gợi ý cú pháp như from:, has:attachment. Nhấn Enter chuyển sang trang Tìm kiếm. Nút bộ lọc mở bảng lọc nâng cao | TM-01, TM-03, TM-05, TM-06, TM-07 |
| Header, bên phải | Chuông thông báo có chấm số; biểu tượng bánh răng mở menu nhanh (giao diện sáng tối, mật độ dòng, đến Cài đặt); ảnh đại diện mở menu gồm tên, email, Chuyển tài khoản, Thêm tài khoản, Hồ sơ, Cài đặt, Đăng xuất | TB-02, TK-04, TK-09, CD-01, CD-06 |
| Thanh bên, nút Soạn thư | Nút to màu nhấn ở đầu thanh bên, bấm mở cửa sổ soạn mới; thu gọn thanh bên thì chỉ còn biểu tượng bút | SO-01 |
| Thanh bên, hộp thư mặc định | Danh sách: Inbox, Gắn sao, Đã hoãn, Quan trọng, Đã gửi, Nháp, Đã lên lịch, Cần xử lý, Spam, Thùng rác. Mỗi mục có biểu tượng, tên và số thư chưa đọc (chữ đậm); mục đang xem có nền nhấn | HT-01, HT-09, HT-10, SO-08, NB-06 |
| Thanh bên, nhãn | Phần Nhãn có nút + tạo nhãn mới; nhãn hiện thành cây có thể thu mở, mỗi nhãn có chấm màu và số thư chưa đọc; rê chuột hiện biểu tượng ba chấm (đổi tên, đổi màu, xóa); nhận thư được kéo thả vào, mục đang nhận sáng viền | NH-01, NH-03, NH-04, NH-05, HT-12 |
| Thanh bên, hộp thư dùng chung | Phần riêng liệt kê các hộp thư chung (ví dụ hotro) kèm số thư chưa có người nhận việc | NB-02 |
| Thanh bên, dưới cùng | Thanh tiến độ dung lượng, chữ đã dùng X trên Y GB; vàng khi từ 80%, đỏ khi từ 95% | CD-04 |
| Vùng nội dung | Nơi hiển thị trang con. Phía trên cùng có thể có dải thông báo toàn công ty được ghim, nền màu nhấn nhạt, nút Tôi đã đọc và nút đóng | NB-05 |
| Dải trạng thái kết nối | Dải mỏng màu vàng dưới header: Mất kết nối, đang thử lại. Biến mất khi có mạng | TB-06 |
| Thanh thông báo ngắn | Hộp tối nhỏ góc dưới bên trái, ví dụ Đã chuyển vào Thùng rác kèm nút Hoàn tác; tự tắt sau 5 giây. Dùng chung cho Đã gửi, hoàn tác gửi | HT-06, SO-07 |
| Khung soạn thư nổi | Các cửa sổ soạn xếp ngang ở đáy bên phải màn hình, mỗi cửa sổ rộng 540 px, thu nhỏ thành thanh tiêu đề | SO-01, SO-13 |
| Bảng phím tắt | Phím ? mở hộp thoại liệt kê phím tắt, nhóm theo Điều hướng, Thao tác thư, Soạn thư | CD-07 |

### Nguyên tắc thiết kế

- Lưới 4 px; khoảng cách dùng bội số của 4 (4, 8, 12, 16, 24, 32)
- Chữ Inter hoặc Roboto: nội dung 14 px, chữ phụ 12 px, tiêu đề trang 20 px
- Một màu nhấn xanh dương; trạng thái dùng đỏ cho lỗi, vàng cho cảnh báo, xanh lá cho thành công; nhãn có 8 màu nhẹ
- Màu khai báo bằng biến để đổi sáng và tối, và đổi chủ đề màu (CD-01, CD-08)
- Dòng thư có 3 mật độ: thoải mái cao 56 px, vừa 48 px, gọn 40 px (CD-06)
- Bố cục theo chiều rộng: từ 1280 px thanh bên mở rộng; 1024 đến 1279 px thanh bên chỉ còn biểu tượng; 768 đến 1023 px thanh bên thành ngăn kéo; dưới 768 px một cột
- Mọi vùng bấm được cao tối thiểu 32 px, có viền khi dùng bàn phím (focus)

## Bản đồ đường dẫn

Có 28 trang chia thành 4 bố cục: AuthLayout (xác thực), AppShell (khung chung), SettingsLayout (cài đặt, có tab bên trái) và AdminLayout (quản trị, có thanh điều hướng riêng). Soạn thư không có trang riêng mà là cửa sổ nổi; trạng thái được giữ trên địa chỉ bằng tham số ?compose=new hoặc ?compose=ID\_NHÁP, trả lời bằng ?reply=ID\_THƯ.

| STT | Trang | Đường dẫn | Bố cục | Quyền | Mã chức năng chính |
| --- | --- | --- | --- | --- | --- |
| 1 | Đăng nhập | /login | AuthLayout | Công khai | TK-02, TK-06 |
| 2 | Kích hoạt tài khoản | /activate/:token | AuthLayout | Công khai (có mã) | TK-01 |
| 3 | Quên mật khẩu | /forgot-password | AuthLayout | Công khai | TK-03 |
| 4 | Xác thực 2 bước | /verify-2fa | AuthLayout | Đã qua bước mật khẩu | TK-07 |
| 5 | Danh sách thư | /mail/:folder, /mail/label/:labelId, /mail/shared/:mailboxId | AppShell | Người dùng | HT-01 đến HT-12, NH-03, NB-02, NB-05, NB-06 |
| 6 | Đọc thư | /mail/:folder/:threadId (cũng có bản theo nhãn và hộp thư chung) | AppShell | Người dùng | DT-01 đến DT-11, NB-03, NB-04 |
| 7 | Tìm kiếm | /search?q= | AppShell | Người dùng | TM-01 đến TM-09 |
| 8 | Danh bạ công ty | /contacts | AppShell | Người dùng | DB-01, DB-03, DB-06 |
| 9 | Chi tiết đồng nghiệp | /contacts/:contactId | AppShell | Người dùng | DB-02, DB-07, DB-08 |
| 10 | Sơ đồ tổ chức | /contacts/org | AppShell | Người dùng | DB-04 |
| 11 | Nhóm liên hệ | /contacts/groups | AppShell | Người dùng | DB-05, NB-01 |
| 12 | Cài đặt chung | /settings/general | SettingsLayout | Người dùng | CD-01, CD-02, CD-06, CD-07, CD-08 |
| 13 | Tài khoản | /settings/account | SettingsLayout | Người dùng | TK-05, CD-03, CD-04 |
| 14 | Quản lý nhãn | /settings/labels | SettingsLayout | Người dùng | NH-01, NH-04, NH-05 |
| 15 | Bộ lọc tự động | /settings/filters | SettingsLayout | Người dùng | NH-06, NH-07, NH-08 |
| 16 | Chữ ký và mẫu thư | /settings/signature | SettingsLayout | Người dùng | SO-09, SO-10 |
| 17 | Trả lời tự động | /settings/vacation | SettingsLayout | Người dùng | CD-05 |
| 18 | Thông báo | /settings/notifications | SettingsLayout | Người dùng | TB-04, TB-05, TB-08 |
| 19 | Bảo mật | /settings/security | SettingsLayout | Người dùng | TK-07, TK-10, BM-03, BM-04 |
| 20 | Dữ liệu của tôi | /settings/data | SettingsLayout | Người dùng | CD-09 |
| 21 | Tổng quan quản trị | /admin | AdminLayout | Quản trị | BM-07 |
| 22 | Người dùng | /admin/users | AdminLayout | Quản trị | BM-05 |
| 23 | Hạn mức dung lượng | /admin/quotas | AdminLayout | Quản trị | BM-06 |
| 24 | Vai trò và quyền | /admin/roles | AdminLayout | Quản trị | BM-09 |
| 25 | Nhật ký kiểm toán | /admin/audit | AdminLayout | Quản trị | BM-08 |
| 26 | Lưu trữ và xuất thư | /admin/retention | AdminLayout | Quản trị | NB-07 |
| 27 | Hộp thư dùng chung | /admin/shared-mailboxes | AdminLayout | Quản trị | NB-02 |
| 28 | Trang lỗi | /403, /404, /500 | AuthLayout | Công khai | Không có |

Các chức năng còn lại không gắn trang riêng vì là thành phần trong các trang trên: soạn thư (SO-01 đến SO-13) ở cửa sổ soạn, thông báo (TB-01 đến TB-09) ở chuông và dải trạng thái, BM-01 và BM-02 ở trang Đọc thư, TK-04 và TK-09 ở menu ảnh đại diện. Bảng đối chiếu đủ 106 mã nằm ở cuối tài liệu.

## Logic di chuyển giữa các trang

Người dùng đi từ nhóm Xác thực vào AppShell, rồi tỏa ra Danh sách thư, Tìm kiếm, Danh bạ, Cài đặt; Quản trị chỉ mở cho vai trò admin. Sơ đồ dưới đây là bản tổng quát, các bảng sau nó là quy tắc chi tiết để nối prototype.

&#91;embedded content: luồng di chuyển giữa các trang · 9 trang chính\]

### Quy tắc chuyển hướng tự động

| Tình huống | Điều kiện | Chuyển tới |
| --- | --- | --- |
| Vào địa chỉ gốc | Gõ / hoặc /mail | /mail/inbox |
| Chưa đăng nhập | Vào bất kỳ trang nào trong AppShell, Settings hoặc Admin | /login?redirect=đường dẫn cũ; đăng nhập xong quay lại đúng đường dẫn đó |
| Đăng nhập đúng | Tài khoản bật 2 bước | /verify-2fa; nhập đúng mã thì vào /mail/inbox |
| Đăng nhập đúng | Tài khoản không bật 2 bước | /mail/inbox |
| Liên kết kích hoạt sai hoặc hết hạn | Vào /activate/:token | Ở lại trang, hiện lỗi và nút Yêu cầu liên kết mới |
| Kích hoạt xong | Đặt mật khẩu thành công | /login có dòng thông báo Đã kích hoạt, mời đăng nhập |
| Phiên hết hạn | Máy chủ trả lỗi 401 khi đang dùng | /login?expired=1; thư đang soạn được lưu cục bộ để khôi phục sau |
| Không đủ quyền | Người dùng thường vào /admin | /403 |
| Đường dẫn không có | Gõ sai địa chỉ, thư đã bị xóa vĩnh viễn | /404, có nút Về Inbox |
| Mất mạng | Mất kết nối khi đang dùng | Ở lại trang hiện tại, hiện dải trạng thái kết nối, không chuyển trang |
| Máy chủ lỗi | Lỗi 5xx khi tải trang chính | Hiện khung lỗi trong vùng nội dung có nút Thử lại; lỗi lặp lại thì /500 |
| Mở thư | Bấm một dòng trong danh sách | /mail/:folder/:threadId; thư tự đánh dấu đã đọc |
| Quay lại danh sách | Bấm Quay lại hoặc nút Back của trình duyệt | Danh sách cũ, giữ nguyên vị trí cuộn và bộ lọc |
| Xóa hoặc lưu trữ thư đang mở | Bấm Xóa hoặc Lưu trữ trong trang Đọc thư | Tự sang thư kế tiếp trong danh sách; hết thư thì về danh sách |
| Đang soạn mà thoát | Đóng tab trình duyệt khi có thay đổi chưa lưu | Trình duyệt hiện hộp cảnh báo; nháp đã tự lưu vẫn còn trong mục Nháp |

## Trang xác thực

Bốn trang dùng chung bố cục AuthLayout: màn hình chia đôi từ 1024 px trở lên, bên trái là thẻ form rộng 420 px canh giữa theo chiều dọc, bên phải là ảnh minh họa và thông báo của công ty; dưới 1024 px chỉ còn thẻ form. Phía trên thẻ có logo, phía dưới có bộ chọn ngôn ngữ (CD-02) và liên kết Hỗ trợ.

| Trang | Bố cục và thành phần | Trạng thái cần vẽ | Dẫn tới |
| --- | --- | --- | --- |
| Đăng nhập (TK-02, TK-06) | Tiêu đề Đăng nhập. Ô Email công ty. Ô Mật khẩu có nút hiện hoặc ẩn. Ô tích Ghi nhớ đăng nhập. Liên kết Quên mật khẩu căn phải. Nút Đăng nhập chiếm hết chiều rộng. Đường kẻ chữ hoặc, rồi nút Đăng nhập bằng tài khoản công ty (SSO) có biểu tượng khiên | Bình thường; đang tải (nút có vòng xoay, ô bị khóa); sai mật khẩu (viền đỏ và dòng lỗi phía trên nút); tài khoản bị khóa (hộp đỏ hướng dẫn liên hệ admin); thử quá nhiều lần (đếm ngược); phiên hết hạn (dải vàng ở đầu thẻ) | /mail/inbox, /verify-2fa, /forgot-password, trang SSO của công ty |
| Kích hoạt tài khoản (TK-01) | Lời chào Chào \[Tên\], đặt mật khẩu của bạn. Email công ty hiện ở ô chỉ đọc. Hai ô Mật khẩu mới và Nhập lại. Thanh độ mạnh 4 mức. Danh sách điều kiện có dấu tích khi đạt: từ 10 ký tự, có chữ hoa, có số, có ký tự đặc biệt. Nút Kích hoạt tài khoản | Liên kết hết hạn (hộp lỗi và nút Yêu cầu liên kết mới); mật khẩu yếu; hai ô không khớp; đang gửi; thành công (dấu tích lớn rồi chuyển sang Đăng nhập) | /login |
| Quên mật khẩu (TK-03) | Bước 1: ô Email công ty và hai lựa chọn (Nhờ quản trị đặt lại, Nhận mã qua email phụ), nút Tiếp tục. Bước 2 (chọn email phụ): sáu ô nhập mã, nút Gửi lại mã đếm ngược 60 giây. Bước 3: ô mật khẩu mới có thanh độ mạnh. Chọn nhờ quản trị thì hiện màn chờ: Yêu cầu đã gửi cho quản trị, kèm mã yêu cầu | Từng bước; mã sai; mã hết hạn; email không có email phụ; yêu cầu đang chờ quản trị | /login |
| Xác thực 2 bước (TK-07) | Tiêu đề Nhập mã xác thực. Sáu ô nhập số tự nhảy ô, dán được cả chuỗi. Nút Xác nhận. Ô tích Tin cậy thiết bị này 30 ngày. Liên kết Dùng mã dự phòng đổi sáu ô thành một ô mã dài. Liên kết Gửi lại mã (chỉ khi dùng SMS) | Sai mã (ô rung nhẹ, viền đỏ); mã hết hạn; khóa tạm sau nhiều lần sai; đang xác nhận | /mail/inbox, /login |

## Trang danh sách thư

Đây là trang dùng nhiều nhất, phục vụ mọi hộp thư (Inbox, Gắn sao, Đã hoãn, Quan trọng, Đã gửi, Nháp, Đã lên lịch, Cần xử lý, Spam, Thùng rác), mọi nhãn và mọi hộp thư dùng chung. Vùng nội dung chiếm hết chiều rộng bên phải thanh bên và xếp từ trên xuống: tiêu đề hộp thư, dải thông báo ghim, thanh công cụ, tab phân loại, danh sách thư.

| Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Tiêu đề hộp thư | Tên hộp thư hoặc tên nhãn kèm chấm màu; bên phải là số thư chưa đọc. Mở nhãn từ thanh bên thì đường dẫn là /mail/label/:id | HT-01, NH-03 |
| Dải thông báo ghim | Hiện đầu danh sách khi có thông báo toàn công ty chưa xác nhận: tiêu đề, một dòng nội dung, nút Tôi đã đọc, bấm tiêu đề thì mở thư | NB-05 |
| Thanh công cụ (chưa chọn thư) | Ô chọn tất cả có mũi tên xổ xuống (Tất cả, Không, Đã đọc, Chưa đọc, Gắn sao), nút Làm mới, menu ba chấm (Đánh dấu tất cả là đã đọc) | HT-03, HT-07 |
| Thanh công cụ (đã chọn thư) | Thay thế thanh trên: số thư đã chọn, Lưu trữ, Báo cáo, Xóa, Đánh dấu đã đọc hoặc chưa đọc, Hoãn, Chuyển vào nhãn (menu có ô tích từng nhãn và ô tạo nhãn mới), Gắn sao, ba chấm. Khi chọn đủ thư của trang hiện dải Chọn cả N thư trong hộp thư này | HT-03, HT-04, HT-05, HT-09, NH-02 |
| Tab phân loại | Chỉ có ở Inbox: ba tab Chính, Mạng xã hội, Quảng cáo, mỗi tab có biểu tượng, tên và số thư mới; tab đang xem có gạch chân màu nhấn | HT-08 |
| Dòng thư | Từ trái sang phải: ô chọn, sao, biểu tượng quan trọng, tên người gửi, nhãn dạng viên thuốc, tiêu đề đậm kèm đoạn xem trước xám, biểu tượng kẹp giấy khi có tệp, số thư trong chuỗi, giờ. Thư chưa đọc có nền trắng và chữ đậm, thư đã đọc có nền xám nhạt. Trong Đã gửi thì tên người gửi đổi thành Đến: tên người nhận | HT-02, HT-04, HT-10, NH-02 |
| Thao tác khi rê chuột | Giờ ở cuối dòng đổi thành 4 nút: Lưu trữ, Xóa, Đánh dấu đã đọc, Hoãn. Đây là cách thể hiện của vuốt thao tác trên Mobile | HT-04, HT-05, HT-09, HT-11 |
| Chọn nhiều | Bấm ô chọn từng dòng; giữ Shift và bấm để chọn cả dải | HT-03 |
| Kéo thả vào nhãn | Kéo một hoặc nhiều dòng sang thanh bên: hiện khối mờ ghi số thư, mục nhãn đang rê qua sáng viền; thả xong hiện thông báo ngắn kèm Hoàn tác | HT-12, HT-06 |
| Bảng hoãn thư | Hộp thoại nhỏ gồm Chiều nay, Sáng mai, Cuối tuần, Tuần sau, và Chọn ngày giờ (mở bộ chọn ngày kèm giờ) | HT-09 |
| Chấm quan trọng | Biểu tượng nhãn vàng cạnh sao, bấm để đánh dấu hoặc bỏ; thư được hệ thống gợi ý quan trọng có biểu tượng nhạt hơn | HT-10 |
| Chip cần xử lý | Viên thuốc Cần xử lý kèm hạn trên dòng thư; quá hạn thì nền đỏ nhạt | NB-06 |
| Thư mới đến | Dòng mới trượt xuống đầu danh sách, nền nhấn nhạt trong 3 giây. Nếu người dùng đang cuộn xa, hiện nút nổi 3 thư mới ở đầu danh sách | TB-03 |
| Hoàn tác | Sau Lưu trữ, Xóa, Chuyển nhãn, Hoãn, hiện thanh thông báo ngắn có nút Hoàn tác trong 5 giây | HT-06 |

### Trạng thái cần vẽ

- Đang tải: 10 dòng khung xương xám, không dùng vòng xoay
- Cuộn tới cuối: hiện dòng Đang tải thêm, hết thì hiện Đã tải hết (HT-02)
- Trống: mỗi hộp thư có hình minh họa và một câu riêng, ví dụ Inbox trống, bạn đã xử lý hết
- Lỗi tải: khung lỗi trong vùng danh sách, nút Thử lại
- Đang chọn nhiều thư, đang kéo thả, đang rê chuột trên dòng
- Phím tắt: j và k chuyển dòng, Enter mở thư, e lưu trữ, # xóa, s gắn sao (CD-07)

### Biến thể theo hộp thư

| Hộp thư | Khác với Inbox |
| --- | --- |
| Gắn sao, Quan trọng | Không có tab phân loại; hiện thêm tên hộp thư gốc dạng viên thuốc nhỏ ở mỗi dòng |
| Đã hoãn | Mỗi dòng hiện giờ sẽ nhắc lại với biểu tượng đồng hồ; có nút Bỏ hoãn (HT-09) |
| Đã gửi | Cột người gửi thành Đến: người nhận; có dấu tích đã đọc nếu bật biên nhận (NB-03) |
| Nháp | Bấm dòng thì mở cửa sổ soạn thay vì trang đọc; chữ Nháp màu đỏ ở đầu tiêu đề (SO-04) |
| Đã lên lịch | Cột giờ hiện thời điểm sẽ gửi; có nút Hủy lịch và Sửa giờ (SO-08) |
| Cần xử lý | Sắp xếp theo hạn gần nhất; quá hạn tô đỏ; có nút Xong để bỏ đánh dấu (NB-06) |
| Spam, Thùng rác | Dải phía trên: Thư ở đây tự xóa sau 30 ngày, kèm nút Dọn ngay; thanh công cụ có Khôi phục và Xóa vĩnh viễn (hộp xác nhận) (HT-05) |
| Hộp thư dùng chung | Thêm cột Người xử lý (ảnh đại diện hoặc nút Nhận xử lý) và menu Giao cho (chọn đồng nghiệp) (NB-02) |

## Trang đọc thư và hội thoại

Trang chiếm toàn vùng nội dung, thay cho danh sách. Nội dung canh trong khung rộng tối đa 960 px; từ trên xuống: thanh công cụ, tiêu đề chuỗi, các dải cảnh báo, các thư trong chuỗi, ô trả lời cuối chuỗi.

| Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Thanh công cụ | Bên trái: nút Quay lại (mũi tên), Lưu trữ, Báo cáo, Xóa, Đánh dấu chưa đọc, Hoãn, Chuyển vào nhãn. Menu ba chấm gồm: Tắt tiếng, Tạo bộ lọc từ thư này, Dịch thư, In, Tải về dạng .eml, Đánh dấu cần xử lý, Đánh dấu quan trọng. Bên phải: ô 12 trong 120 và hai mũi tên thư trước, thư sau | DT-06, HT-04, HT-05, HT-09, HT-10, NH-07, NH-09, DT-08, DT-09, NB-06 |
| Tiêu đề chuỗi | Tiêu đề cỡ 20 px; cạnh tiêu đề là các nhãn dạng viên thuốc có dấu x để gỡ nhãn, bấm tên nhãn thì mở /mail/label/:id | DT-01, NH-02 |
| Dải tóm tắt | Chỉ hiện khi chuỗi từ 5 thư hoặc thư dài: khung nền xanh nhạt, biểu tượng tia sáng, ba gạch đầu dòng tóm tắt, nút Mở rộng, nút Ẩn và dòng nhỏ Tạo tự động, có thể chưa chính xác | DT-11 |
| Dải dịch thư | Hiện khi thư khác ngôn ngữ người dùng: Thư này bằng tiếng Anh, nút Dịch sang Tiếng Việt, nút Không bao giờ dịch tiếng Anh, bộ chọn ngôn ngữ đích. Dịch xong có nút Xem bản gốc | DT-08 |
| Dải cảnh báo giả mạo | Dải đỏ phía trên thân thư khi người gửi giả tên đồng nghiệp hoặc lãnh đạo: nội dung cảnh báo, nút Báo cáo, nút Tôi tin tưởng người gửi. Bấm vào liên kết lạ trong thân thư thì hiện hộp xác nhận ghi rõ địa chỉ đích thật | BM-01 |
| Thư trong chuỗi | Các thư xếp dọc theo thời gian. Thư cũ thu gọn thành một dòng (ảnh đại diện, tên, đoạn đầu, giờ), bấm để mở rộng. Thư mới nhất và thư chưa đọc mở sẵn. Nhiều thư cũ liền nhau gộp thành dải N thư đã ẩn, bấm để mở hết | DT-02 |
| Đầu mỗi thư | Ảnh đại diện, tên đậm, địa chỉ email xám nhỏ, phòng ban và chức vụ; dòng đến tôi kèm mũi tên xổ xuống mở bảng chi tiết (Từ, Đến, CC, BCC, ngày giờ). Bên phải: giờ, sao, nút Trả lời nhanh, ba chấm | DT-01, DT-05 |
| Thân thư | Hiển thị HTML trong khung cách ly, chữ 14 px, ảnh tự co theo chiều rộng. Phần trích dẫn thư cũ ẩn sau nút ba chấm; thư quá dài bị cắt kèm nút Xem toàn bộ thư | DT-01 |
| Tệp đính kèm | Lưới thẻ dưới thân thư: biểu tượng hoặc ảnh thu nhỏ, tên (cắt giữa), dung lượng. Rê chuột hiện Tải về và Xem trước. Có nút Tải tất cả (.zip) và số tệp. Tệp bị chặn vì virus có nền đỏ nhạt, biểu tượng khiên và lý do | DT-04, BM-02 |
| Trình xem tệp | Mở khi bấm tệp ảnh hoặc PDF: nền tối phủ toàn màn hình; thanh trên có tên tệp, Tải về, Đóng; hai mũi tên trái phải để chuyển tệp; nút phóng to, thu nhỏ; PDF cuộn theo trang | DT-07 |
| Biên nhận đã đọc | Chỉ có ở thư mình gửi: dấu tích đôi cạnh giờ; bấm mở bảng Đã đọc 3 trên 5 gồm tên, giờ đọc, người chưa đọc để xám | NB-03 |
| Thu hồi thư | Trong menu ba chấm của thư mình gửi, khi còn người chưa đọc: mục Thu hồi mở hộp xác nhận Thư sẽ biến mất khỏi hộp thư của 2 người chưa đọc. Kết quả báo Đã thu hồi 2 trên 5 người | NB-04 |
| Gợi ý trả lời nhanh | Hàng 3 viên thuốc câu trả lời ngắn nằm ngay trên ô trả lời; bấm một viên thì chèn vào ô trả lời nhúng | DT-10 |
| Ô trả lời cuối chuỗi | Ba nút Trả lời, Trả lời tất cả, Chuyển tiếp. Bấm một nút thì mở ô soạn nhúng ngay dưới chuỗi (đủ ô Đến, nội dung, nút Gửi) kèm nút Mở cửa sổ lớn để chuyển sang cửa sổ soạn nổi | DT-03 |
| In và xuất | In chỉ lấy thân chuỗi, không lấy thanh công cụ. Tải .eml tải về tệp của thư đang mở | DT-09 |

### Trạng thái cần vẽ

- Đang tải: khung xương gồm tiêu đề, một đầu thư và ba dòng thân thư
- Thư không tồn tại hoặc không có quyền xem: chuyển sang trang lỗi 404
- Tải tệp xem trước lỗi: ô xám có biểu tượng lỗi và nút Thử lại
- Dịch đang chạy, dịch lỗi
- Thu hồi thành công, thu hồi một phần, thu hồi thất bại
- Chuỗi rất dài (hơn 50 thư): chỉ tải 10 thư mới nhất, nút Tải thêm thư cũ ở đầu chuỗi

### Dẫn tới

- Bấm Quay lại hoặc nhãn: về danh sách (giữ vị trí cuộn)
- Xóa hoặc Lưu trữ: sang thư kế tiếp
- Tạo bộ lọc từ thư: /settings/filters với form điền sẵn
- Bấm tên người gửi: thẻ nhanh có nút Soạn thư và Xem hồ sơ (đến /contacts/:contactId)

## Cửa sổ soạn thư

Soạn thư là cửa sổ nổi ở góc dưới bên phải, rộng 540 px, mở từ nút Soạn thư, từ Trả lời, Chuyển tiếp hoặc từ một nháp. Từ trên xuống: thanh tiêu đề, ô người nhận, ô tiêu đề, vùng soạn, thanh dưới.

| Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Thanh tiêu đề | Nền xám đậm cao 36 px, chữ Thư mới (hoặc tiêu đề thư). Bốn nút: Thu nhỏ, Phóng to, Toàn màn hình, Đóng. Bấm vào thanh để thu nhỏ hoặc mở lại | SO-01, SO-13 |
| Ô Đến | Người nhận hiện thành viên thuốc có ảnh đại diện nhỏ và dấu x. Gõ vài chữ thì xổ xuống danh sách gợi ý (ảnh, tên, email, phòng ban), người hay liên lạc xếp trên cùng. Địa chỉ sai định dạng hiện viên thuốc viền đỏ kèm lời nhắc khi rê chuột. Cuối ô có hai nút chữ CC và BCC, bấm thì thêm hàng ô tương ứng | SO-01, SO-02 |
| Gửi cho phòng ban hoặc nhóm | Khi gõ tên phòng ban hoặc nhóm, gợi ý hiện dạng Phòng Kế toán (12 người) có biểu tượng nhóm. Chọn thì tạo viên thuốc nhóm kèm số người; bấm vào viên thuốc mở khung nhỏ liệt kê thành viên, gỡ được từng người hoặc bấm Mở rộng thành từng người | NB-01 |
| Ô Tiêu đề | Một dòng chữ xám gợi ý Tiêu đề; trả lời thì điền sẵn Re: và chuyển tiếp thì điền Fwd: | SO-01 |
| Vùng soạn | Trình soạn văn bản nhiều định dạng, cao tối thiểu 240 px và co giãn theo nội dung, thanh cuộn riêng. Trả lời thì phần thư cũ được trích dẫn ở dưới, thu gọn sau nút ba chấm | SO-01, SO-05 |
| Thanh định dạng | Mở bằng nút chữ A ở thanh dưới: hoàn tác, làm lại, cỡ chữ, đậm, nghiêng, gạch chân, màu chữ, căn lề, danh sách số, danh sách chấm, thụt lề, trích dẫn, liên kết, xóa định dạng | SO-05 |
| Chèn ảnh, emoji, bảng | Nút ảnh (chọn tệp hoặc kéo thả vào vùng soạn; ảnh trong nội dung có khung chọn và tay kéo đổi cỡ), nút emoji (bảng nổi lên có tab nhóm và ô tìm), nút bảng (lưới chọn tới 5 trên 5) | SO-11 |
| Chữ ký | Tự chèn dưới thân thư, ngăn bằng một đường gạch; đổi chữ ký ở menu ba chấm | SO-09 |
| Đính kèm tệp | Nút kẹp giấy hoặc kéo tệp vào cửa sổ (lớp phủ nét đứt Thả tệp để đính kèm). Thẻ tệp hiện dưới vùng soạn: tên, dung lượng, thanh tiến độ khi đang tải lên, dấu x để gỡ. Quá giới hạn dung lượng thì thẻ đỏ kèm lý do | SO-03 |
| Mẫu thư | Nút biểu tượng mẫu mở menu: danh sách mẫu để chèn, Lưu thư này thành mẫu, Quản lý mẫu | SO-10 |
| Chế độ bảo mật | Nút ổ khóa mở hộp thoại: thời hạn xem (1 ngày, 1 tuần, 1 tháng, 3 tháng, không hết hạn), yêu cầu mã xác thực, chặn chuyển tiếp, sao chép, in và tải về. Sau khi đặt, cửa sổ hiện dải Thư này sẽ hết hạn ngày ... kèm nút Sửa | SO-12 |
| Dòng trạng thái nháp | Chữ xám nhỏ ở thanh dưới: Đang lưu, rồi Đã lưu nháp lúc 08:12; tự lưu mỗi vài giây khi có thay đổi | SO-04 |
| Nút Gửi | Nút nhấn màu nhấn ở góc trái thanh dưới, bên phải nút có mũi tên xổ xuống với mục Hẹn giờ gửi: Sáng mai, Chiều mai, Thứ Hai, hoặc Chọn ngày giờ (bộ chọn ngày kèm giờ). Gửi hẹn giờ thì thư vào mục Đã lên lịch | SO-06, SO-08 |
| Kiểm tra trước khi gửi | Không có người nhận: hộp thoại Hãy thêm ít nhất một người nhận. Thiếu tiêu đề: hộp hỏi Gửi thư không có tiêu đề, hai nút Gửi vẫn và Quay lại. Có chữ đính kèm trong nội dung nhưng không có tệp: hộp nhắc Bạn quên đính kèm tệp | SO-06 |
| Hủy bỏ nháp | Nút thùng rác ở góc phải thanh dưới, bấm thì hộp xác nhận Xóa nháp này | SO-06 |
| Hoàn tác gửi | Sau khi gửi, thanh thông báo ngắn Đang gửi kèm nút Hoàn tác và Xem thư, tồn tại 5 đến 30 giây theo cài đặt. Bấm Hoàn tác thì mở lại cửa sổ soạn với đúng nội dung cũ | SO-07 |
| Nhiều cửa sổ, toàn màn hình | Tối đa 3 cửa sổ xếp ngang ở đáy; mở thêm thì cửa sổ cũ nhất thu nhỏ. Nút Toàn màn hình làm nền phía sau mờ đi và cửa sổ chiếm giữa màn hình, rộng 80% (tối đa 1000 px) | SO-13 |

### Trạng thái cần vẽ

- Mới mở, đang thu nhỏ, đang phóng to, toàn màn hình
- Đang tải tệp lên (nhiều tệp), tệp lỗi hoặc quá dung lượng
- Gợi ý người nhận đang xổ xuống, địa chỉ sai định dạng
- Đang gửi (nút có vòng xoay), gửi thất bại (thư quay về Nháp, dải đỏ có nút Thử lại)
- Đã gửi, chờ hoàn tác; đã hẹn giờ
- Cửa sổ trả lời, chuyển tiếp: tiêu đề và trích dẫn điền sẵn
- Mất kết nối khi đang soạn: dải vàng trong cửa sổ, nháp được giữ cục bộ

## Trang tìm kiếm

Trang /search nằm trong AppShell, ô tìm kiếm ở header vẫn giữ nguyên từ khóa. Điều kiện tìm nằm trên địa chỉ (ví dụ /search?q=báo cáo&from=an&scope=sent) để chia sẻ và quay lại được. Vùng nội dung gồm: dòng tiêu đề kết quả, thanh phạm vi, thanh bộ lọc nhanh, danh sách kết quả.

| Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Ô tìm kiếm khi vừa bấm vào | Chưa gõ gì thì xổ xuống tối đa 8 từ khóa gần nhất, mỗi dòng có biểu tượng đồng hồ và nút x để xóa từng mục; cuối danh sách có chữ Xóa lịch sử tìm kiếm | TM-03 |
| Gợi ý khi gõ | Xổ xuống theo ba nhóm: Người (ảnh, tên, email), Nhãn (chấm màu, tên), Từ khóa phổ biến. Mũi tên lên xuống để chọn, Enter để tìm. Chọn một người thì tự điền from:người đó | TM-07, TM-01 |
| Cú pháp tìm nhanh | Gõ như from:an, to:binh, subject:báo cáo, has:attachment, before:2026-01-01, label:kế-toán thì phần cú pháp đổi thành viên thuốc trong ô tìm kiếm. Dưới ô hiện dòng gợi ý các cú pháp còn lại | TM-06 |
| Dòng tiêu đề kết quả | Kết quả cho từ khóa và số thư tìm thấy; bên phải là bộ chọn sắp xếp Liên quan nhất hoặc Mới nhất | TM-02 |
| Thanh phạm vi | Hàng tab ngang: Tất cả thư, Inbox, Đã gửi, Nhãn (xổ xuống chọn một nhãn). Tab đang chọn có gạch chân | TM-04 |
| Thanh bộ lọc nhanh | Các viên thuốc bật tắt: Có tệp đính kèm, Chưa đọc, Tuần này, Từ tôi. Bật thì nền đổi màu nhấn và danh sách tải lại | TM-05 |
| Bảng lọc nâng cao | Mở từ nút lọc cuối ô tìm kiếm, là khung nổi rộng 560 px: ô Từ, Đến, Tiêu đề, Có các từ, Không có các từ, Kích thước (lớn hơn hoặc nhỏ hơn, số, đơn vị MB), Khoảng ngày (bộ chọn có các mốc 1 ngày, 1 tuần, 1 tháng, 1 năm và ngày cụ thể), Tìm trong (hộp thư hoặc nhãn), ô tích Có tệp đính kèm. Cuối khung: liên kết Tạo bộ lọc, nút Xóa lọc, nút Tìm kiếm | TM-05, TM-08 |
| Dòng kết quả | Dùng lại dòng thư của danh sách: từ khóa được tô nền vàng nhạt trong tên người gửi, tiêu đề và đoạn xem trước (đoạn xem trước lấy câu chứa từ khóa). Thêm viên thuốc nhỏ ghi hộp thư gốc (Inbox, Đã gửi, nhãn). Vẫn chọn nhiều và thao tác như trong danh sách | TM-02 |
| Khớp trong tệp | Thư khớp ở bên trong tệp đính kèm thì dòng có thêm viên thuốc Khớp trong tệp kèm tên tệp và trang, và một đoạn trích; bấm viên thuốc mở trình xem tệp tại đúng trang | TM-09 |
| Tạo bộ lọc từ tìm kiếm | Nút chữ Tạo bộ lọc từ tìm kiếm này ở đầu danh sách kết quả, bấm thì sang /settings/filters với điều kiện đã điền sẵn | TM-08 |

### Trạng thái cần vẽ

- Đang tìm: khung xương 10 dòng
- Không có kết quả: hình minh họa và câu Không tìm thấy thư nào cho từ khóa; gợi ý kiểm tra chính tả, bỏ bớt bộ lọc, thử Tất cả thư; nút Xóa bộ lọc
- Cú pháp sai (ví dụ before: không có ngày): viên thuốc viền đỏ, rê chuột hiện giải thích
- Bảng lọc nâng cao: mới mở, đã nhập một vài điều kiện, báo lỗi (khoảng ngày sai)
- Lỗi mạng: khung lỗi, nút Thử lại

### Dẫn tới

- Bấm một kết quả: /mail/:hộp-thư-gốc/:threadId; Quay lại thì về /search với đúng điều kiện cũ
- Bấm tên nhãn trong viên thuốc: /mail/label/:labelId
- Tạo bộ lọc: /settings/filters

## Nhãn và bộ lọc

Nhãn và bộ lọc được dùng ở nhiều nơi (thanh bên, danh sách thư, trang đọc thư) nhưng được quản lý ở hai trang trong Cài đặt: /settings/labels và /settings/filters.

### Quản lý nhãn (/settings/labels)

| Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Tiêu đề và nút tạo | Tiêu đề Nhãn, câu mô tả một dòng, nút Tạo nhãn mới ở góc phải | NH-01 |
| Bảng nhãn | Mỗi dòng: chấm màu, tên nhãn, số thư, nút Xem thư (đến /mail/label/:id), menu ba chấm (Đổi tên, Đổi màu, Thêm nhãn con, Xóa). Nhãn con thụt vào 24 px so với nhãn cha, có mũi tên thu mở ở nhãn cha | NH-01, NH-04, NH-05 |
| Hộp thoại tạo nhãn | Ô Tên nhãn có bộ đếm ký tự (tối đa 40); ô xổ xuống Đặt nhãn này trong (không chọn, hoặc một nhãn cha); hàng 8 ô màu và một ô Màu tùy chọn; bản xem trước nhãn dạng viên thuốc cập nhật theo tên và màu; nút Hủy và Tạo | NH-01, NH-04, NH-05 |
| Đổi tên | Bấm Đổi tên thì tên trong bảng thành ô nhập ngay tại dòng; Enter để lưu, Esc để hủy | NH-01 |
| Đổi màu | Bấm chấm màu mở bảng 8 màu nhỏ ngay dưới chấm | NH-04 |
| Xóa nhãn | Hộp xác nhận Xóa nhãn này? Thư không bị xóa, chỉ gỡ nhãn khỏi thư. Nếu nhãn có nhãn con, hộp hỏi thêm có xóa cả nhãn con không | NH-01, NH-05 |
| Gắn nhãn cho thư | Menu chọn nhãn dùng ở danh sách và trang đọc thư: ô tìm nhãn, danh sách có ô tích (tích một phần khi chỉ một số thư đã chọn có nhãn đó), cuối menu là mục Tạo nhãn mới | NH-02 |
| Tắt tiếng chuỗi thư | Chuỗi bị tắt tiếng hiện biểu tượng loa gạch chéo cạnh tiêu đề ở danh sách và trang đọc; thư mới trong chuỗi đi thẳng vào lưu trữ, không có thông báo. Bật lại bằng mục Bỏ tắt tiếng trong menu ba chấm | NH-09 |

### Bộ lọc tự động (/settings/filters)

| Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Danh sách bộ lọc | Mỗi dòng gồm hai phần: điều kiện tóm tắt (ví dụ Từ: ketoan, có chứa hóa đơn) và hành động tóm tắt (ví dụ Gắn nhãn Hóa đơn, Bỏ qua Inbox); bên phải là công tắc bật hoặc tắt, nút Sửa, nút Xóa. Nút Tạo bộ lọc mới ở góc phải trên | NH-06 |
| Form bộ lọc (/settings/filters/new và /settings/filters/:id) | Chia hai khối nối nhau bằng mũi tên. Khối Khi thư đến khớp: ô Từ, Đến, Tiêu đề, Có các từ, Không có các từ, Kích thước, ô tích Có tệp đính kèm; dòng Khớp 23 thư hiện có cập nhật khi gõ. Khối Thì làm gì: các ô tích Bỏ qua Inbox, Đánh dấu đã đọc, Gắn sao, Đánh dấu quan trọng, Gắn nhãn (xổ xuống chọn hoặc tạo mới), Xóa | NH-06 |
| Áp dụng cho thư cũ | Ô tích ở cuối form: Áp dụng cho 23 thư hiện có. Nếu hành động có Xóa thì hiện dòng cảnh báo vàng Hành động này sẽ chuyển 23 thư vào Thùng rác | NH-08 |
| Tạo từ một thư | Từ menu ba chấm ở trang đọc thư mở /settings/filters/new với ô Từ điền sẵn người gửi; bên trên form có ô chọn Dùng: Người gửi, Tiêu đề, hoặc Cả hai | NH-07 |
| Tạo từ tìm kiếm | Từ trang Tìm kiếm mở cùng form với các điều kiện đã điền sẵn | NH-07 |

### Trạng thái cần vẽ

- Danh sách nhãn trống: hình minh họa và nút Tạo nhãn đầu tiên
- Tên nhãn trùng, tên quá dài, nhãn cha là chính nó (không cho chọn)
- Danh sách bộ lọc trống; bộ lọc bị tắt (dòng mờ)
- Form bộ lọc thiếu điều kiện: nút Tạo mờ, dòng nhắc Hãy nhập ít nhất một điều kiện
- Đang lưu, lưu thành công (thanh thông báo ngắn), lưu lỗi

## Danh bạ công ty

Danh bạ gồm bốn trang trong AppShell: /contacts (danh sách), /contacts/:contactId (hồ sơ), /contacts/org (sơ đồ tổ chức) và /contacts/groups (nhóm liên hệ). Dữ liệu lấy tự động từ danh sách nhân viên nên người dùng không thêm hoặc sửa liên hệ thủ công.

| Trang | Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- | --- |
| Danh sách (/contacts) | Đầu trang | Tiêu đề Danh bạ công ty; ô tìm đồng nghiệp có gợi ý khi gõ; hàng tab: Tất cả, Sơ đồ tổ chức (đến /contacts/org), Nhóm của tôi (đến /contacts/groups); bộ lọc Phòng ban và Trạng thái; nút Xuất ở góc phải | DB-01, DB-03, DB-06 |
| Danh sách (/contacts) | Bảng đồng nghiệp | Cột: ảnh đại diện có chấm trạng thái, tên, chức vụ, phòng ban, email, điện thoại. Xếp theo chữ cái hoặc theo phòng ban; thanh chữ A đến Z bên phải để nhảy nhanh. Rê chuột dòng hiện hai nút Soạn thư (mở cửa sổ soạn có sẵn người nhận) và Xem hồ sơ | DB-01, DB-02, DB-08 |
| Danh sách (/contacts) | Chọn nhiều | Ô chọn từng dòng; khi có dòng chọn hiện thanh thao tác: Soạn thư cho những người đã chọn, Thêm vào nhóm, Xuất | DB-05, DB-06 |
| Danh sách (/contacts) | Hộp thoại Xuất | Chọn phạm vi (đang lọc, đã chọn, một nhóm), định dạng CSV, các cột cần xuất bằng ô tích, nút Xuất; xong thì tệp tự tải về và hiện thông báo ngắn | DB-06 |
| Hồ sơ (/contacts/:contactId) | Thẻ bên trái | Ảnh lớn, tên, chức vụ, phòng ban, chấm và dòng trạng thái (Đang hoạt động, hoặc Vắng mặt đến 05/11), nút Soạn thư. Dưới đó: email (bấm để sao chép), điện thoại, vị trí làm việc, quản lý trực tiếp (bấm sang hồ sơ người đó), liên kết Xem trong sơ đồ tổ chức | DB-02, DB-04, DB-08 |
| Hồ sơ (/contacts/:contactId) | Tab Thư trao đổi | Danh sách các thư đã gửi và nhận với người này, dùng lại dòng thư; bộ chọn Tất cả, Tôi gửi, Họ gửi; bấm một thư thì mở trang đọc thư | DB-07 |
| Sơ đồ tổ chức (/contacts/org) | Vùng sơ đồ | Cây nằm ngang trên nền lưới nhạt: mỗi nút là thẻ người (ảnh, tên, chức vụ) nối bằng đường gấp khúc. Nút nhóm cấp dưới có dấu + hoặc − kèm số người. Kéo nền để di chuyển, nút phóng to, thu nhỏ, nút Về vị trí của tôi, ô tìm để nhảy tới một người | DB-04 |
| Sơ đồ tổ chức (/contacts/org) | Thẻ nhanh | Bấm một thẻ người thì hiện khung nhỏ: ảnh, tên, chức vụ, hai nút Soạn thư và Xem hồ sơ | DB-04, DB-02 |
| Nhóm liên hệ (/contacts/groups) | Hai cột | Cột trái là danh sách nhóm (tên, số người) và nút Tạo nhóm; nhóm phòng ban do quản trị tạo có nhãn Phòng ban và chỉ đọc. Cột phải là chi tiết nhóm đang chọn: tên sửa ngay tại chỗ, danh sách thành viên có dấu x, ô Thêm thành viên có gợi ý khi gõ, nút Soạn thư cho nhóm, nút Xóa nhóm | DB-05, NB-01 |
| Nhóm liên hệ (/contacts/groups) | Hộp thoại tạo nhóm | Ô Tên nhóm, ô tìm và chọn thành viên có ô tích, nút Hủy và Tạo | DB-05 |
| Chấm trạng thái | Dùng khắp app | Chấm tròn nhỏ ở góc ảnh đại diện: xanh lá là đang hoạt động, vàng là bận, xám là ngoại tuyến, và biểu tượng va li là vắng mặt (lấy từ Trả lời tự động). Xuất hiện ở danh bạ, viên thuốc người nhận và đầu thư | DB-08 |

### Trạng thái cần vẽ

- Đang tải danh sách (khung xương), không có kết quả tìm, danh sách nhóm trống
- Hồ sơ chưa có thư trao đổi: hình minh họa và nút Soạn thư
- Sơ đồ rất lớn: thu gọn sẵn các cấp sâu hơn 3
- Xuất đang chạy, xuất xong, xuất lỗi

## Cài đặt

Cài đặt dùng bố cục SettingsLayout: cột tab dọc bên trái rộng 240 px (Chung, Tài khoản, Nhãn, Bộ lọc, Chữ ký và mẫu thư, Trả lời tự động, Thông báo, Bảo mật, Dữ liệu của tôi) và vùng nội dung bên phải rộng tối đa 720 px. Mỗi khối là một thẻ có tiêu đề, mô tả ngắn và các điều khiển; thay đổi lưu ngay và hiện thanh thông báo ngắn Đã lưu, riêng form có nút Lưu. Hai tab Nhãn và Bộ lọc đã mô tả ở phần Nhãn và bộ lọc.

| Tab (đường dẫn) | Khối | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- | --- |
| Chung (/settings/general) | Giao diện | Ba thẻ chọn có ảnh xem trước: Sáng, Tối, Theo hệ thống; thẻ đang chọn có viền màu nhấn | CD-01 |
| Chung | Ngôn ngữ | Ô xổ xuống Tiếng Việt, English; đổi xong giao diện đổi ngay, không tải lại | CD-02 |
| Chung | Mật độ hiển thị | Ba lựa chọn dạng nút radio, mỗi lựa chọn kèm hình thu nhỏ ba dòng thư: Thoải mái, Vừa, Gọn | CD-06 |
| Chung | Chủ đề màu và hình nền | Hàng 6 màu nhấn; lưới 8 chủ đề có ảnh nền nhạt và nút Không dùng hình nền | CD-08 |
| Chung | Phím tắt | Công tắc Bật phím tắt và liên kết Xem danh sách phím tắt mở hộp thoại nhóm theo Điều hướng, Thao tác thư, Soạn thư | CD-07 |
| Chung | Tab phân loại Inbox | Công tắc Hiện các tab Chính, Mạng xã hội, Quảng cáo; mỗi tab có ô tích bật hoặc tắt | HT-08 |
| Chung | Thao tác nhanh khi rê chuột | Chọn tối đa 4 nút xuất hiện trên dòng thư (Lưu trữ, Xóa, Đã đọc, Hoãn, Gắn nhãn) bằng ô tích có hình xem trước | HT-11 |
| Chung | Hoàn tác gửi | Ô xổ xuống thời gian giữ thư: 5, 10, 20, 30 giây | SO-07 |
| Tài khoản (/settings/account) | Hồ sơ | Ảnh đại diện tròn lớn với nút Đổi ảnh (mở cửa sổ cắt ảnh vuông có kéo và thu phóng) và Xóa ảnh. Tên, phòng ban, chức vụ chỉ đọc (lấy từ danh sách nhân viên). Ô số điện thoại và email phụ sửa được, nút Lưu | TK-05 |
| Tài khoản | Đổi mật khẩu | Ba ô Mật khẩu hiện tại, Mật khẩu mới, Nhập lại; thanh độ mạnh; nút Đổi mật khẩu. Tài khoản dùng SSO thì thay bằng dòng Mật khẩu do hệ thống công ty quản lý | CD-03, TK-06 |
| Tài khoản | Dung lượng | Thanh tiến độ chia màu theo Thư, Tệp đính kèm, Thùng rác, chữ đã dùng X trên Y GB. Hai nút Dọn thùng rác và Xem thư lớn nhất (sang trang Tìm kiếm đã lọc theo kích thước) | CD-04 |
| Tài khoản | Tài khoản đã thêm | Danh sách tài khoản phụ (ảnh, email, nút Gỡ) và nút Thêm tài khoản mở hộp thoại đăng nhập; chuyển tài khoản làm ở menu ảnh đại diện | TK-09 |
| Chữ ký và mẫu thư (/settings/signature) | Chữ ký | Danh sách chữ ký ở bên trái; bên phải là trình soạn nhỏ (đậm, nghiêng, liên kết, chèn ảnh hoặc logo) và bản xem trước. Hai ô xổ xuống Dùng cho thư mới và Dùng cho trả lời, chuyển tiếp | SO-09 |
| Chữ ký và mẫu thư | Mẫu thư | Bảng mẫu (tên, ngày tạo, nút Sửa, Xóa). Nút Tạo mẫu mở hộp thoại có Tên mẫu, Tiêu đề, trình soạn nội dung và Xem trước | SO-10 |
| Trả lời tự động (/settings/vacation) | Form | Công tắc Bật trả lời tự động; ô Ngày bắt đầu, Ngày kết thúc (không bắt buộc); ô Tiêu đề; trình soạn Nội dung; nút Lưu. Khi đang bật, đầu Inbox có dải Đang bật trả lời tự động đến 05/11 kèm nút Tắt, và chấm trạng thái của người dùng đổi thành Vắng mặt | CD-05, DB-08 |
| Thông báo (/settings/notifications) | Thông báo thư mới | Công tắc chính; dưới đó là ba lựa chọn radio: Tất cả thư mới, Chỉ thư quan trọng, Tắt; công tắc Âm thanh | TB-04, TB-08 |
| Thông báo | Thông báo trên trình duyệt | Thẻ trạng thái quyền: Chưa bật thì có nút Bật thông báo trình duyệt (mở hộp xin quyền của trình duyệt); Đã bật thì có nút Gửi thử; Bị chặn thì hiện hướng dẫn mở khóa trong trình duyệt | TB-05 |
| Thông báo | Giờ yên lặng | Công tắc, hai ô giờ Từ và Đến, hàng 7 nút chọn ngày trong tuần | TB-08 |
| Bảo mật (/settings/security) | Xác thực 2 bước | Thẻ trạng thái Đang tắt hoặc Đang bật kèm nút Bật hoặc Tắt. Bật thì mở hộp thoại 3 bước: chọn phương thức (ứng dụng xác thực hoặc SMS); quét mã QR và nhập mã 6 số; xem 10 mã dự phòng với nút Tải, In, Sao chép và ô tích Tôi đã lưu | TK-07 |
| Bảo mật | Thiết bị đang đăng nhập | Bảng: biểu tượng thiết bị, trình duyệt và hệ điều hành, địa điểm hoặc IP, lần dùng cuối, nhãn Thiết bị này, nút Đăng xuất. Nút Đăng xuất mọi thiết bị khác ở trên bảng | TK-10 |
| Bảo mật | Nhật ký hoạt động | Bảng: thời gian, hành động (Đăng nhập, Đổi mật khẩu, Đăng xuất), thiết bị, IP, kết quả; bộ lọc 7, 30, 90 ngày; cuộn tải thêm | BM-03 |
| Bảo mật | Cảnh báo đăng nhập lạ | Thẻ vàng đầu trang bảo mật và thông báo trong chuông: Đăng nhập mới từ Hà Nội, Chrome trên Windows, 08:12. Có phải bạn không? Hai nút Đúng là tôi và Không phải tôi (nút sau dẫn tới hộp thoại đổi mật khẩu và đăng xuất mọi thiết bị) | BM-04 |
| Dữ liệu của tôi (/settings/data) | Yêu cầu xuất | Chọn phạm vi (toàn bộ thư và tệp, một nhãn, khoảng ngày), định dạng tệp nén .zip chứa .eml, nút Yêu cầu xuất. Thanh tiến độ khi đang chuẩn bị; xong thì hiện nút Tải về (có hiệu lực 7 ngày); bảng lịch sử các lần yêu cầu | CD-09 |

### Trạng thái cần vẽ

- Mỗi khối: bình thường, đang lưu, đã lưu, lưu lỗi
- Form có lỗi từng ô (mật khẩu hiện tại sai, mật khẩu mới yếu, ngày kết thúc trước ngày bắt đầu)
- Quyền thông báo trình duyệt: chưa bật, đã bật, bị chặn
- Xác thực 2 bước: mã sai, mã hết hạn
- Xuất dữ liệu: đang chuẩn bị, sẵn sàng, hết hạn, lỗi

## Thông báo, thời gian thực và ngoại tuyến

Nhóm này không có trang riêng: các thành phần nằm trong header, tiêu đề tab trình duyệt và hệ thống thông báo của trình duyệt. Dữ liệu thời gian thực đi qua một kết nối WebSocket duy nhất mở sau khi đăng nhập.

| Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- |
| Chuông thông báo | Nút chuông ở header có chấm đỏ kèm số. Bấm mở khung xổ xuống rộng 380 px: hai tab Tất cả và Chưa đọc; mỗi dòng gồm ảnh, nội dung (thư mới từ ..., đăng nhập lạ, thư sắp đến hạn xử lý, thông báo toàn công ty), giờ, chấm xanh chưa đọc. Cuối khung có nút Đánh dấu tất cả đã đọc và liên kết Cài đặt thông báo | TB-01, TB-02, BM-04 |
| Số thư chưa đọc | Số hiện cạnh mục Inbox ở thanh bên và trong tiêu đề tab trình duyệt dạng (3) Inbox - Mail công ty; biểu tượng tab đổi sang bản có chấm đỏ | TB-02 |
| Thư mới tự hiện | Khi nhận sự kiện thư mới, dòng thư mới trượt vào đầu danh sách (nền nhấn nhạt 3 giây), số chưa đọc tăng. Đang cuộn xa đầu danh sách thì hiện nút nổi N thư mới thay vì chèn vào | TB-03 |
| Thông báo trình duyệt | Hộp thông báo của hệ điều hành khi tab đang ở nền: tiêu đề tên người gửi, nội dung là tiêu đề thư và đoạn đầu; bấm thì mở thẳng thư. Có thể có nút hành động Lưu trữ, Trả lời, Đã đọc ngay trên thông báo (tùy trình duyệt hỗ trợ) | TB-01, TB-05, TB-09 |
| Xin quyền thông báo | Lần đầu vào app hiện thẻ nhỏ góc dưới: Bật thông báo để không bỏ lỡ thư mới, hai nút Bật và Để sau; chọn Để sau thì hỏi lại sau 7 ngày | TB-05 |
| Giờ yên lặng và lọc loại thư | Áp dụng đúng cấu hình ở Cài đặt thông báo; khi đang trong giờ yên lặng thì chuông vẫn tăng số nhưng không có thông báo trình duyệt và không có âm thanh | TB-08 |
| Mất kết nối | Khi WebSocket đứt hoặc mất mạng, dải vàng mỏng dưới header: Mất kết nối. Đang thử kết nối lại... kèm nút Thử lại ngay. Có lại mạng thì dải xanh Đã kết nối lại hiện 2 giây rồi biến mất, thư bỏ lỡ được tải bù | TB-06 |
| Hàng chờ gửi ngoại tuyến | Soạn và bấm Gửi khi mất mạng thì thư vào mục Hộp đi (xuất hiện ở thanh bên khi có thư chờ): biểu tượng đồng hồ, trạng thái Chờ mạng để gửi, nút Hủy. Có mạng thì tự gửi lần lượt và hiện thông báo ngắn Đã gửi N thư | TB-07 |
| Đọc ngoại tuyến | Thư đã mở và 200 thư gần nhất được lưu trong trình duyệt để xem khi mất mạng; thao tác lưu trữ, xóa, gắn sao khi ngoại tuyến được xếp hàng và đồng bộ sau; chỗ không có dữ liệu hiện khung Cần kết nối mạng để xem | TB-07 |

### Trạng thái cần vẽ

- Chuông: không có thông báo, có thông báo chưa đọc, danh sách trống
- Thông báo trình duyệt: mẫu tiêu chuẩn, mẫu có nút hành động
- Dải trạng thái: mất kết nối, đang thử lại, đã kết nối lại
- Hộp đi: có thư chờ, đang gửi, gửi lỗi (nút Thử lại)
- Đang xem ngoại tuyến: dải Bạn đang ngoại tuyến, một số thư chưa tải

## Khu vực quản trị

Quản trị dùng bố cục AdminLayout, chỉ vai trò Quản trị mới vào được (người khác bị chuyển sang /403). Bố cục: thanh điều hướng dọc bên trái rộng 220 px (Tổng quan, Người dùng, Hạn mức dung lượng, Vai trò và quyền, Nhật ký kiểm toán, Lưu trữ và xuất thư, Hộp thư dùng chung), header có nhãn Quản trị màu cam và nút Về hộp thư. Vùng nội dung rộng tối đa 1280 px, ưu tiên bảng dữ liệu.

| Trang | Thành phần | Mô tả giao diện và hành vi | Mã chức năng |
| --- | --- | --- | --- |
| Tổng quan (/admin) | Hàng thẻ số liệu | Bốn thẻ: Người dùng hoạt động hôm nay, Thư gửi hôm nay, Dung lượng đã dùng, Yêu cầu chờ xử lý (đặt lại mật khẩu); mỗi thẻ có số lớn, mũi tên và phần trăm so với hôm qua | BM-07 |
| Tổng quan (/admin) | Biểu đồ | Biểu đồ đường Thư mỗi ngày (7, 30, 90 ngày, chọn bằng nút) và biểu đồ cột Dung lượng theo phòng ban, rê chuột hiện giá trị; bảng nhỏ Người dùng gửi nhiều thư nhất | BM-07 |
| Người dùng (/admin/users) | Thanh công cụ | Ô tìm theo tên, email; lọc Phòng ban, Vai trò, Trạng thái (Hoạt động, Bị khóa, Chưa kích hoạt); nút Đồng bộ từ LDAP; nút Tạo người dùng | BM-05 |
| Người dùng (/admin/users) | Bảng | Cột: ô chọn, ảnh và tên, email, phòng ban, vai trò, trạng thái (viên thuốc màu), dung lượng đã dùng (thanh nhỏ), lần đăng nhập cuối, menu ba chấm (Sửa, Gửi lại liên kết kích hoạt, Đặt lại mật khẩu, Khóa hoặc Mở khóa, Đăng xuất mọi thiết bị). Chọn nhiều dòng để khóa, mở khóa hàng loạt. Phân trang cuối bảng | BM-05 |
| Người dùng (/admin/users) | Yêu cầu chờ xử lý | Dải đầu bảng khi có người xin đặt lại mật khẩu: danh sách yêu cầu, nút Duyệt và gửi liên kết, Từ chối | BM-05, TK-03 |
| Người dùng (/admin/users) | Hộp thoại tạo, sửa | Ô Họ tên, Email công ty, Phòng ban (xổ xuống), Chức vụ, Vai trò, Hạn mức dung lượng, công tắc Gửi liên kết kích hoạt ngay; nút Hủy và Lưu | BM-05, TK-01 |
| Người dùng (/admin/users) | Đồng bộ LDAP | Hộp thoại hiện kết quả xem trước: Thêm mới 5, Cập nhật 12, Bị khóa vì đã nghỉ việc 2, kèm nút Xác nhận đồng bộ; xong hiện báo cáo | BM-05 |
| Hạn mức dung lượng (/admin/quotas) | Bảng | Hạn mức mặc định của công ty ở đầu trang (ô nhập GB, nút Lưu). Bảng theo phòng ban và theo người: đã dùng, hạn mức, thanh tiến độ vàng từ 80%, đỏ từ 95%; sửa hạn mức ngay tại ô, chọn nhiều người để đặt cùng một hạn mức | BM-06 |
| Vai trò và quyền (/admin/roles) | Ma trận quyền | Danh sách vai trò bên trái (Quản trị, Truyền thông, Nhân viên, Khách); bên phải là bảng ma trận: hàng là quyền (Gửi thư cho toàn công ty, Tạo hộp thư dùng chung, Xem nhật ký kiểm toán, Quản lý người dùng, Xuất thư), cột là vai trò, mỗi ô là ô tích. Vai trò Quản trị bị khóa không sửa được. Nút Thêm vai trò, Lưu thay đổi | BM-09, NB-05 |
| Nhật ký kiểm toán (/admin/audit) | Bảng | Bộ lọc người thực hiện, loại hành động, khoảng ngày; cột: thời gian, người thực hiện, hành động (Khóa tài khoản, Xuất thư, Đổi vai trò), đối tượng, IP; bấm một dòng mở ngăn bên phải hiện chi tiết trước và sau thay đổi; nút Xuất CSV | BM-08 |
| Lưu trữ và xuất thư (/admin/retention) | Chính sách giữ thư | Thẻ cấu hình: thời gian giữ thư thường (1, 3, 5, 7 năm, mãi mãi), thời gian giữ thư trong Thùng rác (7, 30, 90 ngày), công tắc Giữ pháp lý cho một số người, bản tóm tắt tác động Thư cũ hơn 5 năm: 12.400 thư sẽ bị xóa; nút Lưu | NB-07 |
| Lưu trữ và xuất thư (/admin/retention) | Xuất thư kiểm toán | Form: chọn người (một hoặc nhiều), khoảng ngày, hộp thư; ô lý do bắt buộc (ghi vào nhật ký); nút Yêu cầu xuất. Bảng lịch sử xuất: người yêu cầu, phạm vi, tình trạng (Đang chuẩn bị, Sẵn sàng, Hết hạn), nút Tải về | NB-07, BM-08 |
| Hộp thư dùng chung (/admin/shared-mailboxes) | Bảng và form | Bảng: tên và địa chỉ, số thành viên, số thư chưa có người nhận. Nút Tạo hộp thư mở form: tên, địa chỉ (hotro@...), mô tả, danh sách thành viên có chọn vai trò Chỉ xem hoặc Xử lý, công tắc Tự chia thư luân phiên | NB-02 |
| Quét virus và cảnh báo | Cấu hình trong Tổng quan | Thẻ Thư bị chặn gần đây: danh sách tệp bị chặn vì virus, người gửi, nhận; nút Thả tệp (chỉ quản trị) và Xem chi tiết | BM-02 |

### Trạng thái cần vẽ

- Bảng đang tải (khung xương), trống, lỗi, đang lọc
- Hộp thoại xác nhận cho thao tác nguy hiểm: Khóa tài khoản, Đặt lại mật khẩu, Xóa chính sách giữ thư (gõ lại tên để xác nhận)
- Đang đồng bộ LDAP, đồng bộ lỗi (không kết nối được máy chủ LDAP)
- Ma trận quyền có thay đổi chưa lưu: dải vàng Có thay đổi chưa lưu và nút Hoàn nguyên
- Xuất thư: đang chuẩn bị, sẵn sàng, hết hạn, bị từ chối do thiếu lý do

## Chức năng chỉ có trên Mobile hoặc thể hiện khác trên Web

Có 9 chức năng trong bảng chức năng được viết cho Mobile nhưng trên Web có cách thể hiện khác hoặc không cần; bảng dưới nói rõ phần Figma Web phải vẽ.

| Mã | Chức năng | Trên Mobile | Trên Web (vẽ gì) |
| --- | --- | --- | --- |
| HT-07 | Kéo để làm mới | Kéo xuống danh sách | Nút Làm mới ở thanh công cụ danh sách; thư mới tự hiện nhờ thời gian thực nên ít khi cần bấm |
| HT-11 | Vuốt thao tác tùy chỉnh | Vuốt trái, vuốt phải trên dòng thư | Bốn nút hiện khi rê chuột trên dòng; chọn nút nào hiện ở Cài đặt chung |
| HT-12 | Kéo thả vào nhãn | Không có, dùng menu Chuyển vào | Kéo dòng thư sang nhãn ở thanh bên |
| TK-08 | Sinh trắc học | Vân tay, Face ID | Không áp dụng; thay bằng Xác thực 2 bước và Tin cậy thiết bị 30 ngày |
| TK-09 | Nhiều tài khoản | Bộ chọn ở màn hình chính | Menu ảnh đại diện có Chuyển tài khoản và Thêm tài khoản |
| TB-01 | Thông báo đẩy | Firebase Cloud Messaging | Thông báo của trình duyệt (cần xin quyền) |
| TB-02 | Số thư chưa đọc | Chấm số trên biểu tượng app | Số trong tiêu đề tab và ở mục Inbox |
| TB-07 | Chế độ ngoại tuyến | Lưu cục bộ trong máy | Lưu trong trình duyệt (IndexedDB), giới hạn 200 thư gần nhất |
| CD-07 | Phím tắt | Không có | Bảng phím tắt, bật tắt ở Cài đặt chung |

Chỉ có trên Web: CD-07 (phím tắt), các chức năng quản trị BM-05 đến BM-09 và NB-07.

## Cấu trúc thư mục dự án React

Dự án chia theo tính năng (feature-based): mỗi nhóm chức năng có thư mục riêng chứa trang, thành phần, gọi API và trạng thái; phần dùng chung nằm ở shared. Gợi ý dùng Vite, React, TypeScript và React Router.

```text
mail-web/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                   # điểm vào, gắn React
│   ├── app/
│   │   ├── App.tsx                # gắn Provider, Router
│   │   ├── router.tsx             # khai báo toàn bộ đường dẫn
│   │   ├── providers/             # Query, Theme, I18n, Auth, Socket
│   │   └── guards/                # RequireAuth, RequireAdmin, Require2FA
│   ├── layouts/
│   │   ├── AuthLayout.tsx         # trang xác thực, chia đôi màn hình
│   │   ├── AppShell/              # header, thanh bên, vùng nội dung
│   │   │   ├── AppShell.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ConnectionBanner.tsx
│   │   │   └── PinnedAnnouncement.tsx
│   │   ├── SettingsLayout.tsx     # tab dọc bên trái
│   │   └── AdminLayout.tsx        # điều hướng quản trị
│   ├── features/
│   │   ├── auth/                  # TK-01 đến TK-10
│   │   │   ├── pages/             # LoginPage, ActivatePage, ForgotPasswordPage, Verify2FAPage
│   │   │   ├── components/        # PasswordStrength, OtpInput, SsoButton
│   │   │   ├── api.ts
│   │   │   └── store.ts           # phiên đăng nhập, tài khoản đã thêm
│   │   ├── mailbox/               # HT-01 đến HT-12, NB-05, NB-06
│   │   │   ├── pages/             # MailListPage
│   │   │   ├── components/        # MessageRow, ListToolbar, CategoryTabs, SnoozeDialog, LabelMenu
│   │   │   ├── hooks/             # useMessageList, useSelection, useShortcuts
│   │   │   └── api.ts
│   │   ├── thread/                # DT-01 đến DT-11, NB-03, NB-04
│   │   │   ├── pages/             # ThreadPage
│   │   │   ├── components/        # MessageCard, AttachmentGrid, FileViewer, ReadReceipts, SummaryBox
│   │   │   └── api.ts
│   │   ├── compose/               # SO-01 đến SO-13, NB-01
│   │   │   ├── components/        # ComposeWindow, RecipientInput, Editor, ScheduleMenu, ConfidentialDialog
│   │   │   ├── hooks/             # useDraftAutosave, useUpload, useComposeStack
│   │   │   └── api.ts
│   │   ├── search/                # TM-01 đến TM-09
│   │   │   ├── pages/             # SearchPage
│   │   │   ├── components/        # SearchBox, AdvancedFilter, ResultRow, QueryChips
│   │   │   └── api.ts
│   │   ├── labels/                # NH-01 đến NH-05, NH-09
│   │   │   ├── pages/             # LabelsSettingsPage
│   │   │   └── components/        # LabelTree, LabelDialog, ColorPicker
│   │   ├── filters/               # NH-06 đến NH-08
│   │   │   ├── pages/             # FiltersPage, FilterFormPage
│   │   │   └── components/
│   │   ├── contacts/              # DB-01 đến DB-08
│   │   │   ├── pages/             # ContactsPage, ContactDetailPage, OrgChartPage, GroupsPage
│   │   │   └── components/        # PresenceDot, OrgNode, ExportDialog
│   │   ├── settings/              # CD-01 đến CD-09, SO-09, SO-10
│   │   │   ├── pages/             # General, Account, Signature, Vacation, Notifications, Security, Data
│   │   │   └── components/
│   │   ├── notifications/         # TB-01 đến TB-09
│   │   │   ├── components/        # NotificationBell, NotificationList, PermissionPrompt
│   │   │   └── hooks/             # useSocket, useBrowserNotification, useOfflineQueue
│   │   ├── security/              # BM-01 đến BM-04
│   │   │   └── components/        # PhishingBanner, LinkWarning, BlockedFile, LoginAlert
│   │   └── admin/                 # BM-05 đến BM-09, NB-02, NB-07
│   │       ├── pages/             # Overview, Users, Quotas, Roles, Audit, Retention, SharedMailboxes
│   │       └── components/        # PermissionMatrix, StatCard, UserTable, LdapSyncDialog
│   ├── shared/
│   │   ├── components/            # Button, Input, Dialog, Menu, Snackbar, Skeleton, Avatar, Pill, EmptyState, ErrorState
│   │   ├── hooks/                 # useDebounce, useMediaQuery, useInfiniteList, useUndo
│   │   ├── lib/                   # http (axios), socket, offlineDb (IndexedDB), format ngày giờ, dung lượng
│   │   ├── types/                 # Message, Thread, Label, Contact, User, Role
│   │   └── constants/             # routes, permissions, shortcuts
│   ├── i18n/
│   │   ├── vi.json
│   │   └── en.json
│   ├── styles/
│   │   ├── tokens.css             # màu, chữ, khoảng cách; sáng và tối
│   │   └── global.css
│   └── pages/
│       ├── NotFoundPage.tsx       # 404
│       ├── ForbiddenPage.tsx      # 403
│       └── ServerErrorPage.tsx    # 500
├── .env.example                   # VITE_API_URL, VITE_WS_URL
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Quy ước đặt tên và phụ thuộc

- Mỗi feature chỉ gọi lên shared, không gọi chéo sang feature khác; cần dùng chung thì chuyển vào shared (ví dụ dòng thư dùng ở mailbox, search và contacts nên đặt ở shared hoặc xuất qua index.ts của mailbox)
- Đường dẫn khai báo một nơi duy nhất trong shared/constants/routes để đổi không phải sửa nhiều chỗ
- Mọi màu, cỡ chữ lấy từ tokens.css, khớp với biến trong Figma (CD-01, CD-08)
- Soạn thư không có trang: ComposeWindow gắn ở AppShell và đọc trạng thái từ tham số ?compose= trên địa chỉ

### Thư viện gợi ý

| Việc | Thư viện | Dùng cho |
| --- | --- | --- |
| Khung dự án | Vite, React, TypeScript | Chạy và build |
| Định tuyến | React Router | Bảng đường dẫn, guard, tham số địa chỉ |
| Dữ liệu từ máy chủ | TanStack Query | Danh sách thư, cuộn tải thêm, cập nhật lạc quan cho Hoàn tác |
| Trạng thái cục bộ | Zustand | Phiên đăng nhập, các chọn lựa, cửa sổ soạn |
| Gọi API | Axios | Gắn token, làm mới token khi gặp lỗi 401 |
| Thời gian thực | WebSocket (STOMP hoặc sockjs với Spring) | Thư mới, thu hồi, đã đọc, thông báo |
| Form và kiểm tra | React Hook Form, Zod | Form đăng nhập, bộ lọc, cài đặt |
| Trình soạn thư | TipTap | Soạn thư nhiều định dạng, chữ ký, mẫu thư |
| Danh sách dài | TanStack Virtual | Cuộn mượt khi có hàng nghìn thư |
| Kéo thả | dnd-kit | Kéo thư vào nhãn, sắp xếp |
| Giao diện | Tailwind CSS cùng Radix UI hoặc shadcn/ui | Dialog, Menu, Popover, bộ chọn ngày; dễ khớp với Figma |
| Biểu đồ | Recharts | Trang Tổng quan quản trị |
| Đa ngôn ngữ | react-i18next | Tiếng Việt, tiếng Anh (CD-02) |
| Ngoại tuyến | idb (IndexedDB) và Service Worker | Lưu 200 thư gần nhất, hàng chờ gửi (TB-07) |
| Kiểm thử | Vitest, Testing Library, Playwright | Kiểm thử thành phần và luồng chính |

## Đối chiếu 106 chức năng với trang và thành phần

Cả 106 mã trong bảng chức năng đều có chỗ trong tài liệu này: 11 nhóm, mỗi nhóm trỏ tới trang hoặc thành phần chứa nó và thư mục React tương ứng.

| Nhóm | Số mã | Mã | Nằm ở trang hoặc thành phần | Thư mục React |
| --- | --- | --- | --- | --- |
| Tài khoản và xác thực | 10 | TK-01 đến TK-10 | Trang xác thực (TK-01 đến TK-03, TK-06, TK-07); menu ảnh đại diện (TK-04, TK-09); Cài đặt, Tài khoản (TK-05); Cài đặt, Bảo mật (TK-07, TK-10). TK-08 chỉ có trên Mobile | features/auth, features/settings |
| Hộp thư và danh sách thư | 12 | HT-01 đến HT-12 | Thanh bên của khung chung (HT-01); trang Danh sách thư (HT-02 đến HT-12). HT-07 là nút Làm mới trên Web | features/mailbox, layouts/AppShell |
| Đọc thư và hội thoại | 11 | DT-01 đến DT-11 | Trang Đọc thư; trình xem tệp (DT-07) | features/thread |
| Soạn và gửi thư | 13 | SO-01 đến SO-13 | Cửa sổ soạn thư (SO-01 đến SO-08, SO-10 đến SO-13); Cài đặt, Chữ ký và mẫu thư (SO-09, SO-10) | features/compose, features/settings |
| Nhãn, thư mục và bộ lọc | 9 | NH-01 đến NH-09 | Thanh bên (NH-03); Cài đặt, Nhãn (NH-01 đến NH-05); Cài đặt, Bộ lọc (NH-06 đến NH-08); menu ba chấm của thư (NH-09) | features/labels, features/filters |
| Tìm kiếm | 9 | TM-01 đến TM-09 | Ô tìm kiếm ở header (TM-01, TM-03, TM-06, TM-07); trang Tìm kiếm (TM-02, TM-04, TM-05, TM-08, TM-09) | features/search |
| Thông báo và thời gian thực | 9 | TB-01 đến TB-09 | Chuông và dải trạng thái trong khung chung; Cài đặt, Thông báo (TB-04, TB-08) | features/notifications |
| Danh bạ | 8 | DB-01 đến DB-08 | Bốn trang danh bạ; chấm trạng thái dùng khắp app (DB-08) | features/contacts |
| Cài đặt | 9 | CD-01 đến CD-09 | Chín tab của SettingsLayout; phím tắt (CD-07) là hộp thoại toàn app | features/settings |
| Bảo mật và quản trị | 9 | BM-01 đến BM-09 | Trang Đọc thư (BM-01, BM-02); Cài đặt, Bảo mật (BM-03, BM-04); AdminLayout (BM-05 đến BM-09) | features/security, features/admin |
| Chức năng riêng của mail nội bộ | 7 | NB-01 đến NB-07 | Ô Đến của cửa sổ soạn (NB-01); hộp thư dùng chung (NB-02); trang Đọc thư (NB-03, NB-04); dải ghim đầu Inbox (NB-05); chip Cần xử lý (NB-06); quản trị, Lưu trữ và xuất thư (NB-07) | features/compose, features/thread, features/admin |

### Việc cần làm tiếp

- Dựng design system trong Figma trước: màu, chữ, nút, ô nhập, dòng thư, viên thuốc nhãn, hộp thoại, thanh thông báo ngắn
- Vẽ theo thứ tự ưu tiên ở bảng chức năng: AppShell, Danh sách thư, Đọc thư, Soạn thư, rồi các trang còn lại
- Mỗi trang vẽ đủ các trạng thái đã liệt kê (đang tải, trống, lỗi) và hai chế độ sáng, tối
- Nối prototype theo bảng quy tắc chuyển hướng và sơ đồ luồng ở trên
- Chốt với đội Java về hợp đồng API trước khi dựng React, vì các trạng thái đang tải và lỗi của từng trang phụ thuộc vào đó
