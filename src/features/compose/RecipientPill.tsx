import { CircleAlert, X } from "lucide-react"
import { Avatar } from "@/shared/ui/Avatar"

type Props = { name: string email: string valid: boolean onRemove: () => void }

/** Thẻ người nhận: ảnh đại diện, tên và nút xóa. Địa chỉ sai định dạng viền đỏ. */
export function RecipientPill({ name, email, valid, onRemove }: Props) {
  return (
    <span
      title={valid ? email : `“${email}” không phải là địa chỉ email hợp lệ`}
      className={`inline-flex h-7 max-w-full items-center gap-1 rounded-full border pr-1 text-xs ${
        valid
          ? "border-line bg-surface-2 pl-0.5 text-fg"
          : "border-danger bg-danger-soft pl-2 text-danger"
      }`}
    >
      {valid ? (
        <Avatar name={name} size={24} />
      ) : (
        <CircleAlert size={14} aria-hidden />
      )}
      <span className="truncate">{name}</span>
      <button
        type="button"
        aria-label={`Xóa ${name}`}
        onClick={onRemove}
        className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
      >
        <X size={12} />
      </button>
    </span>
  )
}
