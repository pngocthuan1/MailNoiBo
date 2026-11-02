import { CircleAlert, FileText, RotateCcw, X } from "lucide-react"
import type { ComposeAttachment } from "@/mock-data"
import { formatSize, middleTruncate } from "@/features/thread-view/fileUtils"

type Props = {
  items: ComposeAttachment[]
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

/** Thẻ tệp đính kèm: tên, dung lượng, tiến độ tải lên, nút xóa; lỗi hiển thị màu đỏ. */
export function AttachmentCards({ items, onRemove, onRetry }: Props) {
  if (!items.length) return null
  return (
    <ul className="flex flex-wrap gap-2 px-3 pb-3" aria-label="Tệp đính kèm">
      {items.map((a) => {
        const error = a.status === "error"
        return (
          <li
            key={a.id}
            className={`w-56 rounded-lg border px-2.5 py-2 ${
              error
                ? "border-danger bg-danger-soft"
                : "border-line bg-surface-2"
            }`}
          >
            <div className="flex items-center gap-2">
              {error ? (
                <CircleAlert size={18} className="shrink-0 text-danger" />
              ) : (
                <FileText size={18} className="shrink-0 text-muted" />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium" title={a.name}>
                  {middleTruncate(a.name, 24)}
                </div>
                <div
                  className={`text-[11px] ${
                    error ? "text-danger" : "text-muted"
                  }`}
                >
                  {error
                    ? a.error
                    : a.status === "uploading"
                      ? `${formatSize(a.size)} · ${a.progress}%`
                      : formatSize(a.size)}
                </div>
              </div>
              {error && !a.error?.includes("25 MB") && (
                <button
                  type="button"
                  aria-label={`Thử tải lại ${a.name}`}
                  onClick={() => onRetry(a.id)}
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
                >
                  <RotateCcw size={14} />
                </button>
              )}
              <button
                type="button"
                aria-label={`Xóa ${a.name}`}
                onClick={() => onRemove(a.id)}
                className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
              >
                <X size={14} />
              </button>
            </div>
            {a.status === "uploading" && (
              <div
                role="progressbar"
                aria-valuenow={a.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-2 h-1 overflow-hidden rounded-full bg-line"
              >
                <div
                  className="h-full bg-accent transition-[width]"
                  style={{ width: `${a.progress}%` }}
                />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
