import { Link } from "react-router-dom"
import { ArrowLeft, ShieldAlert } from "lucide-react"

export function ForbiddenPage() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-danger-soft text-danger ring-8 ring-danger-soft/40">
        <ShieldAlert size={44} strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-fg">
        403 - Không có quyền truy cập
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Bạn đang đăng nhập bằng tài khoản không có quyền Quản trị. Vui lòng liên hệ
        quản trị viên hệ thống (admin@congty.vn) nếu bạn cần cấp quyền truy cập.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/mail/inbox"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          <ArrowLeft size={16} />
          <span>Về Hộp thư đến</span>
        </Link>
      </div>
    </div>
  )
}
