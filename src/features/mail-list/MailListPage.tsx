import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { folders, sharedMailboxes, type FolderId } from '@/mock-data'
import { useAllLabels } from '@/shared/state/mailStore'
import { MailList } from './MailList'
import type { Scope } from '@/shared/state/mailSelectors'

/** Trang Danh sách thư cho /mail/:folder, /mail/label/:labelId, /mail/shared/:mailboxId. */
export function MailListPage({ kind }: { kind: Scope['kind'] }) {
  const { folder, labelId, mailboxId } = useParams()
  const labels = useAllLabels()
  const scope = useMemo<Scope | null>(() => {
    if (kind === 'folder') return folders.some((f) => f.id === folder) ? { kind, id: folder as FolderId } : null
    if (kind === 'label') return labelId && labels.some((l) => l.id === labelId) ? { kind, id: labelId } : null
    return sharedMailboxes.some((m) => m.id === mailboxId) ? { kind, id: mailboxId! } : null
  }, [kind, folder, labelId, mailboxId, labels])

  if (!scope) return <Navigate to="/404" replace />
  // key: đổi hộp thư thì làm mới toàn bộ trạng thái chọn, cuộn, tab.
  return <MailList key={`${scope.kind}:${scope.id}`} scope={scope} />
}
