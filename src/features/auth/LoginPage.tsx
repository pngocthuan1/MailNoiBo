import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { useAuthStore } from "./authStore"
import { AuthDemoSwitcher, type AuthDemoState } from "./AuthDemoSwitcher"

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/mail/inbox"
  const isExpired = searchParams.get("expired") === "1"
  const isActivated = searchParams.get("activated") === "1"

  const { login, loginWithSSO, sessionStatus } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const [loading, setLoading] = useState(false)
  const [ssoLoading, setSsoLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [demoState, setDemoState] = useState<AuthDemoState>("normal")
  const [countdown, setCountdown] = useState<number | null>(null)

  // Countdown timer cho trường hợp thử sai nhiều lần
  useEffect(() => {
    if (countdown === null || countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev && prev > 1 ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (countdown !== null && countdown > 0) return
    if (!email.trim() || !password) {
      setErrorMsg("Vui lòng điền đầy đủ email và mật khẩu.")
      return
    }

    setErrorMsg(null)
    setLoading(true)

    // Giả lập độ trễ mạng nhẹ
    setTimeout(() => {
      setLoading(false)
      const res = login(email, password, rememberMe)
      if (!res.success) {
        setErrorMsg(res.error ?? "Đăng nhập thất bại.")
        if (res.error?.includes("thử lại sau")) {
          setCountdown(30)
        }
        return
      }

      if (res.require2fa) {
        navigate(`/verify-2fa?redirect=${encodeURIComponent(redirect)}`)
      } else {
        navigate(redirect, { replace: true })
      }
    }, 350)
  }

  const handleSSO = () => {
    setSsoLoading(true)
    setErrorMsg(null)
    setTimeout(() => {
      loginWithSSO()
      setSsoLoading(false)
      navigate(redirect, { replace: true })
    }, 1000)
  }

  const isFormDisabled =
    loading || ssoLoading || demoState === "loading" || (countdown !== null && countdown > 0)

  return (
    <div className="relative">
      <AuthDemoSwitcher current={demoState} onChange={setDemoState} />

      {/* Dải cảnh báo phiên hết hạn */}
      {isExpired && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-warning-bar bg-warning-soft p-3 text-xs text-amber-900">
          <AlertTriangle size={16} className="shrink-0 text-warning-bar mt-0.5" />
          <div>
            <p className="font-semibold">Phiên làm việc đã hết hạn</p>
            <p className="mt-0.5 text-muted">
              Vui lòng đăng nhập lại để tiếp tục. Bản nháp thư đang soạn đã được lưu an
              toàn trên máy của bạn.
            </p>
          </div>
        </div>
      )}

      {/* Dải thông báo kích hoạt thành công */}
      {isActivated && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-success/40 bg-success-soft p-3 text-xs text-success">
          <CheckCircle2 size={16} className="shrink-0" />
          <p className="font-medium">
            Đã kích hoạt tài khoản thành công! Mời bạn đăng nhập bằng mật khẩu vừa đặt.
          </p>
        </div>
      )}

      {/* Màn hình giả lập đang chuyển hướng SSO */}
      {ssoLoading ? (
        <div className="py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-fg">
            Đang chuyển hướng sang cổng SSO...
          </h2>
          <p className="mt-1.5 text-xs text-muted">
            Đang xác thực thông tin tài khoản công ty an.nguyen@congty.vn
          </p>
        </div>
      ) : demoState === "network_error" ? (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
            <AlertCircle size={24} />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-fg">
            Lỗi kết nối máy chủ xác thực
          </h2>
          <p className="mt-1 text-xs text-muted">
            Không thể liên lạc với máy chủ Active Directory / LDAP. Vui lòng thử lại.
          </p>
          <button
            type="button"
            onClick={() => setDemoState("normal")}
            className="mt-4 cursor-pointer rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-on-accent hover:bg-accent-hover"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
              Đăng nhập
            </h1>
            <p className="mt-1 text-xs text-muted">
              Nhập email và mật khẩu tài khoản công ty của bạn
            </p>
          </div>

          {/* Hộp lỗi đăng nhập */}
          {errorMsg && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-danger/40 bg-danger-soft p-3 text-xs text-danger">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                {countdown !== null && countdown > 0 && (
                  <span className="ml-1 font-semibold">({countdown}s)</span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ô Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-medium text-fg"
              >
                Email công ty
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  disabled={isFormDisabled}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten.ho@congty.vn"
                  className={`h-10 w-full rounded-xl border bg-surface pr-3 pl-9 text-sm outline-none transition-colors disabled:opacity-60 ${
                    errorMsg ? "border-danger focus:border-danger" : "border-line focus:border-accent"
                  }`}
                />
                <Mail
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                />
              </div>
            </div>

            {/* Ô Mật khẩu */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-medium text-fg"
                >
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-accent hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isFormDisabled}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`h-10 w-full rounded-xl border bg-surface pr-10 pl-9 text-sm outline-none transition-colors disabled:opacity-60 ${
                    errorMsg ? "border-danger focus:border-danger" : "border-line focus:border-accent"
                  }`}
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

            {/* Ô tích Ghi nhớ đăng nhập */}
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-line text-accent accent-accent focus:ring-accent"
              />
              <label
                htmlFor="remember-me"
                className="cursor-pointer text-xs select-none text-muted"
              >
                Ghi nhớ đăng nhập trên thiết bị này
              </label>
            </div>

            {/* Nút Đăng nhập */}
            <button
              type="submit"
              disabled={isFormDisabled}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {(loading || demoState === "loading") && (
                <RefreshCw size={15} className="animate-spin" />
              )}
              <span>
                {countdown !== null && countdown > 0
                  ? `Vui lòng thử lại sau (${countdown}s)`
                  : "Đăng nhập"}
              </span>
            </button>
          </form>

          {/* Đường kẻ chữ "hoặc" */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-line" />
            <span className="text-xs text-muted">hoặc</span>
            <div className="h-[1px] flex-1 bg-line" />
          </div>

          {/* Nút Đăng nhập SSO (TK-06) */}
          <button
            type="button"
            onClick={handleSSO}
            disabled={isFormDisabled}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-xs font-semibold text-fg transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShieldCheck size={16} className="text-accent" />
            <span>Đăng nhập bằng tài khoản công ty (SSO)</span>
          </button>

          {/* Gợi ý tài khoản mẫu để test nhanh */}
          <div className="mt-5 rounded-xl border border-line/60 bg-surface-2/50 p-2.5 text-[11px] text-muted">
            <p className="font-semibold text-fg">Tài khoản mẫu để thử nghiệm:</p>
            <div className="mt-1 space-y-0.5">
              <p>
                • <strong>an.nguyen@congty.vn</strong> / <code>Matkhau@123</code> (Nhân viên)
              </p>
              <p>
                • <strong>admin@congty.vn</strong> / <code>Admin@12345</code> (Quản trị viên)
              </p>
              <p>
                • <strong>binh.tran@congty.vn</strong> / <code>Matkhau@123</code> (Bật 2FA: 123456)
              </p>
              <p>
                • <strong>khoa@congty.vn</strong> (Bị khóa) | <strong>chuakichhoat@congty.vn</strong> (Chưa kích hoạt)
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
