import { useCallback, useEffect, useRef, useState } from "react"

export type FormatState = {
  bold: boolean
  italic: boolean
  underline: boolean
  ol: boolean
  ul: boolean
}
const none: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  ol: false,
  ul: false,
}

/** Điều khiển trình soạn văn bản nhiều định dạng (contentEditable + execCommand). */
export function useRichEditor(onChange: (html: string) => void) {
  const ref = useRef<HTMLDivElement>(null)
  const saved = useRef<Range | null>(null)
  const [active, setActive] = useState<FormatState>(none)

  useEffect(() => {
    const onSelection = () => {
      const sel = window.getSelection()
      const el = ref.current
      if (!sel || !el || sel.rangeCount === 0 || !el.contains(sel.anchorNode))
        return
      saved.current = sel.getRangeAt(0).cloneRange()
      const next: FormatState = {
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        ol: document.queryCommandState("insertOrderedList"),
        ul: document.queryCommandState("insertUnorderedList"),
      }
      setActive((prev) =>
        JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
      )
    }
    document.addEventListener("selectionchange", onSelection)
    return () => document.removeEventListener("selectionchange", onSelection)
  }, [])

  const restore = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.focus()
    const range = saved.current
    if (range) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [])

  const exec = useCallback(
    (command: string, value?: string) => {
      restore()
      document.execCommand("styleWithCSS", false, "false")
      document.execCommand(command, false, value)
      if (ref.current) onChange(ref.current.innerHTML)
    },
    [restore, onChange],
  )

  const insertHtml = useCallback(
    (html: string) => {
      restore()
      document.execCommand("insertHTML", false, html)
      if (ref.current) onChange(ref.current.innerHTML)
    },
    [restore, onChange],
  )

  return {
    ref,
    active,
    exec,
    insertHtml,
    restore,
    hasSelection: () => !!saved.current && !saved.current.collapsed,
  }
}

export type RichEditorController = ReturnType<typeof useRichEditor>
