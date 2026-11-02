import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { useUI } from '@/shared/state/UIProvider'
import { SidebarContent } from './SidebarContent'

/**
 * >= 1280px: mở rộng (có thể thu gọn bằng nút ba gạch)
 * 1024-1279px: chỉ còn biểu tượng (nút ba gạch mở rộng)
 * < 1024px: ngăn kéo
 */
export function Sidebar() {
  const { sidebarToggled, drawerOpen, setDrawerOpen } = useUI()
  const wide = useMediaQuery('(min-width: 1280px)')
  const docked = useMediaQuery('(min-width: 1024px)')
  const location = useLocation()

  useEffect(() => setDrawerOpen(false), [location.pathname, setDrawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen, setDrawerOpen])

  if (docked) {
    const collapsed = wide ? sidebarToggled : !sidebarToggled
    return (
      <aside
        aria-label="Thanh bên"
        className={`shrink-0 overflow-hidden bg-bg transition-[width] duration-200 ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>
    )
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      <aside
        aria-label="Thanh bên"
        aria-hidden={!drawerOpen}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-surface shadow-pop transition-transform duration-200 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent collapsed={false} />
      </aside>
    </>
  )
}
