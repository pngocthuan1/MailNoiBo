import { useState } from "react"
import { Lock, ShieldAlert, KeyRound } from "lucide-react"
import type { ConfidentialInfo } from "@/mock-data"

type Props = {
  info: ConfidentialInfo
  unlocked: boolean
  onUnlock: (code: string) => boolean
}

/** Banner thông báo thư bảo mật và form nhập mã xác thực (SO-12) */
export function ConfidentialThreadBanner({ info, unlocked, onUnlock }: Props) {
  const [inputCode, setInputCode] = useState("")
  const [error, setError] = useState(false)

  const isExpired = info.expiresAt !== null && info.expiresAt <= Date.now()

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onUnlock(inputCode.trim())
    if (!success) {
      setError(true)
    } else {
      setError(false)
    }
  }

  const expiryStr = info.expiresAt
    ? new Date(info.expiresAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line bg-warning-soft px-4 py-3 text-warning">
        <Lock size={18} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm">Thư bảo mật</p>
          <p className="text-xs">
            {expiryStr ? `Hết hạn vào ngày ${expiryStr}. ` : "Không hết hạn. "}
            {info.restricted &&
              "Người gửi đã chặn chuyển tiếp, sao chép, in và tải về."}
          </p>
        </div>
      </div>

      {isExpired ? (
        <div className="p-6 text-center">
          <ShieldAlert size={36} className="mx-auto mb-2 text-danger" />
          <p className="font-semibold text-danger">
            Thư đã hết hạn, bạn không thể xem nội dung
          </p>
          <p className="mt-1 text-xs text-muted">
            Thời hạn xem thư đã kết thúc. Vui lòng liên hệ người gửi nếu cần
            truy cập lại.
          </p>
        </div>
      ) : !unlocked && info.accessCode ? (
        <div className="p-6">
          <div className="mx-auto max-w-sm text-center">
            <KeyRound size={32} className="mx-auto mb-2 text-accent" />
            <p className="font-semibold text-sm">Yêu cầu mã xác thực</p>
            <p className="mt-1 text-xs text-muted">
              Nhập mã 6 chữ số người gửi đã cung cấp (mã mẫu: {info.accessCode})
            </p>
            <form onSubmit={handleUnlock} className="mt-4 flex flex-col gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value)
                  setError(false)
                }}
                placeholder="Nhập mã 6 chữ số"
                className="h-10 text-center font-mono text-lg tracking-widest rounded-lg border border-line bg-surface px-3 outline-none focus:border-accent"
              />
              {error && (
                <p className="text-xs text-danger font-medium">
                  Mã xác thực không đúng. Hãy thử lại.
                </p>
              )}
              <button
                type="submit"
                className="h-9 cursor-pointer rounded-full bg-accent font-medium text-sm text-on-accent hover:bg-accent/90"
              >
                Mở thư
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
