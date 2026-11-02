import type { ReactNode } from "react"
import { LabelDot } from "@/shared/ui/LabelDot"

type Props = {
  title: string
  labelColor?: number
  unread: number
  right?: ReactNode
}

/** Tiêu đề hộp thư (HT-01): tên hoặc tên nhãn kèm chấm màu, bên phải là số thư chưa đọc. */
export function MailboxHeader({ title, labelColor, unread, right }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-4 pb-2">
      <h1 className="flex min-w-0 items-center gap-2 text-xl font-semibold">
        {labelColor && <LabelDot color={labelColor} size={12} />}
        <span className="truncate">{title}</span>
      </h1>
      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
        {unread} chưa đọc
      </span>
      <div className="ml-auto">{right}</div>
    </div>
  )
}
