import { Maximize2, Minimize2, Minus, Square, X } from 'lucide-react'
import type { ComposeDraft } from './ComposeProvider'

type Props = {
  draft: ComposeDraft
  onToggleMinimize: () => void
  onToggleMaximize: () => void
  onToggleFullscreen: () => void
  onClose: () => void
}

function Ctl({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-white/90 hover:bg-white/15"
    >
      {children}
    </button>
  )
}

/** Thanh tiêu đề tối cao 36px; bấm vào thanh để thu nhỏ hoặc khôi phục. */
export function ComposeTitleBar({ draft, onToggleMinimize, onToggleMaximize, onToggleFullscreen, onClose }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={draft.minimized ? 'Khôi phục cửa sổ soạn thư' : 'Thu nhỏ cửa sổ soạn thư'}
      onClick={onToggleMinimize}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget && (e.preventDefault(), onToggleMinimize())}
      className="flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-t-lg bg-snack pr-1 pl-3 text-sm font-medium text-white"
    >
      <span className="min-w-0 flex-1 truncate">{draft.subject.trim() || 'Thư mới'}</span>
      <Ctl label="Thu nhỏ" onClick={onToggleMinimize}>
        <Minus size={16} />
      </Ctl>
      <Ctl label="Phóng to" onClick={onToggleMaximize}>
        {draft.maximized ? <Square size={13} /> : <Maximize2 size={14} />}
      </Ctl>
      <Ctl label="Toàn màn hình" onClick={onToggleFullscreen}>
        {draft.fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} className="rotate-90" />}
      </Ctl>
      <Ctl label="Đóng" onClick={onClose}>
        <X size={16} />
      </Ctl>
    </div>
  )
}
