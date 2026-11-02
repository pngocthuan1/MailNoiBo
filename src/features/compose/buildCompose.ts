import type { ComposeAttachment, Email, Message } from '@/mock-data'
import { getMessages, me } from '@/features/thread-view/getMessages'
import { formatDateTime } from '@/features/thread-view/fileUtils'
import { useMailStore } from '@/shared/state/mailStore'
import type { ComposeOpenInit } from './ComposeProvider'
import { recipientFromEmail, recipientFromText } from './recipients'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Mở lại một thư nháp trong cửa sổ soạn. */
export function draftToInit(email: Email): ComposeOpenInit {
  const d = email.draft
  if (d) {
    return {
      draftId: email.id,
      to: d.to,
      cc: d.cc,
      bcc: d.bcc,
      subject: email.subject,
      bodyHtml: d.bodyHtml,
      quotedHtml: d.quotedHtml,
      attachments: d.attachments,
      replyThreadId: d.replyThreadId,
      mode: d.mode,
    }
  }
  // Nháp có sẵn trong dữ liệu mẫu: dựng lại từ dòng thư.
  return {
    draftId: email.id,
    to: email.to.map(recipientFromText),
    subject: email.subject,
    bodyHtml: `<p>${esc(email.preview)}</p>`,
  }
}

/** Dựng nội dung Trả lời / Trả lời tất cả / Chuyển tiếp cho cửa sổ soạn nổi. */
export function replyToInit(threadId: string, mode: 'reply' | 'replyAll' | 'forward'): ComposeOpenInit | null {
  const { emails, sentMessages } = useMailStore.getState()
  const email = emails.find((e) => e.threadId === threadId)
  if (!email) return null
  const messages: Message[] = [...getMessages(email), ...(sentMessages[threadId] ?? [])]
  const last = messages[messages.length - 1]
  if (!last) return null

  const mine = last.from.email === me.email
  let to: string[] = []
  let cc: string[] = []
  if (mode === 'reply') to = mine ? last.to.map((p) => p.email) : [last.from.email]
  if (mode === 'replyAll') {
    to = [...new Set([last.from.email, ...last.to.map((p) => p.email)])].filter((e) => e !== me.email)
    cc = (last.cc ?? []).map((p) => p.email).filter((e) => e !== me.email && !to.includes(e))
  }
  const names = new Map([last.from, ...last.to, ...(last.cc ?? [])].map((p) => [p.email, p.name]))
  const toRec = (list: string[]) => list.map((e) => recipientFromEmail(e, names.get(e)))

  const stripped = email.subject.replace(/^\s*(re|fwd):\s*/i, '')
  const when = formatDateTime(last.ts)
  const quotedHtml =
    mode === 'forward'
      ? `<p>---------- Thư được chuyển tiếp ----------<br>Từ: ${esc(last.from.name)} &lt;${esc(last.from.email)}&gt;<br>Ngày: ${when}<br>Tiêu đề: ${esc(email.subject)}<br>Đến: ${last.to.map((p) => esc(p.name)).join(', ')}</p>${last.html}`
      : `<p>Vào ${when}, ${esc(last.from.name)} &lt;${esc(last.from.email)}&gt; đã viết:</p><blockquote>${last.html}</blockquote>`

  const attachments: ComposeAttachment[] | undefined =
    mode === 'forward'
      ? last.attachments
          ?.filter((a) => !a.blocked)
          .map((a) => ({ id: `fw-${a.id}`, name: a.name, size: a.size, kind: a.kind, progress: 100, status: 'done' as const }))
      : undefined

  return {
    to: toRec(to),
    cc: toRec(cc),
    subject: mode === 'forward' ? `Fwd: ${stripped}` : `Re: ${stripped}`,
    bodyHtml: '',
    quotedHtml,
    attachments,
    replyThreadId: mode === 'forward' ? undefined : threadId,
    mode,
  }
}
