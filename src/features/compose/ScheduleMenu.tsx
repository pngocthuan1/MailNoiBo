import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Popover } from "@/shared/ui/Popover"

export type ScheduleTime = { ts: number label: string }

function getNextMonday8am(): number {
  const d = new Date()
  const day = d.getDay() // 0=Sun, 1=Mon...
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  d.setDate(d.getDate() + daysUntilMonday)
  d.setHours(8, 0, 0, 0)
  return d.getTime()
}

function getTomorrow(hour: number): number {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(hour, 0, 0, 0)
  return d.getTime()
}

function formatVi(ts: number): string {
  return new Date(ts).toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

type Props = {
  onSchedule: (time: ScheduleTime) => void
}

/** Menu hẹn giờ gửi (SO-08) */
export function ScheduleMenu({ onSchedule }: Props) {
  const [customDate, setCustomDate] = useState("")
  const [customTime, setCustomTime] = useState("08:00")
  const [error, setError] = useState("")

  const presets: ScheduleTime[] = [
    { ts: getTomorrow(8), label: "Sáng mai 08:00" },
    { ts: getTomorrow(13), label: "Chiều mai 13:00" },
    { ts: getNextMonday8am(), label: "Thứ Hai 08:00" },
  ]

  const handleCustom = (close: () => void) => {
    if (!customDate) {
      setError("Vui lòng chọn ngày")
      return
    }
    const [h, m] = customTime.split(":").map(Number)
    const d = new Date(customDate)
    d.setHours(h, m, 0, 0)
    const ts = d.getTime()
    if (ts <= Date.now()) {
      setError("Thời gian đã qua, hãy chọn thời gian trong tương lai")
      return
    }
    setError("")
    onSchedule({ ts, label: formatVi(ts) })
    close()
  }

  // Today's date string for min attribute
  const todayStr = new Date().toISOString().split("T")[0]

  return (
    <Popover
      align="left"
      up
      className="w-64 py-1"
      trigger={({ toggle }) => (
        <button
          type="button"
          title="Hẹn giờ gửi"
          aria-label="Hẹn giờ gửi"
          onClick={toggle}
          className="flex h-9 w-8 cursor-pointer items-center justify-center rounded-r-full border-l border-white/30 bg-accent text-on-accent hover:bg-accent/90"
        >
          <ChevronDown size={14} />
        </button>
      )}
    >
      {(close) => (
        <div>
          <p className="px-4 py-2 text-xs font-semibold text-muted">
            Hẹn giờ gửi
          </p>
          {presets.map((p) => (
            <button
              key={p.ts}
              type="button"
              onClick={() => {
                onSchedule(p)
                close()
              }}
              className="flex h-10 w-full cursor-pointer items-center gap-3 px-4 text-sm hover:bg-hover"
            >
              <Calendar size={16} className="text-muted" />
              {p.label}
            </button>
          ))}
          <div className="border-t border-line px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted">Chọn ngày giờ</p>
            <input
              type="date"
              min={todayStr}
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value)
                setError("")
              }}
              className="mb-2 h-8 w-full rounded border border-line bg-surface px-2 text-sm outline-none focus:border-accent"
            />
            <input
              type="time"
              value={customTime}
              onChange={(e) => {
                setCustomTime(e.target.value)
                setError("")
              }}
              className="mb-2 h-8 w-full rounded border border-line bg-surface px-2 text-sm outline-none focus:border-accent"
            />
            {error && <p className="mb-2 text-xs text-danger">{error}</p>}
            <button
              type="button"
              onClick={() => handleCustom(close)}
              className="h-8 w-full cursor-pointer rounded-full bg-accent text-sm font-medium text-on-accent hover:bg-accent/90"
            >
              Đặt lịch
            </button>
          </div>
        </div>
      )}
    </Popover>
  )
}
