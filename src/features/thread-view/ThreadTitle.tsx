import { Link } from "react-router-dom"
import { Bookmark, Lock, VolumeX, X } from "lucide-react"
import type { Email } from "@/mock-data"
import { dueInfo } from "@/features/mail-list/mailFormat"
import { useMailActions } from "@/features/mail-list/useMailActions"
import { useAllLabels } from "@/shared/state/mailStore"

/** Tiêu đề chuỗi 20px kèm nhãn có dấu x, biểu tượng tắt tiếng, quan trọng và hạn xử lý (DT-01, NH-02, NH-09, HT-10, NB-06). */
export function ThreadTitle({
  email,
  onEditDue,
}: {
  email: Email
  onEditDue: () => void
}) {
  const actions = useMailActions()
  const labels = useAllLabels()
  const due = email.todoDue ? dueInfo(email.todoDue) : null

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 pb-2">
      <h1 className="flex min-w-0 items-center gap-2 text-xl font-semibold">
        {email.muted && (
          <VolumeX
            size={18}
            className="shrink-0 text-muted"
            aria-label="Chuỗi thư đã tắt tiếng"
          />
        )}
        {email.confidential && (
          <span title="Thư bảo mật">
            <Lock
              size={18}
              className="shrink-0 text-accent"
              aria-label="Thư bảo mật"
            />
          </span>
        )}
        <span>{email.subject || "(Không có tiêu đề)"}</span>
        {email.important && (
          <Bookmark
            size={18}
            className="shrink-0 fill-warning-bar text-warning-bar"
            aria-label="Quan trọng"
          />
        )}
      </h1>
      {email.labelIds.map((id) => {
        const label = labels.find((l) => l.id === id)
        if (!label) return null
        return (
          <span
            key={id}
            className="inline-flex h-6 items-center rounded-full pr-1 pl-2 text-xs font-medium"
            style={{ background: `var(--label-${label.color}-soft)` }}
          >
            <Link to={`/mail/label/${id}`} className="hover:underline">
              {label.name}
            </Link>
            <button
              type="button"
              aria-label={`Gỡ nhãn ${label.name}`}
              title="Gỡ nhãn"
              onClick={() => actions.setLabel([email.id], id, false)}
              className="ml-1 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:bg-black/10"
            >
              <X size={12} />
            </button>
          </span>
        )
      })}
      {due && (
        <span
          className={`inline-flex h-6 items-center rounded-full pr-1 pl-2 text-xs font-medium ${
            due.overdue
              ? "bg-danger-soft text-danger"
              : "bg-warning-soft text-warning"
          }`}
        >
          <button
            type="button"
            onClick={onEditDue}
            title="Đổi hạn xử lý"
            className="cursor-pointer hover:underline"
          >
            Cần xử lý · {due.text}
          </button>
          <button
            type="button"
            aria-label="Bỏ đánh dấu cần xử lý"
            title="Bỏ đánh dấu cần xử lý"
            onClick={() => actions.setFollowUp([email.id], undefined)}
            className="ml-1 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:bg-black/10"
          >
            <X size={12} />
          </button>
        </span>
      )}
    </div>
  )
}
