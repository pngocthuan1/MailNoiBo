import { useEffect, useMemo, useRef, useState } from "react"
import type { Email, FolderId } from "@/mock-data"
import { useMailActions } from "@/features/mail-list/useMailActions"
import {
  patchEmails,
  setNeverTranslateEnglish,
  useMailStore,
} from "@/shared/state/mailStore"
import { useSnackbar } from "@/shared/ui/Snackbar"
import { ConfidentialThreadBanner } from "./ConfidentialThreadBanner"
import { FollowUpDialog } from "./FollowUpDialog"
import { getExtras, getMessages } from "./getMessages"
import { MessageList } from "./MessageList"
import { RecallDialog } from "./RecallDialog"
import { ReplyArea } from "./ReplyArea"
import { SummaryBox } from "./SummaryBox"
import { ThreadTitle } from "./ThreadTitle"
import { ThreadToolbar } from "./ThreadToolbar"
import { TranslateBanner, type TranslateState } from "./TranslateBanner"
import { useInlineComposer } from "./useInlineComposer"
import { useThreadDemoStore } from "./threadDemoStore"
import { useThreadNav } from "./useThreadNav"
import type { MessageCtx } from "./types"
import type { Message } from "@/mock-data"

/** Nội dung trang Đọc thư của một chuỗi: thanh công cụ, tiêu đề, dải cảnh báo, các thư, ô trả lời. */
export function ThreadView({
  email,
  folder,
}: {
  email: Email
  folder: FolderId
}) {
  const actions = useMailActions()
  const snackbar = useSnackbar()
  const nav = useThreadNav(email, folder)
  const neverTranslate = useMailStore((s) => s.neverTranslateEnglish)
  const translateFails = useThreadDemoStore((s) => s.translateFails)

  const sent = useMailStore((s) => s.sentMessages[email.threadId])
  // Thư của chuỗi + thư tôi vừa gửi (hiện ở cuối chuỗi).
  const messages = useMemo(
    () => [...getMessages(email), ...(sent ?? [])],
    [email.threadId, sent],
  ) // eslint-disable-line react-hooks/exhaustive-deps
  const extras = useMemo(
    () => getExtras(email, messages),
    [email.threadId, messages],
  ) // eslint-disable-line react-hooks/exhaustive-deps
  const composer = useInlineComposer(email, messages)

  const [trusted, setTrusted] = useState<Set<string>>(new Set())
  const [recallFor, setRecallFor] = useState<Message | null>(null)
  const [followUp, setFollowUp] = useState(false)
  const [translate, setTranslate] = useState<TranslateState>("idle")
  const [showOriginal, setShowOriginal] = useState(false)
  const [target, setTarget] = useState("Tiếng Việt")

  // Confidential mode state (SO-12)
  const confidential = email.confidential
  const isExpired = confidential?.expiresAt
    ? confidential.expiresAt <= Date.now()
    : false
  const [unlocked, setUnlocked] = useState(!confidential?.accessCode)

  const handleUnlock = (code: string) => {
    if (code === confidential?.accessCode) {
      setUnlocked(true)
      snackbar.show({ message: "Xác thực thành công" })
      return true
    }
    return false
  }

  // Mở thư thì tự đánh dấu đã đọc.
  const wasUnread = useRef(email.unread)
  useEffect(() => {
    if (wasUnread.current) patchEmails([email.id], () => ({ unread: false }))
  }, [email.id])

  const hasEnglish = messages.some((m) => m.language === "en")
  const showTranslateBanner =
    hasEnglish && (!neverTranslate || translate !== "idle")

  const startTranslate = () => {
    setTranslate("running")
    window.setTimeout(() => {
      const fail = translateFails || target !== "Tiếng Việt"
      setTranslate(fail ? "failed" : "done")
      setShowOriginal(false)
    }, 1400)
  }

  const translateFromMenu = () => {
    if (!hasEnglish)
      return snackbar.show({
        message: "Thư này đã bằng Tiếng Việt, không cần dịch",
      })
    startTranslate()
  }

  const neverEnglish = () => {
    setNeverTranslateEnglish(true)
    snackbar.show({
      message: "Sẽ không đề nghị dịch thư tiếng Anh nữa",
      actionLabel: "Hoàn tác",
      onAction: () => setNeverTranslateEnglish(false),
    })
  }

  const ctx: MessageCtx = {
    email,
    trusted,
    onTrust: (id) => {
      setTrusted((s) => new Set(s).add(id))
      snackbar.show({ message: "Đã đánh dấu tin tưởng người gửi" })
    },
    onReport: () => {
      actions.spam([email.id])
      nav.goNextOrList()
    },
    translated: translate === "done" && !showOriginal,
    onReply: (mode, message) => {
      if (confidential?.restricted && mode === "forward") {
        snackbar.show({ message: "Thư bảo mật không cho phép chuyển tiếp" })
        return
      }
      composer.open(mode, message)
    },
    onRecall: setRecallFor,
  }

  const canViewContent = !isExpired && (unlocked || !confidential?.accessCode)

  return (
    <div
      className={`mx-auto max-w-[960px] ${
        confidential?.restricted ? "select-none" : ""
      }`}
    >
      <ThreadToolbar
        email={email}
        folder={folder}
        messages={messages}
        onTranslate={translateFromMenu}
        onFollowUp={() => setFollowUp(true)}
      />
      <div className="px-4 pb-10">
        <ThreadTitle email={email} onEditDue={() => setFollowUp(true)} />

        {/* Dải thông báo và nhập mã thư bảo mật (SO-12) */}
        {confidential && (
          <ConfidentialThreadBanner
            info={confidential}
            unlocked={unlocked}
            onUnlock={handleUnlock}
          />
        )}

        {canViewContent ? (
          <>
            <div className="mb-4 space-y-3 empty:hidden">
              {messages.length >= 5 && (
                <SummaryBox
                  bullets={extras.summary}
                  messageCount={messages.length}
                />
              )}
              {showTranslateBanner && (
                <TranslateBanner
                  state={translate}
                  showOriginal={showOriginal}
                  target={target}
                  onTarget={setTarget}
                  onTranslate={startTranslate}
                  onNever={neverEnglish}
                  onToggleOriginal={() => setShowOriginal((v) => !v)}
                />
              )}
            </div>
            <MessageList messages={messages} email={email} ctx={ctx} />
            <ReplyArea
              composer={composer}
              smartReplies={extras.smartReplies}
              restricted={confidential?.restricted}
            />
          </>
        ) : null}
      </div>
      {recallFor && (
        <RecallDialog message={recallFor} onClose={() => setRecallFor(null)} />
      )}
      {followUp && (
        <FollowUpDialog
          current={email.todoDue}
          onClose={() => setFollowUp(false)}
          onPick={(ts) => {
            setFollowUp(false)
            actions.setFollowUp([email.id], ts)
          }}
        />
      )}
    </div>
  )
}
