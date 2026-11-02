import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Dialog } from '@/shared/ui/Dialog'

const toLocal = (ts: number) => {
  const d = new Date(ts - new Date().getTimezoneOffset() * 60_000)
  return d.toISOString().slice(0, 16)
}

/** Chọn hạn xử lý cho thư "Cần xử lý" (NB-06). */
export function FollowUpDialog({ current, onPick, onClose }: { current?: number; onPick: (ts: number) => void; onClose: () => void }) {
  const [value, setValue] = useState(toLocal(current ?? Date.now() + 24 * 3_600_000))
  const ts = new Date(value).getTime()
  const invalid = Number.isNaN(ts) || ts <= Date.now()
  return (
    <Dialog
      title="Đánh dấu cần xử lý"
      width={380}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button disabled={invalid} onClick={() => onPick(ts)}>
            Đặt hạn xử lý
          </Button>
        </>
      }
    >
      <label htmlFor="follow-up" className="mb-1 block text-xs text-muted">
        Hạn xử lý
      </label>
      <input
        id="follow-up"
        type="datetime-local"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`h-10 w-full rounded-lg border bg-surface px-3 ${invalid ? 'border-danger' : 'border-line'}`}
      />
      {invalid && <p className="mt-1 text-xs text-danger">Hạn xử lý phải ở trong tương lai.</p>}
    </Dialog>
  )
}
