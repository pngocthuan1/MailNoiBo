import { useAuthStore } from "./authStore"

export type AuthDemoState = "normal" | "loading" | "network_error"

export function AuthDemoSwitcher({
  current,
  onChange,
}: {
  current: AuthDemoState
  onChange: (s: AuthDemoState) => void
}) {
  const { resetDemo } = useAuthStore()

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-3 py-1 text-xs shadow-md backdrop-blur">
      <span className="font-medium text-muted">Demo:</span>
      <div className="flex rounded-full bg-surface-2 p-0.5">
        {(
          [
            { id: "normal", label: "Bình thường" },
            { id: "loading", label: "Đang tải" },
            { id: "network_error", label: "Lỗi mạng" },
          ] as const
        ).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
              current === s.id
                ? "bg-accent text-on-accent"
                : "text-muted hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        title="Xóa dữ liệu auth về mặc định ban đầu"
        onClick={resetDemo}
        className="ml-1 cursor-pointer text-[11px] text-muted underline hover:text-danger"
      >
        Đặt lại
      </button>
    </div>
  )
}
