import { Link } from "react-router-dom"
import { Check, Monitor, Moon, Settings, Sun } from "lucide-react"
import { useUI, type ThemeChoice } from "@/shared/state/UIProvider"
import { IconButton } from "@/shared/ui/IconButton"
import { Popover } from "@/shared/ui/Popover"

const themes: { id: ThemeChoice label: string icon: typeof Sun }[] = [
  { id: "light", label: "Sáng", icon: Sun },
  { id: "dark", label: "Tối", icon: Moon },
  { id: "system", label: "Theo hệ thống", icon: Monitor },
]

export function SettingsQuickMenu() {
  const { theme, setTheme } = useUI()
  return (
    <Popover
      className="w-64 py-2"
      trigger={({ toggle, open }) => (
        <IconButton label="Cài đặt nhanh" onClick={toggle} aria-expanded={open}>
          <Settings size={20} />
        </IconButton>
      )}
    >
      {(close) => (
        <div>
          <p className="px-4 pb-1 text-xs font-medium text-muted">Giao diện</p>
          {themes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="flex h-10 w-full cursor-pointer items-center gap-3 px-4 hover:bg-hover"
              onClick={() => setTheme(id)}
            >
              <Icon size={16} className="text-muted" />
              <span className="flex-1 text-left">{label}</span>
              {theme === id && <Check size={16} className="text-accent" />}
            </button>
          ))}
          <div className="my-2 border-t border-line" />
          <Link
            to="/settings/general"
            onClick={close}
            className="flex h-10 items-center gap-3 px-4 hover:bg-hover"
          >
            <Settings size={16} className="text-muted" />
            Xem tất cả cài đặt
          </Link>
        </div>
      )}
    </Popover>
  )
}
