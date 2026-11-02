import { Menu } from "lucide-react"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { useUI } from "@/shared/state/UIProvider"
import { IconButton } from "@/shared/ui/IconButton"
import { AvatarMenu } from "./AvatarMenu"
import { HeaderSearch } from "./HeaderSearch"
import { Logo } from "./Logo"
import { NotificationBell } from "./NotificationBell"
import { SettingsQuickMenu } from "./SettingsQuickMenu"

export function Header() {
  const { toggleSidebar, setDrawerOpen } = useUI()
  const isDrawer = !useMediaQuery("(min-width: 1024px)")

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-bg px-2 sm:gap-4 sm:px-4">
      <div className="flex items-center gap-1">
        <IconButton
          label="Menu chính"
          onClick={() => (isDrawer ? setDrawerOpen(true) : toggleSidebar())}
        >
          <Menu size={20} />
        </IconButton>
        <Logo />
      </div>
      <HeaderSearch />
      <div className="flex items-center">
        <NotificationBell />
        <SettingsQuickMenu />
        <AvatarMenu />
      </div>
    </header>
  )
}
