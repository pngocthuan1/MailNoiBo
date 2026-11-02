import { Sparkles } from 'lucide-react'

/** Ba câu trả lời nhanh nằm ngay trên ô trả lời (DT-10). */
export function SmartReplies({ replies, onPick }: { replies: string[]; onPick: (text: string) => void }) {
  return (
    <div className="no-print flex flex-wrap items-center gap-2" aria-label="Gợi ý trả lời nhanh">
      <Sparkles size={14} className="text-accent" />
      {replies.slice(0, 3).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onPick(r)}
          className="inline-flex min-h-8 cursor-pointer items-center rounded-full border border-line bg-surface px-3 py-1 text-left hover:bg-hover"
        >
          {r}
        </button>
      ))}
    </div>
  )
}
