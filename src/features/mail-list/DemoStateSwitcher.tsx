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
    </div>
  )
}
