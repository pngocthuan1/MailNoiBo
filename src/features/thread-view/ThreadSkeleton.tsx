/** Đang tải: khung xương gồm tiêu đề, một đầu thư và ba dòng thân thư. */
export function ThreadSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Đang tải thư"
      className="animate-pulse px-4 pt-6"
    >
      <div className="mb-6 h-6 w-2/3 rounded bg-surface-2" />
      <div className="rounded-xl border border-line p-4">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-full bg-surface-2" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-48 rounded bg-surface-2" />
            <div className="h-3 w-32 rounded bg-surface-2" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full rounded bg-surface-2" />
          <div className="h-3 w-11/12 rounded bg-surface-2" />
          <div className="h-3 w-3/5 rounded bg-surface-2" />
        </div>
      </div>
    </div>
  )
}
