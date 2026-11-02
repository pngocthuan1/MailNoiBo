import { useNavigate } from 'react-router-dom'
import type { Email, FolderId } from '@/mock-data'
import { useMailStore } from '@/shared/state/mailStore'
import { getSiblings } from './threadNav'

/** Vị trí của thư trong danh sách và các thao tác chuyển thư (thư kế tiếp / về danh sách). */
export function useThreadNav(email: Email, folder: FolderId) {
  const navigate = useNavigate()
  const emails = useMailStore((s) => s.emails)
  const siblings = getSiblings(emails, folder, email)
  const index = siblings.findIndex((m) => m.id === email.id)
  const prev = index > 0 ? siblings[index - 1] : undefined
  const next = index >= 0 ? siblings[index + 1] : undefined
  // Sau khi lưu trữ / xóa: sang thư kế tiếp, hết thư thì về danh sách.
  const fallback = next ?? prev
  return {
    total: siblings.length,
    position: index + 1,
    prev,
    next,
    open: (m: Email) => navigate(`/mail/${folder}/${m.threadId}`),
    goList: () => navigate(`/mail/${folder}`),
    goNextOrList: () => navigate(fallback ? `/mail/${folder}/${fallback.threadId}` : `/mail/${folder}`),
  }
}
