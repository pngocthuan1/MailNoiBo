import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { folders, sharedMailboxes, type MailCategory } from '@/mock-data'
import { useCompose } from '@/features/compose/ComposeProvider'
import { Button } from '@/shared/ui/Button'
import { Dialog } from '@/shared/ui/Dialog'
import { useSnackbar } from '@/shared/ui/Snackbar'
import { AnnouncementStrip } from './AnnouncementStrip'
import { BinBanner } from './BinBanner'
import { CategoryTabs } from './CategoryTabs'
import { DemoStateSwitcher, type DemoState } from './DemoStateSwitcher'
import { ListToolbar } from './ListToolbar'
import { MailboxHeader } from './MailboxHeader'
import { AssigneeCell } from './AssigneeCell'
import { MailEmptyState } from './MailEmptyState'
import { openEmail } from './openEmail'
import { setListNav, useListNavStore } from '@/shared/state/listNavStore'
import { MailErrorState } from './MailErrorState'
import { MailListSkeleton } from './MailListSkeleton'
import { MailRow, type Variant } from './MailRow'
import { RowActions } from './RowActions'
import { SelectionToolbar } from './SelectionToolbar'
import { SnoozeDialog } from './SnoozeDialog'
import type { SelectMode } from './SelectAllControl'
import { selectEmails, type Scope } from '@/shared/state/mailSelectors'
import {
  makeIncomingEmail,
  patchEmails,
  prependEmails,
  setDraggedIds,
  useAllLabels,
  useMailState,
} from '@/shared/state/mailStore'
import { useMailActions } from './useMailActions'

const PAGE_SIZE = 20

type SnoozeTarget = { ids: string[]; mode: 'snooze' | 'schedule' }

export function MailList({ scope }: { scope: Scope }) {
  const navigate = useNavigate()
  const compose = useCompose()
  const snackbar = useSnackbar()
  const actions = useMailActions()
  const allLabels = useAllLabels()
  const { emails } = useMailState()

  const variant: Variant = scope.kind === 'folder' ? scope.id : scope.kind
  const isInbox = scope.kind === 'folder' && scope.id === 'inbox'
  const isBin = variant === 'trash' || variant === 'spam'

  const [demo, setDemo] = useState<DemoState>('normal')
  const [booting, setBooting] = useState(true)
  const [tab, setTab] = useState<MailCategory>('primary')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [matchingAll, setMatchingAll] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [snoozeFor, setSnoozeFor] = useState<SnoozeTarget | null>(null)
  const [confirmIds, setConfirmIds] = useState<string[] | null>(null)
  const [dragging, setDragging] = useState<string[]>([])
  const [fresh, setFresh] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<ReturnType<typeof makeIncomingEmail>[]>([])
  const lastClicked = useRef<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 500)
    return () => window.clearTimeout(t)
  }, [])

  const scoped = useMemo(() => selectEmails(emails, scope), [emails, scope])
  const rows = useMemo(() => (isInbox ? scoped.filter((e) => e.category === tab) : scoped), [scoped, isInbox, tab])
  const shown = rows.slice(0, visible)
  const unreadCount = scoped.filter((e) => e.unread).length

  const selectedRows = useMemo(
    () => (matchingAll ? rows : shown.filter((e) => selected.has(e.id))),
    [matchingAll, rows, shown, selected],
  )
  const allLoadedSelected = shown.length > 0 && shown.every((e) => selected.has(e.id))

  const clearSelection = useCallback(() => {
    setSelected(new Set())
    setMatchingAll(false)
  }, [])

  // --- Đồng bộ với bộ phím tắt (CD-07) ---
  const focusedId = useListNavStore((st) => st.focusedId)
  const shownKey = shown.map((e) => e.id).join(',')
  const selectedKey = selectedRows.map((e) => e.id).join(',')
  useEffect(() => {
    setListNav({ visibleIds: shownKey ? shownKey.split(',') : [], bin: isBin })
  }, [shownKey, isBin])
  useEffect(() => {
    setListNav({ selectedIds: selectedKey ? selectedKey.split(',') : [] })
  }, [selectedKey])
  useEffect(() => {
    setListNav({ focusedId: null })
    return () => setListNav({ focusedId: null, visibleIds: [], selectedIds: [], bin: false })
  }, [])
  useEffect(() => {
    if (focusedId) document.getElementById(`row-${focusedId}`)?.scrollIntoView({ block: 'nearest' })
  }, [focusedId])

  // --- Tiêu đề ---
  let title = ''
  let labelColor: number | undefined
  if (scope.kind === 'folder') title = folders.find((f) => f.id === scope.id)!.name
  else if (scope.kind === 'label') {
    const l = allLabels.find((x) => x.id === scope.id)
    title = l?.name ?? ''
    labelColor = l?.color
  } else title = sharedMailboxes.find((m) => m.id === scope.id)?.name ?? ''

  // --- Chọn thư (HT-03) ---
  const toggleSelect = (index: number, shift: boolean) => {
    const email = shown[index]
    setMatchingAll(false)
    setSelected((prev) => {
      const next = new Set(prev)
      if (shift && lastClicked.current !== null) {
        const [a, b] = [lastClicked.current, index].sort((x, y) => x - y)
        for (let i = a; i <= b; i++) next.add(shown[i].id)
      } else if (next.has(email.id)) next.delete(email.id)
      else next.add(email.id)
      return next
    })
    lastClicked.current = index
  }

  const selectMode = (mode: SelectMode) => {
    setMatchingAll(false)
    const pick = (fn: (e: (typeof shown)[number]) => boolean) => setSelected(new Set(shown.filter(fn).map((e) => e.id)))
    if (mode === 'none') setSelected(new Set())
    else if (mode === 'all') pick(() => true)
    else if (mode === 'read') pick((e) => !e.unread)
    else if (mode === 'unread') pick((e) => e.unread)
    else pick((e) => e.starred)
  }

  // --- Mở thư ---
  const open = (index: number) => {
    setListNav({ focusedId: shown[index].id })
    openEmail(shown[index], navigate, compose)
  }

  // --- Kéo thả vào nhãn ở thanh bên (HT-12) ---
  const dragStart = (index: number, e: DragEvent) => {
    const email = shown[index]
    const ids = selected.has(email.id) ? selectedRows.map((r) => r.id) : [email.id]
    setDraggedIds(ids)
    setDragging(ids)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', ids.join(','))
    const ghost = document.createElement('div')
    ghost.textContent = ids.length === 1 ? '1 thư' : `${ids.length} thư`
    ghost.style.cssText =
      'position:fixed;top:-100px;left:-100px;padding:8px 16px;border-radius:8px;background:#1a73e8;color:#fff;font:600 14px Inter,sans-serif;opacity:.85'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 16, 16)
    window.setTimeout(() => ghost.remove(), 0)
  }
  const dragEnd = () => {
    setDraggedIds([])
    setDragging([])
  }

  // --- Cuộn vô hạn (HT-02) ---
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || demo !== 'normal' || booting || loadingMore || visible >= rows.length) return
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      setLoadingMore(true)
      window.setTimeout(() => {
        setVisible((v) => v + PAGE_SIZE)
        setLoadingMore(false)
      }, 700)
    })
    io.observe(node)
    return () => io.disconnect()
  }, [demo, booting, loadingMore, visible, rows.length])

  // --- Thư mới đến (TB-03) ---
  const reveal = useCallback((list: ReturnType<typeof makeIncomingEmail>[]) => {
    prependEmails(list)
    const ids = list.map((e) => e.id)
    setFresh((f) => new Set([...f, ...ids]))
    window.setTimeout(() => setFresh((f) => new Set([...f].filter((x) => !ids.includes(x)))), 3000)
  }, [])

  const receive = useCallback(() => {
    const email = makeIncomingEmail()
    const scroller = rootRef.current?.closest('main')
    if (isInbox && demo === 'normal' && scroller && scroller.scrollTop > 240) {
      setPending((p) => [email, ...p])
    } else if (isInbox) {
      reveal([email])
    } else {
      prependEmails([email])
      snackbar.show({ message: `Có thư mới từ ${email.from} trong Inbox` })
    }
  }, [isInbox, demo, reveal, snackbar])

  const receiveRef = useRef(receive)
  useEffect(() => {
    receiveRef.current = receive
  }, [receive])
  useEffect(() => {
    if (!isInbox) return
    const t = window.setInterval(() => receiveRef.current(), 45_000)
    return () => window.clearInterval(t)
  }, [isInbox])

  const flushPending = () => {
    reveal(pending)
    setPending([])
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- Làm mới / thử lại ---
  const refresh = () => {
    setRefreshing(true)
    window.setTimeout(() => {
      setRefreshing(false)
      snackbar.show({ message: 'Đã làm mới danh sách thư' })
    }, 700)
  }
  const retry = () => {
    setDemo('loading')
    window.setTimeout(() => setDemo('normal'), 800)
  }

  const markAllRead = () => {
    const ids = scoped.filter((e) => e.unread).map((e) => e.id)
    if (ids.length) actions.markRead(ids, true)
    else snackbar.show({ message: 'Không có thư chưa đọc' })
  }

  const onSnoozePick = (ts: number) => {
    if (!snoozeFor) return
    if (snoozeFor.mode === 'snooze') actions.snooze(snoozeFor.ids, ts)
    else actions.reschedule(snoozeFor.ids, ts)
    setSnoozeFor(null)
    clearSelection()
  }

  const confirmDelete = () => {
    if (!confirmIds) return
    actions.deleteForever(confirmIds)
    setConfirmIds(null)
    clearSelection()
  }

  const view: DemoState = demo === 'normal' && booting ? 'loading' : demo
  const emptyKind = scope.kind === 'folder' ? scope.id : scope.kind

  let body
  if (view === 'loading') body = <MailListSkeleton />
  else if (view === 'error') body = <MailErrorState onRetry={retry} />
  else if (view === 'empty' || rows.length === 0) body = <MailEmptyState kind={emptyKind} />
  else
    body = (
      <div role="table" aria-label="Danh sách thư">
        {variant === 'shared' && (
          <div className="flex items-center justify-end border-b border-line bg-bg px-2 py-1 text-xs font-medium text-muted">
            <span className="w-44 shrink-0">Người xử lý</span>
            <span className="w-24 shrink-0 sm:w-28" />
          </div>
        )}
        {shown.map((email, i) => (
          <MailRow
            key={email.id}
            email={email}
            variant={variant}
            selected={matchingAll || selected.has(email.id)}
            fresh={fresh.has(email.id)}
            focused={focusedId === email.id}
            assigneeCell={variant === 'shared' ? <AssigneeCell email={email} actions={actions} /> : undefined}
            dragging={dragging.includes(email.id)}
            actions={actions}
            hoverActions={
              <RowActions
                email={email}
                variant={variant}
                actions={actions}
                onSnooze={(ids) => setSnoozeFor({ ids, mode: 'snooze' })}
                onReschedule={(ids) => setSnoozeFor({ ids, mode: 'schedule' })}
                onDeleteForever={(ids) => setConfirmIds(ids)}
              />
            }
            onToggleSelect={(shift) => toggleSelect(i, shift)}
            onOpen={() => open(i)}
            onDragStart={(e) => dragStart(i, e)}
            onDragEnd={dragEnd}
          />
        ))}
        <div ref={sentinelRef} className="flex h-14 items-center justify-center text-xs text-muted">
          {loadingMore ? 'Đang tải thêm...' : visible >= rows.length ? 'Đã tải hết' : ''}
        </div>
      </div>
    )

  const showList = view === 'normal' && rows.length > 0
  const hasSelection = showList && selectedRows.length > 0

  return (
    <div ref={rootRef} className="pb-8">
      <MailboxHeader
        title={title}
        labelColor={labelColor}
        unread={view === 'empty' ? 0 : unreadCount}
        right={<DemoStateSwitcher value={demo} onChange={setDemo} onSimulateNewMail={receive} />}
      />
      <AnnouncementStrip />
      {isBin && (
        <BinBanner
          name={variant === 'trash' ? 'Thùng rác' : 'Spam'}
          disabled={rows.length === 0}
          onEmpty={() => setConfirmIds(rows.map((e) => e.id))}
        />
      )}

      <div className="sticky top-0 z-10 bg-surface">
        {hasSelection ? (
          <SelectionToolbar
            selected={selectedRows}
            allCheckedState={allLoadedSelected ? 'all' : 'some'}
            variant={variant}
            actions={actions}
            onSelect={selectMode}
            onSnooze={(ids) => setSnoozeFor({ ids, mode: 'snooze' })}
            onDeleteForever={(ids) => setConfirmIds(ids)}
            onDone={clearSelection}
          />
        ) : (
          <ListToolbar
            total={rows.length}
            shown={showList ? shown.length : 0}
            refreshing={refreshing}
            onSelect={selectMode}
            onRefresh={refresh}
            onMarkAllRead={markAllRead}
          />
        )}
        {hasSelection && allLoadedSelected && rows.length > shown.length && (
          <div className="flex items-center justify-center gap-2 border-b border-line bg-surface-2 py-2 text-sm">
            {matchingAll ? (
              <>
                <span>Đã chọn cả {rows.length} thư trong hộp thư này.</span>
                <button type="button" className="cursor-pointer font-medium text-accent hover:underline" onClick={clearSelection}>
                  Bỏ chọn
                </button>
              </>
            ) : (
              <>
                <span>Đã chọn {shown.length} thư trên trang này.</span>
                <button
                  type="button"
                  className="cursor-pointer font-medium text-accent hover:underline"
                  onClick={() => setMatchingAll(true)}
                >
                  Chọn cả {rows.length} thư trong hộp thư này
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isInbox && <CategoryTabs value={tab} onChange={(c) => { setTab(c); clearSelection(); setVisible(PAGE_SIZE) }} emails={scoped} />}

      {pending.length > 0 && (
        <button
          type="button"
          onClick={flushPending}
          className="animate-slide-down fixed top-20 left-1/2 z-20 inline-flex h-10 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-accent px-4 font-medium text-on-accent shadow-pop hover:bg-accent-hover"
        >
          <ArrowUp size={16} />
          {pending.length} thư mới
        </button>
      )}

      {body}

      {snoozeFor && (
        <SnoozeDialog
          title={snoozeFor.mode === 'snooze' ? 'Hoãn đến' : 'Sửa giờ gửi'}
          onPick={onSnoozePick}
          onClose={() => setSnoozeFor(null)}
        />
      )}
      {confirmIds && (
        <Dialog
          title="Xóa vĩnh viễn?"
          onClose={() => setConfirmIds(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirmIds(null)}>
                Hủy
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Xóa vĩnh viễn
              </Button>
            </>
          }
        >
          <p>{confirmIds.length} thư sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
        </Dialog>
      )}
    </div>
  )
}
