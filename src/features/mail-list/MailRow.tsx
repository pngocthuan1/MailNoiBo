import type { DragEvent, ReactNode } from "react"
import {
  Bookmark,
  Check,
  CheckCheck,
  Clock,
  Lock,
  Paperclip,
  Star,
} from "lucide-react"
import type { Email, FolderId } from "@/mock-data"
import { folderName } from "@/shared/state/mailSelectors"
import { dueInfo, futureTime, listTime } from "./mailFormat"
import { useAllLabels } from "@/shared/state/mailStore"
import { LabelPill } from "./LabelPill"
import type { useMailActions } from "./useMailActions"

export type Variant = FolderId | "label" | "shared"

type Props = {
  email: Email
  variant: Variant
  selected: boolean
  fresh: boolean
  focused: boolean
  assigneeCell?: ReactNode
  dragging: boolean
  actions: ReturnType<typeof useMailActions>
  hoverActions: ReactNode
  onToggleSelect: (shift: boolean) => void
  onOpen: () => void
  onDragStart: (e: DragEvent) => void
  onDragEnd: () => void
}

const outgoing: Variant[] = ["sent", "drafts", "scheduled"]

export function MailRow({
  email,
  variant,
  selected,
  fresh,
  focused,
  assigneeCell,
  dragging,
  actions,
  hoverActions,
  onToggleSelect,
  onOpen,
  onDragStart,
  onDragEnd,
}: Props) {
  const allLabels = useAllLabels()
  const labels = email.labelIds
    .map((id) => allLabels.find((l) => l.id === id))
    .filter((l) => !!l)
  const isOutgoing = outgoing.includes(variant)
  const isDraft = variant === "drafts"
  const due = email.todoDue ? dueInfo(email.todoDue) : null
  // Gắn sao / Quan trọng / nhãn: hiện hộp thư gốc của thư.
  const showOrigin = variant === "starred" || variant === "important"

  const sentRow = variant === "sent"
  const recipients = sentRow ? (email.sentTo ?? email.to) : email.to
  let timeNode: ReactNode = listTime(
    sentRow ? (email.sentTs ?? email.ts) : email.ts,
  )
  if (variant === "snoozed" && email.snoozedUntil) {
    timeNode = (
      <span className="inline-flex items-center gap-1 text-accent">
        <Clock size={12} />
        {futureTime(email.snoozedUntil)}
      </span>
    )
  } else if (variant === "scheduled" && email.scheduledAt) {
    timeNode = (
      <span className="text-accent">Gửi {futureTime(email.scheduledAt)}</span>
    )
  }

  // Biên nhận đã đọc (NB-03): hai dấu tích khi mọi người đã đọc, một dấu tích khi mới một phần.
  if (variant === "sent" && email.readBy) {
    const all = email.readBy >= email.to.length
    const Icon = all ? CheckCheck : Check
    timeNode = (
      <span className="inline-flex items-center gap-1">
        <span
          title={`Đã đọc ${email.readBy} trên ${email.to.length}`}
          aria-label={all ? "Mọi người đã đọc" : "Một số người đã đọc"}
        >
          <Icon size={14} className="text-accent" />
        </span>
        {timeNode}
      </span>
    )
  }

  const sender = isOutgoing
    ? `Đến: ${
        recipients.length ? recipients.join(", ") : "(chưa có người nhận)"
      }`
    : email.from

  return (
    <div
      role="row"
      id={`row-${email.id}`}
      tabIndex={0}
      draggable
      onClick={onOpen}
      onKeyDown={(e) =>
        e.key === "Enter" && e.target === e.currentTarget && onOpen()
      }
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      aria-selected={selected}
      className={`group relative flex min-h-14 cursor-pointer items-center gap-1 border-b border-line px-2 text-sm hover:z-[1] hover:shadow-[0_1px_4px_rgb(0_0_0/0.18)] ${
        selected
          ? "bg-accent-soft"
          : fresh
            ? "animate-slide-down bg-accent-soft"
            : email.unread
              ? "bg-surface"
              : "bg-bg"
      } ${email.unread ? "font-semibold" : ""} ${
        dragging ? "opacity-40" : ""
      } ${focused ? "ring-2 ring-accent ring-inset" : ""} scroll-mt-32`}
    >
      <label
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          aria-label={`Chọn thư "${email.subject || "Không có tiêu đề"}"`}
          checked={selected}
          onChange={() => {}}
          onClick={(e) => onToggleSelect(e.shiftKey)}
          className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
        />
      </label>
      <button
        type="button"
        aria-label={email.starred ? "Bỏ gắn sao" : "Gắn sao"}
        title={email.starred ? "Bỏ gắn sao" : "Gắn sao"}
        onClick={(e) => {
          e.stopPropagation()
          actions.toggleStar([email.id], !email.starred)
        }}
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
      >
        <Star
          size={18}
          className={
            email.starred ? "fill-warning-bar text-warning-bar" : "text-muted"
          }
        />
      </button>
      <button
        type="button"
        aria-label={
          email.important ? "Bỏ đánh dấu quan trọng" : "Đánh dấu quan trọng"
        }
        title={
          email.important
            ? "Quan trọng"
            : email.importantSuggested
              ? "Hệ thống gợi ý là thư quan trọng"
              : "Đánh dấu quan trọng"
        }
        onClick={(e) => {
          e.stopPropagation()
          actions.toggleImportant([email.id], !email.important)
        }}
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
      >
        <Bookmark
          size={16}
          className={
            email.important
              ? "fill-warning-bar text-warning-bar"
              : email.importantSuggested
                ? "text-warning-bar opacity-50"
                : "text-muted opacity-40"
          }
        />
      </button>

      <span className="w-32 shrink-0 truncate px-2 sm:w-44">{sender}</span>

      <span className="flex min-w-0 flex-1 items-center gap-2">
        {showOrigin && (
          <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-surface-2 px-2 text-xs font-medium text-muted">
            {folderName(email.folder)}
          </span>
        )}
        {labels.length > 0 && (
          <span className="hidden shrink-0 items-center gap-1 lg:flex">
            {labels.slice(0, 2).map((l) => (
              <LabelPill key={l.id} label={l} />
            ))}
            {labels.length > 2 && (
              <span className="text-xs text-muted">+{labels.length - 2}</span>
            )}
          </span>
        )}
        {due && (
          <span
            className={`inline-flex h-5 shrink-0 items-center rounded-full px-2 text-xs font-medium ${
              due.overdue
                ? "bg-danger-soft text-danger"
                : "bg-warning-soft text-warning"
            }`}
          >
            Cần xử lý · {due.text}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">
          {isDraft && <span className="mr-1 text-danger">Nháp</span>}
          {email.confidential && (
            <span title="Thư bảo mật" className="mr-1 inline-flex items-center">
              <Lock size={13} className="text-accent" />
            </span>
          )}
          <span>{email.subject || "(Không có tiêu đề)"}</span>
          <span className="font-normal text-muted"> - {email.preview}</span>
        </span>
      </span>

      {email.hasAttachment && (
        <Paperclip
          size={14}
          className="shrink-0 text-muted"
          aria-label="Có tệp đính kèm"
        />
      )}
      {email.threadCount > 1 && (
        <span
          className="shrink-0 text-xs text-muted"
          title={`${email.threadCount} thư trong chuỗi`}
        >
          {email.threadCount}
        </span>
      )}

      {assigneeCell}

      <span className="relative flex h-8 w-24 shrink-0 items-center justify-end pr-2 text-xs sm:w-28">
        <span className="truncate group-focus-within:invisible group-hover:invisible">
          {timeNode}
        </span>
        <span
          className="absolute top-0 right-0 hidden h-8 items-center gap-0.5 bg-inherit pl-2 group-focus-within:flex group-hover:flex"
          onClick={(e) => e.stopPropagation()}
        >
          {hoverActions}
        </span>
      </span>
    </div>
  )
}
