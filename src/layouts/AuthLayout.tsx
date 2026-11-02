import { useState } from "react"
import { Outlet } from "react-router-dom"
import {
  Globe,
  HelpCircle,
  Lock,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Logo } from "@/features/app-shell/Logo"

export function AuthLayout() {
  const [lang, setLang] = useState<"vi" | "en">("vi")
  const [showSupportModal, setShowSupportModal] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-bg">
      {/* Cột trái: Thẻ form rộng 420px căn giữa theo chiều dọc */}
      <div className="flex w-full flex-col justify-between p-6 lg:w-[500px] lg:shrink-0 lg:p-10 xl:w-[540px]">
        {/* Logo trên đầu */}
        <div className="flex items-center justify-between">
          <Logo />
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
            Bản nội bộ v2.6
          </span>
        </div>

        {/* Khối Form chính rộng tối đa 420px căn giữa */}
        <div className="my-auto mx-auto w-full max-w-[420px] py-8">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-pop sm:p-8">
            <Outlet />
          </div>

          {/* Dưới thẻ: Bộ chọn ngôn ngữ (CD-02) & Liên kết hỗ trợ */}
          <div className="mt-6 flex items-center justify-between px-2 text-xs text-muted">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-muted" />
              <button
                type="button"
                onClick={() => setLang(lang === "vi" ? "en" : "vi")}
                className="cursor-pointer hover:text-fg font-medium transition-colors"
                title="Chuyển ngôn ngữ giao diện (CD-02)"
              >
                {lang === "vi" ? "Tiếng Việt (VN)" : "English (US)"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="inline-flex cursor-pointer items-center gap-1 hover:text-fg transition-colors"
            >
              <HelpCircle size={14} />
              <span>Hỗ trợ kỹ thuật</span>
            </button>
          </div>
        </div>

        {/* Bản quyền chân trang */}
        <div className="text-center text-[11px] text-muted/70">
          © 2026 Hoàng Long Group · Hệ thống thư điện tử bảo mật
        </div>
      </div>

      {/* Cột phải: Chỉ hiện từ 1024px trở lên, ảnh minh họa & thông báo công ty */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden border-l border-line bg-gradient-to-br from-accent/10 via-surface to-surface-2 p-12 lg:flex">
        {/* Họa tiết trang trí nền */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        {/* Tiêu đề & Giới thiệu hệ thống */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles size={14} />
            <span>Nền tảng giao tiếp doanh nghiệp thế hệ mới</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-fg lg:text-4xl">
            Kết nối an toàn, làm việc hiệu quả cùng Mail Hoàng Long
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Hệ thống hỗ trợ mã hóa đầu cuối, phân loại thông minh, chữ ký số và xác
            thực đa yếu tố đạt chuẩn an toàn thông tin ISO/IEC 27001.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface/70 p-3.5 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-fg">Xác thực 2 bước</p>
                <p className="text-[11px] text-muted">Bảo vệ tài khoản đa lớp</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface/70 p-3.5 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-fg">Bảo mật TLS 1.3</p>
                <p className="text-[11px] text-muted">Mã hóa đường truyền an toàn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng Thông báo công ty */}
        <div className="relative z-10 max-w-xl rounded-2xl border border-line/80 bg-surface/85 p-6 shadow-pop backdrop-blur">
          <div className="flex items-center gap-2 font-semibold text-fg text-sm">
            <Megaphone size={16} className="text-accent" />
            <span>Thông báo công ty</span>
          </div>
          <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted">
            <div className="rounded-lg bg-surface-2/60 p-3 border border-line/50">
              <p className="font-medium text-fg">
                Nâng cấp hệ thống chứng chỉ bảo mật và 2FA
              </p>
              <p className="mt-1">
                Toàn bộ cán bộ nhân viên cần thiết lập xác thực 2 bước trước ngày
                15/11/2026 theo quy chế An toàn thông tin của Tập đoàn.
              </p>
            </div>
            <div className="rounded-lg bg-surface-2/60 p-3 border border-line/50">
              <p className="font-medium text-fg">Lịch hỗ trợ IT Helpdesk</p>
              <p className="mt-1">
                Bộ phận CNTT trực hỗ trợ 24/7 qua hotline nội bộ <strong>8888</strong> hoặc
                email <strong>helpdesk@congty.vn</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hỗ trợ kỹ thuật */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-pop">
            <h3 className="text-base font-semibold text-fg">Trung tâm Hỗ trợ kỹ thuật IT</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Nếu bạn quên mật khẩu, tài khoản bị khóa hoặc không nhận được mã xác thực 2 bước, vui lòng liên hệ đội ngũ quản trị:
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-surface-2 p-3 text-xs">
              <p><strong>Hotline nội bộ:</strong> máy nhánh 8888 (24/7)</p>
              <p><strong>Email quản trị:</strong> admin@congty.vn</p>
              <p><strong>Văn phòng IT:</strong> Tầng 8, Tòa nhà Hoàng Long Tower</p>
            </div>
            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="cursor-pointer rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-on-accent hover:bg-accent-hover"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
