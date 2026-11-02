import { useEffect } from 'react'
import type { RichEditorController } from './useRichEditor'

type Props = { controller: RichEditorController; initialHtml: string; onChange: (html: string) => void }

/** Vùng soạn nội dung nhiều định dạng: cao tối thiểu 240px và giãn theo nội dung (SO-01, SO-05). */
export function RichEditor({ controller, initialHtml, onChange }: Props) {
  const { ref } = controller

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialHtml
    // chỉ nạp nội dung ban đầu một lần
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label="Nội dung thư"
      data-placeholder="Soạn nội dung thư"
      className="compose-editor min-h-[240px] p-3 outline-none"
      onInput={(e) => {
        const el = e.currentTarget
        if (!el.textContent && !el.querySelector('img,ul,ol,blockquote')) el.innerHTML = ''
        onChange(el.innerHTML)
      }}
      onPaste={(e) => {
        e.preventDefault()
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
      }}
    />
  )
}
