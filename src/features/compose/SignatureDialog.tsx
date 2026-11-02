import { useState } from "react"
import { Plus, Pencil, Trash2, Check } from "lucide-react"
import { Dialog } from "@/shared/ui/Dialog"
import {
  addSignature,
  deleteSignature,
  setSignatureDefaults,
  updateSignature,
  useSignatureStore,
  type Signature,
} from "./signatureStore"

type Props = { onClose: () => void }

/** Hộp thoại quản lý chữ ký (SO-09) */
export function SignatureDialog({ onClose }: Props) {
  const { signatures, defaultNewId, defaultReplyId } = useSignatureStore()
  const [editing, setEditing] = useState<Signature | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState({ name: "", html: "" })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const openNew = () => {
    setIsNew(true)
    setEditing(null)
    setForm({ name: "", html: "" })
  }

  const openEdit = (sig: Signature) => {
    setIsNew(false)
    setEditing(sig)
    setForm({ name: sig.name, html: sig.html })
  }

  const save = () => {
    if (!form.name.trim()) return
    if (isNew) {
      addSignature({ name: form.name.trim(), html: form.html })
    } else if (editing) {
      updateSignature(editing.id, { name: form.name.trim(), html: form.html })
    }
    setEditing(null)
    setIsNew(false)
  }

  const confirmDelete = (id: string) => {
    deleteSignature(id)
    setDeleteId(null)
  }

  const showingForm = isNew || editing !== null

  return (
    <Dialog title="Quản lý chữ ký" onClose={onClose} width={640}>
      {!showingForm ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted">
              Quản lý các chữ ký email của bạn
            </p>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full bg-accent px-3 text-sm font-medium text-on-accent hover:bg-accent/90"
            >
              <Plus size={14} /> Thêm chữ ký
            </button>
          </div>

          {/* Cài đặt mặc định */}
          <div className="mb-4 rounded-lg border border-line bg-surface-2 p-3">
            <p className="mb-2 text-xs font-semibold text-muted">
              Chữ ký mặc định
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 text-sm">
                <span className="w-32 text-muted">Thư mới:</span>
                <select
                  value={defaultNewId ?? ""}
                  onChange={(e) =>
                    setSignatureDefaults(e.target.value || null, defaultReplyId)
                  }
                  className="h-8 flex-1 cursor-pointer rounded border border-line bg-surface px-2 text-sm outline-none"
                >
                  <option value="">Không dùng chữ ký</option>
                  {signatures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <span className="w-32 text-muted">Trả lời/CK:</span>
                <select
                  value={defaultReplyId ?? ""}
                  onChange={(e) =>
                    setSignatureDefaults(defaultNewId, e.target.value || null)
                  }
                  className="h-8 flex-1 cursor-pointer rounded border border-line bg-surface px-2 text-sm outline-none"
                >
                  <option value="">Không dùng chữ ký</option>
                  {signatures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Danh sách chữ ký */}
          {signatures.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Chưa có chữ ký nào. Hãy thêm chữ ký đầu tiên.
            </p>
          ) : (
            <div className="space-y-2">
              {signatures.map((sig) => (
                <div
                  key={sig.id}
                  className="rounded-lg border border-line bg-surface p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sig.name}</span>
                      {sig.id === defaultNewId && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
                          Thư mới
                        </span>
                      )}
                      {sig.id === defaultReplyId && (
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
                          Trả lời
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setPreview(preview === sig.id ? null : sig.id)
                        }
                        className="h-7 cursor-pointer rounded px-2 text-xs text-muted hover:bg-hover"
                      >
                        {preview === sig.id ? "Ẩn" : "Xem trước"}
                      </button>
                      <button
                        type="button"
                        aria-label="Sửa"
                        onClick={() => openEdit(sig)}
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted hover:bg-hover"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa"
                        onClick={() => setDeleteId(sig.id)}
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted hover:bg-hover hover:text-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {preview === sig.id && (
                    <div
                      className="rounded border border-line bg-bg p-3 text-sm"
                      dangerouslySetInnerHTML={{ __html: sig.html }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Xác nhận xóa */}
          {deleteId && (
            <div className="mt-3 rounded-lg border border-danger bg-danger-soft p-3">
              <p className="mb-2 text-sm">Bạn có chắc muốn xóa chữ ký này?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => confirmDelete(deleteId)}
                  className="h-8 cursor-pointer rounded-full bg-danger px-4 text-sm font-medium text-white hover:bg-danger/90"
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
        /* Form tạo/sửa chữ ký */
        <div>
          <h3 className="mb-4 font-medium">
            {isNew ? "Thêm chữ ký mới" : "Sửa chữ ký"}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Tên chữ ký
              </label>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Chữ ký chính"
                className="h-9 w-full rounded border border-line bg-surface px-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Nội dung (HTML)
              </label>
              <textarea
                rows={6}
                value={form.html}
                onChange={(e) => setForm({ ...form, html: e.target.value })}
                placeholder="Nhập HTML của chữ ký..."
                className="w-full rounded border border-line bg-surface p-3 text-sm outline-none focus:border-accent font-mono"
              />
            </div>
            {form.html && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted">Xem trước</p>
                <div
                  className="rounded border border-line bg-bg p-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: form.html }}
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!form.name.trim()}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent hover:bg-accent/90 disabled:opacity-50"
            >
              <Check size={14} /> Lưu
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setIsNew(false)
              }}
              className="h-9 cursor-pointer rounded-full border border-line px-5 text-sm hover:bg-hover"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
