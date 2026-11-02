import type { ReactNode } from 'react'
import { Archive, Clock, Mail, MailOpen, Trash2 } from 'lucide-react'
import type { Email } from '@/mock-data'
import type { Variant } from './MailRow'
import type { useMailActions } from './useMailActions'

type Actions = ReturnType<typeof useMailActions>

type Props = {
  email: Email
  variant: Variant
  actions: Actions
  onSnooze: (ids: string[]) => void
  onReschedule: (ids: string[]) => void
  onDeleteForever: (ids: string[]) => void
}

function Btn({ label, children, onClick, text }: { label: string; children: ReactNode; onClick: () => void; text?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-muted hover:bg-hover hover:text-fg ${
        text ? 'px-3 text-accent hover:text-accent' : 'w-8'
      }`}
    >
      {children}
    </button>
  )
}

/** 4 nút hiện khi rê chuột lên dòng thư (HT-11), thay đổi theo từng hộp thư. */
export function RowActions({ email, variant, actions, onSnooze, onReschedule, onDeleteForever }: Props) {
  const ids = [email.id]
  const archive = (
    <Btn key="a" label="Lưu trữ" onClick={() => actions.archive(ids)}>
      <Archive size={16} />
    </Btn>
  )
  const del = (
    <Btn key="d" label="Xóa" onClick={() => actions.remove(ids)}>
      <Trash2 size={16} />
    </Btn>
  )

  switch (variant) {
    case 'trash':
    case 'spam':
      return (
        <>
          <Btn text label="Khôi phục" onClick={() => actions.restore(ids)}>
            Khôi phục
          </Btn>
          <Btn label="Xóa vĩnh viễn" onClick={() => onDeleteForever(ids)}>
            <Trash2 size={16} />
          </Btn>
        </>
      )
    case 'drafts':
      return del
    case 'scheduled':
      return (
        <>
          <Btn text label="Sửa giờ" onClick={() => onReschedule(ids)}>
            Sửa giờ
          </Btn>
          <Btn text label="Hủy lịch" onClick={() => actions.cancelSchedule(ids)}>
            Hủy lịch
          </Btn>
        </>
      )
    case 'snoozed':
      return (
        <>
          <Btn text label="Bỏ hoãn" onClick={() => actions.unsnooze(ids)}>
            Bỏ hoãn
          </Btn>
          {archive}
          {del}
        </>
      )
    case 'todo':
      return (
        <>
          <Btn text label="Xong" onClick={() => actions.markTodoDone(ids)}>
            Xong
          </Btn>
          {archive}
          {del}
        </>
      )
    default:
      return (
        <>
          {archive}
          {del}
          <Btn
            label={email.unread ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
            onClick={() => actions.markRead(ids, email.unread)}
          >
            {email.unread ? <MailOpen size={16} /> : <Mail size={16} />}
          </Btn>
          <Btn label="Hoãn" onClick={() => onSnooze(ids)}>
            <Clock size={16} />
          </Btn>
        </>
      )
  }
}
