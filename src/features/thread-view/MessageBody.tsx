import { useCallback, useMemo, useState } from 'react'
import { Ellipsis } from 'lucide-react'
import { useCompose } from '@/features/compose/ComposeProvider'
import { LinkConfirmDialog } from './LinkConfirmDialog'
import { plainText } from './getMessages'
import { SafeHtml } from './SafeHtml'

const LONG_THRESHOLD = 1800

const isInternal = (host: string) => host === 'hoanglong.vn' || host.endsWith('.hoanglong.vn')

type Props = { html: string; quoted?: string }

export function MessageBody({ html, quoted }: Props) {
  const compose = useCompose()
  const [showQuoted, setShowQuoted] = useState(false)
  const [full, setFull] = useState(false)
  const [pending, setPending] = useState<{ href: string; text: string } | null>(null)
  const isLong = useMemo(() => plainText(html).length > LONG_THRESHOLD, [html])

  const onLink = useCallback(
    (href: string, text: string) => {
      let url: URL
      try {
        url = new URL(href)
      } catch {
        return
      }
      if (url.protocol === 'mailto:') return compose.open({ to: [url.pathname] })
      if (isInternal(url.host)) return void window.open(href, '_blank', 'noopener')
      setPending({ href, text })
    },
    [compose],
  )

  const clamp = isLong && !full
  return (
    <div>
      <div className={`relative ${clamp ? 'max-h-80 overflow-hidden' : ''}`}>
        <SafeHtml html={html} onLinkClick={onLink} />
        {clamp && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setFull((v) => !v)}
          className="mt-2 h-8 cursor-pointer rounded-full px-3 font-medium text-accent hover:bg-accent-soft"
        >
          {full ? 'Thu gọn thư' : 'Xem toàn bộ thư'}
        </button>
      )}
      {quoted && (
        <div className="mt-2">
          <button
            type="button"
            aria-label={showQuoted ? 'Ẩn phần trích dẫn' : 'Hiện phần trích dẫn'}
            title="Hiện phần trích dẫn"
            onClick={() => setShowQuoted((v) => !v)}
            className="inline-flex h-5 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-2 text-muted hover:bg-hover"
          >
            <Ellipsis size={14} />
          </button>
          {showQuoted && (
            <div className="mt-2">
              <SafeHtml html={quoted} onLinkClick={onLink} />
            </div>
          )}
        </div>
      )}
      {pending && <LinkConfirmDialog {...pending} onClose={() => setPending(null)} />}
    </div>
  )
}
