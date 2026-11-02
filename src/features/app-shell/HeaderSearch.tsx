import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  AlertCircle,
  Clock,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react"
import { employees, popularKeywords } from "@/mock-data"
import { useAllLabels } from "@/shared/state/mailStore"
import { LabelDot } from "@/shared/ui/LabelDot"
import { searchHistory } from "@/features/search/searchHistory"
import { parseSearchQuery } from "@/features/search/searchUtils"
import { AdvancedFilterPanel } from "@/features/search/AdvancedFilterPanel"
import type {
  AdvancedFilters,
  OperatorToken,
} from "@/features/search/searchTypes"

const ALL_OPERATORS = [
  { key: "from:", label: "from:", desc: "Người gửi" },
  { key: "to:", label: "to:", desc: "Người nhận" },
  { key: "subject:", label: "subject:", desc: "Tiêu đề" },
  { key: "has:attachment", label: "has:attachment", desc: "Có tệp đính kèm" },
  { key: "before:", label: "before:YYYY-MM-DD", desc: "Trước ngày" },
  { key: "after:", label: "after:YYYY-MM-DD", desc: "Sau ngày" },
  { key: "label:", label: "label:", desc: "Nhãn thư" },
]

type SuggestionItem =
  | {
      type: "person"
      id: string
      name: string
      email: string
      title: string
    }
  | { type: "label"; id: string; name: string; color: number }
  | {
      type: "keyword"
      text: string
    }

export function HeaderSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const allLabels = useAllLabels()

  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Đồng bộ lịch sử tìm kiếm
  useEffect(() => {
    return searchHistory.subscribe(setHistory)
  }, [])

  // Giữ từ khóa trong ô khi ở trang tìm kiếm
  useEffect(() => {
    if (location.pathname === "/search") {
      const sp = new URLSearchParams(location.search)
      const q = sp.get("q") ?? ""
      setText(q)
    }
  }, [location.pathname, location.search])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false)
        setShowFilterPanel(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  // Phân tích cú pháp trong text hiện tại (TM-06)
  const parsed = parseSearchQuery(text)
  const activeOperatorKeys = new Set(parsed.tokens.map((t) => t.key))
  const remainingOperators = ALL_OPERATORS.filter((op) => {
    const k = op.key.replace(":", "") as any
    return !activeOperatorKeys.has(k)
  })

  // Danh sách gợi ý khi gõ (TM-07)
  const suggestions: SuggestionItem[] = []
  const trimmed = text.trim()

  if (trimmed) {
    const lower = trimmed.toLowerCase()

    // 1. Nhóm Người
    const matchedPeople = employees
      .filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.email.toLowerCase().includes(lower) ||
          e.title.toLowerCase().includes(lower),
      )
      .slice(0, 3)
    matchedPeople.forEach((p) => {
      suggestions.push({
        type: "person",
        id: p.id,
        name: p.name,
        email: p.email,
        title: p.title,
      })
    })

    // 2. Nhóm Nhãn
    const matchedLabels = allLabels
      .filter(
        (l) =>
          l.name.toLowerCase().includes(lower) ||
          l.id.toLowerCase().includes(lower),
      )
      .slice(0, 3)
    matchedLabels.forEach((l) => {
      suggestions.push({
        type: "label",
        id: l.id,
        name: l.name,
        color: l.color,
      })
    })

    // 3. Nhóm Từ khóa phổ biến
    const matchedKeywords = popularKeywords
      .filter(
        (k) => k.toLowerCase().includes(lower) && k.toLowerCase() !== lower,
      )
      .slice(0, 3)
    matchedKeywords.forEach((k) => {
      suggestions.push({
        type: "keyword",
        text: k,
      })
    })
  }

  const runSearch = (q: string) => {
    const finalQ = q.trim()
    if (!finalQ) return
    searchHistory.add(finalQ)
    setOpen(false)
    setShowFilterPanel(false)
    navigate(`/search?q=${encodeURIComponent(finalQ)}`)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (activeIdx >= 0 && activeIdx < suggestions.length) {
      applySuggestion(suggestions[activeIdx])
      return
    }
    if (text.trim()) {
      runSearch(text)
    }
  }

  const applySuggestion = (s: SuggestionItem) => {
    if (s.type === "person") {
      const newQuery = `from:${s.email}`
      setText(newQuery)
      runSearch(newQuery)
    } else if (s.type === "label") {
      const newQuery = `label:${s.id}`
      setText(newQuery)
      runSearch(newQuery)
    } else if (s.type === "keyword") {
      setText(s.text)
      runSearch(s.text)
    }
  }

  // Điều khiển bàn phím: Mũi tên lên / xuống / Enter (TM-07)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (suggestions.length > 0) {
        setActiveIdx((prev) => (prev + 1) % suggestions.length)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (suggestions.length > 0) {
        setActiveIdx((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1))
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      setShowFilterPanel(false)
    }
  }

  const handleAppendOperator = (opStr: string) => {
    const spacer = text.endsWith(" ") || text.length === 0 ? "" : " "
    const next = `${text}${spacer}${opStr}`
    setText(next)
    inputRef.current?.focus()
  }

  const handleRemoveToken = (token: OperatorToken) => {
    const next = text.replace(token.raw, "").replace(/\s+/g, " ").trim()
    setText(next)
  }

  const handleApplyAdvancedFilter = (filters: AdvancedFilters) => {
    setShowFilterPanel(false)
    setOpen(false)
    const sp = new URLSearchParams()
    if (filters.from) sp.set("from", filters.from)
    if (filters.to) sp.set("to", filters.to)
    if (filters.subject) sp.set("subject", filters.subject)
    if (filters.hasWords) sp.set("hasWords", filters.hasWords)
    if (filters.withoutWords) sp.set("withoutWords", filters.withoutWords)
    if (filters.sizeOp && filters.sizeMb)
      sp.set("size", `${filters.sizeOp}:${filters.sizeMb}`)
    if (filters.datePreset) sp.set("datePreset", filters.datePreset)
    if (filters.dateFrom) sp.set("dateFrom", filters.dateFrom)
    if (filters.dateTo) sp.set("dateTo", filters.dateTo)
    if (filters.searchIn && filters.searchIn !== "all")
      sp.set("scope", filters.searchIn)
    if (filters.hasAttachment) sp.set("hasAttachment", "true")

    // Nếu có từ khóa hoặc ô input thì mang theo q
    const qVal = filters.hasWords || text.trim()
    if (qVal) {
      sp.set("q", qVal)
      searchHistory.add(qVal)
    }

    navigate(`/search?${sp.toString()}`)
  }

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[720px] min-w-0 flex-1"
    >
      <form
        role="search"
        onSubmit={handleSubmit}
        className="relative flex w-full flex-col"
      >
        <div
          className={`flex min-h-10 items-center gap-1.5 rounded-full pr-1 pl-4 transition-all ${
            open ? "bg-surface shadow-pop ring-1 ring-line" : "bg-surface-2"
          }`}
        >
          <Search size={18} className="shrink-0 text-muted" />

          {/* TM-06: Viên thuốc toán tử cú pháp trong ô tìm kiếm */}
          {parsed.tokens.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 py-1">
              {parsed.tokens.map((token, i) =>
                token.valid ? (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent"
                  >
                    <span>{token.raw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveToken(token)}
                      className="cursor-pointer hover:opacity-75"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ) : (
                  <span
                    key={i}
                    title={token.error || "Cú pháp không hợp lệ"}
                    className="group relative inline-flex cursor-help items-center gap-1 rounded-full border border-danger/60 bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger"
                  >
                    <AlertCircle size={12} />
                    <span>{token.raw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveToken(token)}
                      className="cursor-pointer hover:opacity-75"
                    >
                      <X size={12} />
                    </button>
                    {/* Tooltip giải thích lỗi cú pháp */}
                    <span className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 hidden w-48 rounded bg-bg-dark px-2 py-1 text-[11px] text-white shadow-md group-hover:block">
                      {token.error}
                    </span>
                  </span>
                ),
              )}
            </div>
          )}

          <input
            ref={inputRef}
            id="header-search-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setActiveIdx(-1)
              if (!open) setOpen(true)
            }}
            onFocus={() => {
              setOpen(true)
              setActiveIdx(-1)
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              parsed.tokens.length > 0 ? "Thêm từ khóa..." : "Tìm trong thư"
            }
            aria-label="Tìm kiếm thư"
            className="h-10 min-w-0 flex-1 bg-transparent px-2 outline-none placeholder:text-muted"
          />

          {text && (
            <button
              type="button"
              aria-label="Xóa từ khóa"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
              onClick={() => {
                setText("")
                setActiveIdx(-1)
                inputRef.current?.focus()
              }}
            >
              <X size={16} />
            </button>
          )}

          {/* Nút bộ lọc nâng cao */}
          <button
            type="button"
            aria-label="Bộ lọc tìm kiếm"
            title="Bộ lọc tìm kiếm"
            onClick={() => {
              setShowFilterPanel((p) => !p)
              setOpen(false)
            }}
            className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
              showFilterPanel
                ? "bg-accent text-on-accent"
                : "text-muted hover:bg-hover hover:text-fg"
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </form>

      {/* TM-05: Bảng lọc nâng cao thả nổi rộng 560px */}
      {showFilterPanel && (
        <div className="absolute top-full right-0 z-[60] mt-2">
          <AdvancedFilterPanel
            currentQuery={text}
            onApply={handleApplyAdvancedFilter}
            onClose={() => setShowFilterPanel(false)}
          />
        </div>
      )}

      {/* Dropdown Gợi ý khi gõ (TM-07) hoặc Lịch sử tìm kiếm (TM-03) */}
      {open && !showFilterPanel && (
        <div className="animate-slide-up absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface py-2 shadow-pop">
          {/* TM-07: Gợi ý khi gõ (khi ô input có ký tự) */}
          {trimmed ? (
            <div>
              {suggestions.length === 0 ? (
                <div className="px-4 py-3 text-xs text-muted">
                  Nhấn{" "}
                  <kbd className="rounded border border-line bg-surface-2 px-1 font-mono">
                    Enter
                  </kbd>{" "}
                  để tìm kiếm "{text}"
                </div>
              ) : (
                <div className="divide-y divide-line/40">
                  {/* Nhóm Người */}
                  {suggestions.some((s) => s.type === "person") && (
                    <div className="py-1">
                      <p className="px-4 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
                        Người
                      </p>
                      {suggestions.map((s, idx) => {
                        if (s.type !== "person") return null
                        const isActive = idx === activeIdx
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => applySuggestion(s)}
                            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isActive
                                ? "bg-accent/15 text-accent font-medium"
                                : "hover:bg-hover"
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">
                              <User size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {s.name}
                              </p>
                              <p className="truncate text-xs text-muted">
                                {s.email} · {s.title}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Nhóm Nhãn */}
                  {suggestions.some((s) => s.type === "label") && (
                    <div className="py-1">
                      <p className="px-4 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
                        Nhãn
                      </p>
                      {suggestions.map((s, idx) => {
                        if (s.type !== "label") return null
                        const isActive = idx === activeIdx
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => applySuggestion(s)}
                            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isActive
                                ? "bg-accent/15 text-accent font-medium"
                                : "hover:bg-hover"
                            }`}
                          >
                            <LabelDot color={s.color} />
                            <span className="truncate text-sm font-medium">
                              {s.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Nhóm Từ khóa phổ biến */}
                  {suggestions.some((s) => s.type === "keyword") && (
                    <div className="py-1">
                      <p className="px-4 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
                        Từ khóa phổ biến
                      </p>
                      {suggestions.map((s, idx) => {
                        if (s.type !== "keyword") return null
                        const isActive = idx === activeIdx
                        return (
                          <button
                            key={s.text}
                            type="button"
                            onClick={() => applySuggestion(s)}
                            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isActive
                                ? "bg-accent/15 text-accent font-medium"
                                : "hover:bg-hover"
                            }`}
                          >
                            <Search size={15} className="shrink-0 text-muted" />
                            <span className="truncate text-sm">{s.text}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* TM-03: Lịch sử tìm kiếm (khi chưa gõ gì, tối đa 8 từ khóa gần nhất) */
            <div>
              <p className="px-4 pb-1 text-xs font-medium text-muted">
                Tìm kiếm gần đây
              </p>
              {history.length === 0 ? (
                <p className="px-4 py-3 text-xs text-muted italic">
                  Chưa có lịch sử tìm kiếm
                </p>
              ) : (
                <ul>
                  {history.slice(0, 8).map((h) => (
                    <li key={h} className="flex items-center hover:bg-hover">
                      <button
                        type="button"
                        className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 text-left"
                        onClick={() => {
                          setText(h)
                          runSearch(h)
                        }}
                      >
                        <Clock size={16} className="shrink-0 text-muted" />
                        <span className="truncate text-sm">{h}</span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Xóa "${h}" khỏi lịch sử`}
                        className="mr-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                        onClick={(e) => {
                          e.stopPropagation()
                          searchHistory.remove(h)
                        }}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {history.length > 0 && (
                <button
                  type="button"
                  className="mt-1 h-8 w-full cursor-pointer border-t border-line px-4 text-left text-xs font-medium text-accent hover:bg-hover"
                  onClick={() => searchHistory.clear()}
                >
                  Xóa lịch sử tìm kiếm
                </button>
              )}
            </div>
          )}

          {/* TM-06: Dòng gợi ý các cú pháp còn lại dưới ô tìm kiếm */}
          {remainingOperators.length > 0 && (
            <div className="mt-2 border-t border-line px-4 pt-2 pb-1">
              <span className="mr-2 text-[11px] font-medium text-muted">
                Gợi ý cú pháp:
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {remainingOperators.map((op) => (
                  <button
                    key={op.key}
                    type="button"
                    onClick={() => handleAppendOperator(op.key)}
                    className="inline-flex cursor-pointer items-center rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-muted hover:border-accent hover:text-accent"
                    title={op.desc}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
