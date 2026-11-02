import { Download, Eye, ShieldAlert } from 'lucide-react'
import type { Attachment } from '@/mock-data'
import { FileTypeIcon } from './FileTypeIcon'
import { downloadAttachment, formatSize, middleTruncate, mockImageUrl } from './fileUtils'

type Props = { file: Attachment; previewable: boolean; onPreview: () => void }

const action =
  'inline-flex h-8 cursor-pointer items-center gap-1 rounded-full bg-surface px-3 text-xs font-medium shadow-pop hover:bg-hover'

/** Thẻ tệp đính kèm (DT-04, BM-02): rê chuột hiện Tải về / Xem trước; tệp bị virus không tải được. */
export function AttachmentCard({ file, previewable, onPreview }: Props) {
  if (file.blocked) {
    return (
      <div className="flex gap-3 rounded-xl border border-danger bg-danger-soft p-3" role="group" aria-label={`${file.name} (đã bị chặn)`}>
        <ShieldAlert size={32} className="shrink-0 text-danger" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="truncate font-medium" title={file.name}>
            {middleTruncate(file.name, 28)}
          </p>
          <p className="text-xs text-muted">{formatSize(file.size)}</p>
          <p className="mt-1 text-xs text-danger">{file.blocked}</p>
          <p className="mt-1 text-xs font-medium text-danger">Không thể tải về</p>
        </div>
      </div>
    )
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-line bg-surface">
      <div className="relative flex h-24 items-center justify-center bg-surface-2">
        {file.kind === 'image' ? (
          <img src={mockImageUrl(file.name)} alt={file.name} className="h-full w-full object-cover" />
        ) : (
          <FileTypeIcon kind={file.kind} size={40} />
        )}
        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/30 group-focus-within:flex group-hover:flex">
          <button type="button" className={action} onClick={() => downloadAttachment(file)}>
            <Download size={14} />
            Tải về
          </button>
          {previewable && (
            <button type="button" className={action} onClick={onPreview}>
              <Eye size={14} />
              Xem trước
            </button>
          )}
        </div>
      </div>
      <div className="px-3 py-2">
        <p className="truncate font-medium" title={file.name}>
          {middleTruncate(file.name, 28)}
        </p>
        <p className="text-xs text-muted">{formatSize(file.size)}</p>
      </div>
    </div>
  )
}
