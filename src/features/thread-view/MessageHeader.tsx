import { Reply, Star } from "lucide-react"
import { employees, getDepartment, type Email, type Message } from "@/mock-data"
import { listTime } from "@/features/mail-list/mailFormat"
import { useMailActions } from "@/features/mail-list/useMailActions"
import { Avatar } from "@/shared/ui/Avatar"
import { MessageMenu } from "./MessageMenu"
import { ReadReceiptButton } from "./ReadReceiptButton"
import { RecipientDetails } from "./RecipientDetails"
import { SenderCard } from "./SenderCard"
import { me } from "./getMessages"
import type { MessageCtx } from "./types"

/** Đầu thư (DT-01, DT-05): ảnh, tên, email, phòng ban/chức vụ, đến tôi, giờ, sao, trả lời nhanh, ba chấm. */
export function MessageHeader({
  message,
  email,
  ctx,
}: {
  message: Message
  email: Email
  ctx: MessageCtx
}) {
  const actions = useMailActions()
  const emp = employees.find((e) => e.email === message.from.email)
  const mine = message.from.email === me.email
  const showReceipts = mine && !!message.receipts?.length

  return (
    <div className="flex items-start gap-3">
      <Avatar name={message.from.name} size={40} status={emp?.status} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <SenderCard person={message.from} />
          <span className="truncate text-xs text-muted">
            &lt;{message.from.email}&gt;
          </span>
        </div>
        {emp && (
          <p className="truncate text-xs text-muted">
            {getDepartment(emp.departmentId)?.name} · {emp.title}
          </p>
        )}
        <RecipientDetails message={message} />
      </div>
      <div className="flex shrink-0 items-center">
        {showReceipts && <ReadReceiptButton message={message} />}
        <span className="mx-1 text-xs text-muted">{listTime(message.ts)}</span>
        <button
          type="button"
          aria-label={email.starred ? "Bỏ gắn sao" : "Gắn sao"}
          title={email.starred ? "Bỏ gắn sao" : "Gắn sao"}
          onClick={() => actions.toggleStar([email.id], !email.starred)}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
        >
          <Star
            size={16}
            className={
              email.starred ? "fill-warning-bar text-warning-bar" : "text-muted"
            }
          />
        </button>
        <button
          type="button"
          aria-label="Trả lời nhanh"
          title="Trả lời nhanh"
          onClick={() => ctx.onReply("reply", message)}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
        >
          <Reply size={16} />
        </button>
        <MessageMenu
          message={message}
          mine={mine}
          restricted={email.confidential?.restricted}
          onReply={(m) => ctx.onReply(m, message)}
          onRecall={() => ctx.onRecall(message)}
        />
      </div>
    </div>
  )
}
