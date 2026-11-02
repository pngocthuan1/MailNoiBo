import type { Message } from '@/mock-data'
import { listTime } from '@/features/mail-list/mailFormat'
import { Avatar } from '@/shared/ui/Avatar'
import { plainText } from './getMessages'

/** Thư cũ thu gọn thành một dòng: ảnh, tên, đoạn đầu, giờ. Bấm để mở rộng. */
export function CollapsedMessage({ message, onExpand }: { message: Message; onExpand: () => void }) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Mở thư từ ${message.from.name}`}
      className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 text-left hover:bg-hover"
    >
      <Avatar name={message.from.name} size={24} />
      <span className="w-36 shrink-0 truncate font-semibold sm:w-44">{message.from.name}</span>
      <span className="min-w-0 flex-1 truncate text-muted">{plainText(message.html)}</span>
      <span className="shrink-0 text-xs text-muted">{listTime(message.ts)}</span>
    </button>
  )
}
