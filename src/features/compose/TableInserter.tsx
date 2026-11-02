import { useState } from "react"
import { Table } from "lucide-react"
import { Popover } from "@/shared/ui/Popover"

const ROWS = 5
const COLS = 5

type Props = { onInsert: (rows: number, cols: number) => void }

/** Bộ chọn bảng 5x5 (SO-11) */
export function TableInserter({ onInsert }: Props) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null)

  return (
    <Popover
      align="left"
      up
      className="p-2"
      trigger={({ toggle }) => (
        <button
          type="button"
          title="Chèn bảng"
          aria-label="Chèn bảng"
          onClick={toggle}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
        >
          <Table size={17} />
        </button>
      )}
    >
      {(close) => (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">
            {hover ? `${hover.r} × ${hover.c} bảng` : "Chọn kích thước bảng"}
          </p>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1.5rem)` }}
          >
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const active = hover && r < hover.r && c < hover.c
                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHover({ r: r + 1, c: c + 1 })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      onInsert(r + 1, c + 1)
                      close()
                    }}
                    className={`h-6 w-6 cursor-pointer rounded border ${
                      active
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface-2"
                    }`}
                  />
                )
              }),
            )}
          </div>
        </div>
      )}
    </Popover>
  )
}

/** Tạo HTML bảng với số hàng và cột */
export function makeTableHtml(rows: number, cols: number): string {
  const headerCells = Array.from(
    { length: cols },
    (_, i) =>
      `<th style="border:1px solid #ccc;padding:6px 12px;background:#f5f5f5;font-weight:600;">Cột ${i + 1}</th>`,
  ).join("")
  const bodyRows = Array.from({ length: rows - 1 }, () => {
    const cells = Array.from(
      { length: cols },
      () => `<td style="border:1px solid #ccc;padding:6px 12px;">&nbsp;</td>`,
    ).join("")
    return `<tr>${cells}</tr>`
  }).join("")
  return `<table style="border-collapse:collapse;width:100%;margin:8px 0"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table><p></p>`
}
