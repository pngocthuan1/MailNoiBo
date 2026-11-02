import { useState } from "react"
import { Sparkles } from "lucide-react"

type Props = { bullets: string[] messageCount: number }

/** Tóm tắt tự động cho chuỗi từ 5 thư trở lên (DT-11). */
export function SummaryBox({ bullets, messageCount }: Props) {
  const [hidden, setHidden] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (hidden)
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        className="no-print inline-flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 text-accent hover:bg-accent-soft"
      >
        <Sparkles size={14} /> Hiện tóm tắt
      </button>
    )

  return (
    <section
      aria-label="Tóm tắt chuỗi thư"
      className="no-print rounded-xl bg-accent-soft p-4"
    >
      <div className="flex items-start gap-3">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Tóm tắt chuỗi {messageCount} thư</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {bullets.map((b) => (
              <li key={b} className={expanded ? "" : "line-clamp-1"}>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">
            Tạo tự động, có thể chưa chính xác
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="h-8 cursor-pointer rounded-full px-3 font-medium text-accent hover:bg-surface/60"
          >
            {expanded ? "Thu gọn" : "Mở rộng"}
          </button>
          <button
            type="button"
            onClick={() => setHidden(true)}
            className="h-8 cursor-pointer rounded-full px-3 font-medium text-muted hover:bg-surface/60"
          >
            Ẩn
          </button>
        </div>
      </div>
    </section>
  )
}
