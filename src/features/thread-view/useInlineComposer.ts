import { useState } from 'react'
import { replyToInit } from '@/features/compose/buildCompose'
import { useCompose } from '@/features/compose/ComposeProvider'
import { recipientFromEmail } from '@/features/compose/recipients'
import type { ComposeRecipient, Email, Message } from '@/mock-data'
import { expandRecipients, sendMail } from '@/shared/state/mailStore'
import { useSnackbar } from '@/shared/ui/Snackbar'
import { me } from './getMessages'
import type { ComposerMode } from './types'

export type InlineComposerState = { mode: ComposerMode; to: ComposeRecipient[]; text: string; error: string }

/** Trạng thái ô soạn nhúng dưới chuỗi thư (DT-03, DT-10). */
export function useInlineComposer(email: Email, messages: Message[]) {
  const compose = useCompose()
  const snackbar = useSnackbar()
  const [state, setState] = useState<InlineComposerState | null>(null)

  const defaultTo = (mode: ComposerMode, from: Message): ComposeRecipient[] => {
    if (mode === 'forward') return []
    const mine = from.from.email === me.email
    const names = new Map([from.from, ...from.to, ...(from.cc ?? [])].map((p) => [p.email, p.name]))
    const emails =
      mode === 'reply'
        ? mine
          ? from.to.map((p) => p.email)
          : [from.from.email]
        : [...new Set([from.from.email, ...from.to.map((p) => p.email), ...(from.cc ?? []).map((p) => p.email)])].filter((e) => e !== me.email)
    return emails.map((e) => recipientFromEmail(e, names.get(e)))
  }

  const open = (mode: ComposerMode, from: Message = messages[messages.length - 1], insert?: string) =>
    setState((prev) => {
      if (prev && !insert) return { ...prev, mode, to: defaultTo(mode, from) }
      const base = prev ?? { mode, to: defaultTo(mode, from), text: '', error: '' }
      return { ...base, text: insert ? (base.text ? `${base.text} ${insert}` : insert) : base.text }
    })

  const subject = (mode: ComposerMode) =>
    mode === 'forward' ? `Fwd: ${email.subject.replace(/^(Fwd|Re):\s*/i, '')}` : `Re: ${email.subject.replace(/^Re:\s*/i, '')}`

  return {
    state,
    open,
    setText: (text: string) => setState((s) => s && { ...s, text }),
    setTo: (to: ComposeRecipient[]) => setState((s) => s && { ...s, to, error: '' }),
    close: () => setState(null),
    /** "Mở cửa sổ lớn": chuyển nội dung đang soạn sang cửa sổ nổi. */
    popOut: () => {
      if (!state) return
      const init = replyToInit(email.threadId, state.mode)
      const html = state.text
        ? `<div>${state.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div>`
        : ''
      compose.open({ ...init, to: state.to, bodyHtml: html, dirty: true })
      setState(null)
    },
    send: () => {
      if (!state) return
      if (state.to.some((r) => r.kind === 'person' && !r.valid)) return setState({ ...state, error: 'Có địa chỉ người nhận không hợp lệ.' })
      if (expandRecipients(state.to).length === 0) return setState({ ...state, error: 'Hãy thêm ít nhất một người nhận' })
      const snapshot = state
      const init = replyToInit(email.threadId, state.mode)
      const bodyHtml = `<div>${state.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div>`
      const res = sendMail({
        to: state.to,
        cc: [],
        bcc: [],
        subject: subject(state.mode),
        bodyHtml,
        quotedHtml: init?.quotedHtml,
        attachments: init?.attachments ?? [],
        replyThreadId: email.threadId,
      })
      setState(null)
      snackbar.show({
        message: 'Đã gửi',
        actionLabel: 'Hoàn tác',
        onAction: () => {
          res.undo()
          setState(snapshot)
        },
      })
    },
  }
}

export type InlineComposer = ReturnType<typeof useInlineComposer>
