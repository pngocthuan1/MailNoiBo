import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import type { Label } from '@/mock-data'
import { labelUnread } from '@/shared/state/mailSelectors'
import { useMailStore } from '@/shared/state/mailStore'
import { getDraggedIds } from '@/shared/state/mailStore'
import { useMailActions } from '@/features/mail-list/useMailActions'
import { LabelDot } from '@/shared/ui/LabelDot'
import { SidebarItem } from './SidebarItem'

function LabelNode({ label, depth, collapsed }: { label: Label; depth: number; collapsed: boolean }) {
  const [open, setOpen] = useState(true)
  const labels = useMailStore((st) => st.labels)
  const emails = useMailStore((st) => st.emails)
  const children = labels.filter((l) => l.parentId === label.id)
  const actions = useMailActions()

  return (
    <li>
      <div className="relative">
        {!collapsed && children.length > 0 && (
          <button
            type="button"
            aria-label={open ? `Thu gọn ${label.name}` : `Mở rộng ${label.name}`}
            className="absolute top-0 left-0 z-10 inline-flex h-8 w-6 cursor-pointer items-center justify-center text-muted hover:text-fg"
            style={{ marginLeft: depth * 16 - 4 }}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        <SidebarItem
          to={`/mail/label/${label.id}`}
          label={label.name}
          icon={<LabelDot color={label.color} />}
          count={labelUnread(emails, labels, label.id)}
          collapsed={collapsed}
          onDropMail={() => {
            const ids = getDraggedIds()
            if (ids.length) actions.setLabel(ids, label.id, true)
          }}
          indent={depth + (children.length > 0 || depth > 0 ? 1 : 0)}
        />
      </div>
      {open && children.length > 0 && (
        <ul className="flex flex-col gap-0.5">
          {children.map((c) => (
            <LabelNode key={c.id} label={c} depth={depth + 1} collapsed={collapsed} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function SidebarLabels({ collapsed }: { collapsed: boolean }) {
  const labels = useMailStore((st) => st.labels)
  const roots = labels.filter((l) => !l.parentId)
  return (
    <section aria-label="Nhãn">
      {collapsed ? (
        <div className="my-2 border-t border-line" />
      ) : (
        <div className="flex h-8 items-center justify-between pr-1 pl-3">
          <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">Nhãn</h2>
          <Link
            to="/settings/labels"
            aria-label="Tạo nhãn mới"
            title="Tạo nhãn mới"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
          >
            <Plus size={16} />
          </Link>
        </div>
      )}
      <ul className="flex flex-col gap-0.5">
        {roots.map((l) => (
          <LabelNode key={l.id} label={l} depth={0} collapsed={collapsed} />
        ))}
      </ul>
    </section>
  )
}
