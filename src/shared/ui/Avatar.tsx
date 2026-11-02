import type { Employee } from "@/mock-data"

const palette = [
  "#3b82d6",
  "#3fa35b",
  "#8b5fd6",
  "#e8833a",
  "#16a39a",
  "#d9559b",
  "#e5534b",
  "#7a8599",
]
const statusColor = {
  online: "var(--success)",
  busy: "var(--warning-bar)",
  offline: "#9aa3b2",
  away: "#9aa3b2",
}

type Props = {
  name: string
  size?: 24 | 32 | 40 | 48
  status?: Employee["status"]
  className?: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
  ).toUpperCase()
}

export function Avatar({ name, size = 32, status, className = "" }: Props) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: palette[hash % palette.length],
        fontSize: size <= 24 ? 10 : 12,
      }}
      aria-hidden
    >
      {initials(name)}
      {status && (
        <span
          className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface"
          style={{ background: statusColor[status] }}
        />
      )}
    </span>
  )
}
