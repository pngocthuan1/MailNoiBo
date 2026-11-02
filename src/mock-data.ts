// Toàn bộ dữ liệu giả lập của ứng dụng (không có backend).

export type Department = { id: string; name: string }

export type Employee = {
  id: string
  name: string
  email: string
  title: string
  departmentId: string
  phone: string
  status: "online" | "busy" | "offline" | "away"
}

export type Label = {
  id: string
  name: string
  /** Chỉ số màu nhãn 1..8, trỏ tới biến CSS --label-N */
  color: number
  parentId?: string
}

export type FolderId = "inbox" | "starred" | "snoozed" | "important" | "sent" | "drafts" | "scheduled" | "todo" | "spam" | "trash"

export type Folder = { id: FolderId; name: string }

export type SharedMailbox = { id: string; name: string; email: string }

export type MailCategory = "primary" | "social" | "promo"

export type Email = {
  id: string
  threadId: string
  /** Hộp thư gốc của thư */
  folder: FolderId
  /** Hộp thư trước khi vào Thùng rác / Spam, dùng để khôi phục */
  prevFolder?: FolderId
  from: string
  to: string[]
  subject: string
  preview: string
  /** Mốc thời gian (ms) */
  ts: number
  unread: boolean
  starred: boolean
  important: boolean
  /** Hệ thống gợi ý là quan trọng (biểu tượng nhạt hơn) */
  importantSuggested: boolean
  category: MailCategory
  labelIds: string[]
  hasAttachment: boolean
  threadCount: number
  archived?: boolean
  snoozedUntil?: number
  scheduledAt?: number
  /** Hạn xử lý (Cần xử lý) */
  todoDue?: number
  mailboxId?: string
  /** Hộp thư dùng chung: người đang xử lý (mã nhân viên), trống nếu chưa ai nhận */
  assigneeId?: string
  /** Số người nhận đã đọc (biên nhận đã đọc, chỉ cho thư đã gửi) */
  readBy?: number
  /** Chuỗi bị tắt tiếng */
  muted?: boolean
  /** Thư tạo từ cửa sổ soạn: nội dung nằm trong kho thư (sentMessages) */
  composed?: boolean
  /** Số thư gốc của chuỗi (trước khi tôi trả lời thêm) */
  baseCount?: number
  /** Chuỗi có thư tôi đã gửi: thời điểm và người nhận của thư gửi gần nhất (hiện trong Đã gửi) */
  sentTs?: number
  sentTo?: string[]
  /** Nội dung nháp để mở lại trong cửa sổ soạn */
  draft?: DraftPayload
  /** Thư bảo mật (SO-12) */
  confidential?: ConfidentialInfo
}

export type ConfidentialInfo = {
  /** Ngày hết hạn (null = không hết hạn) */
  expiresAt: number | null
  /** Chặn chuyển tiếp, sao chép, in và tải về */
  restricted: boolean
  /** Mã xác thực 6 chữ số (null = không yêu cầu) */
  accessCode: string | null
}

export type ComposeRecipient = {
  kind: "person"
  email: string
  name: string
  valid: boolean
} | {
  kind: "group"
  id: string
  name: string
  members: { name: string; email: string }[]
}

export type ComposeAttachment = {
  id: string
  name: string
  size: number
  kind: "image" | "pdf" | "doc" | "sheet" | "zip" | "other"
  /** 0-100 */
  progress: number
  status: "uploading" | "done" | "error"
  error?: string
  /** Mô phỏng: tệp này sẽ lỗi khi tải lên đến 60% */
  willFail?: boolean
}

export type DraftPayload = {
  to: ComposeRecipient[]
  cc: ComposeRecipient[]
  bcc: ComposeRecipient[]
  bodyHtml: string
  quotedHtml?: string
  attachments: ComposeAttachment[]
  replyThreadId?: string
  mode?: "reply" | "replyAll" | "forward"
}

export type AppNotification = {
  id: string
  kind: "mail" | "security" | "deadline" | "announcement"
  text: string
  time: string
  unread: boolean
  actorId?: string
}

export type Announcement = {
  id: string
  title: string
  body: string
  threadId: string
}

export const company = {
  name: "Hoàng Long Group",
  appName: "Mail Hoàng Long",
  domain: "hoanglong.vn",
}

export const departments: Department[] = [
  { id: "bgd", name: "Ban Giám đốc" },
  { id: "kt", name: "Kế toán" },
  { id: "ns", name: "Nhân sự" },
  { id: "kd", name: "Kinh doanh" },
  { id: "cntt", name: "Công nghệ thông tin" },
  { id: "mkt", name: "Marketing" },
  { id: "pc", name: "Pháp chế" },
  { id: "vh", name: "Vận hành" },
]

export const employees: Employee[] = [
  {
    id: "e01",
    name: "Nguyễn Thị Minh Anh",
    email: "anh.nguyen@hoanglong.vn",
    title: "Chuyên viên Kế toán tổng hợp",
    departmentId: "kt",
    phone: "0903 112 345",
    status: "online",
  },
  {
    id: "e02",
    name: "Trần Quốc Bảo",
    email: "bao.tran@hoanglong.vn",
    title: "Giám đốc Kinh doanh",
    departmentId: "kd",
    phone: "0912 234 567",
    status: "busy",
  },
  {
    id: "e03",
    name: "Lê Hoàng Dũng",
    email: "dung.le@hoanglong.vn",
    title: "Trưởng phòng Công nghệ thông tin",
    departmentId: "cntt",
    phone: "0987 345 678",
    status: "online",
  },
  {
    id: "e04",
    name: "Phạm Thu Hà",
    email: "ha.pham@hoanglong.vn",
    title: "Trưởng phòng Nhân sự",
    departmentId: "ns",
    phone: "0935 456 789",
    status: "away",
  },
  {
    id: "e05",
    name: "Võ Thanh Hương",
    email: "huong.vo@hoanglong.vn",
    title: "Chuyên viên Marketing",
    departmentId: "mkt",
    phone: "0976 567 890",
    status: "online",
  },
  {
    id: "e06",
    name: "Đặng Văn Khoa",
    email: "khoa.dang@hoanglong.vn",
    title: "Kỹ sư phần mềm cao cấp",
    departmentId: "cntt",
    phone: "0966 678 901",
    status: "offline",
  },
  {
    id: "e07",
    name: "Bùi Ngọc Lan",
    email: "lan.bui@hoanglong.vn",
    title: "Chuyên viên Pháp chế",
    departmentId: "pc",
    phone: "0944 789 012",
    status: "online",
  },
  {
    id: "e08",
    name: "Hoàng Gia Minh",
    email: "minh.hoang@hoanglong.vn",
    title: "Tổng Giám đốc",
    departmentId: "bgd",
    phone: "0901 890 123",
    status: "busy",
  },
  {
    id: "e09",
    name: "Đỗ Thị Ngọc",
    email: "ngoc.do@hoanglong.vn",
    title: "Kế toán trưởng",
    departmentId: "kt",
    phone: "0918 901 234",
    status: "online",
  },
  {
    id: "e10",
    name: "Ngô Thanh Phong",
    email: "phong.ngo@hoanglong.vn",
    title: "Quản lý Vận hành",
    departmentId: "vh",
    phone: "0985 012 345",
    status: "offline",
  },
  {
    id: "e11",
    name: "Vũ Thị Quỳnh",
    email: "quynh.vu@hoanglong.vn",
    title: "Chuyên viên Tuyển dụng",
    departmentId: "ns",
    phone: "0938 123 456",
    status: "online",
  },
  {
    id: "e12",
    name: "Đinh Công Sơn",
    email: "son.dinh@hoanglong.vn",
    title: "Nhân viên Kinh doanh",
    departmentId: "kd",
    phone: "0972 234 567",
    status: "away",
  },
]

// Nhân viên bổ sung để các phòng ban có số người thực tế (gợi ý gửi cho phòng ban / nhóm).
const slugVn = (t: string) =>
  t.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
const moreStaff: [string, string][] = [
  ["kt", "Lương Thị Mai"],
  ["kt", "Trịnh Văn Hải"],
  ["kt", "Phan Thị Thu"],
  ["kt", "Mai Thanh Tùng"],
  ["kt", "Tạ Thị Yến"],
  ["kt", "Cao Minh Đức"],
  ["kt", "Lâm Thị Hoa"],
  ["kt", "Hồ Quốc Việt"],
  ["kt", "Dương Thị Nhung"],
  ["kt", "Châu Văn Lợi"],
  ["kd", "Tô Văn Hiếu"],
  ["kd", "Kiều Thị Trang"],
  ["kd", "Lý Minh Tuấn"],
  ["kd", "Thái Thị Bích"],
  ["kd", "Huỳnh Văn Nam"],
  ["kd", "Diệp Thị Loan"],
  ["ns", "Quách Thị Oanh"],
  ["ns", "Từ Văn Phúc"],
  ["ns", "Âu Thị Hồng"],
  ["cntt", "Chu Văn Long"],
  ["cntt", "Lại Thị Mỹ"],
  ["cntt", "Doãn Minh Quân"],
  ["cntt", "Giang Thị Tuyết"],
  ["mkt", "Văn Thị Ánh"],
  ["mkt", "Khương Văn Bình"],
  ["mkt", "La Thị Cúc"],
  ["pc", "Đoàn Thị Diệp"],
  ["vh", "Mạc Văn Giang"],
  ["vh", "Nghiêm Thị Hạnh"],
  ["vh", "Bạch Văn Khánh"],
]
const statuses: Employee["status"][] = ["online", "busy", "offline", "away"]
moreStaff.forEach(([dep, name], i) => {
  const parts = name.split(" ")
  employees.push({
    id: `e${13 + i}`,
    name,
    email: `${slugVn(parts[parts.length - 1])}.${slugVn(parts[0])}@hoanglong.vn`,
    title:
      dep === "kt"
        ? "Kế toán viên"
        : `Chuyên viên ${departments.find((d) => d.id === dep)!.name}`,
    departmentId: dep,
    phone: `09${String(10 + i).padStart(2, "0")} ${String(300 + i * 7).slice(-3)} ${String(400 + i * 11).slice(-3)}`,
    status: statuses[i % 4],
  })
})

/** Nhóm liên hệ tự tạo (ngoài các nhóm phòng ban) */
export const contactGroups = [
  {
    id: "g-saomai",
    name: "Nhóm Dự án Sao Mai",
    memberIds: ["e06", "e05", "e12", "e07", "e10", "e03"],
  },
  {
    id: "g-lanhdao",
    name: "Ban lãnh đạo",
    memberIds: ["e08", "e09", "e04", "e02", "e03"],
  },
  {
    id: "g-truc",
    name: "Nhóm trực hệ thống",
    memberIds: ["e03", "e06", "e32", "e33", "e34"],
  },
]

/** Người hay liên lạc (xếp trên cùng trong gợi ý người nhận) */
export const frequentContactIds = ["e02", "e09", "e06", "e04", "e05", "e08"]

export const currentUser = {
  ...employees[2],
  role: "admin" as const,
}

export const accounts = [
  { id: currentUser.id, name: currentUser.name, email: currentUser.email },
  { id: "acc2", name: "Hộp thư Dự án Sao Mai", email: "saomai@hoanglong.vn" },
]

export const folders: Folder[] = [
  { id: "inbox", name: "Inbox" },
  { id: "starred", name: "Gắn sao" },
  { id: "snoozed", name: "Đã hoãn" },
  { id: "important", name: "Quan trọng" },
  { id: "sent", name: "Đã gửi" },
  { id: "drafts", name: "Nháp" },
  { id: "scheduled", name: "Đã lên lịch" },
  { id: "todo", name: "Cần xử lý" },
  { id: "spam", name: "Spam" },
  { id: "trash", name: "Thùng rác" },
]

export const labels: Label[] = [
  { id: "du-an", name: "Dự án", color: 6 },
  { id: "du-an-sao-mai", name: "Sao Mai", color: 6, parentId: "du-an" },
  { id: "du-an-hai-dang", name: "Hải Đăng", color: 7, parentId: "du-an" },
  { id: "ke-toan", name: "Kế toán", color: 4 },
  { id: "hoa-don", name: "Hóa đơn", color: 3, parentId: "ke-toan" },
  { id: "hop-dong", name: "Hợp đồng", color: 1 },
  { id: "nhan-su", name: "Nhân sự", color: 8 },
  { id: "khach-hang", name: "Khách hàng", color: 2 },
  { id: "hop-noi-bo", name: "Họp nội bộ", color: 5 },
]

export const sharedMailboxes: SharedMailbox[] = [
  { id: "hotro", name: "Hỗ trợ khách hàng", email: "hotro@hoanglong.vn" },
  { id: "tuyendung", name: "Tuyển dụng", email: "tuyendung@hoanglong.vn" },
  { id: "kinhdoanh", name: "Kinh doanh", email: "kinhdoanh@hoanglong.vn" },
]

export const storage = { usedGb: 12.4, totalGb: 15 }

export const announcement: Announcement = {
  id: "an01",
  title: "Lịch nghỉ Tết Dương lịch 2027 và kế hoạch trực hệ thống",
  body: "Công ty nghỉ từ 01/01 đến 03/01. Các bộ phận vận hành đăng ký lịch trực trước ngày 25/12.",
  threadId: "t-ann-01",
}

export const notifications: AppNotification[] = [
  {
    id: "n1",
    kind: "mail",
    text: 'Thư mới từ Trần Quốc Bảo: "Báo giá gói bảo trì năm 2027"',
    time: "08:42",
    unread: true,
    actorId: "e02",
  },
  {
    id: "n2",
    kind: "security",
    text: "Đăng nhập mới từ Hà Nội, Chrome trên Windows lúc 08:12. Có phải bạn không?",
    time: "08:12",
    unread: true,
  },
  {
    id: "n3",
    kind: "deadline",
    text: 'Thư "Duyệt ngân sách quý I" sắp đến hạn xử lý vào 17:00 hôm nay',
    time: "07:55",
    unread: true,
    actorId: "e09",
  },
  {
    id: "n4",
    kind: "announcement",
    text: "Thông báo toàn công ty: Lịch nghỉ Tết Dương lịch 2027",
    time: "Hôm qua",
    unread: false,
    actorId: "e08",
  },
  {
    id: "n5",
    kind: "mail",
    text: 'Thư mới từ Phạm Thu Hà: "Danh sách phỏng vấn tuần này"',
    time: "Hôm qua",
    unread: false,
    actorId: "e04",
  },
]

export const recentSearches = [
  "báo cáo doanh thu quý III",
  "from:ngoc.do hóa đơn",
  "has:attachment hợp đồng",
  "họp giao ban",
]

const NOW = Date.now()
const HOUR = 3_600_000
const n = (id: string) => employees.find((e) => e.id === id)!.name

type Seed = Partial<Email> & Pick<Email, "from" | "subject" | "preview"> & {
  /** số giờ trước */
  h: number
  /** hạn xử lý: số giờ kể từ bây giờ (âm là quá hạn) */
  due?: number
  /** nhắc lại: số giờ kể từ bây giờ */
  snooze?: number
  /** hẹn gửi: số giờ kể từ bây giờ */
  sched?: number
}

const me = currentUser.name

const seeds: Seed[] = [
  // --- Thông báo toàn công ty (được ghim ở danh sách) ---
  {
    threadId: "t-ann-01",
    from: n("e08"),
    subject: announcement.title,
    preview: announcement.body,
    h: 20,
    unread: true,
    important: true,
  },
  // --- Inbox, tab Chính ---
  {
    threadId: "t-baogia",
    from: n("e02"),
    subject: "Báo giá gói bảo trì năm 2027",
    preview:
      "Anh Dũng xem giúp báo giá đính kèm, khách hàng cần phản hồi trước thứ Sáu.",
    h: 0.5,
    unread: true,
    starred: true,
    important: true,
    labelIds: ["khach-hang"],
    hasAttachment: true,
    threadCount: 3,
    due: 5,
  },
  {
    from: n("e09"),
    subject: "Duyệt ngân sách quý I",
    preview:
      "Kính gửi anh, phòng Kế toán đã tổng hợp ngân sách quý I, mong anh duyệt trong hôm nay.",
    h: 1.2,
    unread: true,
    important: true,
    labelIds: ["ke-toan"],
    hasAttachment: true,
    threadCount: 5,
    due: 3,
  },
  {
    from: n("e04"),
    subject: "Danh sách phỏng vấn tuần này",
    preview:
      "Nhờ phòng CNTT chuẩn bị phòng họp và thiết bị cho 3 buổi phỏng vấn kỹ sư.",
    h: 5,
    labelIds: ["nhan-su"],
  },
  {
    threadId: "t-saomai-server",
    from: n("e06"),
    subject: "Re: Kế hoạch nâng cấp máy chủ dự án Sao Mai",
    preview:
      "Em đã cập nhật lịch triển khai, dự kiến hoàn tất vào cuối tuần sau.",
    h: 8,
    starred: true,
    importantSuggested: true,
    labelIds: ["du-an", "du-an-sao-mai"],
    threadCount: 8,
  },
  {
    threadId: "t-hopdong",
    from: n("e07"),
    subject: "Hợp đồng cung cấp dịch vụ đám mây - bản chỉnh sửa",
    preview: "Chị gửi anh bản hợp đồng đã chỉnh các điều khoản bảo mật và SLA.",
    h: 10,
    unread: true,
    important: true,
    labelIds: ["hop-dong"],
    hasAttachment: true,
    threadCount: 2,
    due: -4,
  },
  {
    from: n("e05"),
    subject: "Cần hỗ trợ cập nhật trang chiến dịch Sao Mai",
    preview:
      "Bên Marketing cần CNTT hỗ trợ gắn mã theo dõi cho trang đích mới.",
    h: 26,
    labelIds: ["du-an-sao-mai"],
    threadCount: 4,
  },
  {
    from: n("e08"),
    subject: "Họp giao ban thứ Hai: chuẩn bị nội dung báo cáo",
    preview:
      "Các trưởng bộ phận gửi nội dung báo cáo trước 16:00 chiều Chủ nhật.",
    h: 28,
    unread: true,
    important: true,
    labelIds: ["hop-noi-bo"],
  },
  {
    from: n("e10"),
    subject: "Lịch bảo trì điều hòa phòng máy chủ",
    preview: "Đơn vị bảo trì sẽ vào phòng máy chủ từ 13:30 đến 16:30 thứ Tư.",
    h: 30,
  },
  {
    from: n("e11"),
    subject: "Hồ sơ ứng viên vị trí Kỹ sư DevOps",
    preview:
      "Gửi anh 4 hồ sơ ứng viên đã qua vòng sơ loại để anh đánh giá chuyên môn.",
    h: 32,
    unread: true,
    labelIds: ["nhan-su"],
    hasAttachment: true,
  },
  {
    from: n("e12"),
    subject: "Đề nghị hỗ trợ cài đặt phần mềm CRM",
    preview:
      "Em mới nhận máy mới, nhờ anh chị hỗ trợ cài đặt phần mềm CRM và VPN.",
    h: 50,
    unread: true,
    labelIds: ["khach-hang"],
  },
  {
    from: n("e01"),
    subject: "Đối chiếu công nợ tháng 10",
    preview:
      "Chị gửi bảng đối chiếu công nợ, nhờ phòng CNTT xác nhận phần hệ thống.",
    h: 54,
    labelIds: ["ke-toan", "hoa-don"],
    hasAttachment: true,
    threadCount: 2,
  },
  {
    from: n("e09"),
    subject: "Nhắc nộp báo cáo thuế GTGT",
    preview:
      "Hạn nộp tờ khai thuế GTGT là ngày 20, các bộ phận gửi số liệu sớm.",
    h: 60,
    labelIds: ["ke-toan"],
    due: 20,
  },
  {
    from: n("e04"),
    subject: "Quy chế làm việc mới áp dụng từ 01/12",
    preview:
      "Phòng Nhân sự gửi toàn thể nhân viên quy chế làm việc sửa đổi để nắm rõ.",
    h: 72,
    hasAttachment: true,
  },
  {
    from: n("e07"),
    subject: "Rà soát điều khoản bảo mật thông tin với đối tác",
    preview:
      "Nhờ anh xem xét phụ lục kỹ thuật trước khi chúng tôi gửi đối tác ký.",
    h: 80,
    importantSuggested: true,
    labelIds: ["hop-dong"],
  },
  {
    from: n("e02"),
    subject: "Re: Phản hồi của khách hàng Vĩnh Phát",
    preview:
      "Khách hàng đồng ý phương án B, đề nghị triển khai thử nghiệm trong tuần.",
    h: 96,
    starred: true,
    labelIds: ["khach-hang"],
    threadCount: 6,
  },
  {
    from: n("e06"),
    subject: "Báo lỗi trên môi trường thử nghiệm",
    preview: "Chức năng xuất báo cáo bị lỗi khi dữ liệu vượt quá 10.000 dòng.",
    h: 110,
    labelIds: ["du-an-hai-dang"],
  },
  {
    from: n("e05"),
    subject: "Kế hoạch truyền thông quý IV",
    preview:
      "Gửi anh bản kế hoạch truyền thông quý IV để phối hợp phần website.",
    h: 120,
    hasAttachment: true,
  },
  {
    from: n("e08"),
    subject: "Chúc mừng công ty đạt mục tiêu doanh thu quý III",
    preview:
      "Thay mặt Ban Giám đốc, tôi cảm ơn nỗ lực của toàn thể anh chị em.",
    h: 140,
  },
  {
    from: n("e10"),
    subject: "Danh sách thiết bị cần thay thế năm 2027",
    preview:
      "Phòng Vận hành tổng hợp danh sách máy tính đã hết khấu hao cần thay mới.",
    h: 160,
    hasAttachment: true,
  },
  {
    from: n("e11"),
    subject: "Lịch đào tạo hội nhập nhân viên mới",
    preview:
      "Buổi hướng dẫn về hệ thống thư và bảo mật dự kiến vào sáng thứ Năm.",
    h: 180,
  },
  {
    from: n("e12"),
    subject: "Báo cáo công tác khách hàng tuần 45",
    preview:
      "Em gửi báo cáo tuần: 12 cuộc gọi, 5 buổi gặp trực tiếp, 2 hợp đồng mới.",
    h: 200,
    labelIds: ["khach-hang"],
    hasAttachment: true,
  },
  {
    from: n("e01"),
    subject: "Xác nhận hóa đơn điện tử tháng 10",
    preview: "Nhờ anh xác nhận 3 hóa đơn dịch vụ đám mây trong tháng 10.",
    h: 260,
    labelIds: ["hoa-don"],
  },
  {
    from: n("e04"),
    subject: "Khảo sát mức độ hài lòng của nhân viên",
    preview: "Mời anh dành 5 phút tham gia khảo sát trước ngày 30/11.",
    h: 300,
  },
  {
    from: n("e09"),
    subject: "Quyết toán tạm ứng công tác phí",
    preview:
      "Đề nghị anh bổ sung chứng từ cho khoản tạm ứng chuyến công tác Đà Nẵng.",
    h: 340,
    hasAttachment: true,
    due: -30,
  },
  {
    from: n("e07"),
    subject: "Biên bản họp với đối tác Phương Nam",
    preview: "Gửi anh biên bản cuộc họp ngày 08/11, nhờ xác nhận các nội dung.",
    h: 400,
    hasAttachment: true,
  },
  {
    from: n("e02"),
    subject: "Chương trình thưởng kinh doanh cuối năm",
    preview: "Bộ phận Kinh doanh đề xuất cơ chế thưởng mới, mời anh góp ý.",
    h: 500,
  },
  // --- Inbox, tab Mạng xã hội ---
  {
    from: "LinkedIn",
    category: "social",
    subject: "Có 5 người đã xem hồ sơ của bạn tuần này",
    preview: "Xem ai đã quan tâm đến hồ sơ của bạn và kết nối với họ.",
    h: 3,
    unread: true,
  },
  {
    from: "Viblo",
    category: "social",
    subject: "Bài viết nổi bật tuần này về bảo mật ứng dụng web",
    preview: "Tổng hợp 10 bài viết hay nhất cộng đồng lập trình viên Việt Nam.",
    h: 20,
    unread: true,
  },
  {
    from: "Hội Tin học Việt Nam",
    category: "social",
    subject: "Mời tham dự hội thảo Chuyển đổi số 2027",
    preview: "Hội thảo diễn ra tại Hà Nội, đăng ký sớm để nhận ưu đãi.",
    h: 70,
  },
  {
    from: "Zalo Official",
    category: "social",
    subject: "Tin nhắn mới từ nhóm CNTT Hoàng Long",
    preview: "Bạn có 12 tin nhắn chưa đọc trong nhóm.",
    h: 150,
  },
  {
    from: "Facebook",
    category: "social",
    subject: "Trang Hoàng Long Group có lượt theo dõi mới",
    preview: "Trang của công ty vừa đạt 5.000 lượt theo dõi.",
    h: 400,
  },
  // --- Inbox, tab Quảng cáo ---
  {
    from: "Grab Business",
    category: "promo",
    subject: "Ưu đãi 30% cho chuyến đi công tác của doanh nghiệp",
    preview: "Áp dụng đến hết 30/11 cho tài khoản doanh nghiệp.",
    h: 4,
    unread: true,
  },
  {
    from: "Vietnam Airlines",
    category: "promo",
    subject: "Vé máy bay nội địa chỉ từ 690.000đ",
    preview: "Đặt vé sớm cho chuyến công tác dịp cuối năm.",
    h: 22,
    unread: true,
  },
  {
    from: "Shopee Doanh nghiệp",
    category: "promo",
    subject: "Mua sắm văn phòng phẩm giảm đến 50%",
    preview: "Hóa đơn VAT đầy đủ cho mọi đơn hàng của doanh nghiệp.",
    h: 90,
  },
  {
    from: "FPT Telecom",
    category: "promo",
    subject: "Nâng cấp đường truyền internet cáp quang cho văn phòng",
    preview: "Tốc độ lên đến 1 Gbps, miễn phí lắp đặt.",
    h: 200,
  },
  {
    from: "Dell Việt Nam",
    category: "promo",
    subject: "Khuyến mãi máy trạm cho doanh nghiệp tháng 11",
    preview: "Giảm đến 15% khi mua từ 10 máy.",
    h: 330,
  },
  // --- Đã gửi ---
  {
    from: me,
    folder: "sent",
    to: [n("e08")],
    subject: "Báo cáo an ninh hệ thống tháng 10",
    preview:
      "Kính gửi Tổng Giám đốc, em xin gửi báo cáo an ninh hệ thống tháng 10.",
    h: 12,
    hasAttachment: true,
    readBy: 1,
  },
  {
    from: me,
    folder: "sent",
    to: [n("e06"), n("e05")],
    subject: "Phân công công việc nâng cấp trang chiến dịch",
    preview:
      "Khoa phụ trách phần máy chủ, Hương phối hợp nội dung với Marketing.",
    h: 40,
    starred: true,
    threadCount: 3,
    readBy: 1,
  },
  {
    from: me,
    folder: "sent",
    to: [n("e09")],
    subject: "Re: Duyệt ngân sách quý I",
    preview:
      "Chị Ngọc ơi, em đã xem sơ bộ, có một vài điểm cần làm rõ về hạng mục máy chủ.",
    h: 70,
    threadCount: 5,
    readBy: 0,
  },
  {
    from: me,
    folder: "sent",
    to: [n("e04"), n("e11")],
    subject: "Re: Danh sách phỏng vấn tuần này",
    preview:
      "Phòng họp tầng 3 đã sẵn sàng, em sẽ kiểm tra thiết bị trước 30 phút.",
    h: 100,
    readBy: 2,
  },
  {
    from: me,
    folder: "sent",
    to: [n("e02")],
    subject: "Xác nhận lịch demo hệ thống với khách hàng",
    preview: "Em xác nhận lịch demo vào 14:00 thứ Năm, phòng họp lớn.",
    h: 190,
    readBy: 1,
  },
  // --- Nháp ---
  {
    from: me,
    folder: "drafts",
    to: [n("e08")],
    subject: "Đề xuất ngân sách nâng cấp hạ tầng 2027",
    preview:
      "Kính gửi Tổng Giám đốc, em xin đề xuất ngân sách nâng cấp hạ tầng...",
    h: 2,
  },
  {
    from: me,
    folder: "drafts",
    to: [n("e10")],
    subject: "Kế hoạch di chuyển phòng máy chủ",
    preview:
      "Anh Phong ơi, bên em dự kiến di chuyển phòng máy chủ vào cuối tháng...",
    h: 26,
  },
  {
    from: me,
    folder: "drafts",
    to: [],
    subject: "",
    preview: "Chào các bạn, nhắc lại về việc đổi mật khẩu định kỳ...",
    h: 72,
  },
  // --- Đã lên lịch ---
  {
    from: me,
    folder: "scheduled",
    to: [n("e04"), n("e11")],
    subject: "Lịch trực hệ thống dịp Tết Dương lịch",
    preview: "Kính gửi anh chị, dưới đây là lịch trực hệ thống dịp nghỉ lễ.",
    h: 6,
    sched: 20,
  },
  {
    from: me,
    folder: "scheduled",
    to: [n("e01")],
    subject: "Chúc mừng sinh nhật chị Minh Anh",
    preview: "Chúc chị một tuổi mới thật nhiều niềm vui và sức khỏe!",
    h: 8,
    sched: 50,
  },
  // --- Đã hoãn (nằm trong Inbox khi hết hoãn) ---
  {
    from: n("e12"),
    subject: "Đăng ký thiết bị cho nhân viên thử việc",
    preview: "Nhờ anh hỗ trợ cấp laptop cho hai bạn thử việc bắt đầu thứ Hai.",
    h: 35,
    snooze: 3,
    labelIds: ["nhan-su"],
  },
  {
    from: n("e10"),
    subject: "Kiểm kê tài sản CNTT cuối năm",
    preview: "Phòng Vận hành đề nghị gửi danh sách tài sản trước ngày 15/12.",
    h: 60,
    snooze: 20,
    hasAttachment: true,
  },
  {
    from: n("e05"),
    subject: "Ý tưởng banner cho trang chủ mới",
    preview: "Hương gửi 3 phương án banner để anh chọn khi có thời gian.",
    h: 90,
    snooze: 70,
  },
  // --- Spam ---
  {
    from: "ngan-hang-xyz.top",
    folder: "spam",
    subject: "KHẨN: Tài khoản của bạn sẽ bị khóa trong 24 giờ",
    preview:
      "Nhấn vào liên kết bên dưới để xác minh thông tin đăng nhập ngay...",
    h: 7,
    unread: true,
  },
  {
    from: "Trúng thưởng 2027",
    folder: "spam",
    subject: "Chúc mừng bạn đã trúng thưởng iPhone 17",
    preview: "Điền thông tin cá nhân để nhận quà trong hôm nay.",
    h: 48,
    unread: true,
  },
  {
    from: "seo-gia-re.vn",
    folder: "spam",
    subject: "Dịch vụ SEO top 1 Google chỉ 500.000đ",
    preview: "Cam kết hiệu quả, thanh toán sau khi lên top.",
    h: 150,
  },
  // --- Thùng rác ---
  {
    from: n("e10"),
    folder: "trash",
    prevFolder: "inbox",
    subject: "Thông báo cúp điện tòa nhà",
    preview: "Tòa nhà sẽ cúp điện từ 22:00 đến 05:00 để bảo trì hệ thống điện.",
    h: 24,
  },
  {
    from: n("e05"),
    folder: "trash",
    prevFolder: "inbox",
    subject: "Re: Mời tham gia buổi chụp ảnh đồng phục",
    preview: "Lịch chụp ảnh đồng phục dời sang tuần sau.",
    h: 100,
  },
  {
    from: "Tiki",
    folder: "trash",
    prevFolder: "inbox",
    category: "promo",
    subject: "Săn sale 11.11 giảm sốc",
    preview: "Hàng ngàn ưu đãi đang chờ bạn.",
    h: 200,
  },
  {
    from: n("e12"),
    folder: "trash",
    prevFolder: "inbox",
    subject: "Lịch chơi bóng đá giao hữu",
    preview: "Đội bóng phòng Kinh doanh hẹn giao hữu vào chiều thứ Bảy.",
    h: 300,
  },
  // --- Chuỗi mẫu cho trang Đọc thư ---
  {
    threadId: "t-sao-mai-meeting",
    from: me,
    folder: "sent",
    to: [n("e06"), n("e05"), n("e12"), n("e07"), n("e10")],
    subject: "Họp rà soát tiến độ dự án Sao Mai - 14:00 thứ Năm",
    preview:
      "Kính gửi các anh chị, tôi xin gửi lịch họp rà soát tiến độ dự án Sao Mai.",
    h: 3,
    readBy: 3,
    threadCount: 2,
    labelIds: ["du-an-sao-mai"],
  },
  {
    threadId: "t-en-renewal",
    from: "Michael Tran",
    subject: "Renewal of cloud hosting agreement - action required by Nov 30",
    preview:
      "Dear Mr. Dung, our current cloud hosting agreement expires on December 31...",
    h: 2,
    unread: true,
    labelIds: ["hop-dong"],
  },
  {
    threadId: "t-fake-ceo",
    from: n("e08"),
    subject: "Gấp: chuyển khoản thanh toán hợp đồng trong hôm nay",
    preview:
      "Dũng, tôi đang họp với đối tác nước ngoài, cần anh xử lý gấp một lệnh chuyển khoản...",
    h: 0.2,
    unread: true,
  },
  {
    threadId: "t-erp-62",
    from: n("e06"),
    subject: "Nhật ký trao đổi triển khai hệ thống ERP giai đoạn 2",
    preview:
      "Em cập nhật kết quả kiểm thử module kho, còn 3 lỗi mức trung bình.",
    h: 6,
    threadCount: 62,
    labelIds: ["du-an-hai-dang"],
  },
  // --- Thư bảo mật (SO-12) ---
  {
    threadId: "t-confidential-active",
    from: n("e08"),
    subject: "Thông tin mật: Kế hoạch tái cơ cấu tổ chức",
    preview: "[Thư bảo mật] Nội dung này yêu cầu mã xác thực để xem.",
    h: 1,
    unread: true,
    confidential: {
      expiresAt: NOW + 30 * 24 * HOUR,
      restricted: true,
      accessCode: "123456",
    },
  },
  {
    threadId: "t-confidential-expired",
    from: n("e02"),
    subject: "Báo giá đặc biệt (đã hết hạn)",
    preview: "[Thư bảo mật hết hạn]",
    h: 200,
    confidential: {
      expiresAt: NOW - 24 * HOUR,
      restricted: true,
      accessCode: null,
    },
  },
  // --- Hộp thư dùng chung ---
  {
    from: "Công ty CP Thành Đạt",
    mailboxId: "kinhdoanh",
    subject: "Yêu cầu báo giá 50 giấy phép phần mềm",
    preview: "Chúng tôi cần báo giá 50 giấy phép kèm gói hỗ trợ 12 tháng.",
    h: 15,
    assigneeId: "e02",
  },
  {
    from: "Hoàng Minh Châu",
    mailboxId: "kinhdoanh",
    subject: "Đặt lịch demo giải pháp quản lý kho",
    preview: "Mong được đặt lịch demo vào tuần sau cho đội ngũ 8 người.",
    h: 44,
    assigneeId: "e12",
  },
  {
    from: "Công ty TNHH Vĩnh Phát",
    mailboxId: "hotro",
    subject: "Yêu cầu hỗ trợ: không đăng nhập được cổng khách hàng",
    preview: "Chúng tôi không thể đăng nhập từ sáng nay, mong sớm được hỗ trợ.",
    h: 1,
    unread: true,
  },
  {
    from: "Nguyễn Văn Tuấn",
    mailboxId: "hotro",
    subject: "Hỏi về gói bảo hành thiết bị",
    preview:
      "Xin cho biết thời hạn bảo hành và chi phí gia hạn của gói Premium.",
    h: 6,
    unread: true,
    assigneeId: "e02",
  },
  {
    from: "Trần Thị Mai",
    mailboxId: "hotro",
    subject: "Re: Xuất hóa đơn điều chỉnh",
    preview: "Cảm ơn bên mình, tôi đã nhận được hóa đơn điều chỉnh.",
    h: 30,
    assigneeId: "e12",
  },
  {
    from: "Lê Quang Huy",
    mailboxId: "tuyendung",
    subject: "Ứng tuyển vị trí Chuyên viên Marketing",
    preview: "Kính gửi Quý công ty, tôi xin gửi hồ sơ ứng tuyển kèm CV.",
    h: 9,
    unread: true,
    hasAttachment: true,
  },
  {
    from: "Phạm Thị Lan",
    mailboxId: "tuyendung",
    subject: "Ứng tuyển vị trí Kế toán tổng hợp",
    preview:
      "Tôi có 4 năm kinh nghiệm kế toán tổng hợp tại doanh nghiệp sản xuất.",
    h: 52,
    hasAttachment: true,
    assigneeId: "e11",
  },
]

export const emails: Email[] = seeds.map(
  ({ h, due, snooze, sched, ...rest }, i) => ({
    id: `m${i + 1}`,
    threadId: `t${i + 1}`,
    folder: "inbox",
    to: [me],
    category: "primary",
    unread: false,
    starred: false,
    important: false,
    importantSuggested: false,
    labelIds: [],
    hasAttachment: false,
    threadCount: 1,
    ts: NOW - h * HOUR,
    todoDue: due === undefined ? undefined : NOW + due * HOUR,
    snoozedUntil: snooze === undefined ? undefined : NOW + snooze * HOUR,
    scheduledAt: sched === undefined ? undefined : NOW + sched * HOUR,
    ...rest,
  }),
)

// ---------------------------------------------------------------------------
// Nội dung các chuỗi thư (trang Đọc thư). Chuỗi không có dữ liệu riêng sẽ được
// tạo tự động từ dòng thư (xem features/thread-view/getMessages.ts).
// ---------------------------------------------------------------------------

export type Person = { name: string; email: string }

export type Attachment = {
  id: string
  name: string
  size: number
  kind: "image" | "pdf" | "doc" | "sheet" | "zip" | "other"
  /** Số trang (PDF) */
  pages?: number
  /** Lý do bị chặn (virus); tệp bị chặn không thể tải về */
  blocked?: string
}

export type Message = {
  id: string
  from: Person
  to: Person[]
  cc?: Person[]
  bcc?: Person[]
  ts: number
  html: string
  /** Phần trích dẫn thư cũ, ẩn sau nút "..." */
  quoted?: string
  attachments?: Attachment[]
  language?: "vi" | "en"
  /** Bản dịch tiếng Việt (cho thư tiếng Anh) */
  translationVi?: string
  unread?: boolean
  /** Thư tôi gửi: người nhận kèm giờ đọc (không có readAt là chưa đọc) */
  receipts?: { name: string; readAt?: number }[]
  /** Người gửi giả danh ai (cảnh báo giả mạo) */
  impersonates?: string
}

export type ThreadExtra = { summary?: string[]; smartReplies?: string[] }

const P = (id: string): Person => {
  const e = employees.find((x) => x.id === id)!
  return { name: e.name, email: e.email }
}
const ME = P("e03")
const T = (hoursAgo: number) => NOW - hoursAgo * HOUR

const quote = (who: string, when: string, text: string) =>
  `<p>Vào ${when}, ${who} đã viết:</p><blockquote><p>${text}</p></blockquote>`

const clauses = Array.from(
  { length: 14 },
  (_, i) =>
    `<p><strong>Điều ${i + 1}.</strong> Bên B cam kết cung cấp dịch vụ đám mây theo đúng mức cam kết chất lượng (SLA) 99,95% mỗi tháng. Trường hợp gián đoạn vượt mức cam kết, Bên B hoàn lại chi phí tương ứng vào kỳ thanh toán kế tiếp, đồng thời chịu trách nhiệm báo cáo nguyên nhân và biện pháp khắc phục trong vòng 48 giờ kể từ khi sự cố được xử lý xong. Mọi thay đổi về phạm vi dịch vụ phải được hai bên xác nhận bằng văn bản trước khi áp dụng.</p>`,
).join("")

const erpTexts = [
  "Em cập nhật kết quả kiểm thử module kho: 41/44 ca đạt, còn 3 lỗi mức trung bình.",
  "Anh đã xem, nhờ em ưu tiên lỗi tính tồn kho theo lô trước.",
  "Em đã sửa lỗi tồn kho theo lô, đang chạy lại bộ kiểm thử hồi quy.",
  "Phòng Vận hành xin bổ sung báo cáo nhập xuất tồn theo ngày, định dạng Excel.",
  "Báo cáo nhập xuất tồn em sẽ đưa vào bản phát hành thứ Sáu.",
  "Kế toán cần đối chiếu giá vốn bình quân, nhờ CNTT xác nhận công thức đang dùng.",
  "Công thức giá vốn bình quân gia quyền đã được xác nhận với chị Ngọc.",
  "Môi trường UAT đã sẵn sàng, mời các phòng ban vào kiểm tra từ 14:00.",
]
const erpPeople = ["e06", "e03", "e06", "e10", "e06", "e09", "e06", "e03"]

export const threadMessages: Record<string, Message[]> = {
  // Chuỗi có tệp đính kèm: ảnh, PDF, tệp bị chặn vì virus
  "t-baogia": [
    {
      id: "t-baogia-0",
      from: P("e02"),
      to: [ME],
      cc: [P("e12")],
      ts: T(52),
      html: "<p>Anh Dũng thân mến,</p><p>Khách hàng Vĩnh Phát đề nghị gia hạn gói bảo trì hạ tầng thêm 12 tháng. Bên em sẽ gửi báo giá chi tiết trong hôm nay.</p><p>Trân trọng,<br>Quốc Bảo</p>",
    },
    {
      id: "t-baogia-1",
      from: ME,
      to: [P("e02")],
      ts: T(40),
      receipts: [{ name: P("e02").name, readAt: T(39) }],
      html: "<p>Chào Bảo,</p><p>Anh đồng ý gia hạn, nhờ em gửi kèm bảng so sánh chi phí giữa gói hiện tại và gói mới nhé.</p>",
      quoted: quote(
        "Quốc Bảo",
        "08:10 hôm kia",
        "Khách hàng Vĩnh Phát đề nghị gia hạn gói bảo trì hạ tầng thêm 12 tháng.",
      ),
    },
    {
      id: "t-baogia-2",
      from: P("e02"),
      to: [ME],
      cc: [P("e12")],
      ts: T(0.5),
      unread: true,
      html:
        "<p>Anh Dũng xem giúp báo giá đính kèm, khách hàng cần phản hồi trước thứ Sáu.</p>" +
        "<table><tr><th>Hạng mục</th><th>Gói hiện tại</th><th>Gói đề xuất</th></tr>" +
        "<tr><td>Giám sát 24/7</td><td>Có</td><td>Có</td></tr><tr><td>Thời gian xử lý sự cố</td><td>4 giờ</td><td>2 giờ</td></tr>" +
        "<tr><td>Chi phí / năm</td><td>420.000.000đ</td><td>468.000.000đ</td></tr></table>" +
        "<p>Em đính kèm biểu đồ chi phí, báo giá chi tiết và bảng giá dạng Excel.</p><p>Trân trọng,<br>Quốc Bảo</p>",
      quoted: quote(
        "Lê Hoàng Dũng",
        "09:30 hôm qua",
        "Anh đồng ý gia hạn, nhờ em gửi kèm bảng so sánh chi phí.",
      ),
      attachments: [
        {
          id: "a1",
          name: "bao-gia-bao-tri-ha-tang-2027.pdf",
          size: 1_240_000,
          kind: "pdf",
          pages: 4,
        },
        {
          id: "a2",
          name: "bieu-do-so-sanh-chi-phi-3-nam.png",
          size: 348_000,
          kind: "image",
        },
        {
          id: "a3",
          name: "bang-gia-chi-tiet-cap-nhat.xlsm",
          size: 912_000,
          kind: "sheet",
          blocked:
            "Phát hiện mã độc (Trojan.Script.Macro). Tệp đã bị chặn để bảo vệ tài khoản của bạn.",
        },
        {
          id: "a4",
          name: "phu-luc-dieu-khoan-ky-thuat.docx",
          size: 86_000,
          kind: "doc",
        },
      ],
    },
  ],
  // Chuỗi dài: 8 thư
  "t-saomai-server": [
    [
      "e06",
      60,
      "Chào anh Dũng, em đề xuất nâng cấp máy chủ ứng dụng Sao Mai từ 8 lên 16 vCPU trước đợt chiến dịch cuối năm.<ul><li>Tăng RAM từ 32 lên 64 GB</li><li>Chuyển cơ sở dữ liệu sang ổ NVMe</li><li>Bổ sung bản sao lưu hằng giờ</li></ul>",
    ],
    [
      "e03",
      56,
      "Anh đồng ý hướng này. Khoa dự trù thời gian ngừng dịch vụ giúp anh nhé, mình phải báo trước cho Marketing.",
    ],
    [
      "e06",
      50,
      "Dự kiến ngừng dịch vụ 45 phút vào 23:00 thứ Bảy. Em sẽ sao lưu toàn bộ cơ sở dữ liệu trước đó.",
    ],
    [
      "e05",
      44,
      "Bên Marketing chấp nhận khung giờ này, nhưng chiến dịch email bắt đầu 07:00 Chủ nhật nên mong hệ thống ổn định trước đó.",
    ],
    [
      "e10",
      38,
      "Phòng Vận hành sẽ bố trí bảo vệ và điện dự phòng tại phòng máy chủ trong đêm nâng cấp.",
    ],
    [
      "e06",
      20,
      "Cập nhật: em đã chạy thử trên môi trường staging, thời gian di chuyển dữ liệu thực tế khoảng 32 phút.",
    ],
    ["e03", 12, "Tốt. Nhớ chuẩn bị phương án quay lui nếu quá 60 phút nhé."],
    [
      "e06",
      8,
      "Em đã cập nhật lịch triển khai, dự kiến hoàn tất vào cuối tuần sau.",
    ],
  ].map(([id, h, text], i, arr) => {
    const from = P(id as string)
    const mine = id === "e03"
    return {
      id: `t-saomai-server-${i}`,
      from,
      to: mine ? [P("e06"), P("e05")] : [ME],
      cc: i === 3 ? [P("e06")] : undefined,
      ts: T(h as number),
      html: `<p>${text}</p>`,
      unread: i === 5,
      receipts: mine
        ? [
            { name: P("e06").name, readAt: T(h as number - 1) },
            { name: P("e05").name, readAt: T(h as number - 2) },
          ]
        : undefined,
      quoted:
        i === arr.length - 1
          ? quote(
              "Lê Hoàng Dũng",
              "09:00 hôm qua",
              "Tốt. Nhớ chuẩn bị phương án quay lui nếu quá 60 phút nhé.",
            )
          : undefined,
    } satisfies Message
  }),
  // Thư rất dài (cắt kèm nút "Xem toàn bộ thư")
  "t-hopdong": [
    {
      id: "t-hopdong-0",
      from: P("e07"),
      to: [ME],
      ts: T(30),
      html: "<p>Anh Dũng,</p><p>Chị gửi anh dự thảo hợp đồng để rà soát phần kỹ thuật trước khi chuyển Ban Giám đốc.</p>",
    },
    {
      id: "t-hopdong-1",
      from: P("e07"),
      to: [ME],
      ts: T(10),
      unread: true,
      html: `<p>Chị gửi anh bản hợp đồng đã chỉnh các điều khoản bảo mật và SLA. Toàn văn các điều khoản liên quan như sau:</p>${clauses}<p>Mong anh xem và phản hồi trước chiều thứ Năm.</p>`,
      attachments: [
        {
          id: "h1",
          name: "hop-dong-dich-vu-dam-may-ban-chinh-sua.pdf",
          size: 2_050_000,
          kind: "pdf",
          pages: 6,
        },
      ],
    },
  ],
  // Thư tôi gửi, có biên nhận đã đọc 3 trên 5
  "t-sao-mai-meeting": [
    {
      id: "t-sao-mai-meeting-0",
      from: ME,
      to: [P("e06"), P("e05"), P("e12"), P("e07"), P("e10")],
      ts: T(3),
      html: "<p>Kính gửi các anh chị,</p><p>Tôi xin gửi lịch họp rà soát tiến độ dự án Sao Mai:</p><ul><li>Thời gian: 14:00 thứ Năm</li><li>Địa điểm: Phòng họp tầng 3</li><li>Nội dung: tiến độ nâng cấp máy chủ, kế hoạch kiểm thử, phân công nhân sự</li></ul><p>Đề nghị các anh chị chuẩn bị số liệu báo cáo của bộ phận mình.</p><p>Trân trọng,<br>Lê Hoàng Dũng</p>",
      receipts: [
        { name: P("e06").name, readAt: T(2.6) },
        { name: P("e05").name, readAt: T(2.2) },
        { name: P("e12").name, readAt: T(1.4) },
        { name: P("e07").name },
        { name: P("e10").name },
      ],
    },
    {
      id: "t-sao-mai-meeting-1",
      from: P("e06"),
      to: [ME],
      cc: [P("e05")],
      ts: T(2.5),
      html: "<p>Em nhận được, em sẽ chuẩn bị báo cáo phần máy chủ và gửi trước 12:00 thứ Năm.</p>",
      quoted: quote(
        "Lê Hoàng Dũng",
        "09:00 hôm nay",
        "Tôi xin gửi lịch họp rà soát tiến độ dự án Sao Mai...",
      ),
    },
  ],
  // Thư tiếng Anh
  "t-en-renewal": [
    {
      id: "t-en-renewal-0",
      from: { name: "Michael Tran", email: "michael.tran@cloudpartners.io" },
      to: [ME],
      ts: T(2),
      language: "en",
      unread: true,
      html: "<p>Dear Mr. Dung,</p><p>Our current cloud hosting agreement with Hoang Long Group expires on <strong>December 31</strong>. To avoid any interruption to your services, we kindly ask you to confirm the renewal by <strong>November 30</strong>.</p><p>The renewal includes:</p><ul><li>99.95% uptime guarantee</li><li>Dedicated technical account manager</li><li>A 7% discount for a 24-month commitment</li></ul><p>Please let me know if you would like to schedule a call to go through the details.</p><p>Best regards,<br>Michael Tran<br>Cloud Partners</p>",
      translationVi:
        "<p>Kính gửi anh Dũng,</p><p>Hợp đồng lưu trữ đám mây hiện tại của chúng tôi với Hoàng Long Group sẽ hết hạn vào <strong>ngày 31 tháng 12</strong>. Để dịch vụ của anh không bị gián đoạn, chúng tôi đề nghị anh xác nhận gia hạn trước <strong>ngày 30 tháng 11</strong>.</p><p>Gói gia hạn bao gồm:</p><ul><li>Cam kết hoạt động 99,95%</li><li>Chuyên viên kỹ thuật phụ trách riêng</li><li>Giảm 7% khi cam kết 24 tháng</li></ul><p>Nếu anh muốn đặt lịch trao đổi chi tiết, xin vui lòng cho tôi biết.</p><p>Trân trọng,<br>Michael Tran<br>Cloud Partners</p>",
    },
  ],
  // Người gửi giả danh Tổng Giám đốc
  "t-fake-ceo": [
    {
      id: "t-fake-ceo-0",
      from: { name: "Hoàng Gia Minh", email: "minh.hoang@hoanglong-vn.top" },
      to: [ME],
      ts: T(0.2),
      unread: true,
      impersonates: "Hoàng Gia Minh (Tổng Giám đốc)",
      html: '<p>Dũng,</p><p>Tôi đang họp với đối tác nước ngoài nên không nghe máy được. Cần anh xử lý gấp một lệnh chuyển khoản thanh toán hợp đồng ngay trong hôm nay, tuyệt đối giữ kín với các phòng ban khác.</p><p>Chi tiết lệnh chuyển khoản ở đây: <a href="https://thanh-toan-hoanglong.top/xac-nhan?id=8841">Xác nhận lệnh chuyển khoản</a></p><p>Hoặc đăng nhập cổng nội bộ để duyệt: <a href="https://hoanglong-vn.top/login">https://hoanglong.vn/portal</a></p><p>Hoàng Gia Minh<br>Tổng Giám đốc</p>',
    },
  ],
  // Chuỗi rất dài: 62 thư
  "t-erp-62": Array.from({ length: 62 }, (_, i): Message => {
    const id = erpPeople[i % erpPeople.length]
    const mine = id === "e03"
    return {
      id: `t-erp-62-${i}`,
      from: P(id),
      to: mine ? [P("e06")] : [ME],
      ts: T(240 - i * 3.8),
      html: `<p>[${i + 1}/62] ${erpTexts[i % erpTexts.length]}</p>`,
      unread: i === 61,
      receipts: mine
        ? [{ name: P("e06").name, readAt: T(239 - i * 3.8) }]
        : undefined,
    }
  }),
  // Thư bảo mật (SO-12) - đang hoạt động, yêu cầu mã
  "t-confidential-active": [
    {
      id: "t-confidential-active-0",
      from: P("e08"),
      to: [ME],
      ts: T(1),
      html: "<p>Anh Dũng,</p><p>Đây là thông tin mật về kế hoạch tái cơ cấu tổ chức nội bộ năm 2027. Vui lòng giữ bí mật tuyệt đối và không chia sẻ với bất kỳ ai ngoài nhóm lãnh đạo cấp cao.</p><p>Chi tiết cụ thể sẽ được trình bày tại cuộc họp kín vào thứ Sáu.</p><p>Trân trọng,<br>Hoàng Gia Minh</p>",
    },
  ],
  // Thư bảo mật đã hết hạn
  "t-confidential-expired": [
    {
      id: "t-confidential-expired-0",
      from: P("e02"),
      to: [ME],
      ts: T(200),
      html: "<p>Nội dung báo giá đặc biệt đã hết hạn.</p>",
    },
  ],
}

export const threadExtras: Record<string, ThreadExtra> = {
  "t-saomai-server": {
    summary: [
      "Khoa đề xuất nâng cấp máy chủ ứng dụng Sao Mai lên 16 vCPU và 64 GB RAM trước chiến dịch cuối năm.",
      "Cả nhóm thống nhất ngừng dịch vụ khoảng 45 phút lúc 23:00 thứ Bảy, Vận hành lo điện dự phòng.",
      "Thử nghiệm trên môi trường staging mất khoảng 32 phút, cần chuẩn bị phương án quay lui.",
    ],
    smartReplies: [
      "Đồng ý với lịch triển khai.",
      "Nhờ em gửi kế hoạch quay lui chi tiết.",
      "Cảm ơn Khoa, anh đã nắm.",
    ],
  },
  "t-erp-62": {
    summary: [
      "Nhóm đang kiểm thử module kho của hệ thống ERP giai đoạn 2, 41/44 ca đã đạt.",
      "Các yêu cầu bổ sung: báo cáo nhập xuất tồn theo ngày và đối chiếu giá vốn bình quân với Kế toán.",
      "Môi trường UAT đã sẵn sàng để các phòng ban kiểm tra từ 14:00.",
    ],
  },
  "t-baogia": {
    smartReplies: [
      "Cảm ơn Bảo, anh sẽ xem trong hôm nay.",
      "Anh đồng ý với báo giá này.",
      "Em làm rõ giúp anh khoản chi phí gói 2 giờ.",
    ],
  },
  "t-en-renewal": {
    smartReplies: [
      "Cảm ơn anh Michael, chúng tôi sẽ xác nhận trước ngày 30/11.",
      "Xin vui lòng gửi thêm điều khoản chi tiết.",
      "Có thể đặt lịch trao đổi vào thứ Năm không?",
    ],
  },
}

export function getEmployee(id: string) {
  return employees.find((e) => e.id === id)
}

export function getDepartment(id: string) {
  return departments.find((d) => d.id === id)
}

export function getLabel(id: string) {
  return labels.find((l) => l.id === id)
}
