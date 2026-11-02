import { storage } from "@/mock-data"

export function StorageMeter({ collapsed }: { collapsed: boolean }) {
  const pct = Math.min(
    100,
    Math.round((storage.usedGb / storage.totalGb) * 100),
  )
  // Vàng khi từ 80%, đỏ khi từ 95%.
  const tone =
    pct >= 95 ? "bg-danger" : pct >= 80 ? "bg-warning-bar" : "bg-accent"
  const label = `Đã dùng ${storage.usedGb.toLocaleString("vi-VN")} trên ${storage.totalGb} GB`

  return (
    <div className={`border-t border-line ${collapsed ? "px-2 py-3" : "p-4"}`}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        title={label}
        className="h-1 overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {!collapsed && (
        <p className="mt-2 text-xs text-muted">
          {label} ({pct}%)
        </p>
      )}
    </div>
  )
}
