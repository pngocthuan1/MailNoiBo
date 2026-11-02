import { useEffect, useRef } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import type { FolderId } from '@/mock-data'
import { useCompose } from '@/features/compose/ComposeProvider'
import { selectEmails } from '@/shared/state/mailSelectors'
import { useListNavStore, setListNav } from '@/shared/state/listNavStore'
import { getThread, useMailStore } from '@/shared/state/mailStore'
import { openEmail } from './openEmail'
import { ShortcutsDialog } from './ShortcutsDialog'
import { useMailActions } from './useMailActions'

const textTypes = ['text', 'search', 'email', 'password', 'url', 'tel', 'number', 'date', 'datetime-local', 'time']

/** Không kích hoạt phím tắt khi đang gõ trong ô nhập hoặc trình soạn thảo. */
function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el) return false
  if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true
  return el.tagName === 'INPUT' && textTypes.includes((el as HTMLInputElement).type)
}

/** Phím tắt (CD-07) cho danh sách thư và trang đọc thư. */
export function MailShortcuts() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const compose = useCompose()
  const actions = useMailActions()
  const helpOpen = useListNavStore((s) => s.helpOpen)

  // Luôn dùng bản mới nhất mà không phải đăng ký lại sự kiện.
  const latest = useRef({ pathname, search, navigate, compose, actions })
  useEffect(() => {
    latest.current = { pathname, search, navigate, compose, actions }
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return
      const { pathname, search, navigate, compose, actions } = latest.current

      const threadMatch = matchPath('/mail/:folder/:threadId', pathname)
      const inThread = !!threadMatch && !['label', 'shared'].includes(threadMatch.params.folder!)
      const inList =
        !inThread &&
        (!!matchPath('/mail/:folder', pathname) ||
          !!matchPath('/mail/label/:labelId', pathname) ||
          !!matchPath('/mail/shared/:mailboxId', pathname))
      if (!inThread && !inList) return
      if (isTyping(e.target) || document.querySelector('[role="dialog"]')) return

      const { emails } = useMailStore.getState()
      const nav = useListNavStore.getState()
      const key = e.key

      // --- Phím dùng chung ---
      if (key === '?') return void setListNav({ helpOpen: true })
      if (key === '/') {
        const input = document.getElementById('header-search-input')
        if (input) {
          e.preventDefault()
          input.focus()
        }
        return
      }
      if (key === 'c') {
        const params = new URLSearchParams(search)
        params.set('compose', 'new')
        return void navigate({ pathname, search: `?${params}` })
      }

      // --- Trang đọc thư ---
      if (inThread) {
        const folder = threadMatch!.params.folder as FolderId
        const threadId = threadMatch!.params.threadId!
        const thread = getThread(threadId)
        if (!thread) return
        let siblings = selectEmails(emails, { kind: 'folder', id: folder })
        if (folder === 'inbox') siblings = siblings.filter((m) => m.category === thread.category)
        const idx = siblings.findIndex((m) => m.threadId === threadId)
        const next = idx >= 0 ? (siblings[idx + 1] ?? siblings[idx - 1]) : undefined
        const goNextOrList = () => navigate(next ? `/mail/${folder}/${next.threadId}` : `/mail/${folder}`)

        if (key === 'j' && siblings[idx + 1]) navigate(`/mail/${folder}/${siblings[idx + 1].threadId}`)
        else if (key === 'k' && idx > 0) navigate(`/mail/${folder}/${siblings[idx - 1].threadId}`)
        else if (key === 'u') navigate(`/mail/${folder}`)
        else if (key === 'r' || key === 'a' || key === 'f') {
          const mode = key === 'r' ? 'reply' : key === 'a' ? 'replyall' : 'forward'
          navigate({ pathname, search: `?reply=${threadId}&mode=${mode}` })
        } else if (key === 's') actions.toggleStar([thread.id], !thread.starred)
        else if (key === 'e') {
          actions.archive([thread.id])
          goNextOrList()
        } else if (key === '#') {
          actions.remove([thread.id])
          goNextOrList()
        }
        return
      }

      // --- Danh sách thư ---
      const { visibleIds, focusedId, selectedIds } = nav
      const idx = focusedId ? visibleIds.indexOf(focusedId) : -1
      const targets = selectedIds.length ? selectedIds : focusedId ? [focusedId] : []
      const focusAfter = () => {
        if (selectedIds.length || idx < 0) return
        setListNav({ focusedId: visibleIds[idx + 1] ?? visibleIds[idx - 1] ?? null })
      }

      if (key === 'j') setListNav({ focusedId: visibleIds[Math.min(idx + 1, visibleIds.length - 1)] ?? null })
      else if (key === 'k') setListNav({ focusedId: visibleIds[Math.max(idx - 1, 0)] ?? null })
      else if (key === 'Enter' && e.target === document.body && focusedId) {
        const email = emails.find((m) => m.id === focusedId)
        if (email) openEmail(email, navigate, compose)
      } else if (key === 's' && targets.length) {
        const rows = emails.filter((m) => targets.includes(m.id))
        actions.toggleStar(targets, !rows.every((m) => m.starred))
      } else if (key === 'e' && targets.length) {
        actions.archive(targets)
        focusAfter()
      } else if (key === '#' && targets.length && !nav.bin) {
        actions.remove(targets)
        focusAfter()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return helpOpen ? <ShortcutsDialog onClose={() => setListNav({ helpOpen: false })} /> : null
}
