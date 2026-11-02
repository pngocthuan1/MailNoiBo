import { useState } from "react"
import { Dialog } from "@/shared/ui/Dialog"
import { Button } from "@/shared/ui/Button"
import { futureTime, snoozePresets } from "./mailFormat"

type Props = { title?: string onPick: (ts: number) => void onClose: () => void }

/** Bảng hoãn thư (HT-09); cũng dùng để sửa giờ gửi của thư đã lên lịch. */
export function SnoozeDialog({ title = "Hoãn đến", onPick, onClose }: Props) {
  const [custom, setCustom] = useState(false)
  const [value, setValue] = useState("")
  const presets = snoozePresets()
  const ts = value ? new Date(value).getTime() : NaN
  const invalid = !Number.isNaN(ts) && ts <= Date.now()

  return (
    <Dialog
      title={title}
      width={360}
      onClose={onClose}
      footer={
        custom && (
          <>
            <Button variant="ghost" onClick={() => setCustom(false)}>
              Quay lại
            </Button>
            <Button
              disabled={Number.isNaN(ts) || invalid}
              onClick={() => onPick(ts)}
            >
              Lưu
            </Button>
          </>
        )
      }
    >
      {custom ? (
        <div>
          <label
            className="mb-1 block text-xs text-muted"
            htmlFor="snooze-custom"
          >
            Ngày và giờ
          </label>
          <input
            id="snooze-custom"
            type="datetime-local"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`h-10 w-full rounded-lg border bg-surface px-3 ${
              invalid ? "border-danger" : "border-line"
            }`}
          />
          {invalid && (
            <p className="mt-1 text-xs text-danger">
              Thời điểm phải ở trong tương lai.
            </p>
          )}
        </div>
      ) : (
        <ul>
          {presets.map((p) => (
            <li key={p.label}>
              <button
                type="button"
                onClick={() => onPick(p.ts)}
                className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg px-3 hover:bg-hover"
              >
                <span>{p.label}</span>
                <span className="text-xs text-muted">{futureTime(p.ts)}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setCustom(true)}
              className="flex h-10 w-full cursor-pointer items-center rounded-lg px-3 hover:bg-hover"
            >
              Chọn ngày giờ
            </button>
          </li>
        </ul>
      )}
    </Dialog>
  )
}
