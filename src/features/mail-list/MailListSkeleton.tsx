/** Đang tải: 10 dòng khung xương xám, không dùng vòng xoay. */
export function MailListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Đang tải thư">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="flex h-14 animate-pulse items-center gap-3 border-b border-line px-4">
          <span className="h-4 w-4 rounded bg-surface-2" />
          <span className="h-4 w-4 rounded bg-surface-2" />
          <span className="h-3 w-32 rounded bg-surface-2 sm:w-40" />
          <span className="h-3 flex-1 rounded bg-surface-2" style={{ maxWidth: `${70 - (i % 4) * 10}%` }} />
          <span className="ml-auto h-3 w-12 rounded bg-surface-2" />
        </div>
      ))}
    </div>
  )
}
