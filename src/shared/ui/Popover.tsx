import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  /** Render nút kích hoạt popover */
  trigger: (state: { open: boolean; toggle: () => void }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  /** Mở lên phía trên nút thay vì xuống dưới */
  up?: boolean
  className?: string
}

/** Khung nổi đơn giản: đóng khi bấm ra ngoài hoặc nhấn Esc. */
export function Popover({ trigger, children, align = 'right', up = false, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div
          className={`animate-slide-up absolute z-50 rounded-xl ${up ? 'bottom-full mb-2' : 'top-full mt-2'} border border-line bg-surface shadow-pop ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${className}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
