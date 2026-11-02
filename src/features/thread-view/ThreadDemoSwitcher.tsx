import { useNavigate } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'
import { Popover } from '@/shared/ui/Popover'
import { useMailStore } from '@/shared/state/mailStore'
import { setThreadDemo, useThreadDemoStore, type ThreadDemoView } from './threadDemoStore'

const views: { id: ThreadDemoView; label: string }[] = [
  { id: 'normal', label: 'Bình thường' },
  { id: 'loading', label: 'Đang tải' },
  { id: 'error', label: 'Lỗi' },
]

const samples = [
  { id: 't-saomai-server', label: 'Chuỗi dài (8 thư)' },
  { id: 't-baogia', label: 'Tệp đính kèm: ảnh, PDF, tệp virus' },
  { id: 't-sao-mai-meeting', label: 'Thư tôi gửi, có biên nhận đã đọc' },
  { id: 't-en-renewal', label: 'Thư tiếng Anh' },
  { id: 't-fake-ceo', label: 'Người gửi giả danh lãnh đạo' },
  { id: 't-hopdong', label: 'Thư rất dài (Xem toàn bộ thư)' },
  { id: 't-erp-62', label: 'Chuỗi hơn 50 thư (62 thư)' },
]

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex h-8 cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
      {label}
    </label>
  )
}

/** Bộ chuyển trạng thái demo và chọn nhanh các chuỗi thư mẫu. */
export function ThreadDemoSwitcher({ folder, current }: { folder: string; current: string }) {
  const navigate = useNavigate()
  const demo = useThreadDemoStore()
  const emails = useMailStore((s) => s.emails)
  const open = (id: string) => {
    const e = emails.find((m) => m.threadId === id)
    navigate(`/mail/${e?.folder ?? folder}/${id}`)
  }

  return (
    <div className="no-print flex justify-end px-3 pt-2">
      <Popover
        className="w-80 p-4 text-xs"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border border-dashed border-line bg-bg px-3 text-xs font-medium text-muted hover:text-fg"
          >
            <FlaskConical size={14} />
            Trạng thái demo
          </button>
        )}
      >
        {() => (
          <div className="space-y-4">
            <div>
              <p className="mb-1 font-semibold text-muted">Trạng thái trang</p>
              <div role="radiogroup" className="flex rounded-full bg-surface-2 p-0.5">
                {views.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={demo.view === v.id}
                    onClick={() => setThreadDemo({ view: v.id })}
                    className={`h-7 flex-1 cursor-pointer rounded-full font-medium ${demo.view === v.id ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate(`/mail/${folder}/khong-ton-tai`)}
                className="mt-2 h-8 w-full cursor-pointer rounded-lg border border-line font-medium hover:bg-hover"
              >
                Thư không tồn tại (chuyển tới /404)
              </button>
            </div>
            <div>
              <p className="mb-1 font-semibold text-muted">Chuỗi thư mẫu</p>
              <ul>
                {samples.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => open(s.id)}
                      className={`flex h-8 w-full cursor-pointer items-center rounded px-2 text-left hover:bg-hover ${current === s.id ? 'font-semibold text-accent' : ''}`}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-semibold text-muted">Mô phỏng lỗi</p>
              <Check label="Dịch thư thất bại" checked={demo.translateFails} onChange={(v) => setThreadDemo({ translateFails: v })} />
              <Check label="Lỗi xem trước tệp (lần đầu)" checked={demo.previewFails} onChange={(v) => setThreadDemo({ previewFails: v })} />
              <label className="mt-1 flex items-center gap-2">
                Kết quả thu hồi
                <select
                  value={demo.recallOutcome}
                  onChange={(e) => setThreadDemo({ recallOutcome: e.target.value as typeof demo.recallOutcome })}
                  className="h-8 flex-1 cursor-pointer rounded-lg border border-line bg-surface px-2"
                >
                  <option value="success">Thành công</option>
                  <option value="partial">Một phần</option>
                  <option value="failed">Thất bại</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </Popover>
    </div>
  )
}
