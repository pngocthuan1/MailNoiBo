import { CircleAlert, Languages } from "lucide-react"
import { Button } from "@/shared/ui/Button"

export type TranslateState = "idle" | "running" | "done" | "failed"

type Props = {
  state: TranslateState
  showOriginal: boolean
  target: string
  onTarget: (t: string) => void
  onTranslate: () => void
  onNever: () => void
  onToggleOriginal: () => void
}

export const targetLanguages = ["Tiếng Việt", "Tiếng Pháp", "Tiếng Nhật"]

/** Dải dịch thư khi thư khác ngôn ngữ người dùng (DT-08): chờ dịch, đang dịch, đã dịch, lỗi. */
export function TranslateBanner({
  state,
  showOriginal,
  target,
  onTarget,
  onTranslate,
  onNever,
  onToggleOriginal,
}: Props) {
  const tone = state === "failed" ? "bg-danger-soft" : "bg-surface-2"
  return (
    <div
      role="status"
      className={`no-print flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 ${tone}`}
    >
      {state === "failed" ? (
        <CircleAlert size={18} className="text-danger" />
      ) : (
        <Languages size={18} className="text-accent" />
      )}
      <p className="min-w-0 flex-1">
        {state === "idle" && "Thư này bằng tiếng Anh"}
        {state === "running" && (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            Đang dịch thư...
          </span>
        )}
        {state === "done" &&
          (showOriginal
            ? "Đang xem bản gốc tiếng Anh"
            : `Đã dịch từ tiếng Anh sang ${target}`)}
        {state === "failed" && (
          <span className="text-danger">
            {target === "Tiếng Việt"
              ? "Không dịch được thư. Vui lòng thử lại."
              : `Bản demo chưa hỗ trợ dịch sang ${target}.`}
          </span>
        )}
      </p>
      {(state === "idle" || state === "failed") && (
        <>
          <select
            aria-label="Ngôn ngữ đích"
            value={target}
            onChange={(e) => onTarget(e.target.value)}
            className="h-8 cursor-pointer rounded-lg border border-line bg-surface px-2"
          >
            {targetLanguages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <Button onClick={onTranslate}>
            {state === "failed" ? "Thử lại" : `Dịch sang ${target}`}
          </Button>
          {state === "idle" && (
            <Button variant="ghost" onClick={onNever}>
              Không bao giờ dịch tiếng Anh
            </Button>
          )}
        </>
      )}
      {state === "done" && (
        <Button variant="ghost" onClick={onToggleOriginal}>
          {showOriginal ? "Xem bản dịch" : "Xem bản gốc"}
        </Button>
      )}
    </div>
  )
}
