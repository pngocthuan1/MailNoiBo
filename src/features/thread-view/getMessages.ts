import { currentUser, employees, threadExtras, threadMessages, type Email, type Message, type Person } from '@/mock-data'

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')

export const me: Person = { name: currentUser.name, email: currentUser.email }

export function personOf(name: string): Person {
  const e = employees.find((x) => x.name === name)
  return { name, email: e?.email ?? `${slug(name) || 'nguoi.gui'}@doitac.example.com` }
}

const fillers = [
  'Cảm ơn anh chị, tôi đã nhận được thông tin và sẽ phản hồi sớm.',
  'Tôi đã xem nội dung, có một vài điểm cần trao đổi thêm khi gặp trực tiếp.',
  'Đồng ý với đề xuất, mời anh chị tiếp tục triển khai.',
  'Vui lòng cập nhật giúp tôi tiến độ mới nhất trước chiều nay.',
]

/** Nội dung thư của một chuỗi: dữ liệu riêng nếu có, nếu không thì dựng từ dòng thư. */
export function getMessages(email: Email): Message[] {
  const explicit = threadMessages[email.threadId]
  if (explicit) return explicit

  // Thư tạo từ cửa sổ soạn: toàn bộ nội dung nằm trong kho (sentMessages).
  if (email.composed) return []

  const n = Math.max(1, email.baseCount ?? email.threadCount)
  const sender = personOf(email.from)
  const outgoing = email.from === currentUser.name
  const other = outgoing ? personOf(email.to[0] ?? 'Người nhận') : me
  const recipients = outgoing ? email.to.map(personOf) : [me]

  return Array.from({ length: n }, (_, i): Message => {
    const last = i === n - 1
    const fromSender = (n - 1 - i) % 2 === 0
    const from = fromSender ? sender : other
    const mine = from.email === me.email
    const text = last ? email.preview : fillers[i % fillers.length]
    return {
      id: `${email.threadId}-${i}`,
      from,
      to: mine ? recipients.filter((r) => r.email !== me.email) : [me],
      ts: email.ts - (n - 1 - i) * 2 * 3_600_000,
      html: `<p>Kính gửi ${mine ? 'anh chị' : 'anh Dũng'},</p><p>${text}</p><p>Trân trọng,<br>${from.name}</p>`,
      unread: false,
      receipts:
        mine && outgoing
          ? recipients.map((r, k) => ({ name: r.name, readAt: k < (email.readBy ?? 0) ? email.ts + 600_000 * (k + 1) : undefined }))
          : undefined,
      attachments:
        email.hasAttachment && last
          ? [{ id: `${email.threadId}-a`, name: `${slug(email.subject).slice(0, 36) || 'tai-lieu'}.pdf`, size: 480_000, kind: 'pdf', pages: 3 }]
          : undefined,
    }
  })
}

/** Tóm tắt (DT-11) và gợi ý trả lời (DT-10) của chuỗi. */
export function getExtras(email: Email, messages: Message[]) {
  const extra = threadExtras[email.threadId] ?? {}
  const names = [...new Set(messages.map((m) => m.from.name))]
  const last = messages[messages.length - 1]
  return {
    summary: extra.summary ?? [
      `Chuỗi gồm ${messages.length} thư giữa ${names.slice(0, 3).join(', ')}${names.length > 3 ? ' và những người khác' : ''}.`,
      `Chủ đề chính: ${email.subject}.`,
      `Thư mới nhất từ ${last.from.name}: ${email.preview}`,
    ],
    smartReplies: extra.smartReplies ?? ['Cảm ơn anh chị, tôi sẽ xem xét.', 'Đã nhận, tôi sẽ phản hồi trước chiều nay.', 'Tôi cần thêm thông tin về việc này.'],
  }
}

export function plainText(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}
