import { Link, matchPath, useLocation } from "react-router-dom"
import { Megaphone, X } from "lucide-react"
import { announcement } from "@/mock-data"
import { Button } from "@/shared/ui/Button"
import {
  acknowledgeAnnouncement,
  useAnnouncementAcknowledged,
} from "./announcementStore"

// Trên các trang danh sách thư, dải ghim hiển thị ngay trong danh sách (NB-05).
const listPaths = [
  "/mail/:folder",
  "/mail/label/:labelId",
  "/mail/shared/:mailboxId",
]

export function AnnouncementBanner() {
  const acknowledged = useAnnouncementAcknowledged()
  const { pathname } = useLocation()
  if (acknowledged || listPaths.some((p) => matchPath(p, pathname))) return null
  return (
    <div
      role="region"
      aria-label="Thông báo toàn công ty"
      className="flex items-center gap-3 bg-accent-soft px-4 py-3"
    >
      <Megaphone size={18} className="shrink-0 text-accent" />
      <div className="min-w-0 flex-1">
        <Link
          to={`/mail/inbox/${announcement.threadId}`}
          className="block truncate font-semibold hover:underline"
        >
          {announcement.title}
        </Link>
        <p className="truncate text-xs text-muted">{announcement.body}</p>
      </div>
      <Button
        variant="text"
        className="shrink-0"
        onClick={acknowledgeAnnouncement}
      >
        Tôi đã đọc
      </Button>
      <button
        type="button"
        aria-label="Đóng thông báo"
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover"
        onClick={acknowledgeAnnouncement}
      >
        <X size={16} />
      </button>
    </div>
  )
}
