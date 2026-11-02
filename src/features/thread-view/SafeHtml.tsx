import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

type Props = { html: string; onLinkClick: (href: string, text: string) => void }

const style = `
:host{display:block}
.b{font:14px/22px Inter,system-ui,sans-serif;color:var(--fg);overflow-wrap:anywhere}
.b p{margin:0 0 12px}
img{max-width:100%;height:auto;border-radius:8px}
a{color:var(--accent);text-decoration:underline;cursor:pointer}
blockquote{margin:8px 0;padding-left:12px;border-left:3px solid var(--line);color:var(--muted)}
table{border-collapse:collapse;max-width:100%;margin:8px 0}
td,th{border:1px solid var(--line);padding:6px 12px;text-align:left}
th{background:var(--surface-2)}
ul,ol{margin:0 0 12px;padding-left:24px}
`

/**
 * Hiển thị HTML của thư trong một khung cách ly (Shadow DOM): nội dung được làm sạch bằng DOMPurify,
 * kiểu dáng không lọt ra ngoài, ảnh tự co theo chiều rộng. Mọi liên kết đều được chặn để kiểm tra trước.
 */
export function SafeHtml({ html, onLinkClick }: Props) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const root = el.shadowRoot ?? el.attachShadow({ mode: 'open' })
    const clean = DOMPurify.sanitize(html, { FORBID_TAGS: ['style', 'form', 'iframe'], FORBID_ATTR: ['style'] })
    root.innerHTML = `<style>${style}</style><div class="b">${clean}</div>`
    const onClick = (e: Event) => {
      const a = e.composedPath().find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement)
      if (!a) return
      e.preventDefault()
      onLinkClick(a.href, a.textContent ?? '')
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [html, onLinkClick])

  return <div ref={host} />
}
