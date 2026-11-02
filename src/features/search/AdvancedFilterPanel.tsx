import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Filter, X } from "lucide-react"
import { useAllLabels } from "@/shared/state/mailStore"
import { folders } from "@/mock-data"
import type { AdvancedFilters } from "./searchTypes"

type Props = {
  initialValues?: AdvancedFilters
  currentQuery?: string
  onApply: (filters: AdvancedFilters) => void
  onClose: () => void
}

export function AdvancedFilterPanel({
  initialValues = {},
  currentQuery = "",
  onApply,
  onClose,
}: Props) {
  const navigate = useNavigate()
  const allLabels = useAllLabels()

  const [from, setFrom] = useState(initialValues.from || "")
  const [to, setTo] = useState(initialValues.to || "")
  const [subject, setSubject] = useState(initialValues.subject || "")
  const [hasWords, setHasWords] = useState(initialValues.hasWords || "")
  const [withoutWords, setWithoutWords] = useState(
    initialValues.withoutWords || "",
  )
  const [sizeOp, setSizeOp] = useState<"gt" | "lt">(
    initialValues.sizeOp || "gt",
  )
  const [sizeMb, setSizeMb] = useState<string>(
    initialValues.sizeMb ? String(initialValues.sizeMb) : "",
  )
  const [datePreset, setDatePreset] =
    useState<"1d" | "1w" | "1m" | "1y" | "custom" | "">(
      initialValues.datePreset || "",
    )
  const [dateFrom, setDateFrom] = useState(initialValues.dateFrom || "")
  const [dateTo, setDateTo] = useState(initialValues.dateTo || "")
  const [searchIn, setSearchIn] = useState(initialValues.searchIn || "all")
  const [hasAttachment, setHasAttachment] = useState(
    initialValues.hasAttachment || false,
  )
  const [dateError, setDateError] = useState("")

  const handlePreset = (preset: "1d" | "1w" | "1m" | "1y") => {
    setDatePreset(preset)
    setDateError("")
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]
    setDateTo(todayStr)

    const past = new Date()
    if (preset === "1d") past.setDate(now.getDate() - 1)
    else if (preset === "1w") past.setDate(now.getDate() - 7)
    else if (preset === "1m") past.setMonth(now.getMonth() - 1)
    else if (preset === "1y") past.setFullYear(now.getFullYear() - 1)

    setDateFrom(past.toISOString().split("T")[0])
  }

  const validateDates = (fromVal: string, toVal: string): boolean => {
    if (fromVal && toVal) {
      if (fromVal > toVal) {
        setDateError(
          "Khoảng ngày không hợp lệ: ngày bắt đầu phải trước ngày kết thúc",
        )
        return false
      }
    }
    setDateError("")
    return true
  }

  const handleReset = () => {
    setFrom("")
    setTo("")
    setSubject("")
    setHasWords("")
    setWithoutWords("")
    setSizeOp("gt")
    setSizeMb("")
    setDatePreset("")
    setDateFrom("")
    setDateTo("")
    setSearchIn("all")
    setHasAttachment(false)
    setDateError("")
  }

  const handleSearch = () => {
    if (!validateDates(dateFrom, dateTo)) return

    const filters: AdvancedFilters = {
      from: from.trim() || undefined,
      to: to.trim() || undefined,
      subject: subject.trim() || undefined,
      hasWords: hasWords.trim() || undefined,
      withoutWords: withoutWords.trim() || undefined,
      sizeOp: sizeMb ? sizeOp : undefined,
      sizeMb: sizeMb ? parseFloat(sizeMb) : undefined,
      datePreset: datePreset || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      searchIn: searchIn || "all",
      hasAttachment: hasAttachment || undefined,
    }

    onApply(filters)
  }

  // TM-08: Tạo bộ lọc từ tìm kiếm này -> đi tới /settings/filters/new
  const handleCreateFilter = () => {
    if (!validateDates(dateFrom, dateTo)) return

    const params = new URLSearchParams()
    if (from.trim()) params.set("from", from.trim())
    if (to.trim()) params.set("to", to.trim())
    if (subject.trim()) params.set("subject", subject.trim())
    if (hasWords.trim()) params.set("hasWords", hasWords.trim())
    if (withoutWords.trim()) params.set("withoutWords", withoutWords.trim())
    if (hasAttachment) params.set("hasAttachment", "true")
    if (sizeMb) params.set("size", `${sizeOp}:${sizeMb}`)
    if (currentQuery.trim()) params.set("q", currentQuery.trim())

    onClose()
    navigate(`/settings/filters/new?${params.toString()}`)
  }

  return (
    <div
      role="dialog"
      aria-label="Bảng lọc nâng cao"
      className="animate-slide-up w-[560px] max-w-[95vw] rounded-2xl border border-line bg-surface p-5 text-sm shadow-pop"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2 font-semibold text-fg">
          <Filter size={18} className="text-accent" />
          <span>Bộ lọc tìm kiếm nâng cao</span>
        </div>
        <button
          type="button"
          aria-label="Đóng bảng lọc"
          onClick={onClose}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Từ */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label
            htmlFor="filter-from"
            className="text-right text-xs font-medium text-muted"
          >
            Từ
          </label>
          <input
            id="filter-from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Tên hoặc email người gửi"
            className="h-9 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Đến */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label
            htmlFor="filter-to"
            className="text-right text-xs font-medium text-muted"
          >
            Đến
          </label>
          <input
            id="filter-to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Tên hoặc email người nhận"
            className="h-9 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Tiêu đề */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label
            htmlFor="filter-subject"
            className="text-right text-xs font-medium text-muted"
          >
            Tiêu đề
          </label>
          <input
            id="filter-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Từ khóa trong tiêu đề thư"
            className="h-9 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Có các từ */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label
            htmlFor="filter-has-words"
            className="text-right text-xs font-medium text-muted"
          >
            Có các từ
          </label>
          <input
            id="filter-has-words"
            value={hasWords}
            onChange={(e) => setHasWords(e.target.value)}
            placeholder="Từ khóa cần có trong thư"
            className="h-9 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Không có các từ */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label
            htmlFor="filter-without-words"
            className="text-right text-xs font-medium text-muted"
          >
            Không có
          </label>
          <input
            id="filter-without-words"
            value={withoutWords}
            onChange={(e) => setWithoutWords(e.target.value)}
            placeholder="Từ khóa cần loại trừ"
            className="h-9 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Kích thước */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label
            htmlFor="filter-size-op"
            className="text-right text-xs font-medium text-muted"
          >
            Kích thước
          </label>
          <div className="flex items-center gap-2">
            <select
              id="filter-size-op"
              value={sizeOp}
              onChange={(e) => setSizeOp(e.target.value as "gt" | "lt")}
              className="h-9 rounded-lg border border-line bg-bg px-2.5 text-sm outline-none focus:border-accent"
            >
              <option value="gt">Lớn hơn</option>
              <option value="lt">Nhỏ hơn</option>
            </select>
            <input
              type="number"
              min="0"
              step="0.5"
              value={sizeMb}
              onChange={(e) => setSizeMb(e.target.value)}
              placeholder="Số lượng"
              className="h-9 w-28 rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent"
            />
            <span className="text-xs text-muted">MB</span>
          </div>
        </div>

        {/* Khoảng ngày */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-3">
          <span className="pt-2 text-right text-xs font-medium text-muted">
            Khoảng ngày
          </span>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {(["1d", "1w", "1m", "1y"] as const).map((p) => {
                const label =
                  p === "1d"
                    ? "1 ngày"
                    : p === "1w"
                      ? "1 tuần"
                      : p === "1m"
                        ? "1 tháng"
                        : "1 năm"
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePreset(p)}
                    className={`h-7 cursor-pointer rounded-full border px-2.5 text-xs font-medium transition-colors ${
                      datePreset === p
                        ? "border-accent bg-accent text-on-accent"
                        : "border-line bg-surface hover:bg-hover"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setDatePreset("custom")
                  validateDates(e.target.value, dateTo)
                }}
                className="h-9 w-36 rounded-lg border border-line bg-bg px-2 text-xs outline-none focus:border-accent"
              />
              <span className="text-xs text-muted">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setDatePreset("custom")
                  validateDates(dateFrom, e.target.value)
                }}
                className="h-9 w-36 rounded-lg border border-line bg-bg px-2 text-xs outline-none focus:border-accent"
              />
            </div>
            {dateError && (
              <p className="text-xs font-medium text-danger">{dateError}</p>
            )}
          </div>
        </div>

        {/* Tìm trong */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label
            htmlFor="filter-search-in"
            className="text-right text-xs font-medium text-muted"
          >
            Tìm trong
          </label>
          <select
            id="filter-search-in"
            value={searchIn}
            onChange={(e) => setSearchIn(e.target.value)}
            className="h-9 w-full rounded-lg border border-line bg-bg px-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="all">Tất cả thư (trừ Thùng rác & Spam)</option>
            <option value="inbox">Hộp thư đến (Inbox)</option>
            <option value="sent">Đã gửi</option>
            <option value="drafts">Nháp</option>
            <option value="trash">Thùng rác</option>
            <option value="spam">Spam</option>
            <optgroup label="Nhãn">
              {allLabels.map((lbl) => (
                <option key={lbl.id} value={`label:${lbl.id}`}>
                  Nhãn: {lbl.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Có tệp đính kèm */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <span />
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hasAttachment}
              onChange={(e) => setHasAttachment(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            <span className="text-sm font-medium">Có tệp đính kèm</span>
          </label>
        </div>
      </div>

      {/* Hành động dưới chân bảng lọc */}
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        {/* TM-08: Nút Tạo bộ lọc */}
        <button
          type="button"
          onClick={handleCreateFilter}
          className="cursor-pointer text-xs font-medium text-accent hover:underline"
        >
          Tạo bộ lọc từ tìm kiếm này
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="h-9 cursor-pointer rounded-full border border-line px-4 text-xs font-medium text-muted hover:bg-hover hover:text-fg"
          >
            Xóa lọc
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="h-9 cursor-pointer rounded-full bg-accent px-5 text-xs font-medium text-on-accent shadow-sm hover:bg-accent/90"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  )
}
