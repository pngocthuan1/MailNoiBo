import type { Message } from "@/mock-data"
import { useMailStore } from "@/shared/state/mailStore"

/** Dải trạng thái thu hồi hiển thị trong thư của tôi. */
export function RecallStrip({
  message,
  onRetry,
}: {
  message: Message
  onRetry: () => void
}) {
  const info = useMailStore((s) => s.recalls[message.id])
  if (!info) return null
  const tone =
    info.outcome === "success"
      ? "bg-success-soft text-success"
      : info.outcome === "partial"
        ? "bg-warning-soft text-warning"
        : "bg-danger-soft text-danger"
  return (
    <div
      role="status"
      className={`mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium ${tone}`}
    >
      <span className="flex-1">
        {info.outcome === "success" &&
          `Đã thu hồi thư khỏi hộp thư của ${info.recalled} người chưa đọc.`}
        {info.outcome === "partial" &&
          `Đã thu hồi ${info.recalled} trên ${info.total} người.`}
        {info.outcome === "failed" &&
          "Thu hồi thất bại: không có người nhận nào được thu hồi."}
      </span>
      {info.outcome !== "success" && (
        <button
          type="button"
          onClick={onRetry}
          className="h-6 cursor-pointer rounded px-2 underline"
        >
          Thử lại
        </button>
      )}
    </div>
  )
}
