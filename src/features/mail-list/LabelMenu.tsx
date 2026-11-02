import { useMemo, useState } from "react"
import { Plus, Tag } from "lucide-react"
import type { Email } from "@/mock-data"
import { LabelDot } from "@/shared/ui/LabelDot"
import { Popover } from "@/shared/ui/Popover"
import { useAllLabels } from "@/shared/state/mailStore"

type Props = {
  /** Các thư đang được chọn */
  targets: Email[]
  onToggle: (labelId: string, on: boolean) => void
  onCreate: (name: string) => void
}

function Check({
  state,
  onChange,
}: {
  state: "all" | "some" | "none"
  onChange: () => void
}) {
  return (
    <input
      type="checkbox"
      checked={state === "all"}
      ref={(el) => {
        if (el) el.indeterminate = state === "some"
      }}
      onChange={onChange}
      className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
    />
  )
}

/** Menu gắn nhãn: ô tìm, ô tích (tích một phần khi chỉ một số thư có nhãn), tạo nhãn mới (NH-02). */
export function LabelMenu({ targets, onToggle, onCreate }: Props) {
  const labels = useAllLabels()
  const [q, setQ] = useState("")
  const [creating, setCreating] = useState(false)

  const path = (id: string): string => {
    const l = labels.find((x) => x.id === id)!
    return l.parentId ? `${path(l.parentId)} / ${l.name}` : l.name
  }
  const shown = useMemo(
    () =>
      labels.filter((l) =>
        path(l.id).toLowerCase().includes(q.trim().toLowerCase()),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, q],
  )

  return (
    <Popover
      align="left"
      className="w-64"
      trigger={({ toggle }) => (
        <button
          type="button"
          aria-label="Chuyển vào nhãn"
          title="Chuyển vào nhãn"
          onClick={toggle}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
        >
          <Tag size={16} />
        </button>
      )}
    >
      {(close) => (
        <div className="py-2">
          <p className="px-4 pb-1 text-xs font-medium text-muted">
            Gắn nhãn cho {targets.length} thư
          </p>
          <div className="px-3 pb-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm nhãn"
              aria-label="Tìm nhãn"
              className="h-8 w-full rounded-lg border border-line bg-surface px-3 outline-none focus:border-accent"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {shown.length === 0 && (
              <li className="px-4 py-2 text-muted">Không có nhãn phù hợp.</li>
            )}
            {shown.map((l) => {
              const count = targets.filter((t) =>
                t.labelIds.includes(l.id),
              ).length
              const state =
                count === 0 ? "none" : count === targets.length ? "all" : "some"
              return (
                <li key={l.id}>
                  <label className="flex h-9 cursor-pointer items-center gap-3 px-4 hover:bg-hover">
                    <Check
                      state={state}
                      onChange={() => onToggle(l.id, state !== "all")}
                    />
                    <LabelDot color={l.color} />
                    <span className="truncate">{path(l.id)}</span>
                  </label>
                </li>
              )
            })}
          </ul>
          <div className="mt-1 border-t border-line pt-1">
            {creating ? (
              <form
                className="flex items-center gap-2 px-3 py-1"
                onSubmit={(e) => {
                  e.preventDefault()
                  const name = q.trim()
                  if (!name) return
                  onCreate(name)
                  close()
                }}
              >
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tên nhãn mới"
                  aria-label="Tên nhãn mới"
                  maxLength={40}
                  className="h-8 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="h-8 cursor-pointer rounded px-2 font-medium text-accent hover:bg-accent-soft"
                >
                  Tạo
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex h-9 w-full cursor-pointer items-center gap-3 px-4 hover:bg-hover"
              >
                <Plus size={16} className="text-muted" />
                Tạo nhãn mới
              </button>
            )}
          </div>
        </div>
      )}
    </Popover>
  )
}
