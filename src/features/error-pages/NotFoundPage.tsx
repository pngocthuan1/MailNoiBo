import { Link } from "react-router-dom"
import { ArrowLeft, Compass } from "lucide-react"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-soft text-accent ring-8 ring-accent-soft/40">
        <Compass size={44} strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-fg">
        404 - Không tìm thấy trang
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Đường dẫn bạn yêu cầu không tồn tại, đã bị đổi tên hoặc thư đã bị xóa vĩnh
        viễn khỏi hệ thống.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/mail/inbox"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          <ArrowLeft size={16} />
          <span>Về Inbox</span>
        </Link>
      </div>
    </div>
  )
}
