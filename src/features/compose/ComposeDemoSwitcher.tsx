import { FlaskConical } from 'lucide-react'
import { Popover } from '@/shared/ui/Popover'
import { buildAttachments } from './composeFiles'
import { setComposeDemo, useComposeDemoStore } from './composeDemoStore'
import { useCompose } from './ComposeProvider'

/** Bộ chuyển trạng thái demo dành riêng cho trình soạn thư (chỉ hiện khi có cửa sổ soạn). */
export function ComposeDemoSwitcher() {
  const demo = useComposeDemoStore()
  const { windows, edit } = useCompose()
  const target = [...windows].reverse().find((w) => !w.minimized)

  const addSample = (name: string, size: number) =>
    target && edit(target.id, { attachments: [...target.attachments, ...buildAttachments([{ name, size }])] })

  const rows: { key: 'sendFails' | 'offline' | 'uploadError'; label: string }[] = [
    { key: 'sendFails', label: 'Gửi thư thất bại (lần kế tiếp)' },
    { key: 'offline', label: 'Ngoại tuyến' },
    { key: 'uploadError', label: 'Lỗi tải tệp (tệp kế tiếp)' },
  ]

  return (
    <div className="pointer-events-auto fixed bottom-3 left-3 z-[45]">
      <Popover
        align="left"
        up
        className="w-72 p-3"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-3 text-xs font-medium text-muted shadow-pop hover:bg-hover"
          >
            <FlaskConical size={14} /> Demo state
          </button>
        )}
      >
        {() => (
          <div className="space-y-2 text-sm">
            {rows.map((r) => (
              <label key={r.key} className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={demo[r.key]} onChange={(e) => setComposeDemo({ [r.key]: e.target.checked })} />
                {r.label}
              </label>
            ))}
            <div className="flex flex-wrap gap-2 border-t border-line pt-2">
              <button type="button" disabled={!target} onClick={() => addSample('bao-cao-quy-3.pdf', 2_400_000)} className="h-7 cursor-pointer rounded-full border border-line px-3 text-xs hover:bg-hover disabled:opacity-50">
                Thêm tệp mẫu
              </button>
              <button type="button" disabled={!target} onClick={() => addSample('video-demo.mp4', 31 * 1024 * 1024)} className="h-7 cursor-pointer rounded-full border border-line px-3 text-xs hover:bg-hover disabled:opacity-50">
                Thêm tệp 31 MB
              </button>
            </div>
          </div>
        )}
      </Popover>
    </div>
  )
}
