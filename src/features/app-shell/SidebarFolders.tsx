import {
  Bookmark,
  CalendarClock,
  Clock,
  FileText,
  Inbox,
  ListChecks,
  OctagonAlert,
  Send,
  Star,
  Trash2,
} from 'lucide-react'
import { useMemo } from 'react'
import { folders, type FolderId } from '@/mock-data'
import { folderCount } from '@/shared/state/mailSelectors'
import { useMailStore } from '@/shared/state/mailStore'
import { SidebarItem } from './SidebarItem'

const icons: Record<FolderId, typeof Inbox> = {
  inbox: Inbox,
  starred: Star,
  snoozed: Clock,
  important: Bookmark,
  sent: Send,
  drafts: FileText,
  scheduled: CalendarClock,
  todo: ListChecks,
  spam: OctagonAlert,
  trash: Trash2,
}

export function SidebarFolders({ collapsed }: { collapsed: boolean }) {
  const emails = useMailStore((st) => st.emails)
  const counts = useMemo(() => Object.fromEntries(folders.map((f) => [f.id, folderCount(emails, f.id)])), [emails])
  return (
    <nav aria-label="Hộp thư" className="flex flex-col gap-0.5">
      {folders.map((f) => {
        const Icon = icons[f.id]
        return (
          <SidebarItem
            key={f.id}
            to={`/mail/${f.id}`}
            label={f.name}
            icon={<Icon size={18} />}
            count={counts[f.id]}
            collapsed={collapsed}
          />
        )
      })}
    </nav>
  )
}
