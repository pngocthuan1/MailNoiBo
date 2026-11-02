import { Forward, Reply, ReplyAll } from 'lucide-react'
import { InlineComposer } from './InlineComposer'
import { SmartReplies } from './SmartReplies'
import type { InlineComposer as Composer } from './useInlineComposer'

/** Ô trả lời cuối chuỗi: gợi ý trả lời nhanh, ba nút Trả lời / Trả lời tất cả / Chuyển tiếp và ô soạn nhúng (DT-03, DT-10). */
export function ReplyArea({
  composer,
  smartReplies,
  restricted,
}: {
  composer: Composer
  smartReplies: string[]
  restricted?: boolean
}) {
  const btn =
    'inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-5 font-medium hover:bg-hover'
  return (
    <section aria-label="Trả lời" className="mt-6 space-y-3">
      <SmartReplies replies={smartReplies} onPick={(t) => composer.open(composer.state?.mode ?? 'reply', undefined, t)} />
      {!composer.state && (
        <div className="no-print flex flex-wrap gap-3">
          <button type="button" className={btn} onClick={() => composer.open('reply')}>
            <Reply size={16} /> Trả lời
          </button>
          <button type="button" className={btn} onClick={() => composer.open('replyAll')}>
            <ReplyAll size={16} /> Trả lời tất cả
          </button>
          <button
            type="button"
            className={`${btn} ${restricted ? 'cursor-not-allowed opacity-50 hover:bg-surface' : ''}`}
            disabled={restricted}
            title={restricted ? 'Chế độ bảo mật chặn chuyển tiếp' : 'Chuyển tiếp'}
            onClick={() => !restricted && composer.open('forward')}
          >
            <Forward size={16} /> Chuyển tiếp
          </button>
        </div>
      )}
      <InlineComposer composer={composer} />
    </section>
  )
}
