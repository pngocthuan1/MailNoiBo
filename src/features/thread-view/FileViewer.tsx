import { useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import type { Attachment } from "@/mock-data"
import { Button } from "@/shared/ui/Button"
import { downloadAttachment, mockImageUrl } from "./fileUtils"
import { PdfPages } from "./PdfPages"
import { useThreadDemoStore } from "./threadDemoStore"

type Props = {
  files: Attachment[]
  index: number
  initialPage?: number
  onIndex: (i: number) => void
  onClose: () => void
}

/** Trình xem tệp toàn màn hình cho ảnh và PDF (DT-07). */
export function FileViewer({
  files,
  index,
  initialPage,
  onIndex,
  onClose,
}: Props) {
  const file = files[index]
  const previewFails = useThreadDemoStore((s) => s.previewFails)
  const [zoom, setZoom] = useState(1)
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")

  // Tải bản xem trước; khi bật "lỗi xem trước" thì lần đầu báo lỗi, Thử lại sẽ thành công.
  useEffect(() => {
    setStatus("loading")
    setZoom(1)
    const t = window.setTimeout(
      () => setStatus(previewFails && attempt === 0 ? "error" : "ok"),
      500,
    )
    return () => window.clearTimeout(t)
  }, [index, attempt, previewFails])

  useEffect(() => {
    setAttempt(0)
  }, [index])

  const go = (d: number) => onIndex((index + d + files.length) % files.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft") go(-1)
      else if (e.key === "ArrowRight") go(1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  })

  const btn =
    "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white hover:bg-white/15"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Xem tệp ${file.name}`}
      className="fixed inset-0 z-[80] flex flex-col bg-black/90 text-white"
    >
      <div className="flex h-14 shrink-0 items-center gap-2 px-4">
        <p className="min-w-0 flex-1 truncate font-medium">{file.name}</p>
        <span className="hidden text-xs text-white/70 sm:inline">
          {index + 1} / {files.length}
        </span>
        <button
          type="button"
          aria-label="Thu nhỏ"
          title="Thu nhỏ"
          className={btn}
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
        >
          <ZoomOut size={18} />
        </button>
        <span className="w-12 text-center text-xs">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          aria-label="Phóng to"
          title="Phóng to"
          className={btn}
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
        >
          <ZoomIn size={18} />
        </button>
        <button
          type="button"
          aria-label="Tải về"
          title="Tải về"
          className={btn}
          onClick={() => downloadAttachment(file)}
        >
          <Download size={18} />
        </button>
        <button
          type="button"
          aria-label="Đóng"
          title="Đóng"
          className={btn}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        {files.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Tệp trước"
              className={`${btn} absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black/50`}
              onClick={() => go(-1)}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Tệp sau"
              className={`${btn} absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black/50`}
              onClick={() => go(1)}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
        {status === "loading" && (
          <div className="flex h-full items-center justify-center">
            <div
              className="h-64 w-48 animate-pulse rounded bg-white/10"
              aria-label="Đang tải bản xem trước"
            />
          </div>
        )}
        {status === "error" && (
          <div
            role="alert"
            className="flex h-full flex-col items-center justify-center gap-3"
          >
            <div className="flex h-48 w-72 flex-col items-center justify-center gap-2 rounded-xl bg-white/10">
              <CircleAlert size={36} className="text-danger" />
              <p>Không tải được bản xem trước</p>
            </div>
            <Button onClick={() => setAttempt((a) => a + 1)}>Thử lại</Button>
          </div>
        )}
        {status === "ok" && file.kind === "image" && (
          <div className="flex h-full items-center justify-center overflow-auto p-6">
            <img
              src={mockImageUrl(file.name)}
              alt={file.name}
              className="max-w-none rounded bg-white"
              style={{
                width: `${Math.min(100, 70 * zoom)}vw`,
                maxWidth: zoom <= 1 ? "90vw" : "none",
              }}
            />
          </div>
        )}
        {status === "ok" && (file.kind === "pdf" || file.kind === "doc") && (
          <PdfPages
            name={file.name}
            pages={file.pages ?? 3}
            zoom={zoom}
            initialPage={initialPage}
            pageTexts={file.pageTexts}
          />
        )}
      </div>
    </div>
  )
}
