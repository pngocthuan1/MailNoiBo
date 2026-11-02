import type { Email, Message } from "@/mock-data"
import { AttachmentGrid } from "./AttachmentGrid"
import { ImpersonationBanner } from "./ImpersonationBanner"
import { MessageBody } from "./MessageBody"
import { MessageHeader } from "./MessageHeader"
import { RecallStrip } from "./RecallStrip"
import type { MessageCtx } from "./types"

/** Một thư được mở rộng trong chuỗi. */
export function MessageCard({
  message,
  email,
  ctx,
}: {
  message: Message
  email: Email
  ctx: MessageCtx
}) {
  const showWarning = !!message.impersonates && !ctx.trusted.has(message.id)
  const html =
    ctx.translated && message.language === "en" && message.translationVi
      ? message.translationVi
      : message.html

  return (
    <article
      id={`msg-${message.id}`}
      aria-label={`Thư từ ${message.from.name}`}
      className="rounded-xl border border-line bg-surface p-4 shadow-sm"
    >
      <MessageHeader message={message} email={email} ctx={ctx} />
      <div className="mt-4 pl-0 sm:pl-[52px]">
        {showWarning && (
          <ImpersonationBanner
            message={message}
            onReport={ctx.onReport}
            onTrust={() => ctx.onTrust(message.id)}
          />
        )}
        {ctx.translated &&
          message.language === "en" &&
          message.translationVi && (
            <p className="mb-2 text-xs text-muted">
              Đã dịch từ tiếng Anh sang Tiếng Việt
            </p>
          )}
        <MessageBody html={html} quoted={message.quoted} />
        {message.attachments && message.attachments.length > 0 && (
          <AttachmentGrid
            files={message.attachments}
            threadId={email.threadId}
            restricted={email.confidential?.restricted}
          />
        )}
        <RecallStrip message={message} onRetry={() => ctx.onRecall(message)} />
      </div>
    </article>
  )
}
