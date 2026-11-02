import { useState } from "react"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { Dialog } from "@/shared/ui/Dialog"
import {
  addTemplate,
  deleteTemplate,
  updateTemplate,
  useTemplateStore,
  type MailTemplate,
} from "./templateStore"

type Props = {
  onClose: () => void
  onInsert?: (subject: string, bodyHtml: string) => void
}

const listTime = (ts: number) =>
  new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

/** Hộp thoại quản lý mẫu thư (SO-10) */
export function TemplateDialog({ onClose, onInsert }: Props) {
  const { templates } = useTemplateStore()
  const [editing, setEditing] = useState<MailTemplate | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState({ name: "", subject: "", bodyHtml: "" })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const openNew = () => {
    setIsNew(true)
    setEditing(null)
    setForm({ name: "", subject: "", bodyHtml: "" })
    setShowPreview(false)
  }

  const openEdit = (tpl: MailTemplate) => {
    setIsNew(false)
    setEditing(tpl)
    setForm({ name: tpl.name, subject: tpl.subject, bodyHtml: tpl.bodyHtml })
    setShowPreview(false)
  }

  const save = () => {
    if (!form.name.trim()) return
    if (isNew) {
      addTemplate({
        name: form.name.trim(),
        subject: form.subject,
        bodyHtml: form.bodyHtml,
      })
    } else if (editing) {
      updateTemplate(editing.id, {
        name: form.name.trim(),
        subject: form.subject,
        bodyHtml: form.bodyHtml,
      })
    }
    setEditing(null)
    setIsNew(false)
  }

  const confirmDelete = (id: string) => {
    deleteTemplate(id)
    setDeleteId(null)
  }

  const showingForm = isNew || editing !== null

  return (
    <Dialog title="Quản lý mẫu thư" onClose={onClose} width={640}>
      {!showingForm ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted">{templates.length} mẫu thư</p>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full bg-accent px-3 text-sm font-medium text-on-accent hover:bg-accent/90"
            >
              Thêm mẫu
            </button>
          </div>

          {templates.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">
              Chưa có mẫu thư nào. Hãy tạo mẫu đầu tiên!
            </p>
          ) : (
            <div className="space-y-2">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-lg border border-line bg-surface p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{tpl.name}</p>
                      <p className="text-xs text-muted">
                        Tạo ngày {listTime(tpl.createdAt)}
                      </p>
                      {tpl.subject && (
                        <p className="mt-1 text-xs text-muted">
                          Tiêu đề: {tpl.subject}
                        </p>
                      )}
                    </div>
                    <div className="ml-2 flex shrink-0 gap-1">
                      {onInsert && (
                        <button
                          type="button"
                          onClick={() => {
                            onInsert(tpl.subject, tpl.bodyHtml)
                            onClose()
                          }}
                          className="h-7 cursor-pointer rounded px-2 text-xs text-accent hover:bg-accent-soft"
                        >
                          Chèn
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Sửa"
                        onClick={() => openEdit(tpl)}
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted hover:bg-hover"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa"
                        onClick={() => setDeleteId(tpl.id)}
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted hover:bg-hover hover:text-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deleteId && (
            <div className="mt-3 rounded-lg border border-danger bg-danger-soft p-3">
              <p className="mb-2 text-sm">Bạn có chắc muốn xóa mẫu thư này?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => confirmDelete(deleteId)}
                  className="h-8 cursor-pointer rounded-full bg-danger px-4 text-sm font-medium text-white"
                >
                  Xóa
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="h-8 cursor-pointer rounded-full border border-line px-4 text-sm hover:bg-hover"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-9 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-on-accent hover:bg-accent/90"
            >
              Đóng
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="mb-4 font-medium">
            {isNew ? "Tạo mẫu mới" : "Sửa mẫu"}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Tên mẫu
              </label>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Xin nghỉ phép"
                className="h-9 w-full rounded border border-line bg-surface px-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Tiêu đề mẫu
              </label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Tiêu đề mẫu thư"
                className="h-9 w-full rounded border border-line bg-surface px-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-muted">
                  Nội dung (HTML)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="text-xs text-accent hover:underline"
                >
                  {showPreview ? "Xem HTML" : "Xem trước"}
                </button>
              </div>
              {showPreview ? (
                <div
                  className="min-h-[120px] rounded border border-line bg-bg p-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: form.bodyHtml }}
                />
              ) : (
                <textarea
                  rows={8}
                  value={form.bodyHtml}
                  onChange={(e) =>
                    setForm({ ...form, bodyHtml: e.target.value })
                  }
                  placeholder="Nhập nội dung HTML của mẫu thư..."
                  className="w-full rounded border border-line bg-surface p-3 text-sm outline-none focus:border-accent font-mono"
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!form.name.trim()}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent hover:bg-accent/90 disabled:opacity-50"
            >
              <Check size={14} /> Lưu mẫu
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setIsNew(false)
              }}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line px-5 text-sm hover:bg-hover"
            >
              <X size={14} /> Hủy
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
