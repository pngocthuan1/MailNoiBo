const pad = (n: number) => String(n).padStart(2, "0")

export function clock(ts: number) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

/** Giờ nếu là hôm nay, ngày tháng nếu cùng năm, ngày đầy đủ nếu khác năm. */
export function listTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  if (sameDay(d, now)) return clock(ts)
  if (d.getFullYear() === now.getFullYear())
    return `${d.getDate()} thg ${d.getMonth() + 1}`
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

/** Thời điểm tương lai: "08:00 hôm nay", "08:00 ngày mai", "08:00, 14 thg 11". */
export function futureTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 86_400_000)
  if (sameDay(d, now)) return `${clock(ts)} hôm nay`
  if (sameDay(d, tomorrow)) return `${clock(ts)} ngày mai`
  return `${clock(ts)}, ${d.getDate()} thg ${d.getMonth() + 1}`
}

/** Nhãn hạn xử lý + trạng thái quá hạn. */
export function dueInfo(ts: number) {
  const overdue = ts < Date.now()
  const text = futureTime(ts)
    .replace("hôm nay", "hôm nay")
    .replace("ngày mai", "mai")
  return { overdue, text: overdue ? `Quá hạn · ${text}` : `Hạn ${text}` }
}

function at(base: Date, hour: number, dayOffset = 0) {
  const d = new Date(base)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, 0, 0, 0)
  return d.getTime()
}

/** Các mốc hoãn nhanh (HT-09). */
export function snoozePresets() {
  const now = new Date()
  const afternoon =
    now.getHours() < 15 ? at(now, 17) : now.getTime() + 3 * 3_600_000
  const dow = now.getDay() // 0 = CN
  const toSaturday = (6 - dow + 7) % 7 || 7
  const toMonday = (1 - dow + 7) % 7 || 7
  return [
    { label: "Chiều nay", ts: afternoon },
    { label: "Sáng mai", ts: at(now, 8, 1) },
    { label: "Cuối tuần", ts: at(now, 8, toSaturday) },
    { label: "Tuần sau", ts: at(now, 8, toMonday) },
  ]
}
