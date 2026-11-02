import { Inbox, Tag, Users } from 'lucide-react'
import type { Email, MailCategory } from '@/mock-data'

const tabs: { id: MailCategory; label: string; icon: typeof Inbox }[] = [
  { id: 'primary', label: 'Chính', icon: Inbox },
  { id: 'social', label: 'Mạng xã hội', icon: Users },
  { id: 'promo', label: 'Quảng cáo', icon: Tag },
]

type Props = { value: MailCategory; onChange: (c: MailCategory) => void; emails: Email[] }

/** Tab phân loại chỉ có ở Inbox (HT-08). */
export function CategoryTabs({ value, onChange, emails }: Props) {
  return (
    <div role="tablist" aria-label="Phân loại thư" className="flex border-b border-line">
      {tabs.map(({ id, label, icon: Icon }) => {
        const fresh = emails.filter((e) => e.category === id && e.unread).length
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`flex h-14 min-w-0 cursor-pointer items-center gap-3 border-b-[3px] px-4 font-medium whitespace-nowrap hover:bg-hover sm:min-w-44 ${
              active ? 'border-accent text-accent' : 'border-transparent text-muted'
            }`}
          >
            <Icon size={18} />
            {label}
            {fresh > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  active ? 'bg-accent text-on-accent' : 'bg-surface-2 text-fg'
                }`}
              >
                {fresh} mới
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
