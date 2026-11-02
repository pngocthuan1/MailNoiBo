import type { Label } from '@/mock-data'

/** Nhãn dạng viên thuốc (NH-02). */
export function LabelPill({ label }: { label: Label }) {
  return (
    <span
      className="inline-flex h-5 max-w-32 shrink-0 items-center gap-1 truncate rounded-full px-2 text-xs font-medium text-fg"
      style={{ background: `var(--label-${label.color}-soft)` }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `var(--label-${label.color})` }} />
      <span className="truncate">{label.name}</span>
    </span>
  )
}
