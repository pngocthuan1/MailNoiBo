import { CheckCheck } from 'lucide-react'
import type { Message } from '@/mock-data'
import { Avatar } from '@/shared/ui/Avatar'
import { Popover } from '@/shared/ui/Popover'
import { useMailStore } from '@/shared/state/mailStore'
import { formatDateTime } from './fileUtils'

/** Biên nhận đã đọc (NB-03): dấu tích đôi cạnh giờ, bấm mở bảng "Đã đọc N trên M". */
export function ReadReceiptButton({ message }: { message: Message }) {
  const recall = useMailStore((s) => s.recalls[message.id])
  const receipts = message.receipts ?? []
  const read = receipts.filter((r) => r.readAt).length
  const unread = receipts.filter((r) => !r.readAt)
  // Các người chưa đọc được thu hồi theo thứ tự cuối danh sách
  const recalledNames = new Set(unread.slice(unread.length - (recall?.recalled ?? 0)).map((r) => r.name))

  return (
    <Popover
      className="w-80 py-2"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Đã đọc ${read} trên ${receipts.length}`}
          title={`Đã đọc ${read} trên ${receipts.length}`}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
        >
          <CheckCheck size={16} className={read > 0 ? 'text-accent' : 'text-muted'} />
        </button>
      )}
    >
      {() => (
        <div>
          <p className="px-4 pb-2 font-semibold">
            Đã đọc {read} trên {receipts.length}
          </p>
          <ul>
            {receipts.map((r) => (
              <li key={r.name} className={`flex items-center gap-3 px-4 py-2 ${r.readAt ? '' : 'text-muted'}`}>
                <span className={r.readAt ? '' : 'opacity-50 grayscale'}>
                  <Avatar name={r.name} size={24} />
                </span>
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                <span className="text-xs">
                  {r.readAt ? formatDateTime(r.readAt) : recalledNames.has(r.name) ? 'Đã thu hồi' : 'Chưa đọc'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Popover>
  )
}
