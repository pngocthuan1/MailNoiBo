import { useState, type FormEvent } from "react"
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  UserPlus,
  X,
} from "lucide-react"
import { useAuthStore } from "./authStore"

export function AddAccountModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { addAccount } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    if (!email.trim() || !password) {
      setErrorMsg("Vui lòng điền đầy đủ email và mật khẩu.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const res = addAccount(email, password)
      if (!res.success) {
        setErrorMsg(res.error ?? "Đăng nhập tài khoản thất bại.")
        return
      }

      onClose()
    }, 350)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-pop animate-scale-in">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-fg">
                Thêm tài khoản công ty
              </h3>
              <p className="text-xs text-muted">
                Đăng nhập tài khoản thứ hai vào cùng phiên làm việc
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 text-muted hover:bg-hover hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger-soft p-3 text-xs text-danger">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg">
              Email công ty
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dong-nghiep@congty.vn"
                className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-sm outline-none focus:border-accent"
              />
              <Mail
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-10 w-full rounded-xl border border-line bg-surface pr-10 pl-9 text-sm outline-none focus:border-accent"
              />
              <Lock
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1 text-muted hover:text-fg"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted">
            * Thử nhanh: <code>admin@congty.vn</code> / <code>Admin@12345</code> hoặc <code>binh.tran@congty.vn</code> / <code>Matkhau@123</code>
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-line px-4 py-2 text-xs font-medium text-muted hover:bg-hover hover:text-fg"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-50"
            >
              {loading && <RefreshCw size={14} className="animate-spin" />}
              <span>Thêm và chuyển</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
