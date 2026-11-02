import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { useAuthStore } from "./authStore"
import { AuthDemoSwitcher, type AuthDemoState } from "./AuthDemoSwitcher"

export function Verify2faPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/mail/inbox"

  const { pending2faUser, verify2fa, verifyBackupCode } = useAuthStore()

  const [useBackupMode, setUseBackupMode] = useState(false)
  const [backupCode, setBackupCode] = useState("")
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""])
  const [trustDevice, setTrustDevice] = useState(false)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [failCount, setFailCount] = useState(0)
  const [lockCountdown, setLockCountdown] = useState<number | null>(null)
  const [demoState, setDemoState] = useState<AuthDemoState>("normal")

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Đếm ngược gửi lại mã
  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  // Đếm ngược khóa tạm khi sai nhiều lần
  useEffect(() => {
    if (lockCountdown === null || lockCountdown <= 0) return
    const timer = setInterval(() => {
      setLockCountdown((prev) => (prev && prev > 1 ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(timer)
  }, [lockCountdown])

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Dán chuỗi 6 số
      const raw = val.replace(/\D/g, "").slice(0, 6).split("")
      const next = [...digits]
      raw.forEach((d, i) => {
        if (i < 6) next[i] = d
      })
      setDigits(next)
      const targetFocus = Math.min(raw.length, 5)
      inputRefs.current[targetFocus]?.focus()
      return
    }

    const d = val.replace(/\D/g, "")
    const next = [...digits]
    next[index] = d
    setDigits(next)

    if (d && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (lockCountdown !== null && lockCountdown > 0) return
    setErrorMsg(null)

    if (useBackupMode) {
      if (!backupCode.trim()) {
        setErrorMsg("Vui lòng nhập mã dự phòng.")
        return
      }

      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        const res = verifyBackupCode(backupCode)
        if (!res.success) {
          setErrorMsg(res.error ?? "Mã dự phòng không hợp lệ.")
          setShake(true)
          setTimeout(() => setShake(false), 500)
          return
        }
        navigate(redirect, { replace: true })
      }, 400)
      return
    }

    // Xác thực bằng OTP 6 số
    const code = digits.join("")
    if (code.length < 6) {
      setErrorMsg("Vui lòng nhập đủ 6 chữ số mã xác thực.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const res = verify2fa(code, trustDevice)
      if (!res.success) {
        const nextFails = failCount + 1
        setFailCount(nextFails)
        setShake(true)
        setTimeout(() => setShake(false), 500)

        if (nextFails >= 3) {
          setLockCountdown(30)
          setErrorMsg("Bạn đã nhập sai 3 lần. Vui lòng chờ 30 giây để thử lại.")
        } else {
          setErrorMsg(res.error ?? "Mã xác thực không chính xác.")
        }
        return
      }

      navigate(redirect, { replace: true })
    }, 400)
  }

  const isFormDisabled =
    loading || demoState === "loading" || (lockCountdown !== null && lockCountdown > 0)

  return (
    <div className="relative">
      <AuthDemoSwitcher current={demoState} onChange={setDemoState} />

      <div className="mb-5">
        <Link
          to="/login"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg"
        >
          <ArrowLeft size={14} />
          <span>Quay lại đăng nhập</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <ShieldCheck size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
            Xác thực 2 bước
          </h1>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          {useBackupMode
            ? "Nhập một trong các mã khôi phục dự phòng đã được cấp cho tài khoản của bạn."
            : `Nhập mã 6 chữ số từ ứng dụng Google Authenticator hoặc tin nhắn SMS gửi tới thiết bị đã đăng ký cho tài khoản ${
                pending2faUser ? pending2faUser.email : ""
              }`}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger-soft p-3 text-xs text-danger">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{errorMsg}</span>
            {lockCountdown !== null && lockCountdown > 0 && (
              <span className="ml-1 font-semibold">({lockCountdown}s)</span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {useBackupMode ? (
          <div>
            <label
              htmlFor="backup-code-input"
              className="mb-1.5 block text-xs font-medium text-fg"
            >
              Mã dự phòng (8 ký tự)
            </label>
            <div className="relative">
              <input
                id="backup-code-input"
                type="text"
                autoFocus
                disabled={isFormDisabled}
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                placeholder="BACKUP-XXXX"
                className="h-11 w-full rounded-xl border border-line bg-surface pr-3 pl-9 font-mono text-sm tracking-wider uppercase outline-none focus:border-accent"
              />
              <KeyRound
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted">
              * Mã mẫu thử nghiệm: <strong>BACKUP-2026</strong>
            </p>
          </div>
        ) : (
          <div>
            <div
              className={`flex justify-between gap-2 ${
                shake ? "animate-shake" : ""
              }`}
            >
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  disabled={isFormDisabled}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`h-12 w-12 rounded-xl border text-center text-lg font-bold outline-none transition-colors ${
                    errorMsg
                      ? "border-danger bg-danger-soft/20 text-danger focus:border-danger"
                      : "border-line bg-surface focus:border-accent"
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted">Chưa nhận được mã?</span>
              {resendTimer > 0 ? (
                <span className="flex items-center gap-1 text-muted">
                  <Clock size={12} />
                  <span>Gửi lại sau {resendTimer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setResendTimer(60)}
                  className="cursor-pointer font-medium text-accent hover:underline"
                >
                  Gửi lại mã qua SMS
                </button>
              )}
            </div>

            <p className="mt-1.5 text-[11px] text-muted">
              * Mã xác thực mẫu: <strong>123456</strong>
            </p>
          </div>
        )}

        {/* Ô tích tin cậy thiết bị */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="trust-device"
            type="checkbox"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            className="h-4 w-4 rounded border-line text-accent accent-accent focus:ring-accent"
          />
          <label
            htmlFor="trust-device"
            className="cursor-pointer text-xs select-none text-muted"
          >
            Tin cậy thiết bị này trong 30 ngày (không hỏi lại 2FA)
          </label>
        </div>

        {/* Nút Xác nhận */}
        <button
          type="submit"
          disabled={isFormDisabled}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <RefreshCw size={15} className="animate-spin" />}
          <span>
            {lockCountdown !== null && lockCountdown > 0
              ? `Tạm khóa (${lockCountdown}s)`
              : "Xác nhận"}
          </span>
        </button>

        {/* Liên kết đổi chế độ Dùng mã dự phòng */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setUseBackupMode((p) => !p)
              setErrorMsg(null)
            }}
            className="cursor-pointer text-xs text-accent hover:underline"
          >
            {useBackupMode
              ? "Sử dụng mã OTP 6 chữ số thông thường"
              : "Dùng mã dự phòng thay thế"}
          </button>
        </div>
      </form>
    </div>
  )
}
