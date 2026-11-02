import type { Email, Message } from '@/mock-data'

export type ComposerMode = 'reply' | 'replyAll' | 'forward'

/** Ngữ cảnh dùng chung cho các thư trong chuỗi. */
export type MessageCtx = {
  email: Email
  trusted: Set<string>
  onTrust: (messageId: string) => void
  onReport: () => void
  /** Đang hiển thị bản dịch tiếng Việt */
  translated: boolean
  onReply: (mode: ComposerMode, message: Message) => void
  onRecall: (message: Message) => void
}
