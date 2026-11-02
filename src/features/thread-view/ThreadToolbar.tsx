import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  Archive,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  OctagonAlert,
  Trash2,
} from "lucide-react"
import type { Email, FolderId, Message } from "@/mock-data"
import { LabelMenu } from "@/features/mail-list/LabelMenu"
import { SnoozeDialog } from "@/features/mail-list/SnoozeDialog"
import { useMailActions } from "@/features/mail-list/useMailActions"
import { useSnackbar } from "@/shared/ui/Snackbar"
import { downloadEml } from "./emlExport"
import { me } from "./getMessages"
import { ThreadMoreMenu } from "./ThreadMoreMenu"
import { useThreadNav } from "./useThreadNav"

type Props = {
  email: Email
  folder: FolderId
  messages: Message[]
  onTranslate: () => void
  onFollowUp: () => void
}

function Tool({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

/** Thanh công cụ trang Đọc thư (DT-06, HT-04, HT-05, HT-09, HT-10, NH-02, NH-07, NH-09, NB-06). */
export function ThreadToolbar({
  email,
  folder,
  messages,
  onTranslate,
  onFollowUp,
}: Props) {
  const actions = useMailActions()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const nav = useThreadNav(email, folder)
  const [snooze, setSnooze] = useState(false)
  const ids = [email.id]

  const sender =
    messages.find((m) => m.from.email !== me.email)?.from.email ?? me.email
  const isRestricted = email.confidential?.restricted

  const handlePrint = () => {
    if (isRestricted) {
      snackbar.show({ message: "Thư bảo mật không cho phép in" })
      return
    }
    window.print()
  }

  const handleEml = () => {
    if (isRestricted) {
      snackbar.show({ message: "Thư bảo mật không cho phép tải về" })
      return
    }
    downloadEml(email, messages)
  }

  return (
    <div className="no-print sticky top-0 z-10 flex h-12 items-center gap-1 border-b border-line bg-surface px-2">
      <Tool label="Quay lại danh sách" onClick={nav.goList}>
        <ArrowLeft size={18} />
      </Tool>
      <Tool
        label="Lưu trữ"
        onClick={() => {
          actions.archive(ids)
          nav.goNextOrList()
        }}
      >
        <Archive size={16} />
      </Tool>
      <Tool
        label="Báo cáo spam"
        onClick={() => {
          actions.spam(ids)
          nav.goNextOrList()
        }}
      >
        <OctagonAlert size={16} />
      </Tool>
      <Tool
        label="Xóa"
        onClick={() => {
          actions.remove(ids)
          nav.goNextOrList()
        }}
      >
        <Trash2 size={16} />
      </Tool>
      <span className="mx-1 h-5 w-px bg-line" />
      <Tool
        label="Đánh dấu chưa đọc"
        onClick={() => {
          actions.markRead(ids, false)
          nav.goList()
        }}
      >
        <Mail size={16} />
      </Tool>
      <Tool label="Hoãn" onClick={() => setSnooze(true)}>
        <Clock size={16} />
      </Tool>
      <LabelMenu
        targets={[email]}
        onToggle={(labelId, on) => actions.setLabel(ids, labelId, on)}
        onCreate={(name) => actions.createLabelAndApply(ids, name)}
      />
      <ThreadMoreMenu
        email={email}
        onMute={() => actions.mute(ids, !email.muted)}
        onFilter={() =>
          navigate(`/settings/filters/new?from=${encodeURIComponent(sender)}`)
        }
        onTranslate={onTranslate}
        onPrint={handlePrint}
        onEml={handleEml}
        onFollowUp={onFollowUp}
        onImportant={() => actions.toggleImportant(ids, !email.important)}
      />

      <span className="ml-auto pr-1 text-xs whitespace-nowrap text-muted">
        {nav.position > 0 ? nav.position : 1} trong {Math.max(nav.total, 1)}
      </span>
      <Tool
        label="Thư trước"
        disabled={!nav.prev}
        onClick={() => nav.prev && nav.open(nav.prev)}
      >
        <ChevronLeft size={18} />
      </Tool>
      <Tool
        label="Thư sau"
        disabled={!nav.next}
        onClick={() => nav.next && nav.open(nav.next)}
      >
        <ChevronRight size={18} />
      </Tool>

      {snooze && (
        <SnoozeDialog
          onClose={() => setSnooze(false)}
          onPick={(ts) => {
            setSnooze(false)
            actions.snooze(ids, ts)
            nav.goNextOrList()
          }}
        />
      )}
    </div>
  )
}
