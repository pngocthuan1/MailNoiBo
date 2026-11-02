import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'

type UIState = {
  theme: ThemeChoice
  setTheme: (t: ThemeChoice) => void
  /** true khi người dùng bấm nút ba gạch để đảo trạng thái mặc định của thanh bên */
  sidebarToggled: boolean
  toggleSidebar: () => void
  drawerOpen: boolean
  setDrawerOpen: (v: boolean) => void
}

const UIContext = createContext<UIState | null>(null)

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI phải nằm trong UIProvider')
  return ctx
}

function applyTheme(choice: ThemeChoice) {
  const dark = choice === 'dark' || (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>(() => (localStorage.getItem('theme') as ThemeChoice) || 'light')
  const [sidebarToggled, setSidebarToggled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = useCallback((t: ThemeChoice) => {
    localStorage.setItem('theme', t)
    setThemeState(t)
  }, [])

  const value = useMemo<UIState>(
    () => ({
      theme,
      setTheme,
      sidebarToggled,
      toggleSidebar: () => setSidebarToggled((v) => !v),
      drawerOpen,
      setDrawerOpen,
    }),
    [theme, setTheme, sidebarToggled, drawerOpen],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}
