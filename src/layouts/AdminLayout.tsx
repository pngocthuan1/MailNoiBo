import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { currentUser } from '@/mock-data'

const links = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/users', label: 'Người dùng' },
  { to: '/admin/quotas', label: 'Hạn mức dung lượng' },
  { to: '/admin/roles', label: 'Vai trò và quyền' },
  { to: '/admin/audit', label: 'Nhật ký kiểm toán' },
  { to: '/admin/retention', label: 'Lưu trữ và xuất thư' },
  { to: '/admin/shared-mailboxes', label: 'Hộp thư dùng chung' },
]

export function AdminLayout() {
  if (currentUser.role !== 'admin') return <Navigate to="/403" replace />
  return (
    <div className="flex min-h-full flex-col bg-bg md:flex-row">
      <nav aria-label="Quản trị" className="shrink-0 p-4 md:w-60">
        <NavLink to="/mail/inbox" className="mb-4 flex h-8 items-center gap-2 text-accent hover:underline">
          <ArrowLeft size={16} />
          Về hộp thư
        </NavLink>
        <h1 className="mb-2 px-3 text-xl font-semibold">Quản trị</h1>
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map((l) => (
            <li key={l.to} className="shrink-0">
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex h-10 items-center rounded-full px-3 whitespace-nowrap ${
                    isActive ? 'bg-accent-soft font-semibold text-accent' : 'hover:bg-hover'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="min-w-0 flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
