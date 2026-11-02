import { useEffect, useRef, useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Clock, Search, SlidersHorizontal, X } from "lucide-react"
import { recentSearches } from "@/mock-data"

export function HeaderSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState(recentSearches)
  const ref = useRef<HTMLFormElement>(null)

  // Giữ từ khóa trong ô khi ở trang tìm kiếm.
  useEffect(() => {
    if (location.pathname === "/search")
      setText(new URLSearchParams(location.search).get("q") ?? "")
  }, [location.pathname, location.search])

  useEffect(() => {
    const onDown = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  const run = (q: string) => {
    setOpen(false)
    setText(q)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) run(text.trim())
  }

  return (
    <form
      ref={ref}
      role="search"
      onSubmit={submit}
      className="relative mx-auto w-full max-w-[720px] min-w-0 flex-1"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <div
        className={`flex h-10 items-center gap-1 rounded-full pr-1 pl-4 transition-colors ${
          open ? "bg-surface shadow-pop" : "bg-surface-2"
        }`}
      >
        <Search size={18} className="shrink-0 text-muted" />
        <input
          id="header-search-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Tìm trong thư"
          aria-label="Tìm kiếm thư"
          className="h-10 min-w-0 flex-1 bg-transparent px-2 outline-none placeholder:text-muted"
        />
        {text && (
          <button
            type="button"
            aria-label="Xóa từ khóa"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover"
            onClick={() => setText("")}
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          aria-label="Bộ lọc tìm kiếm"
          title="Bộ lọc tìm kiếm"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>
      {open && !text && history.length > 0 && (
        <div className="animate-slide-up absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-line bg-surface py-2 shadow-pop">
          <p className="px-4 pb-1 text-xs font-medium text-muted">
            Tìm kiếm gần đây
          </p>
          <ul>
            {history.map((h) => (
              <li key={h} className="flex items-center hover:bg-hover">
                <button
                  type="button"
                  className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 text-left"
                  onClick={() => run(h)}
                >
                  <Clock size={16} className="shrink-0 text-muted" />
                  <span className="truncate">{h}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Xóa "${h}" khỏi lịch sử`}
                  className="mr-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface-2"
                  onClick={() => setHistory((l) => l.filter((x) => x !== h))}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-1 h-8 w-full cursor-pointer px-4 text-left text-accent hover:bg-hover"
            onClick={() => setHistory([])}
          >
            Xóa lịch sử tìm kiếm
          </button>
        </div>
      )}
    </form>
  )
}
