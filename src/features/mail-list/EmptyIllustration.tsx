import { AlarmClock, Bookmark, CalendarClock, ListChecks, MailCheck, PencilLine, Send, ShieldCheck, Star, Tag, Trash2, Users } from 'lucide-react'
import type { ComponentType } from 'react'

export type EmptyKind =
  | 'inbox' | 'starred' | 'snoozed' | 'important' | 'sent' | 'drafts'
  | 'scheduled' | 'todo' | 'spam' | 'trash' | 'label' | 'shared'

/** Mỗi hộp thư một hình minh họa riêng: biểu tượng, màu nhãn và bố cục trang trí khác nhau. */
const art: Record<EmptyKind, { icon: ComponentType<{ size?: number; strokeWidth?: number }>; color: number; decor: 'dots' | 'lines' | 'rings' }> = {
  inbox: { icon: MailCheck, color: 6, decor: 'dots' },
  starred: { icon: Star, color: 3, decor: 'dots' },
  snoozed: { icon: AlarmClock, color: 2, decor: 'rings' },
  important: { icon: Bookmark, color: 3, decor: 'lines' },
  sent: { icon: Send, color: 5, decor: 'lines' },
  drafts: { icon: PencilLine, color: 7, decor: 'lines' },
  scheduled: { icon: CalendarClock, color: 6, decor: 'rings' },
  todo: { icon: ListChecks, color: 4, decor: 'dots' },
  spam: { icon: ShieldCheck, color: 1, decor: 'rings' },
  trash: { icon: Trash2, color: 8, decor: 'lines' },
  label: { icon: Tag, color: 7, decor: 'dots' },
  shared: { icon: Users, color: 5, decor: 'rings' },
}

export function EmptyIllustration({ kind }: { kind: EmptyKind }) {
  const { icon: Icon, color, decor } = art[kind]
  const main = `var(--label-${color})`
  const soft = `var(--label-${color}-soft)`
  return (
    <div className="relative h-36 w-48" aria-hidden>
      <svg viewBox="0 0 192 144" className="absolute inset-0">
        <ellipse cx="96" cy="76" rx="84" ry="60" fill={soft} />
        <rect x="40" y="34" width="112" height="76" rx="12" fill="var(--surface)" stroke="var(--line)" strokeWidth="2" transform="rotate(-4 96 72)" />
        {decor === 'lines' && (
          <g stroke="var(--line)" strokeWidth="4" strokeLinecap="round">
            <line x1="58" y1="88" x2="120" y2="84" />
            <line x1="58" y1="98" x2="100" y2="95" />
          </g>
        )}
        {decor === 'dots' && (
          <g fill={main} opacity="0.5">
            <circle cx="24" cy="40" r="4" />
            <circle cx="170" cy="30" r="3" />
            <circle cx="164" cy="112" r="5" />
            <circle cx="30" cy="108" r="3" />
          </g>
        )}
        {decor === 'rings' && (
          <g fill="none" stroke={main} strokeWidth="2" opacity="0.5">
            <circle cx="28" cy="38" r="7" />
            <circle cx="168" cy="108" r="9" />
            <circle cx="166" cy="34" r="3" />
          </g>
        )}
      </svg>
      <span
        className="absolute top-1/2 left-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-full text-white shadow-pop"
        style={{ background: main }}
      >
        <Icon size={28} strokeWidth={1.75} />
      </span>
    </div>
  )
}
