import { Lock, Pencil, X } from "lucide-react"
import type { ConfidentialInfo } from "@/mock-data"

type Props = {
  info: ConfidentialInfo
  onEdit: () => void
  onRemove: () => void
}

/** Dải thông báo bảo mật trong cửa sổ soạn (SO-12) */
export function ConfidentialBanner({ info, onEdit, onRemove }: Props) {
  const expiryStr = info.expiresAt
    ? new Date(info.expiresAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null

  return (
    <div className="flex items-center gap-2 border-b border-line bg-warning-soft px-3 py-2 text-xs text-warning">
      <Lock size={13} className="shrink-0" />
      <span className="min-w-0 flex-1">
        {expiryStr
          ? `Thư này sẽ hết hạn ngày ${expiryStr}`
          : "Thư này không hết hạn"}
        {info.accessCode && ` · Mã: ${info.accessCode}`}
        {info.restricted && " · Đã chặn chuyển tiếp/sao chép/in"}
      </span>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 font-medium hover:bg-warning/20"
      >
        <Pencil size={11} /> Sửa
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Gỡ bảo mật"
        className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-warning/20"
      >
        <X size={11} />
      </button>
    </div>
  )
}
