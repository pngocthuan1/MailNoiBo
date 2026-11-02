import { Link } from "react-router-dom"
import { ArrowLeft, RefreshCw, ServerCrash } from "lucide-react"

export function ServerErrorPage() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-danger-soft text-danger ring-8 ring-danger-soft/40">
        <ServerCrash size={44} strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-fg">
        500 - Lỗi máy chủ
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Hệ thống đang gặp sự cố gián đoạn tạm thời trong quá trình xử lý yêu cầu.
        Kỹ sư vận hành hệ thống đã được thông báo tự động.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium text-fg transition-colors hover:bg-hover"
        >
          <RefreshCw size={15} />
          <span>Thử lại</span>
        </button>
        <Link
          to="/mail/inbox"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          <ArrowLeft size={16} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  )
}
