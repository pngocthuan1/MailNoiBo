import { MoreVertical, RefreshCw } from "lucide-react"
import { Popover } from "@/shared/ui/Popover"
import { SelectAllControl, type SelectMode } from "./SelectAllControl"

type Props = {
  total: number
  shown: number
  refreshing: boolean
  onSelect: (m: SelectMode) => void
  onRefresh: () => void
  onMarkAllRead: () => void
}

/** Thanh công cụ khi chưa chọn thư (HT-03, HT-07). */
export function ListToolbar({
  total,
  shown,
  refreshing,
  onSelect,
  onRefresh,
  onMarkAllRead,
}: Props) {
  return (
    <div className="flex h-12 items-center gap-1 border-b border-line px-2">
      <SelectAllControl state="none" onSelect={onSelect} />
      <button
        type="button"
        aria-label="Làm mới"
        title="Làm mới"
        onClick={onRefresh}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
      >
        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
      </button>
      <Popover
        align="left"
        className="w-64 py-1"
        trigger={({ toggle }) => (
          <button
            type="button"
            aria-label="Thêm"
            title="Thêm"
            onClick={toggle}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
          >
            <MoreVertical size={16} />
          </button>
        )}
      >
        {(close) => (
          <button
            type="button"
            onClick={() => {
              onMarkAllRead()
              close()
            }}
            className="flex h-9 w-full cursor-pointer items-center px-4 hover:bg-hover"
          >
            Đánh dấu tất cả là đã đọc
          </button>
        )}
      </Popover>
      <span className="ml-auto pr-2 text-xs text-muted">
        {shown === 0 ? "0 thư" : `1–${shown} trong ${total}`}
      </span>
    </div>
  )
}
