import { ChevronsUpDown } from 'lucide-react'

/** Nhiều thư cũ liền nhau gộp thành một dải, bấm để mở hết (DT-02). */
export function HiddenMessagesBar({ count, onExpand }: { count: number; onExpand: () => void }) {
  return (
    <button
      type="button"
      onClick={onExpand}
      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line text-muted hover:bg-hover hover:text-fg"
    >
      <ChevronsUpDown size={16} />
      {count} thư đã ẩn
    </button>
  )
}
