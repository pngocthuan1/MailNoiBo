import { useCallback, useEffect, useRef, useState } from "react"
import {
  CircleAlert,
  Loader2,
  Paperclip,
  Trash2,
  Type,
  WifiOff,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  expandRecipients,
  removeEmails,
  restoreEmails,
  saveDraft,
  scheduleMail,
  sendMail,
  useMailStore,
  type OutgoingMail,
} from "@/shared/state/mailStore"
import { SafeHtml } from "@/features/thread-view/SafeHtml"
import { Button } from "@/shared/ui/Button"
import { useSnackbar } from "@/shared/ui/Snackbar"
import { AttachmentCards } from "./AttachmentCards"
import { ComposeDialogs, type ComposeDialogType } from "./ComposeDialogs"
import { ComposeMoreMenu } from "./ComposeMoreMenu"
import { ComposeTitleBar } from "./ComposeTitleBar"
import { ConfidentialBanner } from "./ConfidentialBanner"
import { ConfidentialDialog } from "./ConfidentialDialog"
import { EmojiPicker } from "./EmojiPicker"
import { FormatBar } from "./FormatBar"
import { ImageInserter } from "./ImageInserter"
import { makeTableHtml, TableInserter } from "./TableInserter"
import { TemplateDialog } from "./TemplateDialog"
import { TemplateMenu } from "./TemplateMenu"
import { SaveTemplateDialog } from "./SaveTemplateDialog"
import { ScheduleMenu, type ScheduleTime } from "./ScheduleMenu"
import { SignatureDialog } from "./SignatureDialog"
import { RecipientsField } from "./RecipientsField"
import { RichEditor } from "./RichEditor"
import { buildAttachments } from "./composeFiles"
import { setComposeDemo, useComposeDemoStore } from "./composeDemoStore"
import { useCompose, type ComposeDraft } from "./ComposeProvider"
import { useRichEditor } from "./useRichEditor"
import { useSignatureStore } from "./signatureStore"
import { addTemplate } from "./templateStore"
import {
  addPendingSend,
  removePendingSend,
  usePendingSendStore,
} from "./pendingSendStore"
import type { ConfidentialInfo } from "@/mock-data"

const timeNow = () =>
  new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
const bodyText = (html: string) => {
  const el = document.createElement("div")
  el.innerHTML = html
  return el.textContent ?? ""
}
export const localKey = (id: number) => `compose-local-${id}`

function useOnline() {
  const [net, setNet] = useState(() => navigator.onLine)
  useEffect(() => {
    const up = () => setNet(true)
    const down = () => setNet(false)
    window.addEventListener("online", up)
    window.addEventListener("offline", down)
    return () => {
      window.removeEventListener("online", up)
      window.removeEventListener("offline", down)
    }
  }, [])
  const demoOffline = useComposeDemoStore((s) => s.offline)
  return net && !demoOffline
}

export function ComposeWindow({ draft }: { draft: ComposeDraft }) {
  const { update, edit, close, open } = useCompose()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const online = useOnline()

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  )
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [sendState, setSendState] = useState<"idle" | "sending" | "failed">(
    "idle",
  )
  const [dialog, setDialog] = useState<ComposeDialogType | null>(null)
  const [skipped, setSkipped] = useState<string[]>([])
  const [showFormat, setShowFormat] = useState(false)
  const [showQuoted, setShowQuoted] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const dragDepth = useRef(0)
  const fileInput = useRef<HTMLInputElement>(null)

  // Dialog states for advanced features
  const [showSigManager, setShowSigManager] = useState(false)
  const [showTplManager, setShowTplManager] = useState(false)
  const [showSaveTpl, setShowSaveTpl] = useState(false)
  const [showConfidentialDialog, setShowConfidentialDialog] = useState(false)

  const latest = useRef(draft)
  latest.current = draft
  const onlineRef = useRef(online)
  onlineRef.current = online

  const onBody = useCallback(
    (html: string) => edit(latest.current.id, { bodyHtml: html }),
    [edit],
  )
  const editor = useRichEditor(onBody)

  // Khởi tạo chữ ký mặc định nếu chưa gán (SO-09)
  useEffect(() => {
    if (draft.signatureId === undefined) {
      const sigState = useSignatureStore.getState()
      const defId = draft.mode ? sigState.defaultReplyId : sigState.defaultNewId
      if (defId) {
        const sig = sigState.signatures.find((s) => s.id === defId)
        if (sig && !draft.bodyHtml.includes("sig-block")) {
          const sigHtml = `<div class="sig-block" data-sig-id="${sig.id}">${sig.html}</div>`
          const nextHtml = draft.bodyHtml
            ? `${draft.bodyHtml}${sigHtml}`
            : `<p></p>${sigHtml}`
          edit(draft.id, { bodyHtml: nextHtml, signatureId: defId })
          if (editor.ref.current) editor.ref.current.innerHTML = nextHtml
        } else {
          edit(draft.id, { signatureId: defId })
        }
      } else {
        edit(draft.id, { signatureId: null })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Đổi chữ ký (SO-09)
  const applySignature = (sigId: string | null) => {
    const currentHtml = latest.current.bodyHtml
    const parser = new DOMParser()
    const doc = parser.parseFromString(currentHtml, "text/html")
    // Xóa chữ ký cũ nếu có
    const existingSig = doc.querySelector(".sig-block")
    if (existingSig) existingSig.remove()

    if (sigId) {
      const sig = useSignatureStore
        .getState()
        .signatures.find((s) => s.id === sigId)
      if (sig) {
        const sigDiv = doc.createElement("div")
        sigDiv.className = "sig-block"
        sigDiv.setAttribute("data-sig-id", sig.id)
        sigDiv.innerHTML = sig.html
        doc.body.appendChild(sigDiv)
      }
    }

    const nextHtml = doc.body.innerHTML
    edit(draft.id, { bodyHtml: nextHtml, signatureId: sigId })
    if (editor.ref.current) editor.ref.current.innerHTML = nextHtml
  }

  const hasContent = (d: ComposeDraft) =>
    d.to.length + d.cc.length + d.bcc.length > 0 ||
    !!d.subject.trim() ||
    !!bodyText(d.bodyHtml).trim() ||
    d.attachments.length > 0

  const persist = useCallback(() => {
    const d = latest.current
    const id = saveDraft({
      draftId: d.draftId,
      subject: d.subject,
      to: d.to,
      cc: d.cc,
      bcc: d.bcc,
      bodyHtml: d.bodyHtml,
      quotedHtml: d.quotedHtml,
      attachments: d.attachments.filter((a) => a.status === "done"),
      replyThreadId: d.replyThreadId,
      mode: d.mode,
    })
    update(d.id, { draftId: id, dirty: false })
    localStorage.removeItem(localKey(d.id))
    setSavedAt(timeNow())
    setSaveState("saved")
    return id
  }, [update])

  // Tự lưu nháp vài giây sau khi ngừng chỉnh sửa
  useEffect(() => {
    if (!draft.dirty || sendState === "sending") return
    if (!online) {
      localStorage.setItem(
        localKey(draft.id),
        JSON.stringify({ ...latest.current, savedAt: Date.now() }),
      )
      setSaveState("idle")
      return
    }
    setSaveState("saving")
    const t = window.setTimeout(() => {
      if (!hasContent(latest.current)) return setSaveState("idle")
      persist()
    }, 2500)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.rev, online])

  // Mô phỏng tiến độ tải tệp lên
  const uploading = draft.attachments.some((a) => a.status === "uploading")
  useEffect(() => {
    if (!uploading) return
    const t = window.setInterval(() => {
      const d = latest.current
      update(d.id, {
        attachments: d.attachments.map((a) => {
          if (a.status !== "uploading") return a
          const progress = Math.min(a.progress + 14, a.willFail ? 60 : 100)
          if (a.willFail && progress >= 60)
            return {
              ...a,
              progress,
              status: "error",
              error: "Tải lên thất bại. Hãy thử lại.",
            }
          return progress >= 100
            ? { ...a, progress: 100, status: "done" }
            : { ...a, progress }
        }),
      })
    }, 350)
    return () => window.clearInterval(t)
  }, [uploading, update])

  const addFiles = (files: { name: string size: number }[]) => {
    if (!files.length) return
    edit(draft.id, {
      attachments: [...latest.current.attachments, ...buildAttachments(files)],
    })
  }

  const setAtt = (
    fn: (list: ComposeDraft["attachments"]) => ComposeDraft["attachments"],
  ) => edit(draft.id, { attachments: fn(latest.current.attachments) })

  const requestClose = () => {
    if (sendState === "sending") return
    const d = latest.current
    if (d.dirty && hasContent(d)) setDialog("confirm-close")
    else close(d.id)
  }

  const deleteDraft = () => {
    const d = latest.current
    const snapshot = d.draftId
      ? useMailStore.getState().emails.filter((e) => e.id === d.draftId)
      : []
    if (d.draftId) removeEmails([d.draftId])
    localStorage.removeItem(localKey(d.id))
    close(d.id)
    snackbar.show({
      message: "Đã xóa nháp",
      actionLabel: snapshot.length ? "Hoàn tác" : undefined,
      onAction: () => restoreEmails(snapshot),
    })
  }

  // --- SO-07: Undo send with hold countdown ---
  const doSendWithHold = (mailPayload: OutgoingMail) => {
    const d = latest.current
    const demo = useComposeDemoStore.getState()
    if (demo.sendFails || !onlineRef.current) {
      if (demo.sendFails) setComposeDemo({ sendFails: false })
      if (onlineRef.current) persist()
      setSendState("failed")
      return
    }

    const holdSeconds = demo.undoSendSeconds || 10
    const pendingId = `pending-${Date.now()}`
    const snapshotDraft = { ...d }

    if (d.draftId) removeEmails([d.draftId])
    localStorage.removeItem(localKey(d.id))
    close(d.id)

    // Save to pending store (for tab close handling)
    addPendingSend({
      id: pendingId,
      mail: mailPayload,
      draftId: d.draftId,
      countdown: holdSeconds,
      totalSeconds: holdSeconds,
      startedAt: Date.now(),
    })

    let secondsLeft = holdSeconds
    let timer: number | null = null

    const finalizeSend = () => {
      if (timer) clearInterval(timer)
      removePendingSend(pendingId)
      const res = sendMail(mailPayload)
      snackbar.show({
        message: "Đã gửi",
        actionLabel: "Xem thư",
        onAction: () => navigate(`/mail/${res.folder}/${res.threadId}`),
      })
    }

    const handleUndo = () => {
      if (timer) clearInterval(timer)
      removePendingSend(pendingId)
      open({
        draftId: snapshotDraft.draftId,
        to: snapshotDraft.to,
        cc: snapshotDraft.cc,
        bcc: snapshotDraft.bcc,
        subject: snapshotDraft.subject,
        bodyHtml: snapshotDraft.bodyHtml,
        quotedHtml: snapshotDraft.quotedHtml,
        attachments: snapshotDraft.attachments,
        replyThreadId: snapshotDraft.replyThreadId,
        mode: snapshotDraft.mode,
        dirty: true,
        signatureId: snapshotDraft.signatureId,
        confidential: snapshotDraft.confidential,
      })
      snackbar.show({ message: "Đã hủy gửi" })
    }

    // Show initial hold snackbar
    snackbar.show({
      message: `Đang gửi... (${secondsLeft}s)`,
      actionLabel: "Hoàn tác",
      onAction: handleUndo,
      secondaryLabel: "Xem thư",
      onSecondary: () => {
        // Finalize send immediately and navigate
        if (timer) clearInterval(timer)
        removePendingSend(pendingId)
        const res = sendMail(mailPayload)
        navigate(`/mail/${res.folder}/${res.threadId}`)
      },
    })

    timer = window.setInterval(() => {
      secondsLeft--
      if (secondsLeft <= 0) {
        finalizeSend()
      } else {
        snackbar.show({
          message: `Đang gửi... (${secondsLeft}s)`,
          actionLabel: "Hoàn tác",
          onAction: handleUndo,
          secondaryLabel: "Xem thư",
          onSecondary: () => {
            if (timer) clearInterval(timer)
            removePendingSend(pendingId)
            const res = sendMail(mailPayload)
            navigate(`/mail/${res.folder}/${res.threadId}`)
          },
        })
      }
    }, 1000)
  }

  // --- SO-08: Schedule send ---
  const handleScheduleSend = (st: ScheduleTime) => {
    const d = latest.current
    const mailPayload: OutgoingMail = {
      to: d.to,
      cc: d.cc,
      bcc: d.bcc,
      subject: d.subject,
      bodyHtml: d.bodyHtml,
      quotedHtml: d.quotedHtml,
      attachments: d.attachments,
      replyThreadId: d.replyThreadId,
      confidential: d.confidential,
    }
    const res = scheduleMail({ ...mailPayload, scheduledAt: st.ts })
    if (d.draftId) removeEmails([d.draftId])
    localStorage.removeItem(localKey(d.id))
    close(d.id)
    snackbar.show({
      message: `Đã lên lịch gửi lúc ${st.label}`,
      actionLabel: "Hoàn tác",
      onAction: () => {
        res.undo()
        open({
          draftId: d.draftId,
          to: d.to,
          cc: d.cc,
          bcc: d.bcc,
          subject: d.subject,
          bodyHtml: d.bodyHtml,
          quotedHtml: d.quotedHtml,
          attachments: d.attachments,
          replyThreadId: d.replyThreadId,
          mode: d.mode,
          dirty: true,
          signatureId: d.signatureId,
          confidential: d.confidential,
        })
      },
    })
  }

  const trySend = (skip: string[] = skipped) => {
    const d = latest.current
    const all = [...d.to, ...d.cc, ...d.bcc]
    if (all.some((r) => r.kind === "person" && !r.valid))
      return setDialog("invalid")
    if (expandRecipients(all).length === 0) return setDialog("no-recipient")
    if (d.attachments.some((a) => a.status === "uploading"))
      return setDialog("uploading")
    if (d.attachments.some((a) => a.status === "error"))
      return setDialog("upload-error")
    if (!d.subject.trim() && !skip.includes("subject"))
      return setDialog("no-subject")
    if (
      /đính kèm|attached|attachment/i.test(bodyText(d.bodyHtml)) &&
      d.attachments.length === 0 &&
      !skip.includes("attach")
    )
      return setDialog("forgot-attachment")

    doSendWithHold({
      to: d.to,
      cc: d.cc,
      bcc: d.bcc,
      subject: d.subject,
      bodyHtml: d.bodyHtml,
      quotedHtml: d.quotedHtml,
      attachments: d.attachments,
      replyThreadId: d.replyThreadId,
      confidential: d.confidential,
    })
  }

  const sendAnyway = () => {
    const next = [...skipped, dialog === "no-subject" ? "subject" : "attach"]
    setSkipped(next)
    setDialog(null)
    trySend(next)
  }

  // --- SO-10: Templates insertion ---
  const insertTemplate = (subject: string, bodyHtml: string) => {
    const d = latest.current
    if (!d.subject.trim() && subject) {
      edit(d.id, { subject })
    }
    editor.insertHtml(bodyHtml)
  }

  const handleSaveAsTemplate = () => {
    setShowSaveTpl(true)
  }

  const doSaveTemplate = (name: string) => {
    const d = latest.current
    addTemplate({
      name,
      subject: d.subject,
      bodyHtml: d.bodyHtml,
    })
    setShowSaveTpl(false)
    snackbar.show({ message: `Đã lưu mẫu "${name}"` })
  }

  // --- SO-11: Image, Emoji, Table insertion ---
  const handleInsertImage = (dataUrl: string) => {
    editor.insertHtml(
      `<img src="${dataUrl}" alt="Hình ảnh" style="max-width:100%;height:auto;display:inline-block;margin:6px 0;" />`,
    )
  }

  const handleInsertEmoji = (emoji: string) => {
    editor.insertHtml(emoji)
  }

  const handleInsertTable = (rows: number, cols: number) => {
    editor.insertHtml(makeTableHtml(rows, cols))
  }

  // --- SO-12: Confidential mode ---
  const handleSaveConfidential = (info: ConfidentialInfo) => {
    edit(draft.id, { confidential: info })
    setShowConfidentialDialog(false)
    snackbar.show({ message: "Đã bật chế độ bảo mật" })
  }

  const handleRemoveConfidential = () => {
    edit(draft.id, { confidential: null })
    setShowConfidentialDialog(false)
    snackbar.show({ message: "Đã gỡ chế độ bảo mật" })
  }

  const status = !online
    ? "Mất kết nối. Nháp được giữ trên máy."
    : saveState === "saving"
      ? "Đang lưu"
      : savedAt
        ? `Đã lưu nháp lúc ${savedAt}`
        : ""

  const size = draft.minimized
    ? "w-60"
    : draft.fullscreen
      ? "fixed top-1/2 left-1/2 z-50 h-[80vh] w-[80%] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 !rounded-lg"
      : `w-[540px] max-w-[calc(100vw-32px)] ${
          draft.maximized
            ? "h-[min(780px,calc(100vh-48px))]"
            : "h-[min(560px,calc(100vh-48px))]"
        }`

  const invalidList = [...draft.to, ...draft.cc, ...draft.bcc].flatMap((r) =>
    r.kind === "person" && !r.valid ? [r.email] : [],
  )

  return (
    <section
      aria-label={draft.subject.trim() || "Thư mới"}
      className={`pointer-events-auto relative flex min-h-0 flex-col rounded-t-lg border border-line bg-surface shadow-pop ${size}`}
      onDragEnter={(e) => {
        if (draft.minimized || !e.dataTransfer.types.includes("Files")) return
        e.preventDefault()
        dragDepth.current++
        setDragOver(true)
      }}
      onDragOver={(e) =>
        e.dataTransfer.types.includes("Files") && e.preventDefault()
      }
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (!dragDepth.current) setDragOver(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        dragDepth.current = 0
        setDragOver(false)
        addFiles(Array.from(e.dataTransfer.files))
      }}
    >
      <ComposeTitleBar
        draft={draft}
        onToggleMinimize={() =>
          update(draft.id, { minimized: !draft.minimized, fullscreen: false })
        }
        onToggleMaximize={() =>
          update(draft.id, {
            minimized: false,
            fullscreen: false,
            maximized: draft.minimized ? draft.maximized : !draft.maximized,
          })
        }
        onToggleFullscreen={() =>
          update(draft.id, { minimized: false, fullscreen: !draft.fullscreen })
        }
        onClose={requestClose}
      />

      {!draft.minimized && (
        <>
          {!online && (
            <div
              role="alert"
              className="flex items-center gap-2 bg-warning-soft px-3 py-2 text-xs text-warning"
            >
              <WifiOff size={14} /> Bạn đang ngoại tuyến. Thư vẫn được giữ trên
              máy và sẽ lưu lại khi có mạng.
            </div>
          )}
          {sendState === "failed" && (
            <div
              role="alert"
              className="flex items-center gap-2 bg-danger-soft px-3 py-2 text-xs text-danger"
            >
              <CircleAlert size={14} />
              <span className="flex-1">
                Không gửi được thư. Thư được giữ lại trong Nháp.
              </span>
              <button
                type="button"
                onClick={() => trySend()}
                className="cursor-pointer font-semibold underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Dải thông báo thư bảo mật (SO-12) */}
          {draft.confidential && (
            <ConfidentialBanner
              info={draft.confidential}
              onEdit={() => setShowConfidentialDialog(true)}
              onRemove={handleRemoveConfidential}
            />
          )}

          <div className="text-sm">
            <RecipientsField
              label="Đến"
              value={draft.to}
              autoFocus={draft.to.length === 0}
              onChange={(to) => edit(draft.id, { to })}
              trailing={
                <>
                  {!draft.showCc && (
                    <button
                      type="button"
                      onClick={() => update(draft.id, { showCc: true })}
                      className="h-6 cursor-pointer rounded px-1.5 text-xs font-medium text-muted hover:bg-hover"
                    >
                      CC
                    </button>
                  )}
                  {!draft.showBcc && (
                    <button
                      type="button"
                      onClick={() => update(draft.id, { showBcc: true })}
                      className="h-6 cursor-pointer rounded px-1.5 text-xs font-medium text-muted hover:bg-hover"
                    >
                      BCC
                    </button>
                  )}
                </>
              }
            />
            {draft.showCc && (
              <RecipientsField
                label="CC"
                value={draft.cc}
                onChange={(cc) => edit(draft.id, { cc })}
              />
            )}
            {draft.showBcc && (
              <RecipientsField
                label="BCC"
                value={draft.bcc}
                onChange={(bcc) => edit(draft.id, { bcc })}
              />
            )}
            <input
              aria-label="Tiêu đề"
              placeholder="Tiêu đề"
              value={draft.subject}
              onChange={(e) => edit(draft.id, { subject: e.target.value })}
              className="h-10 w-full border-b border-line bg-transparent px-3 outline-none"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto text-sm">
            <RichEditor
              controller={editor}
              initialHtml={draft.bodyHtml}
              onChange={onBody}
            />
            {draft.quotedHtml && (
              <div className="px-3 pb-3">
                <button
                  type="button"
                  aria-label="Hiện hoặc ẩn nội dung được trích dẫn"
                  aria-expanded={showQuoted}
                  onClick={() => setShowQuoted((v) => !v)}
                  className="h-4 cursor-pointer rounded bg-surface-2 px-2 text-xs leading-none tracking-widest text-muted hover:bg-hover"
                >
                  ...
                </button>
                {showQuoted && (
                  <div className="mt-2 border-l-2 border-line pl-3">
                    <SafeHtml html={draft.quotedHtml} onLinkClick={() => {}} />
                  </div>
                )}
              </div>
            )}
            <AttachmentCards
              items={draft.attachments}
              onRemove={(id) => setAtt((l) => l.filter((a) => a.id !== id))}
              onRetry={(id) =>
                setAtt((l) =>
                  l.map((a) =>
                    a.id === id
                      ? {
                          ...a,
                          status: "uploading",
                          progress: 0,
                          error: undefined,
                          willFail: false,
                        }
                      : a,
                  ),
                )
              }
            />
          </div>

          {showFormat && <FormatBar editor={editor} />}

          <div className="flex items-center gap-1 border-t border-line px-3 py-2">
            {/* Split button Gửi / Hẹn giờ gửi (SO-08) */}
            <div className="inline-flex rounded-full shadow-sm">
              <Button
                onClick={() => trySend()}
                disabled={sendState === "sending"}
                className="h-9 min-w-20 rounded-r-none px-4"
                aria-label="Gửi"
              >
                {sendState === "sending" ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                ) : null}
                {sendState === "sending" ? "Đang gửi" : "Gửi"}
              </Button>
              <ScheduleMenu onSchedule={handleScheduleSend} />
            </div>

            {/* Nút A định dạng */}
            <button
              type="button"
              title="Định dạng"
              aria-label="Định dạng"
              aria-pressed={showFormat}
              onClick={() => setShowFormat((v) => !v)}
              className={`ml-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-hover ${
                showFormat ? "bg-accent-soft text-accent" : ""
              }`}
            >
              <Type size={17} />
            </button>

            {/* Đính kèm tệp */}
            <button
              type="button"
              title="Đính kèm tệp"
              aria-label="Đính kèm tệp"
              onClick={() => fileInput.current?.click()}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
            >
              <Paperclip size={17} />
            </button>
            <input
              ref={fileInput}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                addFiles(Array.from(e.target.files ?? []))
                e.target.value = ""
              }}
            />

            {/* SO-11: Chèn ảnh inline */}
            <ImageInserter onInsert={handleInsertImage} />

            {/* SO-11: Chèn emoji */}
            <EmojiPicker onInsert={handleInsertEmoji} />

            {/* SO-11: Chèn bảng */}
            <TableInserter onInsert={handleInsertTable} />

            {/* SO-10: Mẫu thư */}
            <TemplateMenu
              currentSubject={draft.subject}
              onInsertTemplate={insertTemplate}
              onOpenManager={() => setShowTplManager(true)}
              onSaveAsTemplate={handleSaveAsTemplate}
            />

            {/* SO-09 & SO-12: Menu ba chấm (Chữ ký & Chế độ bảo mật) */}
            <ComposeMoreMenu
              activeSigId={draft.signatureId}
              onSelectSignature={applySignature}
              onOpenSignatureManager={() => setShowSigManager(true)}
              onOpenConfidential={() => setShowConfidentialDialog(true)}
            />

            <span
              className="ml-2 min-w-0 flex-1 truncate text-xs text-muted"
              aria-live="polite"
            >
              {status}
            </span>

            <button
              type="button"
              title="Xóa nháp"
              aria-label="Xóa nháp"
              onClick={() => setDialog("confirm-delete")}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover"
            >
              <Trash2 size={17} />
            </button>
          </div>

          {dragOver && (
            <div className="pointer-events-none absolute inset-0 top-9 z-20 flex items-center justify-center rounded-b-lg border-2 border-dashed border-accent bg-accent-soft/90 text-base font-medium text-accent">
              Thả tệp để đính kèm
            </div>
          )}
        </>
      )}

      {dialog && (
        <ComposeDialogs
          type={dialog}
          invalidList={invalidList}
          onDismiss={() => setDialog(null)}
          onSendAnyway={sendAnyway}
          onSaveClose={() => {
            if (hasContent(latest.current) && onlineRef.current) persist()
            close(draft.id)
          }}
          onDiscard={() => {
            localStorage.removeItem(localKey(draft.id))
            close(draft.id)
          }}
          onDelete={() => {
            setDialog(null)
            deleteDraft()
          }}
        />
      )}

      {/* SO-09: Quản lý chữ ký */}
      {showSigManager && (
        <SignatureDialog onClose={() => setShowSigManager(false)} />
      )}

      {/* SO-10: Quản lý mẫu thư */}
      {showTplManager && (
        <TemplateDialog
          onClose={() => setShowTplManager(false)}
          onInsert={insertTemplate}
        />
      )}

      {/* SO-10: Lưu thành mẫu thư */}
      {showSaveTpl && (
        <SaveTemplateDialog
          onSave={doSaveTemplate}
          onClose={() => setShowSaveTpl(false)}
        />
      )}

      {/* SO-12: Hộp thoại chế độ bảo mật */}
      {showConfidentialDialog && (
        <ConfidentialDialog
          current={draft.confidential}
          onSave={handleSaveConfidential}
          onRemove={handleRemoveConfidential}
          onClose={() => setShowConfidentialDialog(false)}
        />
      )}
    </section>
  )
}
