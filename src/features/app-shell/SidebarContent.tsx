import { useSearchParams } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { SidebarFolders } from './SidebarFolders'
import { SidebarLabels } from './SidebarLabels'
import { SidebarSharedMailboxes } from './SidebarSharedMailboxes'
import { StorageMeter } from './StorageMeter'

export function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const [params, setParams] = useSearchParams()
  const compose = () => {
    const next = new URLSearchParams(params)
    next.set('compose', 'new')
    setParams(next)
  }

  return (
    <div className="flex h-full flex-col">
      <div className={`shrink-0 ${collapsed ? 'flex justify-center py-2' : 'px-3 py-2'}`}>
        <button
          type="button"
          onClick={compose}
          aria-label="Soạn thư"
          title="Soạn thư"
          className={`flex cursor-pointer items-center justify-center bg-accent font-medium text-on-accent shadow-pop transition-colors hover:bg-accent-hover ${
            collapsed ? 'h-12 w-12 rounded-2xl' : 'h-14 w-full max-w-44 gap-3 rounded-2xl px-5 text-base'
          }`}
        >
          <Pencil size={20} />
          {!collapsed && 'Soạn thư'}
        </button>
      </div>
      <div className={`min-h-0 flex-1 space-y-2 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'} pb-2`}>
        <SidebarFolders collapsed={collapsed} />
        <SidebarLabels collapsed={collapsed} />
        <SidebarSharedMailboxes collapsed={collapsed} />
      </div>
      <StorageMeter collapsed={collapsed} />
    </div>
  )
}
