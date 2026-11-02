import { ChevronDown } from 'lucide-react'
import type { Message, Person } from '@/mock-data'
import { Popover } from '@/shared/ui/Popover'
import { formatDateTime } from './fileUtils'
import { me } from './getMessages'

const list = (people?: Person[]) =>
  people && people.length ? people.map((p) => `${p.name} <${p.email}>`).join(', ') : 'Không có'

/** Dòng "đến tôi" kèm mũi tên mở bảng chi tiết Từ / Đến / CC / BCC / ngày giờ (DT-05). */
export function RecipientDetails({ message }: { message: Message }) {
  const everyone = [...message.to, ...(message.cc ?? [])]
  const toMe = everyone.some((p) => p.email === me.email)
  const others = everyone.length - (toMe ? 1 : 0)
  const text = toMe
    ? `đến tôi${others > 0 ? ` và ${others} người khác` : ''}`
    : `đến ${message.to.slice(0, 2).map((p) => p.name.split(' ').slice(-1)[0]).join(', ')}${message.to.length > 2 ? ` và ${message.to.length - 2} người khác` : ''}`

  const rows: [string, string][] = [
    ['Từ', `${message.from.name} <${message.from.email}>`],
    ['Đến', list(message.to)],
    ['CC', list(message.cc)],
    ['BCC', list(message.bcc)],
    ['Ngày giờ', formatDateTime(message.ts)],
  ]

  return (
    <Popover
      align="left"
      className="w-[min(420px,85vw)] p-4"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label="Xem chi tiết người nhận"
          className="inline-flex h-6 cursor-pointer items-center gap-1 rounded px-1 text-xs text-muted hover:bg-hover"
        >
          {text}
          <ChevronDown size={14} />
        </button>
      )}
    >
      {() => (
        <dl className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-2 text-xs">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd className="break-words">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </Popover>
  )
}
