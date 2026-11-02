import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { X } from "lucide-react"

type SnackOptions = {
  message: string
  actionLabel?: string
  onAction?: () => void
  /** Nút phụ thứ hai (ví dụ "Xem thư") */
  secondaryLabel?: string
  onSecondary?: () => void
  /** Mặc định 5 giây */
  duration?: number
}

type SnackItem = SnackOptions & { id: number }

const SnackbarContext = createContext<{
  show: (opts: SnackOptions) => void
} | null>(null)

export function useSnackbar() {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error("useSnackbar phải nằm trong SnackbarProvider")
  return ctx
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<SnackItem | null>(null)
  const idRef = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current)
    setItem(null)
  }, [])

  const show = useCallback((opts: SnackOptions) => {
    window.clearTimeout(timer.current)
    const id = ++idRef.current
    setItem({ ...opts, id })
    timer.current = window.setTimeout(
      () => setItem((cur) => (cur?.id === id ? null : cur)),
      opts.duration ?? 5000,
    )
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-6 left-6 z-[60]"
        aria-live="polite"
      >
        {item && (
          <div
            key={item.id}
            role="status"
            className="animate-slide-up pointer-events-auto flex min-h-12 items-center gap-4 rounded-lg bg-snack py-2 pr-2 pl-4 text-sm text-snack-fg shadow-pop"
          >
            <span>{item.message}</span>
            {item.actionLabel && (
              <button
                type="button"
                className="h-8 cursor-pointer rounded px-2 font-semibold hover:bg-white/10"
                style={{
                  color: "color-mix(in srgb, var(--accent) 70%, white)",
                }}
                onClick={() => {
                  item.onAction?.()
                  dismiss()
                }}
              >
                {item.actionLabel}
              </button>
            )}
            {item.secondaryLabel && (
              <button
                type="button"
                className="h-8 cursor-pointer rounded px-2 font-semibold hover:bg-white/10"
                style={{
                  color: "color-mix(in srgb, var(--accent) 70%, white)",
                }}
                onClick={() => {
                  item.onSecondary?.()
                  dismiss()
                }}
              >
                {item.secondaryLabel}
              </button>
            )}
            <button
              type="button"
              aria-label="Đóng"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full opacity-70 hover:bg-white/10 hover:opacity-100"
              onClick={dismiss}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </SnackbarContext.Provider>
  )
}
