import { useEffect, useRef, useState } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Trash2,
  Plus,
  Minus,
} from "lucide-react"
import type { RichEditorController } from "./useRichEditor"

type Props = {
  controller: RichEditorController
  initialHtml: string
  onChange: (html: string) => void
}

/**
 * Vùng soạn nội dung nhiều định dạng (SO-01, SO-05, SO-11):
 * - Hỗ trợ chèn ảnh, kéo thả ảnh vào editor, click chọn ảnh để resize và căn lề.
 * - Hỗ trợ bảng: click vào ô bảng hiện floating toolbar để thêm/xóa hàng/cột/xóa bảng.
 */
export function RichEditor({ controller, initialHtml, onChange }: Props) {
  const { ref } = controller
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null)
  const [imgAlign, setImgAlign] = useState<"left" | "center" | "right">("left")
  const [activeTable, setActiveTable] = useState<{
    table: HTMLTableElement
    cell: HTMLTableCellElement
  } | null>(null)
  const isResizing = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialHtml
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Theo dõi click vào ảnh hoặc bảng bên trong contentEditable
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG") {
        setSelectedImg(target as HTMLImageElement)
        setActiveTable(null)
      } else {
        setSelectedImg(null)
        const cell = target.closest("td, th") as HTMLTableCellElement | null
        const table = target.closest("table") as HTMLTableElement | null
        if (cell && table) {
          setActiveTable({ table, cell })
        } else {
          setActiveTable(null)
        }
      }
    }

    el.addEventListener("click", handleClick)
    return () => el.removeEventListener("click", handleClick)
  }, [ref])

  // Xử lý kéo thả ảnh trực tiếp vào editor
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer.files)
    const imgFile = files.find((f) => f.type.startsWith("image/"))
    if (imgFile) {
      e.preventDefault()
      e.stopPropagation()
      const reader = new FileReader()
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target?.result as string
        if (dataUrl) {
          controller.insertHtml(
            `<img src="${dataUrl}" alt="Hình ảnh" style="max-width:100%;height:auto;display:inline-block;margin:6px 0;" />`,
          )
        }
      }
      reader.readAsDataURL(imgFile)
    }
  }

  // Xử lý resize ảnh
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!selectedImg) return
    e.preventDefault()
    e.stopPropagation()
    isResizing.current = true
    startX.current = e.clientX
    startWidth.current = selectedImg.offsetWidth

    const onMouseMove = (moveEvt: MouseEvent) => {
      if (!isResizing.current || !selectedImg) return
      const diff = moveEvt.clientX - startX.current
      const newWidth = Math.max(60, Math.min(800, startWidth.current + diff))
      selectedImg.style.width = `${newWidth}px`
      selectedImg.style.height = "auto"
    }

    const onMouseUp = () => {
      isResizing.current = false
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      if (ref.current) onChange(ref.current.innerHTML)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const setAlign = (align: "left" | "center" | "right") => {
    if (!selectedImg) return
    setImgAlign(align)
    if (align === "left") {
      selectedImg.style.display = "block"
      selectedImg.style.margin = "6px auto 6px 0"
    } else if (align === "center") {
      selectedImg.style.display = "block"
      selectedImg.style.margin = "6px auto"
    } else {
      selectedImg.style.display = "block"
      selectedImg.style.margin = "6px 0 6px auto"
    }
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const removeImg = () => {
    if (!selectedImg) return
    selectedImg.remove()
    setSelectedImg(null)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  // Thao tác bảng (SO-11)
  const addRow = () => {
    if (!activeTable) return
    const { table, cell } = activeTable
    const row = cell.parentElement as HTMLTableRowElement
    const colCount = row.cells.length
    const newRow = table.insertRow(row.rowIndex + 1)
    for (let i = 0; i < colCount; i++) {
      const newCell = newRow.insertCell(i)
      newCell.style.border = "1px solid #ccc"
      newCell.style.padding = "6px 12px"
      newCell.innerHTML = "&nbsp;"
    }
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const deleteRow = () => {
    if (!activeTable) return
    const { table, cell } = activeTable
    const row = cell.parentElement as HTMLTableRowElement
    if (table.rows.length > 1) {
      table.deleteRow(row.rowIndex)
      setActiveTable(null)
    } else {
      table.remove()
      setActiveTable(null)
    }
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const addCol = () => {
    if (!activeTable) return
    const { table, cell } = activeTable
    const colIdx = cell.cellIndex
    for (let i = 0; i < table.rows.length; i++) {
      const r = table.rows[i]
      const isHeader = r.parentElement?.tagName === "THEAD" || i === 0
      const newCell = isHeader
        ? document.createElement("th")
        : document.createElement("td")
      newCell.style.border = "1px solid #ccc"
      newCell.style.padding = "6px 12px"
      if (isHeader) {
        newCell.style.background = "#f5f5f5"
        newCell.style.fontWeight = "600"
        newCell.textContent = "Cột mới"
      } else {
        newCell.innerHTML = "&nbsp;"
      }
      r.insertBefore(newCell, r.cells[colIdx + 1] || null)
    }
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const deleteCol = () => {
    if (!activeTable) return
    const { table, cell } = activeTable
    const colIdx = cell.cellIndex
    const totalCols = table.rows[0]?.cells.length ?? 0
    if (totalCols <= 1) {
      table.remove()
      setActiveTable(null)
    } else {
      for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells.length > colIdx) {
          table.rows[i].deleteCell(colIdx)
        }
      }
      setActiveTable(null)
    }
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const deleteTable = () => {
    if (!activeTable) return
    activeTable.table.remove()
    setActiveTable(null)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  return (
    <div className="relative">
      {/* Floating Toolbar cho Ảnh đã chọn */}
      {selectedImg && (
        <div
          className="absolute z-30 flex items-center gap-1 rounded-md border border-line bg-surface p-1 shadow-md text-xs"
          style={{
            top: `${Math.max(4, selectedImg.offsetTop - 36)}px`,
            left: `${selectedImg.offsetLeft}px`,
          }}
        >
          <button
            type="button"
            title="Căn trái"
            onClick={() => setAlign("left")}
            className={`p-1 rounded hover:bg-hover ${
              imgAlign === "left" ? "text-accent font-bold" : ""
            }`}
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            title="Căn giữa"
            onClick={() => setAlign("center")}
            className={`p-1 rounded hover:bg-hover ${
              imgAlign === "center" ? "text-accent font-bold" : ""
            }`}
          >
            <AlignCenter size={14} />
          </button>
          <button
            type="button"
            title="Căn phải"
            onClick={() => setAlign("right")}
            className={`p-1 rounded hover:bg-hover ${
              imgAlign === "right" ? "text-accent font-bold" : ""
            }`}
          >
            <AlignRight size={14} />
          </button>
          <span className="h-4 w-px bg-line mx-0.5" />
          <button
            type="button"
            title="Xóa ảnh"
            onClick={removeImg}
            className="p-1 rounded text-danger hover:bg-danger-soft"
          >
            <Trash2 size={14} />
          </button>
          <span className="h-4 w-px bg-line mx-0.5" />
          <span
            onMouseDown={handleResizeStart}
            title="Kéo để đổi kích thước"
            className="cursor-ew-resize px-1 py-0.5 rounded bg-surface-2 font-mono text-[10px] select-none hover:bg-hover"
          >
            Kéo đổi cỡ
          </span>
        </div>
      )}

      {/* Floating Toolbar cho Bảng đã chọn */}
      {activeTable && (
        <div
          className="absolute z-30 flex items-center gap-1 rounded-md border border-line bg-surface p-1 shadow-md text-xs"
          style={{
            top: `${Math.max(4, activeTable.table.offsetTop - 36)}px`,
            left: `${activeTable.table.offsetLeft}px`,
          }}
        >
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-hover"
            title="Thêm hàng dưới"
          >
            <Plus size={12} /> Hàng
          </button>
          <button
            type="button"
            onClick={deleteRow}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-hover text-danger"
            title="Xóa hàng hiện tại"
          >
            <Minus size={12} /> Hàng
          </button>
          <span className="h-4 w-px bg-line mx-0.5" />
          <button
            type="button"
            onClick={addCol}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-hover"
            title="Thêm cột bên phải"
          >
            <Plus size={12} /> Cột
          </button>
          <button
            type="button"
            onClick={deleteCol}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-hover text-danger"
            title="Xóa cột hiện tại"
          >
            <Minus size={12} /> Cột
          </button>
          <span className="h-4 w-px bg-line mx-0.5" />
          <button
            type="button"
            onClick={deleteTable}
            className="p-1 rounded text-danger hover:bg-danger-soft"
            title="Xóa bảng"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Nội dung thư"
        data-placeholder="Soạn nội dung thư"
        className="compose-editor min-h-[240px] p-3 outline-none"
        onDrop={handleDrop}
        onInput={(e) => {
          const el = e.currentTarget
          if (
            !el.textContent &&
            !el.querySelector("img,ul,ol,blockquote,table")
          )
            el.innerHTML = ""
          onChange(el.innerHTML)
        }}
        onPaste={(e) => {
          // If pasting an image from clipboard
          const items = Array.from(e.clipboardData.items)
          const imgItem = items.find((it) => it.type.startsWith("image/"))
          if (imgItem) {
            e.preventDefault()
            const file = imgItem.getAsFile()
            if (file) {
              const reader = new FileReader()
              reader.onload = (loadEvt) => {
                const dataUrl = loadEvt.target?.result as string
                if (dataUrl) {
                  controller.insertHtml(
                    `<img src="${dataUrl}" alt="Hình ảnh" style="max-width:100%;height:auto;display:inline-block;margin:6px 0;" />`,
                  )
                }
              }
              reader.readAsDataURL(file)
            }
            return
          }
          // Otherwise plain text paste
          e.preventDefault()
          document.execCommand(
            "insertText",
            false,
            e.clipboardData.getData("text/plain"),
          )
        }}
      />
    </div>
  )
}
