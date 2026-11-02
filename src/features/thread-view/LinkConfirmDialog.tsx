import { TriangleAlert } from "lucide-react"
import { Button } from "@/shared/ui/Button"
import { Dialog } from "@/shared/ui/Dialog"

type Props = { href: string text: string onClose: () => void }

/** Hộp xác nhận khi bấm liên kết lạ: ghi rõ địa chỉ đích thật (BM-01). */
export function LinkConfirmDialog({ href, text, onClose }: Props) {
  let host = href
  try {
    host = new URL(href).host
  } catch {
    /* giữ nguyên */
  }
  const looksLikeUrl = /^(https?:\/\/|www\.)/i.test(text.trim())
  const mismatch =
    looksLikeUrl &&
    !href.includes(
      text
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0],
    )

  return (
    <Dialog
      title="Mở liên kết lạ?"
      onClose={onClose}
      width={460}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              window.open(href, "_blank", "noopener,noreferrer")
              onClose()
            }}
          >
            Vẫn mở liên kết
          </Button>
        </>
      }
    >
      <p className="mb-3">
        Liên kết này không thuộc hệ thống của công ty. Địa chỉ đích thật là:
      </p>
      <div className="rounded-lg border border-line bg-surface-2 p-3">
        <p className="font-semibold break-all text-danger">{host}</p>
        <p className="mt-1 text-xs break-all text-muted">{href}</p>
      </div>
      {mismatch && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-warning">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          Văn bản hiển thị trong thư ("{text}") khác với địa chỉ thật. Đây là
          dấu hiệu của thư lừa đảo.
        </p>
      )}
    </Dialog>
  )
}
