import { ChevronDown } from "lucide-react"
import { Popover } from "@/shared/ui/Popover"

export type SelectMode = "all" | "none" | "read" | "unread" | "starred"

const options: { mode: SelectMode label: string }[] = [
  { mode: "all", label: "Tất cả" },
  { mode: "none", label: "Không" },
  { mode: "read", label: "Đã đọc" },
  { mode: "unread", label: "Chưa đọc" },
  { mode: "starred", label: "Gắn sao" },
]

type Props = {
  state: "none" | "some" | "all"
  onSelect: (m: SelectMode) => void
}

/** Ô chọn tất cả kèm mũi tên xổ xuống (HT-03). */
export function SelectAllControl({ state, onSelect }: Props) {
  return (
    <div className="flex items-center">
      <label
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center"
        title="Chọn tất cả"
      >
        <input
          type="checkbox"
          aria-label="Chọn tất cả thư"
          checked={state === "all"}
          ref={(el) => {
            if (el) el.indeterminate = state === "some"
          }}
          onChange={() => onSelect(state === "none" ? "all" : "none")}
          className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
        />
      </label>
      <Popover
        align="left"
        className="w-40 py-1"
        trigger={({ toggle }) => (
          <button
            type="button"
            aria-label="Chọn theo điều kiện"
            onClick={toggle}
            className="inline-flex h-8 w-6 cursor-pointer items-center justify-center rounded text-muted hover:bg-hover"
          >
            <ChevronDown size={14} />
          </button>
        )}
      >
        {(close) =>
          options.map((o) => (
            <button
              key={o.mode}
              type="button"
              onClick={() => {
                onSelect(o.mode)
                close()
              }}
              className="flex h-9 w-full cursor-pointer items-center px-4 hover:bg-hover"
            >
              {o.label}
            </button>
          ))
        }
      </Popover>
    </div>
  )
}
