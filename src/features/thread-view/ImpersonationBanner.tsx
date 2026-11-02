import { ShieldAlert } from "lucide-react"
import type { Message } from "@/mock-data"
import { Button } from "@/shared/ui/Button"

/** Dải đỏ cảnh báo giả mạo phía trên thân thư (BM-01). */
export function ImpersonationBanner({
  message,
  onReport,
  onTrust,
}: {
  message: Message
  onReport: () => void
  onTrust: () => void
}) {
  return (
    <div
      role="alert"
      className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-danger bg-danger-soft p-3"
    >
      <ShieldAlert className="shrink-0 text-danger" />
      <p className="min-w-0 flex-1 text-danger">
        <strong>Cảnh báo giả mạo.</strong> Người gửi dùng tên{" "}
        {message.impersonates} nhưng địa chỉ {message.from.email} không thuộc hệ
        thống của công ty. Không bấm liên kết hoặc chuyển tiền theo thư này.
      </p>
      <div className="flex gap-2">
        <Button variant="danger" onClick={onReport}>
          Báo cáo
        </Button>
        <Button variant="ghost" onClick={onTrust}>
          Tôi tin tưởng người gửi
        </Button>
      </div>
    </div>
  )
}
