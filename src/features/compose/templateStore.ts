import { create } from "zustand"

export type MailTemplate = {
  id: string
  name: string
  subject: string
  bodyHtml: string
  createdAt: number
}

type TemplateState = {
  templates: MailTemplate[]
}

const MOCK_TEMPLATES: MailTemplate[] = [
  {
    id: "tpl-leave",
    name: "Xin nghỉ phép",
    subject: "Đơn xin nghỉ phép",
    bodyHtml: `<p>Kính gửi Phòng Nhân sự,</p><p>Tôi là <strong>Lê Hoàng Dũng</strong>, Trưởng phòng Công nghệ thông tin, xin phép nghỉ phép từ ngày <strong>[ngày bắt đầu]</strong> đến ngày <strong>[ngày kết thúc]</strong>.</p><p>Lý do: [lý do nghỉ]</p><p>Trong thời gian nghỉ, công việc sẽ được bàn giao cho anh/chị [tên người bàn giao].</p><p>Kính trình và mong được chấp thuận.</p><p>Trân trọng,</p>`,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "tpl-weekly",
    name: "Báo cáo tuần",
    subject: "Báo cáo tuần [Tuần X] - Phòng CNTT",
    bodyHtml: `<p>Kính gửi Ban Giám đốc,</p><p>Phòng CNTT xin gửi báo cáo tuần [X]:</p><p><strong>Công việc đã hoàn thành:</strong></p><ul><li>[Mô tả công việc 1]</li><li>[Mô tả công việc 2]</li></ul><p><strong>Công việc đang thực hiện:</strong></p><ul><li>[Mô tả công việc 1]</li></ul><p><strong>Vấn đề gặp phải:</strong></p><ul><li>[Nếu có]</li></ul><p><strong>Kế hoạch tuần tới:</strong></p><ul><li>[Kế hoạch 1]</li><li>[Kế hoạch 2]</li></ul><p>Trân trọng,</p>`,
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: "tpl-thanks",
    name: "Cảm ơn đối tác",
    subject: "Cảm ơn sự hợp tác - Hoàng Long Group",
    bodyHtml: `<p>Kính gửi Quý đối tác,</p><p>Thay mặt Công ty Hoàng Long Group, tôi xin gửi lời cảm ơn chân thành đến Quý đối tác vì sự hợp tác tích cực trong thời gian vừa qua.</p><p>Chúng tôi rất hân hạnh được làm việc cùng Quý đối tác và mong rằng mối quan hệ hợp tác sẽ ngày càng phát triển bền vững.</p><p>Nếu có bất kỳ điều gì cần trao đổi thêm, xin vui lòng liên hệ trực tiếp với chúng tôi.</p><p>Trân trọng,</p>`,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "tpl-meeting",
    name: "Họp nhóm",
    subject: "Thư mời họp - [Chủ đề cuộc họp]",
    bodyHtml: `<p>Kính gửi các anh/chị,</p><p>Tôi xin kính mời tham dự cuộc họp với các thông tin như sau:</p><ul><li><strong>Chủ đề:</strong> [Chủ đề cuộc họp]</li><li><strong>Thời gian:</strong> [Giờ], ngày [Ngày/Tháng/Năm]</li><li><strong>Địa điểm:</strong> [Phòng họp / Link Meeting]</li><li><strong>Thời lượng dự kiến:</strong> [X] tiếng</li></ul><p><strong>Nội dung chính:</strong></p><ol><li>[Nội dung 1]</li><li>[Nội dung 2]</li><li>[Nội dung 3]</li></ol><p>Kính nhờ anh/chị xác nhận tham dự và chuẩn bị nội dung liên quan trước buổi họp.</p><p>Trân trọng,</p>`,
    createdAt: Date.now() - 86400000 * 3,
  },
]

export const useTemplateStore = create<TemplateState>(() => ({
  templates: MOCK_TEMPLATES,
}))

export function addTemplate(
  tpl: Omit<MailTemplate, "id" | "createdAt">,
): MailTemplate {
  const newTpl: MailTemplate = {
    ...tpl,
    id: `tpl-${Date.now()}`,
    createdAt: Date.now(),
  }
  useTemplateStore.setState((s) => ({ templates: [...s.templates, newTpl] }))
  return newTpl
}

export function updateTemplate(
  id: string,
  patch: Partial<Omit<MailTemplate, "id" | "createdAt">>,
) {
  useTemplateStore.setState((s) => ({
    templates: s.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  }))
}

export function deleteTemplate(id: string) {
  useTemplateStore.setState((s) => ({
    templates: s.templates.filter((t) => t.id !== id),
  }))
}
