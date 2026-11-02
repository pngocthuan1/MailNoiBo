import { useState } from "react"
import { Dialog } from "@/shared/ui/Dialog"

type Props = {
  onSave: (name: string) => void
  onClose: () => void
}

/** Hộp thoại lưu thư thành mẫu */
export function SaveTemplateDialog({ onSave, onClose }: Props) {
  const [name, setName] = useState("")

  return (
    <Dialog title="Lưu thành mẫu thư" onClose={onClose} width={400}>
      <p className="mb-3 text-sm text-muted">
        Đặt tên cho mẫu thư này để dùng lại sau
      </p>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && name.trim() && onSave(name.trim())
        }
        placeholder="VD: Xin nghỉ phép"
        className="mb-4 h-9 w-full rounded border border-line bg-surface px-3 text-sm outline-none focus:border-accent"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!name.trim()}
          onClick={() => onSave(name.trim())}
          className="h-9 flex-1 cursor-pointer rounded-full bg-accent text-sm font-medium text-on-accent hover:bg-accent/90 disabled:opacity-50"
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-9 cursor-pointer rounded-full border border-line px-4 text-sm hover:bg-hover"
        >
          Hủy
        </button>
      </div>
    </Dialog>
  )
}
