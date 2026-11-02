import { Link } from 'react-router-dom'
import { Megaphone } from 'lucide-react'
import { announcement } from '@/mock-data'
import { acknowledgeAnnouncement, useAnnouncementAcknowledged } from '@/features/app-shell/announcementStore'
import { Button } from '@/shared/ui/Button'

/** Dải thông báo toàn công ty ghim đầu danh sách (NB-05). */
export function AnnouncementStrip() {
  if (useAnnouncementAcknowledged()) return null
  return (
    <div
      role="region"
      aria-label="Thông báo toàn công ty được ghim"
      className="mx-4 mb-2 flex items-center gap-3 rounded-lg bg-accent-soft px-4 py-2"
    >
      <Megaphone size={18} className="shrink-0 text-accent" />
      <div className="min-w-0 flex-1">
        <Link to={`/mail/inbox/${announcement.threadId}`} className="block truncate font-semibold hover:underline">
          {announcement.title}
        </Link>
        <p className="truncate text-xs text-muted">{announcement.body}</p>
      </div>
      <Button variant="text" className="shrink-0" onClick={acknowledgeAnnouncement}>
        Tôi đã đọc
      </Button>
    </div>
  )
}
