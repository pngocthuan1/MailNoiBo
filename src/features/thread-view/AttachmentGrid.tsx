import { useState } from 'react'
import { Download } from 'lucide-react'
import type { Attachment } from '@/mock-data'
import { useSnackbar } from '@/shared/ui/Snackbar'
import { AttachmentCard } from './AttachmentCard'
import { FileViewer } from './FileViewer'

/** Lưới tệp đính kèm dưới thân thư kèm nút "Tải tất cả (.zip)". */
export function AttachmentGrid({ files, threadId }: { files: Attachment[]; threadId: string }) {
  const snackbar = useSnackbar()
  const previewables = files.filter((f) => !f.blocked && (f.kind === 'image' || f.kind === 'pdf'))
  const [viewer, setViewer] = useState<number | null>(null)
  const downloadable = files.filter((f) => !f.blocked)

  return (
    <section aria-label="Tệp đính kèm" className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">{files.length} tệp đính kèm</h3>
        <button
          type="button"
          disabled={downloadable.length === 0}
          onClick={() =>
            snackbar.show({ message: `Đang nén ${downloadable.length} tệp thành ${threadId}.zip (bản demo, chưa tạo tệp thật)` })
          }
          className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 font-medium text-accent hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={14} />
          Tải tất cả (.zip) · {files.length} tệp
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((f) => (
          <AttachmentCard
            key={f.id}
            file={f}
            previewable={previewables.includes(f)}
            onPreview={() => setViewer(previewables.indexOf(f))}
          />
        ))}
      </div>
      {viewer !== null && (
        <FileViewer files={previewables} index={viewer} onIndex={setViewer} onClose={() => setViewer(null)} />
      )}
    </section>
  )
}
