import { useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  Send,
} from "lucide-react"
import { useAuthStore } from "./authStore"
import {
  calculatePasswordScore,
  checkPasswordRules,
  PasswordStrengthBar,
} from "./PasswordStrengthBar"
import { AuthDemoSwitcher, type AuthDemoState } from "./AuthDemoSwitcher"

export function ActivatePage() {
  const { token = "" } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { activateAccount } = useAuthStore()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [requestedNewLink, setRequestedNewLink] = useState(false)
  const [activatedSuccess, setActivatedSuccess] = useState(false)
  const [demoState, setDemoState] = useState<AuthDemoState>("normal")

  const isExpired = token.includes("expired") || demoState === "network_error"

  const rules = checkPasswordRules(password)
  const score = calculatePasswordScore(rules)
  const passwordsMatch = password.length > 0 && password === confirmPassword

  const handleActivate = (e: FormEvent) => {
    e.preventDefault()
    if (score < 4) {
      setErrorMsg("Mật khẩu chưa đáp ứng đầy đủ tất cả các tiêu chí bảo mật.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg("Hai ô mật khẩu không khớp nhau.")
      return
    }

    setErrorMsg(null)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      const res = activateAccount(token, password)
      if (!res.success) {
        setErrorMsg(res.error ?? "Kích hoạt tài khoản thất bại.")
        return
      }

      setActivatedSuccess(true)
      setTimeout(() => {
        navigate("/login?activated=1", { replace: true })
      }, 1200)
    }, 400)
  }

  const handleRequestNewLink = () => {
    setRequestedNewLink(true)
  }

  if (isExpired) {
    return (
      <div className="relative">
        <AuthDemoSwitcher current={demoState} onChange={setDemoState} />

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger">
            <AlertCircle size={28} />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-fg">
            Liên kết đã hết hạn
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Liên kết kích hoạt tài khoản này không hợp lệ hoặc đã quá hạn sử dụng (quá 24 giờ kể từ thời điểm khởi tạo).
          </p>

          {requestedNewLink ? (
            <div className="mt-5 rounded-xl border border-success/40 bg-success-soft p-3 text-xs text-success">
              <CheckCircle2 size={16} className="mx-auto mb-1" />
              <p className="font-semibold">Đã gửi yêu cầu cấp liên kết mới</p>
              <p className="mt-0.5 text-muted">
                Quản trị viên đã nhận được thông báo và sẽ gửi liên kết mới tới hòm thư cá nhân của bạn.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestNewLink}
              className="mt-6 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-on-accent transition-colors hover:bg-accent-hover"
            >
              <Send size={15} />
              <span>Yêu cầu liên kết mới</span>
            </button>
          )}

          <div className="mt-4">
            <Link to="/login" className="text-xs text-accent hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (activatedSuccess) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success ring-8 ring-success-soft/30">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-fg">Kích hoạt thành công!</h2>
        <p className="mt-1.5 text-xs text-muted">
          Đang chuyển hướng về trang đăng nhập...
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <AuthDemoSwitcher current={demoState} onChange={setDemoState} />

      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
          Chào Lê Hoàng Nam,
        </h1>
        <p className="mt-1 text-xs text-muted">
          Đặt mật khẩu của bạn để kích hoạt tài khoản hòm thư công ty
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger-soft p-3 text-xs text-danger">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleActivate} className="space-y-4">
        {/* Email chỉ đọc */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-fg">
            Email công ty được cấp
          </label>
          <div className="relative">
            <input
              type="email"
              readOnly
              value="chuakichhoat@congty.vn"
              className="h-10 w-full rounded-xl border border-line bg-surface-2 pr-3 pl-9 text-sm text-muted outline-none cursor-not-allowed"
            />
            <Mail
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            />
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label
            htmlFor="new-password"
            className="mb-1.5 block text-xs font-medium text-fg"
          >
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
              className="h-10 w-full rounded-xl border border-line bg-surface pr-10 pl-9 text-sm outline-none focus:border-accent"
            />
            <Lock
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPass((p) => !p)}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1 text-muted hover:text-fg"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrengthBar password={password} />
        </div>

        {/* Nhập lại mật khẩu */}
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1.5 block text-xs font-medium text-fg"
          >
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu vừa đặt..."
              className={`h-10 w-full rounded-xl border bg-surface pr-10 pl-9 text-sm outline-none ${
                confirmPassword && !passwordsMatch
                  ? "border-danger focus:border-danger"
                  : "border-line focus:border-accent"
              }`}
            />
            <Lock
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1 text-muted hover:text-fg"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-xs text-danger">Hai mật khẩu không khớp.</p>
          )}
        </div>

        {/* Nút kích hoạt */}
        <button
          type="submit"
          disabled={loading || score < 4 || !passwordsMatch}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <RefreshCw size={15} className="animate-spin" />}
          <span>Kích hoạt tài khoản</span>
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/login" className="text-xs text-accent hover:underline">
          Đã có tài khoản? Đăng nhập ngay
        </Link>
      </div>
    </div>
  )
}
