import type { ReactNode } from 'react'
import { Archive, Clock, Mail, MailOpen, MoreVertical, OctagonAlert, RotateCcw, Star, Trash2 } from 'lucide-react'
import type { Email } from '@/mock-data'
import { Popover } from '@/shared/ui/Popover'
import { LabelMenu } from './LabelMenu'
import { SelectAllControl, type SelectMode } from './SelectAllControl'
import type { Variant } from './MailRow'
import type { useMailActions } from './useMailActions'

type Props = {
  selected: Email[]
  allCheckedState: 'some' | 'all'
  variant: Variant
  actions: ReturnType<typeof useMailActions>
  onSelect: (m: SelectMode) => void
  onSnooze: (ids: string[]) => void
  onDeleteForever: (ids: string[]) => void
  onDone: () => void
}

function Tool({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
    >
      {children}
    </button>
  )
}

/** Thanh công cụ khi đã chọn thư: thay thế thanh trên (HT-03, HT-04, HT-05, HT-09, NH-02). */
export function SelectionToolbar({ selected, allCheckedState, variant, actions, onSelect, onSnooze, onDeleteForever, onDone }: Props) {
  const ids = selected.map((e) => e.id)
  const anyUnread = selected.some((e) => e.unread)
  const allStarred = selected.every((e) => e.starred)
  const allImportant = selected.every((e) => e.important)

  const finish = (fn: () => void) => () => {
    fn()
    onDone()
  }

  const bin = variant === 'trash' || variant === 'spam'

  return (
    <div className="flex h-12 items-center gap-1 border-b border-line bg-accent-soft px-2">
      <SelectAllControl state={allCheckedState} onSelect={onSelect} />
      <span className="mr-2 ml-1 font-medium whitespace-nowrap">{selected.length} đã chọn</span>
      {bin ? (
        <>
          <button
            type="button"
            onClick={finish(() => actions.restore(ids))}
            className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 font-medium text-accent hover:bg-hover"
          >
            <RotateCcw size={16} />
            Khôi phục
          </button>
          <button
            type="button"
            onClick={() => onDeleteForever(ids)}
            className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 font-medium text-danger hover:bg-hover"
          >
            <Trash2 size={16} />
            Xóa vĩnh viễn
          </button>
        </>
      ) : (
        <>
          <Tool label="Lưu trữ" onClick={finish(() => actions.archive(ids))}>
            <Archive size={16} />
          </Tool>
          <Tool label="Báo cáo spam" onClick={finish(() => actions.spam(ids))}>
            <OctagonAlert size={16} />
          </Tool>
          <Tool label="Xóa" onClick={finish(() => actions.remove(ids))}>
            <Trash2 size={16} />
          </Tool>
          <span className="mx-1 h-5 w-px bg-line" />
          <Tool
            label={anyUnread ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
            onClick={finish(() => actions.markRead(ids, anyUnread))}
          >
            {anyUnread ? <MailOpen size={16} /> : <Mail size={16} />}
          </Tool>
          <Tool label="Hoãn" onClick={() => onSnooze(ids)}>
            <Clock size={16} />
          </Tool>
          <LabelMenu
            targets={selected}
            onToggle={(labelId, on) => actions.setLabel(ids, labelId, on)}
            onCreate={(name) => actions.createLabelAndApply(ids, name)}
          />
          <Tool
            label={allStarred ? 'Bỏ gắn sao' : 'Gắn sao'}
            onClick={finish(() => actions.toggleStar(ids, !allStarred))}
          >
            <Star size={16} />
          </Tool>
          <Popover
            align="left"
            className="w-60 py-1"
            trigger={({ toggle }) => (
              <Tool label="Thêm" onClick={toggle}>
                <MoreVertical size={16} />
              </Tool>
            )}
          >
            {(close) => (
              <button
                type="button"
                onClick={() => {
                  actions.toggleImportant(ids, !allImportant)
                  close()
                  onDone()
                }}
                className="flex h-9 w-full cursor-pointer items-center px-4 hover:bg-hover"
              >
                {allImportant ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu quan trọng'}
              </button>
            )}
          </Popover>
        </>
      )}
    </div>
  )
}
