import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleAlert, Loader2, Paperclip, Trash2, Type, WifiOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { expandRecipients, removeEmails, restoreEmails, saveDraft, sendMail, useMailStore } from '@/shared/state/mailStore'
import { SafeHtml } from '@/features/thread-view/SafeHtml'
import { Button } from '@/shared/ui/Button'
import { useSnackbar } from '@/shared/ui/Snackbar'
import { AttachmentCards } from './AttachmentCards'
import { ComposeDialogs, type ComposeDialogType } from './ComposeDialogs'
import { ComposeTitleBar } from './ComposeTitleBar'
import { FormatBar } from './FormatBar'
import { RecipientsField } from './RecipientsField'
import { RichEditor } from './RichEditor'
import { buildAttachments } from './composeFiles'
import { setComposeDemo, useComposeDemoStore } from './composeDemoStore'
import { useCompose, type ComposeDraft } from './ComposeProvider'
import { useRichEditor } from './useRichEditor'

const timeNow = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
const bodyText = (html: string) => {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent ?? ''
}
export const localKey = (id: number) => `compose-local-${id}`

function useOnline() {
  const [net, setNet] = useState(() => navigator.onLine)
  useEffect(() => {
    const up = () => setNet(true)
    const down = () => setNet(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])
  const demoOffline = useComposeDemoStore((s) => s.offline)
  return net && !demoOffline
}

export function ComposeWindow({ draft }: { draft: ComposeDraft }) {
  const { update, edit, close } = useCompose()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const online = useOnline()

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'failed'>('idle')
  const [dialog, setDialog] = useState<ComposeDialogType | null>(null)
  const [skipped, setSkipped] = useState<string[]>([])
  const [showFormat, setShowFormat] = useState(false)
  const [showQuoted, setShowQuoted] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const dragDepth = useRef(0)
  const fileInput = useRef<HTMLInputElement>(null)

  const latest = useRef(draft)
  latest.current = draft
  const onlineRef = useRef(online)
  onlineRef.current = online

  const onBody = useCallback((html: string) => edit(latest.current.id, { bodyHtml: html }), [edit])
  const editor = useRichEditor(onBody)

  const hasContent = (d: ComposeDraft) =>
    d.to.length + d.cc.length + d.bcc.length > 0 || !!d.subject.trim() || !!bodyText(d.bodyHtml).trim() || d.attachments.length > 0

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
      attachments: d.attachments.filter((a) => a.status === 'done'),
      replyThreadId: d.replyThreadId,
      mode: d.mode,
    })
    update(d.id, { draftId: id, dirty: false })
    localStorage.removeItem(localKey(d.id))
    setSavedAt(timeNow())
    setSaveState('saved')
    return id
  }, [update])

  // Tự lưu nháp vài giây sau khi ngừng chỉnh sửa; khi mất mạng thì giữ bản nháp trên máy.
  useEffect(() => {
    if (!draft.dirty || sendState === 'sending') return
    if (!online) {
      localStorage.setItem(localKey(draft.id), JSON.stringify({ ...latest.current, savedAt: Date.now() }))
      setSaveState('idle')
      return
    }
    setSaveState('saving')
    const t = window.setTimeout(() => {
      if (!hasContent(latest.current)) return setSaveState('idle')
      persist()
    }, 2500)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.rev, online])

  // Mô phỏng tiến độ tải tệp lên.
  const uploading = draft.attachments.some((a) => a.status === 'uploading')
  useEffect(() => {
    if (!uploading) return
    const t = window.setInterval(() => {
      const d = latest.current
      update(d.id, {
        attachments: d.attachments.map((a) => {
          if (a.status !== 'uploading') return a
          const progress = Math.min(a.progress + 14, a.willFail ? 60 : 100)
          if (a.willFail && progress >= 60) return { ...a, progress, status: 'error', error: 'Tải lên thất bại. Hãy thử lại.' }
          return progress >= 100 ? { ...a, progress: 100, status: 'done' } : { ...a, progress }
        }),
      })
    }, 350)
    return () => window.clearInterval(t)
  }, [uploading, update])

  const addFiles = (files: { name: string; size: number }[]) => {
    if (!files.length) return
    edit(draft.id, { attachments: [...latest.current.attachments, ...buildAttachments(files)] })
  }

  const setAtt = (fn: (list: ComposeDraft['attachments']) => ComposeDraft['attachments']) =>
    edit(draft.id, { attachments: fn(latest.current.attachments) })

  const requestClose = () => {
    if (sendState === 'sending') return
    const d = latest.current
    if (d.dirty && hasContent(d)) setDialog('confirm-close')
    else close(d.id)
  }

  const deleteDraft = () => {
    const d = latest.current
    const snapshot = d.draftId ? useMailStore.getState().emails.filter((e) => e.id === d.draftId) : []
    if (d.draftId) removeEmails([d.draftId])
    localStorage.removeItem(localKey(d.id))
    close(d.id)
    snackbar.show({ message: 'Đã xóa nháp', actionLabel: snapshot.length ? 'Hoàn tác' : undefined, onAction: () => restoreEmails(snapshot) })
  }

  const doSend = () => {
    setDialog(null)
    setSendState('sending')
    window.setTimeout(() => {
      const d = latest.current
      const demo = useComposeDemoStore.getState()
      if (demo.sendFails || !onlineRef.current) {
        if (demo.sendFails) setComposeDemo({ sendFails: false })
        if (onlineRef.current) persist()
        setSendState('failed')
        return
      }
      const res = sendMail({
        to: d.to,
        cc: d.cc,
        bcc: d.bcc,
        subject: d.subject,
        bodyHtml: d.bodyHtml,
        quotedHtml: d.quotedHtml,
        attachments: d.attachments,
        replyThreadId: d.replyThreadId,
      })
      if (d.draftId) removeEmails([d.draftId])
      localStorage.removeItem(localKey(d.id))
      close(d.id)
      snackbar.show({
        message: 'Đã gửi',
        actionLabel: 'Xem thư',
        onAction: () => navigate(`/mail/${res.folder}/${res.threadId}`),
        secondaryLabel: 'Hoàn tác',
        onSecondary: res.undo,
      })
    }, 1200)
  }

  const trySend = (skip: string[] = skipped) => {
    const d = latest.current
    const all = [...d.to, ...d.cc, ...d.bcc]
    if (all.some((r) => r.kind === 'person' && !r.valid)) return setDialog('invalid')
    if (expandRecipients(all).length === 0) return setDialog('no-recipient')
    if (d.attachments.some((a) => a.status === 'uploading')) return setDialog('uploading')
    if (d.attachments.some((a) => a.status === 'error')) return setDialog('upload-error')
    if (!d.subject.trim() && !skip.includes('subject')) return setDialog('no-subject')
    if (/đính kèm|attached|attachment/i.test(bodyText(d.bodyHtml)) && d.attachments.length === 0 && !skip.includes('attach'))
      return setDialog('forgot-attachment')
    doSend()
  }

  const sendAnyway = () => {
    const next = [...skipped, dialog === 'no-subject' ? 'subject' : 'attach']
    setSkipped(next)
    setDialog(null)
    trySend(next)
  }

  const status = !online
    ? 'Mất kết nối. Nháp được giữ trên máy.'
    : saveState === 'saving'
      ? 'Đang lưu'
      : savedAt
        ? `Đã lưu nháp lúc ${savedAt}`
        : ''

  const size = draft.minimized
    ? 'w-60'
    : draft.fullscreen
      ? 'fixed top-1/2 left-1/2 z-50 h-[80vh] w-[80%] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 !rounded-lg'
      : `w-[540px] max-w-[calc(100vw-32px)] ${draft.maximized ? 'h-[min(780px,calc(100vh-48px))]' : 'h-[min(560px,calc(100vh-48px))]'}`

  const invalidList = [...draft.to, ...draft.cc, ...draft.bcc].flatMap((r) => (r.kind === 'person' && !r.valid ? [r.email] : []))

  return (
    <section
      aria-label={draft.subject.trim() || 'Thư mới'}
      className={`pointer-events-auto relative flex min-h-0 flex-col rounded-t-lg border border-line bg-surface shadow-pop ${size}`}
      onDragEnter={(e) => {
        if (draft.minimized || !e.dataTransfer.types.includes('Files')) return
        e.preventDefault()
        dragDepth.current++
        setDragOver(true)
      }}
      onDragOver={(e) => e.dataTransfer.types.includes('Files') && e.preventDefault()}
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
        onToggleMinimize={() => update(draft.id, { minimized: !draft.minimized, fullscreen: false })}
        onToggleMaximize={() => update(draft.id, { minimized: false, fullscreen: false, maximized: draft.minimized ? draft.maximized : !draft.maximized })}
        onToggleFullscreen={() => update(draft.id, { minimized: false, fullscreen: !draft.fullscreen })}
        onClose={requestClose}
      />

      {!draft.minimized && (
        <>
          {!online && (
            <div role="alert" className="flex items-center gap-2 bg-warning-soft px-3 py-2 text-xs text-warning">
              <WifiOff size={14} /> Bạn đang ngoại tuyến. Thư vẫn được giữ trên máy và sẽ lưu lại khi có mạng.
            </div>
          )}
          {sendState === 'failed' && (
            <div role="alert" className="flex items-center gap-2 bg-danger-soft px-3 py-2 text-xs text-danger">
              <CircleAlert size={14} />
              <span className="flex-1">Không gửi được thư. Thư được giữ lại trong Nháp.</span>
              <button type="button" onClick={() => trySend()} className="cursor-pointer font-semibold underline">
                Thử lại
              </button>
            </div>
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
                    <button type="button" onClick={() => update(draft.id, { showCc: true })} className="h-6 cursor-pointer rounded px-1.5 text-xs font-medium text-muted hover:bg-hover">
                      CC
                    </button>
                  )}
                  {!draft.showBcc && (
                    <button type="button" onClick={() => update(draft.id, { showBcc: true })} className="h-6 cursor-pointer rounded px-1.5 text-xs font-medium text-muted hover:bg-hover">
                      BCC
                    </button>
                  )}
                </>
              }
            />
            {draft.showCc && <RecipientsField label="CC" value={draft.cc} onChange={(cc) => edit(draft.id, { cc })} />}
            {draft.showBcc && <RecipientsField label="BCC" value={draft.bcc} onChange={(bcc) => edit(draft.id, { bcc })} />}
            <input
              aria-label="Tiêu đề"
              placeholder="Tiêu đề"
              value={draft.subject}
              onChange={(e) => edit(draft.id, { subject: e.target.value })}
              className="h-10 w-full border-b border-line bg-transparent px-3 outline-none"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto text-sm">
            <RichEditor controller={editor} initialHtml={draft.bodyHtml} onChange={onBody} />
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
              onRetry={(id) => setAtt((l) => l.map((a) => (a.id === id ? { ...a, status: 'uploading', progress: 0, error: undefined, willFail: false } : a)))}
            />
          </div>

          {showFormat && <FormatBar editor={editor} />}

          <div className="flex items-center gap-1 border-t border-line px-3 py-2">
            <Button onClick={() => trySend()} disabled={sendState === 'sending'} className="h-9 min-w-20 px-5" aria-label="Gửi">
              {sendState === 'sending' ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
              {sendState === 'sending' ? 'Đang gửi' : 'Gửi'}
            </Button>
            <button
              type="button"
              title="Định dạng"
              aria-label="Định dạng"
              aria-pressed={showFormat}
              onClick={() => setShowFormat((v) => !v)}
              className={`ml-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-hover ${showFormat ? 'bg-accent-soft text-accent' : ''}`}
            >
              <Type size={17} />
            </button>
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
                e.target.value = ''
              }}
            />
            <span className="ml-2 min-w-0 flex-1 truncate text-xs text-muted" aria-live="polite">
              {status}
            </span>
            <button
              type="button"
              title="Xóa nháp"
              aria-label="Xóa nháp"
              onClick={() => setDialog('confirm-delete')}
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
    </section>
  )
}
