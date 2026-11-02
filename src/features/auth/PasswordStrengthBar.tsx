import { Check, X } from "lucide-react"

export type PasswordRules = {
  minLength: boolean
  hasUpper: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export function checkPasswordRules(password: string): PasswordRules {
  return {
    minLength: password.length >= 10,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  }
}

export function calculatePasswordScore(rules: PasswordRules): number {
  let score = 0
  if (rules.minLength) score++
  if (rules.hasUpper) score++
  if (rules.hasNumber) score++
  if (rules.hasSpecial) score++
  return score
}

const levelLabels = ["Rất yếu", "Yếu", "Trung bình", "Khá", "Mạnh"]
const levelColors = [
  "bg-line",
  "bg-danger",
  "bg-amber-500",
  "bg-blue-500",
  "bg-success",
]

export function PasswordStrengthBar({ password }: { password: string }) {
  const rules = checkPasswordRules(password)
  const score = calculatePasswordScore(rules)

  if (!password) {
    return null
  }

  return (
    <div className="mt-2 space-y-2 text-xs">
      <div className="flex items-center justify-between text-muted">
        <span>Độ mạnh mật khẩu:</span>
        <span
          className={`font-medium ${
            score <= 1
              ? "text-danger"
              : score === 2
                ? "text-amber-500"
                : score === 3
                  ? "text-blue-500"
                  : "text-success"
          }`}
        >
          {levelLabels[score]}
        </span>
      </div>

      {/* 4 thanh chỉ thị mức độ */}
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all ${
              step <= score ? levelColors[score] : "bg-surface-2 border border-line/60"
            }`}
          />
        ))}
      </div>

      {/* Danh sách điều kiện */}
      <ul className="mt-2 space-y-1 text-muted">
        <li className="flex items-center gap-1.5">
          {rules.minLength ? (
            <Check size={13} className="text-success" />
          ) : (
            <X size={13} className="text-muted/60" />
          )}
          <span className={rules.minLength ? "text-fg font-medium" : ""}>
            Từ 10 ký tự trở lên
          </span>
        </li>
        <li className="flex items-center gap-1.5">
          {rules.hasUpper ? (
            <Check size={13} className="text-success" />
          ) : (
            <X size={13} className="text-muted/60" />
          )}
          <span className={rules.hasUpper ? "text-fg font-medium" : ""}>
            Có ít nhất 1 chữ hoa (A-Z)
          </span>
        </li>
        <li className="flex items-center gap-1.5">
          {rules.hasNumber ? (
            <Check size={13} className="text-success" />
          ) : (
            <X size={13} className="text-muted/60" />
          )}
          <span className={rules.hasNumber ? "text-fg font-medium" : ""}>
            Có ít nhất 1 chữ số (0-9)
          </span>
        </li>
        <li className="flex items-center gap-1.5">
          {rules.hasSpecial ? (
            <Check size={13} className="text-success" />
          ) : (
            <X size={13} className="text-muted/60" />
          )}
          <span className={rules.hasSpecial ? "text-fg font-medium" : ""}>
            Có ký tự đặc biệt (!@#$%^&*...)
          </span>
        </li>
      </ul>
    </div>
  )
}
