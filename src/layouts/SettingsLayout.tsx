import { NavLink, Outlet } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const tabs = [
  { to: "/settings/general", label: "Chung" },
  { to: "/settings/account", label: "Tài khoản" },
  { to: "/settings/labels", label: "Nhãn" },
  { to: "/settings/filters", label: "Bộ lọc" },
  { to: "/settings/signature", label: "Chữ ký và mẫu thư" },
  { to: "/settings/vacation", label: "Trả lời tự động" },
  { to: "/settings/notifications", label: "Thông báo" },
  { to: "/settings/security", label: "Bảo mật" },
  { to: "/settings/data", label: "Dữ liệu của tôi" },
]

export function SettingsLayout() {
  return (
    <div className="flex min-h-full flex-col bg-bg md:flex-row">
      <nav aria-label="Cài đặt" className="shrink-0 p-4 md:w-60">
        <NavLink
          to="/mail/inbox"
          className="mb-4 flex h-8 items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft size={16} />
          Về hộp thư
        </NavLink>
        <h1 className="mb-2 px-3 text-xl font-semibold">Cài đặt</h1>
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {tabs.map((t) => (
            <li key={t.to} className="shrink-0">
              <NavLink
                to={t.to}
                className={({ isActive }) =>
                  `flex h-10 items-center rounded-full px-3 whitespace-nowrap ${
                    isActive
                      ? "bg-accent-soft font-semibold text-accent"
                      : "hover:bg-hover"
                  }`
                }
              >
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="min-w-0 max-w-[720px] flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
