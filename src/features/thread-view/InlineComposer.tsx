import { useEffect, useRef } from "react"
import { Maximize2, X } from "lucide-react"
import { RecipientsField } from "@/features/compose/RecipientsField"
import { Button } from "@/shared/ui/Button"
import type { InlineComposer as Composer } from "./useInlineComposer"

const titles = {
  reply: "Trả lời",
  replyAll: "Trả lời tất cả",
  forward: "Chuyển tiếp",
}

/** Ô soạn nhúng ngay dưới chuỗi: Đến, nội dung, Gửi, Mở cửa sổ lớn (DT-03). */
export function InlineComposer({ composer }: { composer: Composer }) {
  const { state } = composer
  const ref = useRef<HTMLDivElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!state) return
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    area.current?.focus()
    // chỉ khi mở hoặc đổi chế độ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.mode, !!state])

  if (!state) return null
  return (
    <div
      ref={ref}
      className="no-print overflow-hidden rounded-xl border border-line bg-surface shadow-sm"
    >
      <div className="flex h-10 items-center justify-between border-b border-line bg-surface-2 pr-1 pl-4">
        <span className="font-medium">{titles[state.mode]}</span>
        <span className="flex items-center">
          <button
            type="button"
            aria-label="Mở cửa sổ lớn"
            title="Mở cửa sổ lớn"
            onClick={composer.popOut}
            className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 text-xs font-medium hover:bg-hover"
          >
            <Maximize2 size={14} />
            Mở cửa sổ lớn
          </button>
          <button
            type="button"
            aria-label="Hủy thư đang soạn"
            title="Hủy"
            onClick={composer.close}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover"
          >
            <X size={16} />
          </button>
        </span>
      </div>
      {state.error && (
        <p
          role="alert"
          className="bg-danger-soft px-4 py-2 text-xs text-danger"
        >
          {state.error}
        </p>
      )}
      <RecipientsField label="Đến" value={state.to} onChange={composer.setTo} />
      <textarea
        ref={area}
        value={state.text}
        onChange={(e) => composer.setText(e.target.value)}
        rows={6}
        aria-label="Nội dung trả lời"
        placeholder="Nhập nội dung thư"
        className="block w-full resize-y bg-transparent p-4 outline-none"
      />
      <div className="flex h-14 items-center px-4">
        <Button onClick={composer.send}>Gửi</Button>
      </div>
    </div>
  )
}
