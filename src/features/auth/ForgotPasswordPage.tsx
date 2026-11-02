import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Headphones,
  Lock,
  Mail,
  RefreshCw,
  Send,
  ShieldAlert,
} from "lucide-react"
import { useAuthStore } from "./authStore"
import {
  calculatePasswordScore,
  checkPasswordRules,
  PasswordStrengthBar,
} from "./PasswordStrengthBar"
import { AuthDemoSwitcher, type AuthDemoState } from "./AuthDemoSwitcher"

type RecoveryMethod = "secondary_email" | "admin_request"

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const {
    requestOtpReset,
    verifyOtpReset,
    resetPasswordWithOtp,
    requestAdminReset,
  } = useAuthStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [method, setMethod] = useState<RecoveryMethod>("secondary_email")
  const [maskedSecondaryEmail, setMaskedSecondaryEmail] = useState("")
  const [adminRequestId, setAdminRequestId] = useState<string | null>(null)

  // Bước 2: OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""])
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [resendTimer, setResendTimer] = useState(60)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  // Bước 3: Mật khẩu mới
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [demoState, setDemoState] = useState<AuthDemoState>("normal")

  // Bộ đếm gửi lại mã ở bước 2
  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [step, resendTimer])

  // Xử lý Bước 1: Gửi yêu cầu
  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setErrorMsg("Vui lòng nhập địa chỉ email công ty.")
      return
    }

    if (method === "admin_request") {
      const res = requestAdminReset(normalizedEmail)
      setAdminRequestId(res.requestId)
      return
    }

    // Nhận mã qua email phụ
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const res = requestOtpReset(normalizedEmail)
      if (!res.success) {
        setErrorMsg(res.error ?? "Không thể gửi mã xác thực.")
        return
      }

      setMaskedSecondaryEmail(res.secondaryEmailMasked ?? "email phụ của bạn")
      setStep(2)
      setResendTimer(60)
      setOtpDigits(["", "", "", "", "", ""])
    }, 350)
  }

  // Xử lý Bước 2: Nhập OTP
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Xử lý khi dán cả chuỗi
      const digits = value.replace(/\D/g, "").slice(0, 6).split("")
      const next = [...otpDigits]
      digits.forEach((d, i) => {
        if (i < 6) next[i] = d
      })
      setOtpDigits(next)
      const focusTarget = Math.min(digits.length, 5)
      otpInputRefs.current[focusTarget]?.focus()
      return
    }

    const digit = value.replace(/\D/g, "")
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault()
    setOtpError(null)
    const code = otpDigits.join("")
    if (code.length < 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số mã xác thực.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const res = verifyOtpReset(email, code)
      if (!res.success) {
        setOtpError(res.error ?? "Mã OTP không chính xác.")
        setShake(true)
        setTimeout(() => setShake(false), 500)
        return
      }

      setStep(3)
    }, 350)
  }

  // Xử lý Bước 3: Đặt mật khẩu mới
  const rules = checkPasswordRules(newPassword)
  const score = calculatePasswordScore(rules)
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (score < 4) {
      setErrorMsg("Mật khẩu mới chưa đạt tiêu chuẩn bảo mật.")
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Hai mật khẩu không khớp.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      resetPasswordWithOtp(email, newPassword)
      navigate("/login?activated=1", { replace: true })
    }, 400)
  }

  return (
    <div className="relative">
      <AuthDemoSwitcher current={demoState} onChange={setDemoState} />

      {/* Màn chờ khi chọn Nhờ quản trị viên đặt lại */}
      {adminRequestId ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Headphones size={28} />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-fg">
            Yêu cầu đã được gửi
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Yêu cầu đặt lại mật khẩu cho tài khoản <strong>{email}</strong> đã
            được chuyển tới bộ phận Quản trị hệ thống.
          </p>

          <div className="my-5 rounded-xl border border-line bg-surface-2 p-3 text-xs">
            <p className="text-muted">Mã yêu cầu hỗ trợ:</p>
            <p className="mt-1 font-mono text-base font-bold text-accent">
              {adminRequestId}
            </p>
            <p className="mt-2 text-[11px] text-muted">
              Vui lòng cung cấp mã này khi liên hệ hotline nội bộ <strong>8888</strong> để được phê duyệt nhanh.
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-on-accent hover:bg-accent-hover"
          >
            Quay lại trang Đăng nhập
          </Link>
        </div>
      ) : step === 1 ? (
        /* BƯỚC 1: NHẬP EMAIL & CHỌN PHƯƠNG ÁN */
        <div>
          <div className="mb-5">
            <Link
              to="/login"
              className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg"
            >
              <ArrowLeft size={14} />
              <span>Quay lại đăng nhập</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
              Quên mật khẩu?
            </h1>
            <p className="mt-1 text-xs text-muted">
              Chọn phương án để khôi phục quyền truy cập vào tài khoản của bạn
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger-soft p-3 text-xs text-danger">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-1.5 block text-xs font-medium text-fg"
              >
                Email công ty cần khôi phục
              </label>
              <div className="relative">
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten.ho@congty.vn"
                  className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-sm outline-none focus:border-accent"
                />
                <Mail
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <p className="text-xs font-medium text-fg">Phương thức khôi phục:</p>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                  method === "secondary_email"
                    ? "border-accent bg-accent-soft/30"
                    : "border-line bg-surface hover:bg-hover"
                }`}
              >
                <input
                  type="radio"
                  name="recovery-method"
                  checked={method === "secondary_email"}
                  onChange={() => setMethod("secondary_email")}
                  className="mt-0.5 accent-accent"
                />
                <div className="text-xs">
                  <p className="font-semibold text-fg">Nhận mã qua email phụ</p>
                  <p className="text-muted">
                    Hệ thống sẽ gửi mã xác thực 6 số đến địa chỉ email cá nhân bạn đã liên kết trước đó.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                  method === "admin_request"
                    ? "border-accent bg-accent-soft/30"
                    : "border-line bg-surface hover:bg-hover"
                }`}
              >
                <input
                  type="radio"
                  name="recovery-method"
                  checked={method === "admin_request"}
                  onChange={() => setMethod("admin_request")}
                  className="mt-0.5 accent-accent"
                />
                <div className="text-xs">
                  <p className="font-semibold text-fg">Nhờ quản trị viên đặt lại</p>
                  <p className="text-muted">
                    Gửi yêu cầu tới đội ngũ Quản trị IT để được cấp lại mật khẩu tạm thời.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {loading && <RefreshCw size={15} className="animate-spin" />}
              <span>Tiếp tục</span>
            </button>
          </form>
        </div>
      ) : step === 2 ? (
        /* BƯỚC 2: NHẬP MÃ OTP */
        <div>
          <div className="mb-5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted hover:text-fg"
            >
              <ArrowLeft size={14} />
              <span>Quay lại bước trước</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
              Nhập mã xác thực
            </h1>
            <p className="mt-1 text-xs text-muted">
              Nhập mã gồm 6 chữ số đã được gửi đến email phụ{" "}
              <strong>{maskedSecondaryEmail}</strong>
            </p>
          </div>

          {otpError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger-soft p-3 text-xs text-danger">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{otpError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div
              className={`flex justify-between gap-2 ${
                shake ? "animate-shake" : ""
              }`}
            >
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`h-12 w-12 rounded-xl border text-center text-lg font-bold outline-none transition-colors ${
                    otpError
                      ? "border-danger bg-danger-soft/20 text-danger focus:border-danger"
                      : "border-line bg-surface focus:border-accent"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Không nhận được mã?</span>
              {resendTimer > 0 ? (
                <span className="flex items-center gap-1 text-muted">
                  <Clock size={12} />
                  <span>Gửi lại sau {resendTimer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    requestOtpReset(email)
                    setResendTimer(60)
                  }}
                  className="cursor-pointer font-medium text-accent hover:underline"
                >
                  Gửi lại mã ngay
                </button>
              )}
            </div>

            <p className="text-[11px] text-muted/80">
              * Mã mẫu để thử nghiệm: <strong>654321</strong>
            </p>

            <button
              type="submit"
              disabled={loading || otpDigits.join("").length < 6}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <RefreshCw size={15} className="animate-spin" />}
              <span>Xác nhận mã</span>
            </button>
          </form>
        </div>
      ) : (
        /* BƯỚC 3: ĐẶT MẬT KHẨU MỚI */
        <div>
          <div className="mb-5">
            <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
              Đặt mật khẩu mới
            </h1>
            <p className="mt-1 text-xs text-muted">
              Tạo mật khẩu mới an toàn cho tài khoản <strong>{email}</strong>
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger-soft p-3 text-xs text-danger">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="new-pwd"
                className="mb-1.5 block text-xs font-medium text-fg"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="new-pwd"
                  type={showNewPass ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  aria-label={showNewPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShowNewPass((p) => !p)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1 text-muted hover:text-fg"
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrengthBar password={newPassword} />
            </div>

            <div>
              <label
                htmlFor="confirm-pwd"
                className="mb-1.5 block text-xs font-medium text-fg"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="confirm-pwd"
                  type={showConfirmPass ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu..."
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
                  aria-label={showConfirmPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShowConfirmPass((p) => !p)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1 text-muted hover:text-fg"
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-danger">Hai mật khẩu không khớp.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || score < 4 || !passwordsMatch}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <RefreshCw size={15} className="animate-spin" />}
              <span>Cập nhật mật khẩu</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
