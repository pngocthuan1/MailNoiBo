import { sendEarliestScheduledMail } from '@/shared/state/mailStore'
import { useSnackbar } from '@/shared/ui/Snackbar'
import { setComposeDemo, useComposeDemoStore } from '@/features/compose/composeDemoStore'

export type DemoState = 'normal' | 'loading' | 'empty' | 'error'

const options: { id: DemoState; label: string }[] = [
  { id: 'normal', label: 'Bình thường' },
  { id: 'loading', label: 'Đang tải' },
  { id: 'empty', label: 'Trống' },
  { id: 'error', label: 'Lỗi' },
]

type Props = { value: DemoState; onChange: (s: DemoState) => void; onSimulateNewMail: () => void }

/** Bộ chuyển trạng thái demo để xem lại từng trạng thái của trang. */
export function DemoStateSwitcher({ value, onChange, onSimulateNewMail }: Props) {
  const snackbar = useSnackbar()
  const { undoSendSeconds } = useComposeDemoStore()

  const handleSendEarliest = () => {
    const success = sendEarliestScheduledMail()
    if (success) {
      snackbar.show({ message: 'Đã gửi thư hẹn giờ sớm nhất thành công!' })
    } else {
      snackbar.show({ message: 'Không có thư nào trong thư mục Đã lên lịch' })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border border-dashed border-line bg-bg py-1 pr-1 pl-3 text-xs">
      <span className="font-medium text-muted">Trạng thái demo</span>
      <div role="radiogroup" aria-label="Trạng thái demo" className="flex rounded-full bg-surface-2 p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={`h-6 cursor-pointer rounded-full px-3 font-medium ${
              value === o.id ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onSimulateNewMail}
        className="h-6 cursor-pointer rounded-full px-3 font-medium text-accent hover:bg-accent-soft"
      >
        Mô phỏng thư mới
      </button>

      {/* SO-08: Nút Đến giờ gửi */}
      <button
        type="button"
        onClick={handleSendEarliest}
        className="h-6 cursor-pointer rounded-full border border-line bg-surface px-3 font-medium text-accent hover:bg-accent-soft"
      >
        Đến giờ gửi
      </button>

      {/* SO-07: Dropdown Thời gian hoàn tác gửi */}
      <div className="flex items-center gap-1 pl-1">
        <span className="text-[11px] text-muted">Hoàn tác gửi:</span>
        <select
          value={undoSendSeconds ?? 10}
          onChange={(e) => setComposeDemo({ undoSendSeconds: Number(e.target.value) })}
          className="h-6 cursor-pointer rounded border border-line bg-surface px-1 text-[11px] outline-none"
        >
          <option value={5}>5s</option>
          <option value={10}>10s</option>
          <option value={20}>20s</option>
          <option value={30}>30s</option>
        </select>
      </div>
    </div>
  )
}
