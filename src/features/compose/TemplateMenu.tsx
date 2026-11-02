import { useState } from "react"
import { BookTemplate, Plus, Save } from "lucide-react"
import { Popover } from "@/shared/ui/Popover"
import { useTemplateStore } from "./templateStore"

type Props = {
  currentSubject: string
  onInsertTemplate: (subject: string, bodyHtml: string) => void
  onOpenManager: () => void
  onSaveAsTemplate: () => void
}

/** Menu mẫu thư trong thanh dưới cửa sổ soạn (SO-10) */
export function TemplateMenu({
  currentSubject,
  onInsertTemplate,
  onOpenManager,
  onSaveAsTemplate,
}: Props) {
  const { templates } = useTemplateStore()

  const htmlToText = (html: string) => {
    const el = document.createElement("div")
    el.innerHTML = html
    return (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80)
  }

  return (
    <Popover
      align="left"
      up
      className="w-72 py-1"
      trigger={({ toggle }) => (
        <button
          type="button"
          title="Mẫu thư"
          aria-label="Mẫu thư"
          onClick={toggle}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
        >
          <BookTemplate size={17} />
        </button>
      )}
    >
      {(close) => (
        <div>
          <p className="px-4 py-2 text-xs font-semibold text-muted">Mẫu thư</p>
          {templates.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted italic">
              Chưa có mẫu thư nào
            </p>
          ) : (
            templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  onInsertTemplate(tpl.subject, tpl.bodyHtml)
                  close()
                }}
                className="flex w-full cursor-pointer flex-col px-4 py-2 text-left hover:bg-hover"
              >
                <span className="text-sm font-medium">{tpl.name}</span>
                <span className="text-xs text-muted">
                  {htmlToText(tpl.bodyHtml)}
                </span>
              </button>
            ))
          )}
          <div className="border-t border-line">
            <button
              type="button"
              onClick={() => {
                onSaveAsTemplate()
                close()
              }}
              className="flex h-10 w-full cursor-pointer items-center gap-3 px-4 text-sm hover:bg-hover"
            >
              <Save size={16} className="text-muted" />
              Lưu thư này thành mẫu
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenManager()
                close()
              }}
              className="flex h-10 w-full cursor-pointer items-center gap-3 px-4 text-sm hover:bg-hover"
            >
              <Plus size={16} className="text-muted" />
              Quản lý mẫu
            </button>
          </div>
        </div>
      )}
    </Popover>
  )
}
