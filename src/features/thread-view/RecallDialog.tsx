import { useEffect, useState } from "react"
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react"
import type { Message } from "@/mock-data"
import { Button } from "@/shared/ui/Button"
import { Dialog } from "@/shared/ui/Dialog"
import { setRecall, useMailStore } from "@/shared/state/mailStore"
import { useThreadDemoStore } from "./threadDemoStore"

export const pendingRecipients = (message: Message, recalled = 0) =>
  (message.receipts ?? []).filter((r) => !r.readAt).length - recalled

/** Thu hồi thư (NB-04): xác nhận, đang xử lý, rồi kết quả thành công / một phần / thất bại. */
export function RecallDialog({
  message,
  onClose,
}: {
  message: Message
  onClose: () => void
}) {
  const outcome = useThreadDemoStore((s) => s.recallOutcome)
  const prior = useMailStore((s) => s.recalls[message.id])
  const unread = pendingRecipients(message, prior?.recalled)
  const [step, setStep] = useState<"confirm" | "running" | "result">("confirm")
  const [result, setResult] = useState<{
    outcome: typeof outcome
    recalled: number
    total: number
  } | null>(null)

  useEffect(() => {
    if (step !== "running") return
    const t = window.setTimeout(() => {
      const recalled =
        outcome === "success"
          ? unread
          : outcome === "partial"
            ? Math.max(1, Math.floor(unread / 2))
            : 0
      const r = { outcome, recalled, total: unread }
      setResult(r)
      setRecall(message.id, {
        outcome,
        recalled: (prior?.recalled ?? 0) + recalled,
        total: (message.receipts ?? []).filter((x) => !x.readAt).length,
      })
      setStep("result")
    }, 1200)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  return (
    <Dialog
      title="Thu hồi thư"
      onClose={onClose}
      footer={
        step === "confirm" ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="danger" onClick={() => setStep("running")}>
              Thu hồi
            </Button>
          </>
        ) : step === "result" ? (
          <Button onClick={onClose}>Đóng</Button>
        ) : undefined
      }
    >
      {step === "confirm" && (
        <p>
          Thư sẽ biến mất khỏi hộp thư của {unread} người chưa đọc. Những người
          đã đọc vẫn giữ bản thư.
        </p>
      )}
      {step === "running" && (
        <p className="flex items-center gap-3" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          Đang thu hồi thư...
        </p>
      )}
      {step === "result" && result && (
        <div role="status" className="flex items-start gap-3">
          {result.outcome === "success" && (
            <CircleCheck className="shrink-0 text-success" />
          )}
          {result.outcome === "partial" && (
            <TriangleAlert className="shrink-0 text-warning" />
          )}
          {result.outcome === "failed" && (
            <CircleX className="shrink-0 text-danger" />
          )}
          <p>
            {result.outcome === "success" &&
              `Đã thu hồi thư khỏi hộp thư của ${result.total} người chưa đọc.`}
            {result.outcome === "partial" &&
              `Đã thu hồi ${result.recalled} trên ${result.total} người. Những người còn lại đã mở thư hoặc không thể thu hồi.`}
            {result.outcome === "failed" &&
              "Không thể thu hồi thư. Người nhận có thể đã mở thư hoặc hệ thống đang bận, vui lòng thử lại."}
          </p>
        </div>
      )}
    </Dialog>
  )
}
