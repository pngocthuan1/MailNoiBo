import { useState, type ReactNode } from "react"
import { NavLink } from "react-router-dom"

type Props = {
  to: string
  label: string
  icon: ReactNode
  count?: number
  collapsed: boolean
  indent?: number
  /** Cho phép thả thư (kéo từ danh sách) vào mục này */
  onDropMail?: () => void
}

export function SidebarItem({
  to,
  label,
  icon,
  count,
  collapsed,
  indent = 0,
  onDropMail,
}: Props) {
  const [over, setOver] = useState(false)
  return (
    <NavLink
      to={to}
      onDragOver={
        onDropMail
          ? (e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = "move"
              setOver(true)
            }
          : undefined
      }
      onDragLeave={onDropMail ? () => setOver(false) : undefined}
      onDrop={
        onDropMail
          ? (e) => {
              e.preventDefault()
              setOver(false)
              onDropMail()
            }
          : undefined
      }
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      style={
        !collapsed && indent ? { paddingLeft: 12 + indent * 16 } : undefined
      }
      className={({ isActive }) =>
        `relative flex h-8 items-center rounded-full ${
          collapsed ? "mx-auto w-10 justify-center" : "gap-3 px-3"
        } ${
          isActive
            ? "bg-accent-soft font-semibold text-accent"
            : "text-fg hover:bg-hover"
        } ${over ? "ring-2 ring-accent ring-inset bg-accent-soft" : ""} ${
          !collapsed ? "h-8" : "h-10"
        }`
      }
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {icon}
      </span>
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!!count && !collapsed && (
        <span className="text-xs font-semibold">{count}</span>
      )}
      {!!count && collapsed && (
        <span
          className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-accent"
          aria-label={`${count} chưa đọc`}
        />
      )}
    </NavLink>
  )
}
