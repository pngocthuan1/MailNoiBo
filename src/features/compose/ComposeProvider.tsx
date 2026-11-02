import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ComposeAttachment, ComposeRecipient, DraftPayload } from '@/mock-data'
import { recipientFromText } from './recipients'

export type ComposeDraft = {
  id: number
  /** Mã thư nháp đã lưu trong kho thư (nếu có) */
  draftId?: string
  to: ComposeRecipient[]
  cc: ComposeRecipient[]
  bcc: ComposeRecipient[]
  showCc: boolean
  showBcc: boolean
  subject: string
  bodyHtml: string
  quotedHtml?: string
  attachments: ComposeAttachment[]
  replyThreadId?: string
  mode?: DraftPayload['mode']
  minimized: boolean
  maximized: boolean
  fullscreen: boolean
  /** Có thay đổi chưa được lưu thành nháp */
  dirty: boolean
  /** Tăng sau mỗi lần chỉnh sửa nội dung, dùng để kích hoạt tự lưu */
  rev: number
}

/** Dữ liệu mở cửa sổ soạn. Vẫn nhận địa chỉ dạng chuỗi và `body` văn bản thường như trước. */
export type ComposeOpenInit = {
  draftId?: string
  to?: (string | ComposeRecipient)[]
  cc?: (string | ComposeRecipient)[]
  bcc?: (string | ComposeRecipient)[]
  subject?: string
  body?: string
  bodyHtml?: string
  quotedHtml?: string
  attachments?: ComposeAttachment[]
  replyThreadId?: string
  mode?: DraftPayload['mode']
  /** Đánh dấu là có thay đổi chưa lưu (ví dụ khi mở rộng từ khung trả lời nhanh) */
  dirty?: boolean
}

export const MAX_COMPOSE_WINDOWS = 3

type ComposeState = {
  windows: ComposeDraft[]
  open: (init?: ComposeOpenInit) => number
  update: (id: number, patch: Partial<ComposeDraft>) => void
  /** Chỉnh nội dung: đánh dấu chưa lưu và kích hoạt tự lưu */
  edit: (id: number, patch: Partial<ComposeDraft>) => void
  close: (id: number) => void
}

const ComposeContext = createContext<ComposeState | null>(null)

export function useCompose() {
  const ctx = useContext(ComposeContext)
  if (!ctx) throw new Error('useCompose phải nằm trong ComposeProvider')
  return ctx
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toRecipients = (list?: (string | ComposeRecipient)[]) =>
  (list ?? []).map((r) => (typeof r === 'string' ? recipientFromText(r) : r))

export function ComposeProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<ComposeDraft[]>([])
  const nextId = useRef(1)
  const windowsRef = useRef<ComposeDraft[]>([])
  windowsRef.current = windows

  const open = useCallback<ComposeState['open']>((init = {}) => {
    // Nháp đã mở sẵn thì chỉ đưa cửa sổ đó lên lại.
    const existing = init.draftId ? windowsRef.current.find((w) => w.draftId === init.draftId) : undefined
    if (existing) {
      setWindows((prev) => prev.map((w) => (w.id === existing.id ? { ...w, minimized: false } : w)))
      return existing.id
    }
    const cc = toRecipients(init.cc)
    const bcc = toRecipients(init.bcc)
    const draft: ComposeDraft = {
      id: nextId.current++,
      draftId: init.draftId,
      to: toRecipients(init.to),
      cc,
      bcc,
      showCc: cc.length > 0,
      showBcc: bcc.length > 0,
      subject: init.subject ?? '',
      bodyHtml: init.bodyHtml ?? (init.body ? `<div>${esc(init.body).replace(/\n/g, '<br>')}</div>` : ''),
      quotedHtml: init.quotedHtml,
      attachments: init.attachments ?? [],
      replyThreadId: init.replyThreadId,
      mode: init.mode,
      minimized: false,
      maximized: false,
      fullscreen: false,
      dirty: init.dirty ?? false,
      rev: 0,
    }
    setWindows((prev) => {
      const next = [...prev, draft]
      // Tối đa 3 cửa sổ mở rộng cạnh nhau: mở cửa sổ thứ 4 thì thu nhỏ cửa sổ cũ nhất.
      let expanded = next.filter((w) => !w.minimized)
      while (expanded.length > MAX_COMPOSE_WINDOWS) {
        const oldest = expanded[0]
        oldest.minimized = true
        oldest.fullscreen = false
        expanded = expanded.slice(1)
      }
      return next.map((w) => ({ ...w }))
    })
    return draft.id
  }, [])

  const update = useCallback<ComposeState['update']>((id, patch) => {
    setWindows((prev) => {
      let next = prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
      // Mở lại một cửa sổ thu nhỏ khi đã đủ 3 cửa sổ: thu nhỏ cửa sổ mở cũ nhất khác.
      if (patch.minimized === false) {
        const expanded = next.filter((w) => !w.minimized)
        if (expanded.length > MAX_COMPOSE_WINDOWS) {
          const oldest = expanded.find((w) => w.id !== id)
          next = next.map((w) => (w.id === oldest?.id ? { ...w, minimized: true, fullscreen: false } : w))
        }
      }
      return next
    })
  }, [])

  const edit = useCallback<ComposeState['edit']>((id, patch) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch, dirty: true, rev: w.rev + 1 } : w)))
  }, [])

  const close = useCallback((id: number) => setWindows((prev) => prev.filter((w) => w.id !== id)), [])

  const value = useMemo(() => ({ windows, open, update, edit, close }), [windows, open, update, edit, close])
  return <ComposeContext.Provider value={value}>{children}</ComposeContext.Provider>
}
