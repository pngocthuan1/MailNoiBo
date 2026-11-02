# Bảng chức năng app Mail (Web + Mobile)

Oct 29, 2026 · @Phạm Vân Nam

App mail nội bộ công ty gồm 11 nhóm chức năng, mỗi chức năng chia hai cấp là Cơ bản (làm trước) và Nâng cao; cột cuối ghi phần giao diện cần vẽ trên Figma. Web làm bằng React và vẽ trước, Mobile làm bằng Flutter sau, cùng dùng một backend Java.

## Màn hình cần vẽ trên Figma

Có 15 màn hình chính; Web (React) vẽ trước, Mobile (Flutter) vẽ sau nhưng dùng chung một design system (màu, chữ, icon, nút).

| Mã | Màn hình | Nền tảng | Nội dung chính |
| --- | --- | --- | --- |
| M01 | Giới thiệu (onboarding) | Mobile | 3 slide giới thiệu, nút Bắt đầu |
| M02 | Đăng nhập | Web + Mobile | Email công ty, mật khẩu, ghi nhớ, nút Đăng nhập SSO |
| M03 | Kích hoạt tài khoản | Web + Mobile | Đặt mật khẩu lần đầu từ liên kết admin gửi, kiểm tra độ mạnh |
| M04 | Quên và đặt lại mật khẩu | Web + Mobile | Gửi yêu cầu cho admin hoặc nhận mã qua email phụ, đặt mật khẩu mới |
| M05 | Xác thực 2 bước | Web + Mobile | Nhập mã OTP, gửi lại mã, mã dự phòng |
| M06 | Hộp thư chính (Inbox) | Web + Mobile | Thanh bên, danh sách thư, tab phân loại, dải thông báo toàn công ty. Thư đã gửi, nháp, spam, thùng rác và hộp thư dùng chung dùng lại cùng bố cục |
| M07 | Đọc thư và hội thoại | Web + Mobile | Nội dung thư, chuỗi hội thoại, tệp đính kèm, thanh thao tác, danh sách người đã đọc |
| M08 | Soạn thư | Web + Mobile | Web: cửa sổ nổi góc dưới phải. Mobile: toàn màn hình |
| M09 | Tìm kiếm và lọc nâng cao | Web + Mobile | Ô tìm kiếm, gợi ý, bảng lọc theo người gửi, ngày, nhãn, tệp |
| M10 | Quản lý nhãn | Web + Mobile | Tạo, đổi tên, đổi màu, xóa nhãn |
| M11 | Danh bạ công ty | Web + Mobile | Danh sách đồng nghiệp, sơ đồ phòng ban, hồ sơ chi tiết |
| M12 | Cài đặt | Web + Mobile | Giao diện, chữ ký, trả lời tự động, thông báo |
| M13 | Bộ lọc và quy tắc tự động | Web + Mobile | Tạo quy tắc: điều kiện, rồi hành động |
| M14 | Thiết bị và bảo mật tài khoản | Web + Mobile | Thiết bị đang đăng nhập, lịch sử, đổi mật khẩu |
| M15 | Quản trị (admin) | Web | Quản lý người dùng, hạn mức dung lượng, nhật ký |

## Bố cục tổng thể

Web chia 3 cột (thanh bên, danh sách, khung đọc); Mobile dùng một cột và chuyển màn hình.

| Thành phần | Web (desktop, tablet) | Mobile |
| --- | --- | --- |
| Điều hướng | Thanh bên trái: Inbox, Gắn sao, Đã gửi, Nháp, Spam, Thùng rác, danh sách nhãn; thu gọn được | Menu hamburger mở ngăn kéo trái; thanh dưới tối đa 4 mục |
| Thanh trên | Ô tìm kiếm rộng, chuông thông báo, cài đặt, ảnh đại diện | Ô tìm kiếm trên cùng, ảnh đại diện góc phải |
| Danh sách thư | Cột giữa, mỗi dòng: ô chọn, sao, người gửi, tiêu đề, đoạn xem trước, giờ | Danh sách toàn màn hình, mỗi dòng: ảnh đại diện chữ cái, người gửi, tiêu đề, giờ, sao |
| Đọc thư | Khung bên phải, hoặc mở toàn trang | Màn hình riêng, nút quay lại |
| Soạn thư | Cửa sổ nổi góc dưới phải, thu nhỏ, phóng to | Màn hình riêng, tự lưu nháp |
| Thao tác nhanh | Hiện khi rê chuột: lưu trữ, xóa, đã đọc, hoãn | Vuốt trái và vuốt phải trên dòng thư |
| Nút chính | Nút Soạn thư to ở thanh bên | Nút tròn nổi (FAB) góc dưới phải |
| Giao diện | Sáng và tối, mật độ dòng thoải mái, vừa, gọn | Sáng và tối, theo cài đặt máy |

## 1. Tài khoản và xác thực

Nhóm này gồm 5 chức năng cơ bản và 5 chức năng nâng cao; tài khoản do admin tạo, không cho tự đăng ký.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| TK-01 | Kích hoạt tài khoản | Admin tạo tài khoản, người dùng nhận liên kết và đặt mật khẩu lần đầu | Cơ bản | Form đặt mật khẩu, thanh độ mạnh mật khẩu, báo liên kết hết hạn |
| TK-02 | Đăng nhập | Email công ty và mật khẩu, có tùy chọn ghi nhớ | Cơ bản | Form, trạng thái sai mật khẩu, đang tải |
| TK-03 | Quên mật khẩu | Gửi yêu cầu cho admin hoặc nhận mã qua email phụ, rồi đặt mật khẩu mới | Cơ bản | Form yêu cầu, trạng thái chờ admin, màn mật khẩu mới |
| TK-04 | Đăng xuất | Thoát khỏi thiết bị hiện tại | Cơ bản | Menu ảnh đại diện |
| TK-05 | Hồ sơ cá nhân | Đổi ảnh đại diện, số điện thoại; tên, phòng ban, chức vụ lấy từ danh sách nhân viên | Cơ bản | Trang hồ sơ, cửa sổ cắt ảnh |
| TK-06 | Đăng nhập SSO công ty | Dùng tài khoản LDAP, Azure AD hoặc Google Workspace của công ty | Nâng cao | Nút Đăng nhập bằng tài khoản công ty, màn chuyển hướng |
| TK-07 | Xác thực 2 bước | Mã OTP qua SMS, ứng dụng xác thực hoặc mã dự phòng | Nâng cao | Màn bật, quét mã QR, nhập mã, hiển thị mã dự phòng |
| TK-08 | Sinh trắc học | Mở app bằng vân tay hoặc Face ID | Nâng cao | Cửa sổ xin quyền, màn khóa app (Mobile) |
| TK-09 | Nhiều tài khoản | Thêm và chuyển đổi giữa các tài khoản | Nâng cao | Bộ chọn tài khoản ở ảnh đại diện |
| TK-10 | Quản lý thiết bị | Xem thiết bị đang đăng nhập, đăng xuất từ xa | Nâng cao | Danh sách thiết bị, nút Đăng xuất thiết bị này |

## 2. Hộp thư và danh sách thư

Đây là màn hình dùng nhiều nhất; nhóm gồm 7 chức năng cơ bản và 5 chức năng nâng cao.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| HT-01 | Hộp thư mặc định | Inbox, Gắn sao, Đã gửi, Nháp, Spam, Thùng rác, kèm số thư chưa đọc | Cơ bản | Thanh bên, mục đang chọn, số đếm |
| HT-02 | Danh sách thư | Cuộn để tải thêm, thư chưa đọc in đậm | Cơ bản | Dòng thư đã đọc, chưa đọc, có tệp đính kèm; trạng thái trống, đang tải, lỗi mạng |
| HT-03 | Chọn nhiều thư | Chọn tất cả hoặc từng thư để thao tác hàng loạt | Cơ bản | Thanh công cụ đổi khi có thư được chọn |
| HT-04 | Gắn sao, đã đọc, chưa đọc | Đánh dấu nhanh trên từng dòng | Cơ bản | Biểu tượng sao, nút trên thanh công cụ |
| HT-05 | Lưu trữ, xóa, khôi phục | Xóa chuyển vào Thùng rác; khôi phục hoặc xóa vĩnh viễn | Cơ bản | Nút thao tác, hộp xác nhận xóa vĩnh viễn |
| HT-06 | Hoàn tác | Thanh thông báo ngắn có nút Hoàn tác sau mỗi thao tác | Cơ bản | Thanh thông báo (snackbar) dưới màn hình |
| HT-07 | Kéo để làm mới | Kéo xuống để tải thư mới | Cơ bản | Biểu tượng tải (Mobile) |
| HT-08 | Tab phân loại | Tự chia thư thành Chính, Mạng xã hội, Quảng cáo | Nâng cao | Hàng tab phía trên danh sách |
| HT-09 | Hoãn thư (snooze) | Ẩn thư và nhắc lại vào giờ đã chọn | Nâng cao | Bảng chọn giờ: sáng mai, cuối tuần, chọn ngày giờ |
| HT-10 | Thư quan trọng | Hệ thống gợi ý thư quan trọng, người dùng sửa được | Nâng cao | Biểu tượng quan trọng, mục Quan trọng ở thanh bên |
| HT-11 | Vuốt thao tác tùy chỉnh | Chọn hành động khi vuốt trái, vuốt phải | Nâng cao | Màu nền và biểu tượng lúc vuốt, màn chọn hành động trong Cài đặt |
| HT-12 | Kéo thả vào nhãn | Kéo thư sang nhãn ở thanh bên | Nâng cao | Trạng thái đang kéo, vùng thả sáng lên (Web) |

## 3. Đọc thư và hội thoại

Nhóm gồm 6 chức năng cơ bản và 5 chức năng nâng cao.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| DT-01 | Xem nội dung thư | Hiển thị người gửi, người nhận, giờ, tiêu đề, thân thư | Cơ bản | Phần đầu thư, thân thư, thanh thao tác phía trên |
| DT-02 | Hội thoại theo chuỗi | Các thư cùng chủ đề gộp một chuỗi, thư cũ thu gọn | Cơ bản | Thư thu gọn (một dòng) và thư mở rộng, số thư trong chuỗi |
| DT-03 | Trả lời, trả lời tất cả, chuyển tiếp | Ba nút ở cuối thư và trên thanh thao tác | Cơ bản | Ba nút, ô trả lời nhanh dưới chuỗi |
| DT-04 | Tệp đính kèm | Xem tên, dung lượng, tải về từng tệp hoặc tải tất cả | Cơ bản | Thẻ tệp theo loại (PDF, ảnh, Word), nút tải |
| DT-05 | Chi tiết người gửi và người nhận | Bấm để xem đầy đủ Từ, Đến, CC, BCC, kèm phòng ban và chức vụ | Cơ bản | Bảng chi tiết mở rộng |
| DT-06 | Chuyển nhãn, báo cáo thư | Chuyển thư sang nhãn khác, báo cáo thư cho quản trị viên | Cơ bản | Menu thả xuống nhãn có ô chọn, nút Báo cáo |
| DT-07 | Xem trước tệp trong app | Mở ảnh và PDF không cần tải về | Nâng cao | Trình xem toàn màn hình, nút phóng to, chuyển tệp kế tiếp |
| DT-08 | Dịch thư | Dịch thân thư sang ngôn ngữ đã chọn | Nâng cao | Dải gợi ý dịch, bảng chọn ngôn ngữ |
| DT-09 | In và xuất thư | In thư hoặc lưu thành tệp .eml | Nâng cao | Mục trong menu ba chấm |
| DT-10 | Gợi ý trả lời nhanh | 3 câu trả lời ngắn gợi ý ở cuối thư | Nâng cao | Ba nút gợi ý (chip) |
| DT-11 | Tóm tắt thư dài | Tóm tắt chuỗi thư thành vài dòng | Nâng cao | Khung tóm tắt phía trên chuỗi, nút mở rộng |

## 4. Soạn và gửi thư

Nhóm gồm 6 chức năng cơ bản và 7 chức năng nâng cao.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| SO-01 | Soạn thư mới | Các ô Đến, CC, BCC, Tiêu đề, Nội dung | Cơ bản | Cửa sổ soạn, ô CC/BCC ẩn và hiện, trạng thái thu nhỏ và phóng to |
| SO-02 | Gợi ý người nhận | Gõ vài chữ thì hiện danh sách liên hệ phù hợp | Cơ bản | Danh sách gợi ý, thẻ người nhận (chip), địa chỉ sai định dạng |
| SO-03 | Đính kèm tệp | Chọn tệp hoặc kéo thả; có giới hạn dung lượng | Cơ bản | Thẻ tệp, thanh tiến trình, báo lỗi quá dung lượng |
| SO-04 | Tự lưu nháp | Tự lưu mỗi vài giây, có thể mở lại từ mục Nháp | Cơ bản | Dòng chữ Đã lưu nháp, hộp xác nhận khi thoát |
| SO-05 | Định dạng chữ | Đậm, nghiêng, gạch chân, danh sách, liên kết, màu chữ | Cơ bản | Thanh định dạng |
| SO-06 | Gửi và hủy | Kiểm tra thiếu người nhận hoặc tiêu đề trước khi gửi | Cơ bản | Nút Gửi, hộp cảnh báo, trạng thái đang gửi |
| SO-07 | Hoàn tác gửi | Giữ thư vài giây (5 đến 30 giây) để kịp thu hồi | Nâng cao | Thanh thông báo Đã gửi, nút Hoàn tác |
| SO-08 | Hẹn giờ gửi | Chọn ngày giờ để thư tự gửi | Nâng cao | Menu cạnh nút Gửi, bảng chọn ngày giờ, mục Đã lên lịch |
| SO-09 | Chữ ký | Chữ ký riêng, tự chèn vào thư mới | Nâng cao | Trình soạn chữ ký trong Cài đặt, bản xem trước |
| SO-10 | Mẫu thư | Lưu thư soạn sẵn để dùng lại | Nâng cao | Danh sách mẫu, nút Chèn mẫu |
| SO-11 | Chèn ảnh, emoji, bảng | Ảnh trong nội dung, bộ emoji | Nâng cao | Bảng chọn emoji, khung ảnh có tay kéo đổi cỡ |
| SO-12 | Chế độ bảo mật | Đặt hạn xem, yêu cầu mã, cấm chuyển tiếp | Nâng cao | Hộp thoại cài đặt, dải biểu tượng khóa trên thư |
| SO-13 | Nhiều cửa sổ soạn | Soạn nhiều thư cùng lúc, chế độ toàn màn hình | Nâng cao | Các cửa sổ xếp ngang ở đáy trang (Web) |

## 5. Nhãn, thư mục và bộ lọc

Nhóm gồm 4 chức năng cơ bản và 5 chức năng nâng cao; phần bộ lọc là điểm làm app mail khác app nhắn tin.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| NH-01 | Tạo, đổi tên, xóa nhãn | Quản lý nhãn của riêng người dùng | Cơ bản | Hộp thoại tạo nhãn, trang quản lý nhãn, xác nhận xóa |
| NH-02 | Gắn nhiều nhãn cho một thư | Một thư có thể có nhiều nhãn | Cơ bản | Menu chọn nhãn có ô tích, nhãn hiện cạnh tiêu đề thư |
| NH-03 | Xem thư theo nhãn | Bấm nhãn ở thanh bên để lọc danh sách | Cơ bản | Mục nhãn ở thanh bên, danh sách theo nhãn |
| NH-04 | Màu nhãn | Chọn màu cho từng nhãn | Cơ bản | Bảng chọn màu, nhãn dạng viên thuốc (pill) |
| NH-05 | Nhãn lồng nhau | Nhãn con nằm trong nhãn cha | Nâng cao | Cây nhãn thu gọn và mở rộng ở thanh bên |
| NH-06 | Bộ lọc tự động | Nếu thư thỏa điều kiện thì gắn nhãn, bỏ qua Inbox, đánh dấu đã đọc hoặc xóa | Nâng cao | Form điều kiện và hành động, danh sách bộ lọc đã tạo |
| NH-07 | Tạo bộ lọc từ một thư | Từ thư đang mở, tạo bộ lọc theo người gửi hoặc tiêu đề | Nâng cao | Mục trong menu ba chấm, form điền sẵn |
| NH-08 | Áp dụng cho thư cũ | Chạy bộ lọc mới trên các thư đã có | Nâng cao | Ô tích Áp dụng cho N thư hiện có |
| NH-09 | Tắt tiếng chuỗi thư | Ngừng thông báo cho chuỗi thư dài nhưng vẫn nhận thư | Nâng cao | Mục Tắt tiếng trong menu ba chấm, biểu tượng loa gạch chéo trên dòng thư |

## 6. Tìm kiếm

Nhóm gồm 4 chức năng cơ bản và 5 chức năng nâng cao.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| TM-01 | Tìm theo từ khóa | Tìm trong tiêu đề, người gửi, người nhận, nội dung | Cơ bản | Ô tìm kiếm khi chưa bấm, đang gõ, có từ khóa |
| TM-02 | Kết quả tìm kiếm | Danh sách thư khớp, từ khóa được tô sáng | Cơ bản | Dòng kết quả có chữ tô sáng, trạng thái không có kết quả |
| TM-03 | Lịch sử tìm kiếm | Hiện các từ khóa đã tìm gần đây, xóa được | Cơ bản | Danh sách gợi ý khi vừa bấm vào ô tìm kiếm |
| TM-04 | Tìm trong một nhãn | Giới hạn phạm vi: Inbox, Đã gửi, một nhãn | Cơ bản | Bộ chọn phạm vi cạnh ô tìm kiếm |
| TM-05 | Bộ lọc nâng cao | Lọc theo Từ, Đến, ngày, có tệp, dung lượng, nhãn | Nâng cao | Bảng lọc thả xuống (Web), màn lọc toàn màn hình (Mobile) |
| TM-06 | Toán tử tìm kiếm | Gõ nhanh như from:an, has:attachment, before:2026-01-01 | Nâng cao | Gợi ý cú pháp dưới ô tìm kiếm |
| TM-07 | Gợi ý khi gõ | Gợi ý người gửi, nhãn, từ khóa phổ biến | Nâng cao | Danh sách gợi ý nhiều nhóm (người, nhãn, từ khóa) |
| TM-08 | Lưu tìm kiếm thành bộ lọc | Biến một lần tìm thành bộ lọc tự động | Nâng cao | Nút Tạo bộ lọc ở cuối bảng lọc |
| TM-09 | Tìm trong tệp đính kèm | Tìm chữ bên trong PDF, Word | Nâng cao | Nhãn Khớp trong tệp trên dòng kết quả |

## 7. Thông báo và thời gian thực

Nhóm gồm 4 chức năng cơ bản và 5 chức năng nâng cao.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| TB-01 | Thông báo đẩy thư mới | Báo trên điện thoại khi có thư mới | Cơ bản | Mẫu thông báo: người gửi, tiêu đề, đoạn đầu thư |
| TB-02 | Số thư chưa đọc | Số đếm trên biểu tượng app và tiêu đề tab trình duyệt | Cơ bản | Biểu tượng có chấm số, tiêu đề tab kiểu (3) Inbox |
| TB-03 | Thư mới tự hiện | Thư mới xuất hiện đầu danh sách không cần tải lại | Cơ bản | Dòng thư mới có hiệu ứng nổi bật ngắn, dải Có thư mới |
| TB-04 | Bật tắt thông báo | Công tắc trong Cài đặt | Cơ bản | Mục thông báo trong Cài đặt có công tắc |
| TB-05 | Thông báo trình duyệt | Web push khi đang mở tab khác | Nâng cao | Hộp xin quyền thông báo, mẫu thông báo web |
| TB-06 | Báo mất kết nối | Hiện trạng thái offline, tự thử lại khi có mạng | Nâng cao | Dải cảnh báo mất kết nối phía trên |
| TB-07 | Chế độ ngoại tuyến | Đọc thư đã tải, thư soạn lúc offline tự gửi khi có mạng | Nâng cao | Mục Chờ gửi trong Hộp đi, biểu tượng đồng hồ trên thư |
| TB-08 | Giờ yên lặng, chỉ thư quan trọng | Tắt thông báo theo giờ hoặc theo loại thư | Nâng cao | Bộ chọn giờ, tùy chọn lọc loại thông báo |
| TB-09 | Thao tác ngay trên thông báo | Nút Lưu trữ, Trả lời, Đánh dấu đã đọc | Nâng cao | Mẫu thông báo mở rộng có nút hành động |

## 8. Danh bạ

Nhóm gồm 3 chức năng cơ bản và 5 chức năng nâng cao; danh bạ lấy tự động từ danh sách nhân viên của công ty.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| DB-01 | Danh bạ công ty | Tự lấy từ danh sách nhân viên, xếp theo chữ cái hoặc phòng ban | Cơ bản | Danh sách có ảnh đại diện chữ cái, thanh chữ A-Z (Mobile), trạng thái trống |
| DB-02 | Hồ sơ đồng nghiệp | Tên, phòng ban, chức vụ, email, số điện thoại | Cơ bản | Trang chi tiết, nút Soạn thư nhanh |
| DB-03 | Tìm đồng nghiệp | Tìm theo tên, email hoặc phòng ban | Cơ bản | Ô tìm kiếm, kết quả khi gõ |
| DB-04 | Sơ đồ tổ chức | Xem cây phòng ban và người quản lý trực tiếp | Nâng cao | Sơ đồ cây có thu gọn, mở rộng |
| DB-05 | Nhóm liên hệ cá nhân | Tạo nhóm riêng, gửi thư cho cả nhóm | Nâng cao | Danh sách nhóm, chọn nhiều người, thẻ nhóm ở ô Đến |
| DB-06 | Xuất danh bạ | Xuất danh sách nhóm hoặc phòng ban ra tệp CSV | Nâng cao | Hộp thoại xuất, báo kết quả |
| DB-07 | Lịch sử thư với một người | Xem các thư đã trao đổi với đồng nghiệp | Nâng cao | Tab Thư trên trang chi tiết |
| DB-08 | Trạng thái đồng nghiệp | Online, đang bận, vắng mặt kèm ngày quay lại | Nâng cao | Chấm trạng thái cạnh ảnh đại diện, dòng vắng mặt trong hồ sơ |

## 9. Cài đặt

Nhóm gồm 4 chức năng cơ bản và 5 chức năng nâng cao; trên Web nên chia tab bên trái, trên Mobile chia danh sách mục.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| CD-01 | Giao diện sáng, tối | Chọn sáng, tối hoặc theo hệ thống | Cơ bản | Bộ chọn 3 lựa chọn có ảnh xem trước |
| CD-02 | Ngôn ngữ | Chọn tiếng Việt, tiếng Anh | Cơ bản | Danh sách ngôn ngữ |
| CD-03 | Đổi mật khẩu | Nhập mật khẩu cũ và mới | Cơ bản | Form, thanh độ mạnh mật khẩu |
| CD-04 | Dung lượng lưu trữ | Hiện đã dùng bao nhiêu trên hạn mức admin đặt | Cơ bản | Thanh tiến độ, cảnh báo sắp đầy |
| CD-05 | Trả lời tự động | Tự trả lời khi vắng mặt, chọn khoảng ngày | Nâng cao | Form có công tắc, bộ chọn ngày, nội dung trả lời |
| CD-06 | Mật độ hiển thị | Thoải mái, vừa, gọn cho danh sách thư | Nâng cao | 3 phiên bản dòng thư |
| CD-07 | Phím tắt | Phím tắt kiểu j/k để chuyển thư, c để soạn | Nâng cao | Bảng liệt kê phím tắt (Web) |
| CD-08 | Chủ đề màu, hình nền | Đổi màu nhấn hoặc ảnh nền | Nâng cao | Bảng chọn chủ đề có ảnh xem trước |
| CD-09 | Tải dữ liệu của tôi | Xuất toàn bộ thư và tệp của riêng mình | Nâng cao | Hộp xác nhận, báo khi tệp sẵn sàng |

## 10. Bảo mật và quản trị

Cả 9 chức năng đều thuộc cấp Nâng cao; từ BM-05 đến BM-09 chỉ có trên Web, dành cho quản trị viên.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| BM-01 | Cảnh báo thư giả mạo | Báo thư giả tên lãnh đạo hoặc đồng nghiệp, cảnh báo trước khi bấm liên kết | Nâng cao | Dải cảnh báo màu đỏ trên thư, hộp xác nhận khi bấm liên kết lạ |
| BM-02 | Quét virus tệp đính kèm | Quét tệp trước khi cho tải, chặn tệp nguy hiểm | Nâng cao | Nhãn Tệp bị chặn, thông báo lý do |
| BM-03 | Nhật ký hoạt động tài khoản | Lịch sử đăng nhập: giờ, thiết bị, địa điểm | Nâng cao | Bảng lịch sử đăng nhập |
| BM-04 | Cảnh báo đăng nhập lạ | Báo qua email và trong app khi có thiết bị lạ | Nâng cao | Thẻ cảnh báo Có phải bạn không, nút Đúng, Không phải tôi |
| BM-05 | Quản lý người dùng | Tạo, khóa, mở khóa, đặt lại mật khẩu; đồng bộ từ LDAP hoặc danh sách nhân viên | Nâng cao | Bảng người dùng có tìm kiếm, lọc, thao tác từng dòng |
| BM-06 | Hạn mức dung lượng | Đặt dung lượng cho từng người hoặc phòng ban | Nâng cao | Form hạn mức, bảng dung lượng đã dùng |
| BM-07 | Thống kê hệ thống | Số thư mỗi ngày, người dùng hoạt động, dung lượng dùng | Nâng cao | Trang tổng quan: thẻ số liệu, biểu đồ đường và cột |
| BM-08 | Nhật ký kiểm toán | Ghi lại thao tác của quản trị viên | Nâng cao | Bảng nhật ký có lọc theo người và thời gian |
| BM-09 | Phân quyền vai trò | Vai trò quản trị, nhân viên, người dùng thường | Nâng cao | Ma trận quyền theo vai trò |

## 11. Chức năng riêng của mail nội bộ

Nhóm gồm 1 chức năng cơ bản và 6 chức năng nâng cao, chỉ có ở mail nội bộ.

| Mã | Chức năng | Mô tả | Cấp | Cần vẽ trên Figma |
| --- | --- | --- | --- | --- |
| NB-01 | Gửi cho phòng ban, nhóm | Gõ tên phòng ban ở ô Đến, hệ thống tự mở thành danh sách người | Cơ bản | Thẻ nhóm có số người, bấm để xem thành viên |
| NB-02 | Hộp thư dùng chung | Địa chỉ chung như hotro, nhiều người cùng xem và xử lý | Nâng cao | Hộp thư dùng chung ở thanh bên, nhãn Đang xử lý kèm ảnh đại diện người nhận việc |
| NB-03 | Biên nhận đã đọc | Người gửi xem ai đã đọc thư và lúc nào | Nâng cao | Dấu tích trên thư đã gửi, bảng danh sách người đã đọc |
| NB-04 | Thu hồi thư đã gửi | Rút lại thư khi người nhận chưa đọc | Nâng cao | Nút Thu hồi, trạng thái thu hồi thành công hoặc không thể |
| NB-05 | Thông báo toàn công ty | Quản trị hoặc truyền thông gửi thư ghim, có thể yêu cầu xác nhận đã đọc | Nâng cao | Dải thông báo ghim đầu Inbox, nút Tôi đã đọc |
| NB-06 | Đánh dấu cần xử lý | Gắn hạn xử lý cho thư, nhắc khi gần đến hạn | Nâng cao | Nhãn Cần xử lý, bộ chọn hạn, mục Cần xử lý ở thanh bên |
| NB-07 | Lưu trữ và xuất thư kiểm toán | Đặt thời gian giữ thư, xuất thư theo người và khoảng ngày (Web, quản trị) | Nâng cao | Trang cấu hình thời gian giữ, form xuất, báo tiến độ |

## Trạng thái cần vẽ và thứ tự ưu tiên

Tổng cộng có 106 chức năng (44 cơ bản, 62 nâng cao); nên vẽ trọn bộ cơ bản trước rồi mới thêm nâng cao.

Mọi màn hình nên có đủ các trạng thái sau, để lập trình viên không phải đoán:

- Đang tải (khung xương skeleton thay vì vòng xoay)
- Trống (ví dụ Inbox không có thư, kèm hình minh họa và một câu hướng dẫn)
- Lỗi mạng và lỗi máy chủ (kèm nút Thử lại)
- Thành công và hoàn tác (thanh thông báo ngắn)
- Rê chuột, đang chọn, bị vô hiệu hóa, đang tập trung bàn phím
- Giao diện sáng và tối cho từng màn hình
- Kích thước khung gợi ý: Web 1440 và 1024, tablet 768, Mobile 390

| Giai đoạn | Nội dung | Số chức năng |
| --- | --- | --- |
| 1. Bản chạy được (MVP) | Toàn bộ chức năng Cơ bản (nhóm 1 đến 9 và NB-01), làm trên Web (React) trước | 44 |
| 2. Dùng thoải mái | Nâng cao hay dùng: TK-06, TK-07, HT-08, HT-09, SO-07, SO-08, SO-09, NH-06, NH-07, TM-05, TB-05, TB-06, DB-04, CD-05, NB-03, NB-04; đồng thời bắt đầu Mobile (Flutter) bản Cơ bản | 16 |
| 3. Hoàn thiện | Phần Nâng cao còn lại, gồm nhóm Bảo mật và quản trị | 46 |
