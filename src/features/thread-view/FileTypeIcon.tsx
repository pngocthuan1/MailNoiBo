import { File, FileArchive, FileImage, FileSpreadsheet, FileText } from 'lucide-react'
import type { Attachment } from '@/mock-data'

const map = {
  image: { icon: FileImage, color: 'var(--label-6)' },
  pdf: { icon: FileText, color: 'var(--label-1)' },
  doc: { icon: FileText, color: 'var(--label-6)' },
  sheet: { icon: FileSpreadsheet, color: 'var(--label-4)' },
  zip: { icon: FileArchive, color: 'var(--label-3)' },
  other: { icon: File, color: 'var(--muted)' },
}

export function FileTypeIcon({ kind, size = 32 }: { kind: Attachment['kind']; size?: number }) {
  const { icon: Icon, color } = map[kind]
  return <Icon size={size} style={{ color }} strokeWidth={1.5} />
}
