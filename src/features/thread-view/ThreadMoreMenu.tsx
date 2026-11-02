import { Bookmark, ClipboardCheck, Download, FilterIcon, Languages, MoreVertical, Printer, Volume2, VolumeX } from 'lucide-react'
import type { Email } from '@/mock-data'
import { Popover } from '@/shared/ui/Popover'

type Props = {
  email: Email
  onMute: () => void
  onFilter: () => void
  onTranslate: () => void
  onPrint: () => void
  onEml: () => void
  onFollowUp: () => void
  onImportant: () => void
}

const item = 'flex h-9 w-full cursor-pointer items-center gap-3 px-4 hover:bg-hover'

/** Menu ba chấm của thanh công cụ (NH-09, NH-07, DT-08, DT-09, NB-06, HT-10). */
export function ThreadMoreMenu({ email, onMute, onFilter, onTranslate, onPrint, onEml, onFollowUp, onImportant }: Props) {
  const rows = [
    { label: email.muted ? 'Bỏ tắt tiếng' : 'Tắt tiếng', icon: email.muted ? Volume2 : VolumeX, run: onMute },
    { label: 'Tạo bộ lọc từ thư này', icon: FilterIcon, run: onFilter },
    { label: 'Dịch thư', icon: Languages, run: onTranslate },
    { label: 'In', icon: Printer, run: onPrint },
    { label: 'Tải về dạng .eml', icon: Download, run: onEml },
    { label: email.todoDue ? 'Đổi hạn cần xử lý' : 'Đánh dấu cần xử lý', icon: ClipboardCheck, run: onFollowUp },
    { label: email.important ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu quan trọng', icon: Bookmark, run: onImportant },
  ]
  return (
    <Popover
      align="left"
      className="w-64 py-1"
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
      {(close) =>
        rows.map(({ label, icon: Icon, run }) => (
          <button
            key={label}
            type="button"
            className={item}
            onClick={() => {
              close()
              run()
            }}
          >
            <Icon size={16} className="text-muted" />
            {label}
          </button>
        ))
      }
    </Popover>
  )
}
