import { Forward, MoreVertical, Reply, ReplyAll, Undo2 } from 'lucide-react'
import type { Message } from '@/mock-data'
import { Popover } from '@/shared/ui/Popover'
import { useMailStore } from '@/shared/state/mailStore'
import { pendingRecipients } from './RecallDialog'
import type { ComposerMode } from './types'

type Props = { message: Message; mine: boolean; onReply: (m: ComposerMode) => void; onRecall: () => void }

const item = 'flex h-9 w-full cursor-pointer items-center gap-3 px-4 hover:bg-hover'

/** Menu ba chấm của từng thư; "Thu hồi" chỉ có ở thư của tôi khi còn người chưa đọc (NB-04). */
export function MessageMenu({ message, mine, onReply, onRecall }: Props) {
  const recalled = useMailStore((s) => s.recalls[message.id]?.recalled ?? 0)
  const canRecall = mine && pendingRecipients(message, recalled) > 0
  return (
    <Popover
      className="w-52 py-1"
      trigger={({ toggle }) => (
        <button
          type="button"
          aria-label="Thêm"
          title="Thêm"
          onClick={toggle}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
        >
          <MoreVertical size={16} />
        </button>
      )}
    >
      {(close) => (
        <>
          <button type="button" className={item} onClick={() => { close(); onReply('reply') }}>
            <Reply size={16} className="text-muted" /> Trả lời
          </button>
          <button type="button" className={item} onClick={() => { close(); onReply('replyAll') }}>
            <ReplyAll size={16} className="text-muted" /> Trả lời tất cả
          </button>
          <button type="button" className={item} onClick={() => { close(); onReply('forward') }}>
            <Forward size={16} className="text-muted" /> Chuyển tiếp
          </button>
          {canRecall && (
            <button type="button" className={`${item} border-t border-line text-danger`} onClick={() => { close(); onRecall() }}>
              <Undo2 size={16} /> Thu hồi
            </button>
          )}
        </>
      )}
    </Popover>
  )
}
