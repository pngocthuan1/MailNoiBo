import { create } from 'zustand'
import {
  currentUser,
  emails as seed,
  labels as baseLabels,
  type Attachment,
  type ComposeAttachment,
  type ComposeRecipient,
  type DraftPayload,
  type Email,
  type Label,
  type Message,
  type Person,
} from '@/mock-data'

/**
 * Kho thư dùng chung (trong bộ nhớ): danh sách thư, trang đọc thư và thanh bên
 * cùng đọc từ đây. Mỗi thư là một chuỗi (threadId duy nhất).
 */
export type RecallInfo = { outcome: 'success' | 'partial' | 'failed'; recalled: number; total: number }

type MailState = {
  emails: Email[]
  labels: Label[]
  /** Kết quả thu hồi theo mã thư (NB-04) */
  recalls: Record<string, RecallInfo>
  /** Không bao giờ dịch thư tiếng Anh (DT-08) */
  neverTranslateEnglish: boolean
  /** Thư tôi gửi thêm vào các chuỗi (từ cửa sổ soạn và ô trả lời nhúng) */
  sentMessages: Record<string, Message[]>
}

export const useMailStore = create<MailState>(() => ({
  emails: seed.map((e) => ({ ...e })),
  labels: baseLabels.map((l) => ({ ...l })),
  recalls: {},
  neverTranslateEnglish: false,
  sentMessages: {},
}))

const get = () => useMailStore.getState()
const set = (partial: Partial<MailState>) => useMailStore.setState(partial)

export const useMailState = () => useMailStore()
export const useAllLabels = () => useMailStore((s) => s.labels)
export const useThread = (threadId: string | undefined) =>
  useMailStore((s) => s.emails.find((e) => e.threadId === threadId))

export const getThread = (threadId: string | undefined) => get().emails.find((e) => e.threadId === threadId)

/** Cập nhật các thư theo `ids`; trả về bản chụp trước khi sửa để Hoàn tác. */
export function patchEmails(ids: string[], patch: (e: Email) => Partial<Email>): Email[] {
  const idSet = new Set(ids)
  const snapshot = get().emails.filter((e) => idSet.has(e.id)).map((e) => ({ ...e }))
  set({ emails: get().emails.map((e) => (idSet.has(e.id) ? { ...e, ...patch(e) } : e)) })
  return snapshot
}

export function removeEmails(ids: string[]): Email[] {
  const idSet = new Set(ids)
  const snapshot = get().emails.filter((e) => idSet.has(e.id)).map((e) => ({ ...e }))
  set({ emails: get().emails.filter((e) => !idSet.has(e.id)) })
  return snapshot
}

/** Khôi phục từ bản chụp (cập nhật thư còn tồn tại, thêm lại thư đã bị xóa hẳn). */
export function restoreEmails(snapshot: Email[]) {
  const byId = new Map(snapshot.map((e) => [e.id, e]))
  const current = get().emails
  const existing = new Set(current.map((e) => e.id))
  set({
    emails: [...current.map((e) => byId.get(e.id) ?? e), ...snapshot.filter((e) => !existing.has(e.id))],
  })
}

export function prependEmails(list: Email[]) {
  set({ emails: [...list, ...get().emails] })
}

export function addLabel(name: string): Label {
  const labels = get().labels
  const label: Label = { id: `custom-${Date.now()}`, name, color: (labels.length % 8) + 1 }
  set({ labels: [...labels, label] })
  return label
}

export function removeLabel(id: string) {
  set({
    labels: get().labels.filter((l) => l.id !== id),
    emails: get().emails.map((e) => (e.labelIds.includes(id) ? { ...e, labelIds: e.labelIds.filter((l) => l !== id) } : e)),
  })
}

// --- Trạng thái kéo thả giữa danh sách thư và thanh bên ---
let draggedIds: string[] = []
export const setDraggedIds = (ids: string[]) => {
  draggedIds = ids
}
export const getDraggedIds = () => draggedIds

// --- Thư đến giả lập (TB-03) ---
const incoming = [
  { from: 'Đỗ Thị Ngọc', subject: 'Nhờ anh ký duyệt đề nghị thanh toán', preview: 'Kính gửi anh, đề nghị thanh toán đợt 2 đã đủ chứng từ, mong anh ký duyệt.' },
  { from: 'Trần Quốc Bảo', subject: 'Khách hàng yêu cầu họp gấp chiều nay', preview: 'Bên Vĩnh Phát muốn họp lúc 15:00 để chốt phương án triển khai.' },
  { from: 'Phạm Thu Hà', subject: 'Cập nhật lịch phỏng vấn ngày mai', preview: 'Ứng viên thứ hai đổi lịch sang 10:30, nhờ phòng CNTT chuẩn bị lại phòng.' },
  { from: 'Bùi Ngọc Lan', subject: 'Bản hợp đồng đã được đối tác ký', preview: 'Chị gửi anh bản scan hợp đồng đã đủ chữ ký của hai bên.' },
]
let incomingIndex = 0

export function makeIncomingEmail(): Email {
  const t = incoming[incomingIndex++ % incoming.length]
  const id = `new-${Date.now()}-${incomingIndex}`
  return {
    id,
    threadId: `t-${id}`,
    folder: 'inbox',
    from: t.from,
    to: ['Lê Hoàng Dũng'],
    subject: t.subject,
    preview: t.preview,
    ts: Date.now(),
    unread: true,
    starred: false,
    important: false,
    importantSuggested: false,
    category: 'primary',
    labelIds: [],
    hasAttachment: false,
    threadCount: 1,
  }
}

export function setRecall(messageId: string, info: RecallInfo) {
  set({ recalls: { ...get().recalls, [messageId]: info } })
}

export function setNeverTranslateEnglish(value: boolean) {
  set({ neverTranslateEnglish: value })
}

// ---------------------------------------------------------------------------
// Soạn thư: nháp và gửi thư (dùng chung cho cửa sổ soạn nổi và ô trả lời nhúng)
// ---------------------------------------------------------------------------

const htmlToText = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** Mở rộng người nhận: nhóm / phòng ban thành từng người. */
export function expandRecipients(list: ComposeRecipient[]): Person[] {
  const seen = new Set<string>()
  const out: Person[] = []
  for (const r of list) {
    const people = r.kind === 'group' ? r.members : [{ name: r.name, email: r.email }]
    for (const p of people) {
      if (!seen.has(p.email)) {
        seen.add(p.email)
        out.push({ name: p.name, email: p.email })
      }
    }
  }
  return out
}

const fileKind = (name: string): Attachment['kind'] => {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'doc'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'sheet'
  if (['zip', 'rar', '7z'].includes(ext)) return 'zip'
  return 'other'
}

export const composeFileKind = fileKind

const toMessageAttachments = (list: ComposeAttachment[]): Attachment[] =>
  list
    .filter((a) => a.status === 'done')
    .map((a) => ({ id: a.id, name: a.name, size: a.size, kind: a.kind, pages: a.kind === 'pdf' ? 3 : undefined }))

/** Lưu hoặc cập nhật nháp trong Nháp; trả về mã thư nháp. */
export function saveDraft(input: {
  draftId?: string
  subject: string
  to: ComposeRecipient[]
  cc: ComposeRecipient[]
  bcc: ComposeRecipient[]
  bodyHtml: string
  quotedHtml?: string
  attachments: ComposeAttachment[]
  replyThreadId?: string
  mode?: DraftPayload['mode']
}): string {
  const now = Date.now()
  const id = input.draftId ?? `draft-${now}`
  const payload: DraftPayload = {
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    bodyHtml: input.bodyHtml,
    quotedHtml: input.quotedHtml,
    attachments: input.attachments.filter((a) => a.status === 'done'),
    replyThreadId: input.replyThreadId,
    mode: input.mode,
  }
  const base: Partial<Email> = {
    from: currentUser.name,
    to: expandRecipients(input.to).map((p) => p.name),
    subject: input.subject,
    preview: htmlToText(input.bodyHtml).slice(0, 140),
    ts: now,
    hasAttachment: payload.attachments.length > 0,
    draft: payload,
  }
  const existing = get().emails.find((e) => e.id === id)
  if (existing) {
    set({ emails: get().emails.map((e) => (e.id === id ? { ...e, ...base, folder: 'drafts' } : e)) })
  } else {
    const draft: Email = {
      id,
      threadId: `t-${id}`,
      folder: 'drafts',
      from: currentUser.name,
      to: [],
      subject: '',
      preview: '',
      ts: now,
      unread: false,
      starred: false,
      important: false,
      importantSuggested: false,
      category: 'primary',
      labelIds: [],
      hasAttachment: false,
      threadCount: 1,
      composed: true,
      ...base,
    }
    set({ emails: [draft, ...get().emails] })
  }
  return id
}

export type OutgoingMail = {
  to: ComposeRecipient[]
  cc: ComposeRecipient[]
  bcc: ComposeRecipient[]
  subject: string
  bodyHtml: string
  quotedHtml?: string
  attachments: ComposeAttachment[]
  /** Trả lời trong chuỗi này */
  replyThreadId?: string
}

const normalizeSubject = (s: string) => s.replace(/^\s*(re:\s*)+/i, '').trim().toLowerCase()

/**
 * Gửi thư: thư vào Đã gửi với đúng người nhận (nhóm được mở rộng thành từng người, chưa ai đọc),
 * và được thêm vào chuỗi sẵn có nếu là trả lời hoặc trùng tiêu đề và người tham gia.
 */
export function sendMail(mail: OutgoingMail): { threadId: string; folder: Email['folder']; undo: () => void } {
  const now = Date.now()
  const to = expandRecipients(mail.to)
  const cc = expandRecipients(mail.cc)
  const bcc = expandRecipients(mail.bcc)
  const everyone = [...new Map([...to, ...cc, ...bcc].map((p) => [p.email, p])).values()]
  const names = everyone.map((p) => p.name)
  const subject = mail.subject.trim()
  const me: Person = { name: currentUser.name, email: currentUser.email }

  const emails = get().emails
  let target = mail.replyThreadId ? emails.find((e) => e.threadId === mail.replyThreadId) : undefined
  if (!target && subject && !/^\s*fwd:/i.test(subject)) {
    const norm = normalizeSubject(subject)
    target = emails.find(
      (e) =>
        e.folder !== 'drafts' &&
        e.folder !== 'trash' &&
        !e.mailboxId &&
        normalizeSubject(e.subject) === norm &&
        [e.from, ...e.to].some((n) => names.includes(n)),
    )
  }

  const threadId = target?.threadId ?? `t-sent-${now}`
  const message: Message = {
    id: `${threadId}-s${now}`,
    from: me,
    to,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    ts: now,
    html: mail.bodyHtml || '<p></p>',
    quoted: mail.quotedHtml,
    attachments: toMessageAttachments(mail.attachments),
    // Mọi người nhận bắt đầu với 0 biên nhận đã đọc.
    receipts: names.map((name) => ({ name })),
  }

  const sentMessages = get().sentMessages
  const attachments = toMessageAttachments(mail.attachments).length > 0
  let snapshot: Email | undefined
  let created: Email | undefined

  if (target) {
    snapshot = { ...target }
    const updated: Email = {
      ...target,
      baseCount: target.baseCount ?? target.threadCount,
      threadCount: target.threadCount + 1,
      ts: now,
      sentTs: now,
      sentTo: names,
      hasAttachment: target.hasAttachment || attachments,
    }
    set({
      emails: emails.map((e) => (e.id === target!.id ? updated : e)),
      sentMessages: { ...sentMessages, [threadId]: [...(sentMessages[threadId] ?? []), message] },
    })
  } else {
    created = {
      id: `m-sent-${now}`,
      threadId,
      folder: 'sent',
      from: me.name,
      to: names,
      subject,
      preview: htmlToText(message.html).slice(0, 140),
      ts: now,
      unread: false,
      starred: false,
      important: false,
      importantSuggested: false,
      category: 'primary',
      labelIds: [],
      hasAttachment: attachments,
      threadCount: 1,
      composed: true,
      readBy: 0,
    }
    set({ emails: [created, ...emails], sentMessages: { ...sentMessages, [threadId]: [message] } })
  }

  return {
    threadId,
    folder: target?.folder ?? 'sent',
    undo: () => {
      const rest = { ...get().sentMessages }
      rest[threadId] = (rest[threadId] ?? []).filter((m) => m.id !== message.id)
      if (rest[threadId].length === 0) delete rest[threadId]
      set({
        sentMessages: rest,
        emails: created
          ? get().emails.filter((e) => e.id !== created!.id)
          : get().emails.map((e) => (snapshot && e.id === snapshot.id ? snapshot : e)),
      })
    },
  }
}
