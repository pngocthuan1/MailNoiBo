import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ShieldAlert, Megaphone, Clock, Mail } from 'lucide-react'
import { getEmployee, notifications as seed } from '@/mock-data'
import { Avatar } from '@/shared/ui/Avatar'
import { IconButton } from '@/shared/ui/IconButton'
import { Popover } from '@/shared/ui/Popover'

const kindIcon = {
  mail: Mail,
  security: ShieldAlert,
  deadline: Clock,
  announcement: Megaphone,
}

export function NotificationBell() {
  const [items, setItems] = useState(seed)
  const [tab, setTab] = useState<'all' | 'unread'>('all')
  const unread = items.filter((n) => n.unread).length
  const shown = tab === 'all' ? items : items.filter((n) => n.unread)

  return (
    <Popover
      className="w-[380px] max-w-[calc(100vw-16px)]"
      trigger={({ toggle, open }) => (
        <IconButton label="Thông báo" onClick={toggle} aria-expanded={open}>
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] leading-none font-bold text-white">
              {unread}
            </span>
          )}
        </IconButton>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center gap-1 border-b border-line px-2 pt-2">
            {(['all', 'unread'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`h-10 cursor-pointer border-b-2 px-3 font-medium ${
                  tab === t ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-fg'
                }`}
              >
                {t === 'all' ? 'Tất cả' : `Chưa đọc (${unread})`}
              </button>
            ))}
          </div>
          <ul className="max-h-[400px] overflow-y-auto">
            {shown.length === 0 && <li className="p-8 text-center text-muted">Không có thông báo nào.</li>}
            {shown.map((n) => {
              const actor = n.actorId ? getEmployee(n.actorId) : undefined
              const Icon = kindIcon[n.kind]
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left hover:bg-hover"
                    onClick={() => setItems((l) => l.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                  >
                    {actor ? (
                      <Avatar name={actor.name} size={32} />
                    ) : (
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
                        <Icon size={16} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={`block ${n.unread ? 'font-semibold' : ''}`}>{n.text}</span>
                      <span className="text-xs text-muted">{n.time}</span>
                    </span>
                    {n.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Chưa đọc" />}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center justify-between border-t border-line px-4 py-2">
            <button
              type="button"
              className="h-8 cursor-pointer rounded px-2 text-accent hover:bg-accent-soft"
              onClick={() => setItems((l) => l.map((x) => ({ ...x, unread: false })))}
            >
              Đánh dấu tất cả đã đọc
            </button>
            <Link
              to="/settings/notifications"
              onClick={close}
              className="inline-flex h-8 items-center rounded px-2 text-accent hover:bg-accent-soft"
            >
              Cài đặt thông báo
            </Link>
          </div>
        </div>
      )}
    </Popover>
  )
}
