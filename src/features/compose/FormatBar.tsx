import { useState, type ReactNode } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  IndentIncrease,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
} from "lucide-react"
import { Popover } from "@/shared/ui/Popover"
import type { RichEditorController } from "./useRichEditor"

const colors = [
  "#1f2430",
  "#d93025",
  "#e8833a",
  "#d9a400",
  "#188038",
  "#1a73e8",
  "#8b5fd6",
  "#5f6877",
]
const sizes = [
  { label: "Nhỏ", value: "2" },
  { label: "Bình thường", value: "3" },
  { label: "Lớn", value: "5" },
  { label: "Rất lớn", value: "6" },
]

/** Giữ vùng chọn trong trình soạn khi bấm nút định dạng. */
const keepFocus = (e: React.MouseEvent) => e.preventDefault()

function Tool({
  label,
  on,
  onClick,
  children,
}: {
  label: string
  on?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={on}
      onMouseDown={keepFocus}
      onClick={onClick}
      className={`inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-fg hover:bg-hover ${
        on ? "bg-accent-soft text-accent" : ""
      }`}
    >
      {children}
    </button>
  )
}

/** Thanh định dạng mở bằng nút “A” (SO-05). */
export function FormatBar({ editor }: { editor: RichEditorController }) {
  const { exec, active } = editor
  const [url, setUrl] = useState("")

  const applyLink = (close: () => void) => {
    const href = /^(https?:|mailto:)/i.test(url.trim())
      ? url.trim()
      : `https://${url.trim()}`
    if (!url.trim()) return
    if (editor.hasSelection()) exec("createLink", href)
    else
      exec(
        "insertHTML",
        `<a href="${href.replace(/"/g, "&quot;")}">${url.trim().replace(/</g, "&lt;")}</a>`,
      )
    setUrl("")
    close()
  }

  return (
    <div
      role="toolbar"
      aria-label="Định dạng"
      className="flex flex-wrap items-center gap-0.5 border-t border-line px-2 py-1"
    >
      <Tool label="Hoàn tác" onClick={() => exec("undo")}>
        <Undo2 size={16} />
      </Tool>
      <Tool label="Làm lại" onClick={() => exec("redo")}>
        <Redo2 size={16} />
      </Tool>
      <select
        aria-label="Cỡ chữ"
        defaultValue="3"
        onChange={(e) => exec("fontSize", e.target.value)}
        className="mx-1 h-8 cursor-pointer rounded border border-line bg-surface px-1 text-xs"
      >
        {sizes.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Tool label="In đậm" on={active.bold} onClick={() => exec("bold")}>
        <Bold size={16} />
      </Tool>
      <Tool
        label="In nghiêng"
        on={active.italic}
        onClick={() => exec("italic")}
      >
        <Italic size={16} />
      </Tool>
      <Tool
        label="Gạch chân"
        on={active.underline}
        onClick={() => exec("underline")}
      >
        <Underline size={16} />
      </Tool>
      <Popover
        align="left"
        up
        className="p-2"
        trigger={({ toggle }) => (
          <button
            type="button"
            title="Màu chữ"
            aria-label="Màu chữ"
            onMouseDown={keepFocus}
            onClick={toggle}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-hover"
          >
            <Baseline size={16} />
          </button>
        )}
      >
        {(close) => (
          <div className="grid grid-cols-4 gap-1">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Màu ${c}`}
                onMouseDown={keepFocus}
                onClick={() => {
                  exec("foreColor", c)
                  close()
                }}
                className="h-6 w-6 cursor-pointer rounded-full border border-line"
                style={{ background: c }}
              />
            ))}
          </div>
        )}
      </Popover>
      <Tool label="Căn trái" onClick={() => exec("justifyLeft")}>
        <AlignLeft size={16} />
      </Tool>
      <Tool label="Căn giữa" onClick={() => exec("justifyCenter")}>
        <AlignCenter size={16} />
      </Tool>
      <Tool label="Căn phải" onClick={() => exec("justifyRight")}>
        <AlignRight size={16} />
      </Tool>
      <Tool
        label="Danh sách đánh số"
        on={active.ol}
        onClick={() => exec("insertOrderedList")}
      >
        <ListOrdered size={16} />
      </Tool>
      <Tool
        label="Danh sách dấu đầu dòng"
        on={active.ul}
        onClick={() => exec("insertUnorderedList")}
      >
        <List size={16} />
      </Tool>
      <Tool label="Thụt lề" onClick={() => exec("indent")}>
        <IndentIncrease size={16} />
      </Tool>
      <Tool label="Trích dẫn" onClick={() => exec("formatBlock", "blockquote")}>
        <Quote size={16} />
      </Tool>
      <Popover
        align="left"
        up
        className="w-64 p-2"
        trigger={({ toggle }) => (
          <button
            type="button"
            title="Chèn liên kết"
            aria-label="Chèn liên kết"
            onMouseDown={keepFocus}
            onClick={toggle}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-hover"
          >
            <LinkIcon size={16} />
          </button>
        )}
      >
        {(close) => (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              applyLink(close)
            }}
          >
            <input
              autoFocus
              aria-label="Địa chỉ liên kết"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-8 min-w-0 flex-1 rounded border border-line bg-surface px-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="h-8 cursor-pointer rounded-full px-3 text-sm font-medium text-accent hover:bg-accent-soft"
            >
              Chèn
            </button>
          </form>
        )}
      </Popover>
      <Tool
        label="Xóa định dạng"
        onClick={() => {
          exec("removeFormat")
          exec("formatBlock", "div")
        }}
      >
        <RemoveFormatting size={16} />
      </Tool>
    </div>
  )
}
