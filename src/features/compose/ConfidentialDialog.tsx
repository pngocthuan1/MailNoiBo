import { useState } from "react"
import { Lock, RefreshCw } from "lucide-react"
import { Dialog } from "@/shared/ui/Dialog"
import type { ConfidentialInfo } from "@/mock-data"

type Props = {
  current: ConfidentialInfo | null | undefined
  onSave: (info: ConfidentialInfo) => void
  onRemove: () => void
  onClose: () => void
}

const EXPIRY_OPTIONS: { label: string ms: number | null }[] = [
  { label: "1 ngày", ms: 24 * 3600 * 1000 },
  { label: "1 tuần", ms: 7 * 24 * 3600 * 1000 },
  { label: "1 tháng", ms: 30 * 24 * 3600 * 1000 },
  { label: "3 tháng", ms: 90 * 24 * 3600 * 1000 },
  { label: "Không hết hạn", ms: null },
]

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/** Hộp thoại cài đặt chế độ bảo mật (SO-12) */
export function ConfidentialDialog({
  current,
  onSave,
  onRemove,
  onClose,
}: Props) {
  const [expiryIdx, setExpiryIdx] = useState(() => {
    if (!current) return 2 // default: 1 tháng
    if (current.expiresAt === null) return 4
    const ms = current.expiresAt - Date.now()
    if (ms <= 25 * 3600 * 1000) return 0
    if (ms <= 8 * 24 * 3600 * 1000) return 1
    if (ms <= 31 * 24 * 3600 * 1000) return 2
    return 3
  })
  const [requireCode, setRequireCode] = useState(Boolean(current?.accessCode))
  const [restricted, setRestricted] = useState(current?.restricted ?? true)
  const [code, setCode] = useState(current?.accessCode ?? generateCode())

  const expiresAt = EXPIRY_OPTIONS[expiryIdx].ms
    ? Date.now() + EXPIRY_OPTIONS[expiryIdx].ms!
    : null

  const formatExpiry = () => {
    if (expiresAt === null) return "Không bao giờ"
    return new Date(expiresAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleSave = () => {
    onSave({
      expiresAt,
      restricted,
      accessCode: requireCode ? code : null,
    })
  }

  return (
    <Dialog title="Chế độ bảo mật" onClose={onClose} width={480}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-accent-soft p-3">
          <Lock size={20} className="text-accent" />
          <p className="text-sm text-accent">
            Thư bảo mật sẽ hết hạn sau thời gian bạn chọn và người nhận không
            thể chuyển tiếp, in hay tải về.
          </p>
        </div>

        {/* Thời hạn */}
        <div>
          <label className="mb-2 block text-sm font-medium">Thời hạn</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {EXPIRY_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setExpiryIdx(i)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  expiryIdx === i
                    ? "border-accent bg-accent text-on-accent"
                    : "border-line bg-surface hover:bg-hover"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {expiresAt && (
            <p className="mt-2 text-xs text-muted">
              Sẽ hết hạn: {formatExpiry()}
            </p>
          )}
        </div>

        {/* Mã xác thực */}
        <div className="rounded-lg border border-line bg-surface p-3">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={requireCode}
              onChange={(e) => setRequireCode(e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            <div>
              <p className="text-sm font-medium">Yêu cầu mã xác thực</p>
              <p className="text-xs text-muted">
                Người nhận cần nhập mã 6 chữ số để xem nội dung
              </p>
            </div>
          </label>
          {requireCode && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 rounded border border-line bg-bg px-3 py-2 text-center font-mono text-xl font-bold tracking-widest">
                {code}
              </div>
              <button
                type="button"
                onClick={() => setCode(generateCode())}
                title="Tạo mã mới"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-line bg-surface hover:bg-hover"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Chặn hành động */}
        <div className="rounded-lg border border-line bg-surface p-3">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={restricted}
              onChange={(e) => setRestricted(e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            <div>
              <p className="text-sm font-medium">
                Chặn chuyển tiếp, sao chép, in và tải về
              </p>
              <p className="text-xs text-muted">
                Người nhận không thể chia sẻ nội dung thư theo các cách này
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="h-9 flex-1 cursor-pointer rounded-full bg-accent text-sm font-medium text-on-accent hover:bg-accent/90"
        >
          Lưu
        </button>
        {current && (
          <button
            type="button"
            onClick={onRemove}
            className="h-9 cursor-pointer rounded-full border border-line px-4 text-sm text-danger hover:bg-danger-soft"
          >
            Gỡ bảo mật
          </button>
        )}
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
