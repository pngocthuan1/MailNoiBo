import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import {
  Archive,
  ArrowUpDown,
  CheckSquare,
  ChevronDown,
  Filter,
  FileQuestion,
  Mail,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react"
import type { Attachment, Email } from "@/mock-data"
import { useAllLabels, useMailState } from "@/shared/state/mailStore"
import { useMailActions } from "@/features/mail-list/useMailActions"
import { LabelDot } from "@/shared/ui/LabelDot"
import { Popover } from "@/shared/ui/Popover"
import { MailRow } from "@/features/mail-list/MailRow"
import { FileViewer } from "@/features/thread-view/FileViewer"
import { executeSearch } from "./searchUtils"
import type {
  AdvancedFilters,
  QuickFilters,
  SearchDemoView,
  SearchResultItem,
  SearchScope,
  SearchSortOption,
} from "./searchTypes"

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { emails } = useMailState()
  const allLabels = useAllLabels()
  const actions = useMailActions()

  // Đọc các tham số tìm kiếm từ URL
  const query = searchParams.get("q") ?? ""
  const scopeParam = searchParams.get("scope") as SearchScope ?? "all"
  const sortParam = searchParams.get("sort") as SearchSortOption ?? "relevance"

  // Quick filters từ URL
  const hasAttachmentParam = searchParams.get("hasAttachment") === "true"
  const unreadParam = searchParams.get("unread") === "true"
  const thisWeekParam = searchParams.get("thisWeek") === "true"
  const fromMeParam = searchParams.get("fromMe") === "true"

  // Advanced filters từ URL
  const advancedFrom = searchParams.get("from") ?? undefined
  const advancedTo = searchParams.get("to") ?? undefined
  const advancedSubject = searchParams.get("subject") ?? undefined
  const advancedHasWords = searchParams.get("hasWords") ?? undefined
  const advancedWithoutWords = searchParams.get("withoutWords") ?? undefined
  const sizeParam = searchParams.get("size") ?? undefined
  const dateFrom = searchParams.get("dateFrom") ?? undefined
  const dateTo = searchParams.get("dateTo") ?? undefined
  const datePreset = searchParams.get("datePreset") as any

  let sizeOp: "gt" | "lt" | undefined = undefined
  let sizeMb: number | undefined = undefined
  if (sizeParam && sizeParam.includes(":")) {
    const [op, mb] = sizeParam.split(":")
    sizeOp = (op as "gt" | "lt")
    sizeMb = parseFloat(mb)
  }

  const advancedFilters: AdvancedFilters = useMemo(
    () => ({
      from: advancedFrom,
      to: advancedTo,
      subject: advancedSubject,
      hasWords: advancedHasWords,
      withoutWords: advancedWithoutWords,
      sizeOp,
      sizeMb,
      datePreset,
      dateFrom,
      dateTo,
      searchIn: scopeParam,
      hasAttachment: hasAttachmentParam || undefined,
    }),
    [
      advancedFrom,
      advancedTo,
      advancedSubject,
      advancedHasWords,
      advancedWithoutWords,
      sizeOp,
      sizeMb,
      datePreset,
      dateFrom,
      dateTo,
      scopeParam,
      hasAttachmentParam,
    ],
  )

  const quickFilters: QuickFilters = useMemo(
    () => ({
      hasAttachment: hasAttachmentParam,
      unread: unreadParam,
      thisWeek: thisWeekParam,
      fromMe: fromMeParam,
    }),
    [hasAttachmentParam, unreadParam, thisWeekParam, fromMeParam],
  )

  // Demo state switcher: 'normal' | 'loading' | 'empty' | 'error'
  const [demoView, setDemoView] = useState<SearchDemoView>("normal")
  const [loading, setLoading] = useState(false)

  // Trạng thái chọn nhiều (Selection)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Trình xem tệp TM-09
  const [fileViewer, setFileViewer] = useState<{
    files: Attachment[]
    index: number
    page: number
  } | null>(null)

  // Giả lập trạng thái tải ngắn khi thay đổi điều kiện
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 300)
    return () => window.clearTimeout(t)
  }, [location.search])

  // Cập nhật param trên URL
  const updateParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams)
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || v === "false") {
        next.delete(k)
      } else {
        next.set(k, v)
      }
    }
    setSearchParams(next)
  }

  // Chuyển tab phạm vi
  const setScope = (scope: SearchScope) => {
    updateParams({ scope: scope === "all" ? undefined : scope })
  }

  // Toggle quick filters
  const toggleQuickFilter = (key: keyof QuickFilters) => {
    const current = quickFilters[key]
    updateParams({ [key]: current ? undefined : "true" })
  }

  // Xóa mọi bộ lọc
  const clearAllFilters = () => {
    const next = new URLSearchParams()
    if (query) next.set("q", query)
    setSearchParams(next)
  }

  // Thực hiện tìm kiếm
  const searchResults: SearchResultItem[] = useMemo(() => {
    return executeSearch({
      emails,
      allLabels,
      query,
      scope: scopeParam,
      quick: quickFilters,
      advanced: advancedFilters,
    })
  }, [emails, allLabels, query, scopeParam, quickFilters, advancedFilters])

  // Sắp xếp kết quả: Liên quan nhất hoặc Mới nhất
  const sortedResults = useMemo(() => {
    const list = [...searchResults]
    if (sortParam === "newest") {
      return list.sort((a, b) => b.email.ts - a.email.ts)
    }
    // Sắp xếp theo độ liên quan
    return list.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return b.email.ts - a.email.ts
    })
  }, [searchResults, sortParam])

  // Xử lý chọn nhiều thư
  const toggleSelect = (id: string, shift: boolean) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedResults.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(sortedResults.map((r) => r.email.id))
    }
  }

  // Mở chuỗi thư kết quả
  const handleOpenEmail = (email: Email) => {
    navigate(`/mail/${email.folder}/${email.threadId}`)
  }

  // TM-09: Mở trình xem tệp tại trang chính xác
  const handleOpenAttachment = (
    file: Attachment,
    page: number,
    fileIndex: number,
  ) => {
    setFileViewer({
      files: [file],
      index: 0,
      page,
    })
  }

  // TM-08: Nút "Tạo bộ lọc từ tìm kiếm này"
  const handleCreateFilter = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (advancedFrom) params.set("from", advancedFrom)
    if (advancedTo) params.set("to", advancedTo)
    if (advancedSubject) params.set("subject", advancedSubject)
    if (advancedHasWords) params.set("hasWords", advancedHasWords)
    if (advancedWithoutWords) params.set("withoutWords", advancedWithoutWords)
    if (hasAttachmentParam) params.set("hasAttachment", "true")
    if (sizeParam) params.set("size", sizeParam)

    navigate(`/settings/filters/new?${params.toString()}`)
  }

  // Tên hiển thị tab Nhãn đang chọn
  const activeLabelObj = scopeParam.startsWith("label:")
    ? allLabels.find((l) => l.id === scopeParam.replace("label:", ""))
    : undefined

  // Xác định trạng thái xem (xử lý cả demo state)
  const currentView: SearchDemoView =
    demoView !== "normal" ? demoView : loading ? "loading" : "normal"

  const hasActiveFilters =
    hasAttachmentParam ||
    unreadParam ||
    thisWeekParam ||
    fromMeParam ||
    scopeParam !== "all" ||
    Boolean(
      advancedFrom ||
        advancedTo ||
        advancedSubject ||
        advancedHasWords ||
        advancedWithoutWords,
    )

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Thanh Demo state switcher */}
      <div className="border-b border-line bg-surface-2/40 px-4 py-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted">Trạng thái demo:</span>
            <div className="flex rounded-full bg-surface p-0.5 border border-line">
              {([
                { id: "normal", label: "Bình thường" },
                { id: "loading", label: "Đang tải" },
                { id: "empty", label: "Trống" },
                { id: "error", label: "Lỗi" },
              ] as const).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setDemoView(o.id)}
                  className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    demoView === o.id
                      ? "bg-accent text-on-accent"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-muted">
            Tìm trong kho <strong className="text-fg">{emails.length}</strong>{" "}
            thư
          </span>
        </div>
      </div>

      {/* TM-04: Thanh phạm vi (Scope tabs) */}
      <div className="flex items-center border-b border-line px-4 pt-1">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setScope("all")}
            className={`cursor-pointer pb-2.5 text-sm font-medium transition-colors ${
              scopeParam === "all"
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-fg"
            }`}
          >
            Tất cả thư
          </button>
          <button
            type="button"
            onClick={() => setScope("inbox")}
            className={`cursor-pointer pb-2.5 text-sm font-medium transition-colors ${
              scopeParam === "inbox"
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-fg"
            }`}
          >
            Inbox
          </button>
          <button
            type="button"
            onClick={() => setScope("sent")}
            className={`cursor-pointer pb-2.5 text-sm font-medium transition-colors ${
              scopeParam === "sent"
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-fg"
            }`}
          >
            Đã gửi
          </button>

          {/* Tab Nhãn (Dropdown chọn nhãn) */}
          <Popover
            align="left"
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className={`inline-flex cursor-pointer items-center gap-1.5 pb-2.5 text-sm font-medium transition-colors ${
                  activeLabelObj
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted hover:text-fg"
                }`}
              >
                <Tag size={15} />
                <span>
                  {activeLabelObj ? `Nhãn: ${activeLabelObj.name}` : "Nhãn"}
                </span>
                <ChevronDown size={14} />
              </button>
            )}
          >
            {(close) => (
              <div className="w-56 py-1 text-sm">
                <p className="px-3 py-1.5 text-xs font-semibold text-muted">
                  Chọn một nhãn
                </p>
                {allLabels.map((lbl) => (
                  <button
                    key={lbl.id}
                    type="button"
                    onClick={() => {
                      setScope(`label:${lbl.id}`)
                      close()
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left hover:bg-hover ${
                      scopeParam === `label:${lbl.id}`
                        ? "bg-accent-soft font-medium text-accent"
                        : ""
                    }`}
                  >
                    <span className="truncate">{lbl.name}</span>
                    <LabelDot color={lbl.color} size={10} />
                  </button>
                ))}
              </div>
            )}
          </Popover>
        </div>
      </div>

      {/* TM-05: Thanh viên thuốc bộ lọc nhanh */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface px-4 py-2 text-xs">
        <span className="text-muted">Bộ lọc nhanh:</span>
        <button
          type="button"
          onClick={() => toggleQuickFilter("hasAttachment")}
          className={`cursor-pointer rounded-full border px-3 py-1 font-medium transition-colors ${
            hasAttachmentParam
              ? "border-accent bg-accent text-on-accent"
              : "border-line bg-surface hover:bg-hover"
          }`}
        >
          Có tệp đính kèm
        </button>
        <button
          type="button"
          onClick={() => toggleQuickFilter("unread")}
          className={`cursor-pointer rounded-full border px-3 py-1 font-medium transition-colors ${
            unreadParam
              ? "border-accent bg-accent text-on-accent"
              : "border-line bg-surface hover:bg-hover"
          }`}
        >
          Chưa đọc
        </button>
        <button
          type="button"
          onClick={() => toggleQuickFilter("thisWeek")}
          className={`cursor-pointer rounded-full border px-3 py-1 font-medium transition-colors ${
            thisWeekParam
              ? "border-accent bg-accent text-on-accent"
              : "border-line bg-surface hover:bg-hover"
          }`}
        >
          Tuần này
        </button>
        <button
          type="button"
          onClick={() => toggleQuickFilter("fromMe")}
          className={`cursor-pointer rounded-full border px-3 py-1 font-medium transition-colors ${
            fromMeParam
              ? "border-accent bg-accent text-on-accent"
              : "border-line bg-surface hover:bg-hover"
          }`}
        >
          Từ tôi
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-auto inline-flex cursor-pointer items-center gap-1 text-xs text-danger hover:underline"
          >
            <X size={14} /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* TM-02: Dòng tiêu đề kết quả, số thư và bộ chọn sắp xếp */}
      <div className="flex flex-wrap items-center justify-between border-b border-line bg-bg px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-base font-semibold text-fg">
            {query ? (
              <span>
                Kết quả cho{" "}
                <span className="text-accent font-bold">"{query}"</span>
              </span>
            ) : (
              <span>Kết quả tìm kiếm</span>
            )}
            <span className="ml-2 font-normal text-muted text-sm">
              ({currentView === "empty" ? 0 : sortedResults.length} thư)
            </span>
          </h1>

          {/* TM-08: Nút Tạo bộ lọc từ tìm kiếm này ở đầu kết quả */}
          <button
            type="button"
            onClick={handleCreateFilter}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-accent hover:bg-hover hover:border-accent"
          >
            <Sparkles size={13} />
            <span>Tạo bộ lọc từ tìm kiếm này</span>
          </button>
        </div>

        {/* Bộ chọn sắp xếp: Liên quan nhất / Mới nhất */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted">Sắp xếp:</span>
          <select
            value={sortParam}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="h-8 cursor-pointer rounded-lg border border-line bg-surface px-2.5 font-medium outline-none focus:border-accent"
          >
            <option value="relevance">Liên quan nhất</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Toolbar thao tác chọn nhiều (nếu có thư được chọn) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between border-b border-accent/20 bg-accent-soft px-4 py-2 text-xs font-medium text-accent">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="inline-flex cursor-pointer items-center gap-1.5"
            >
              <CheckSquare size={16} />
              <span>Đã chọn {selectedIds.length} thư</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                actions.markRead(selectedIds, true)
                setSelectedIds([])
              }}
              className="cursor-pointer rounded px-2 py-1 hover:bg-accent/20"
            >
              Đánh dấu đã đọc
            </button>
            <button
              type="button"
              onClick={() => {
                actions.markRead(selectedIds, false)
                setSelectedIds([])
              }}
              className="cursor-pointer rounded px-2 py-1 hover:bg-accent/20"
            >
              Đánh dấu chưa đọc
            </button>
            <button
              type="button"
              onClick={() => {
                actions.remove(selectedIds)
                setSelectedIds([])
              }}
              className="cursor-pointer rounded px-2 py-1 text-danger hover:bg-danger-soft"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Danh sách kết quả hoặc các trạng thái đặc biệt */}
      <div className="flex-1">
        {/* 1. Trạng thái Đang tìm (Khung xương 10 dòng) */}
        {currentView === "loading" && (
          <div className="divide-y divide-line p-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex h-14 items-center gap-3 px-3 animate-pulse"
              >
                <div className="h-4 w-4 rounded bg-surface-2" />
                <div className="h-4 w-4 rounded bg-surface-2" />
                <div className="h-4 w-32 rounded bg-surface-2" />
                <div className="h-4 flex-1 rounded bg-surface-2" />
                <div className="h-4 w-16 rounded bg-surface-2" />
              </div>
            ))}
          </div>
        )}

        {/* 2. Trạng thái Lỗi mạng */}
        {currentView === "error" && (
          <div className="flex h-80 flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 rounded-full bg-danger-soft p-4 text-danger">
              <RefreshCw size={32} />
            </div>
            <h3 className="mb-1 text-base font-semibold">
              Lỗi tải kết quả tìm kiếm
            </h3>
            <p className="mb-4 max-w-sm text-xs text-muted">
              Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu thư. Vui lòng kiểm tra
              lại kết nối mạng.
            </p>
            <button
              type="button"
              onClick={() => setDemoView("normal")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-on-accent hover:bg-accent/90"
            >
              <RefreshCw size={14} /> Thử lại
            </button>
          </div>
        )}

        {/* 3. Trạng thái Không có kết quả */}
        {(currentView === "empty" ||
          (currentView === "normal" && sortedResults.length === 0)) && (
          <div className="flex h-96 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-2 text-muted">
              <FileQuestion size={40} />
            </div>
            <h2 className="mb-2 text-base font-semibold text-fg">
              {query
                ? `Không tìm thấy thư nào cho từ khóa "${query}"`
                : "Không tìm thấy thư nào phù hợp với bộ lọc"}
            </h2>
            <div className="mb-6 max-w-md space-y-1 text-xs text-muted">
              <p>Gợi ý:</p>
              <ul className="list-inside list-disc text-left">
                <li>Kiểm tra lại chính tả của từ khóa tìm kiếm.</li>
                <li>Bỏ bớt các bộ lọc (nhãn, người gửi, có tệp...).</li>
                <li>Thử mở rộng phạm vi tìm kiếm sang "Tất cả thư".</li>
              </ul>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-medium text-on-accent shadow-sm hover:bg-accent/90"
              >
                <X size={14} /> Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* 4. Trạng thái Danh sách kết quả bình thường */}
        {currentView === "normal" && sortedResults.length > 0 && (
          <div className="divide-y divide-line">
            {sortedResults.map((item) => {
              const email = item.email
              const isSelected = selectedIds.includes(email.id)
              return (
                <MailRow
                  key={email.id}
                  email={email}
                  variant="search"
                  selected={isSelected}
                  fresh={false}
                  focused={false}
                  dragging={false}
                  actions={actions}
                  searchQuery={query}
                  previewSnippet={item.previewSnippet}
                  originLabel={item.originLabel}
                  matchedAttachment={item.matchedAttachment}
                  onOpenAttachment={handleOpenAttachment}
                  onToggleSelect={(shift) => toggleSelect(email.id, shift)}
                  onOpen={() => handleOpenEmail(email)}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                  hoverActions={
                    <div className="flex items-center gap-1 bg-surface px-1">
                      <button
                        type="button"
                        title="Lưu trữ"
                        onClick={(e) => {
                          e.stopPropagation()
                          actions.archive([email.id])
                        }}
                        className="p-1 hover:text-accent"
                      >
                        <Archive size={15} />
                      </button>
                      <button
                        type="button"
                        title="Xóa"
                        onClick={(e) => {
                          e.stopPropagation()
                          actions.remove([email.id])
                        }}
                        className="p-1 text-danger hover:opacity-80"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  }
                />
              )
            })}
          </div>
        )}
      </div>

      {/* TM-09: Trình xem tệp đính kèm khi bấm vào viên thuốc "Khớp trong tệp" */}
      {fileViewer && (
        <FileViewer
          files={fileViewer.files}
          index={fileViewer.index}
          initialPage={fileViewer.page}
          onIndex={(idx) =>
            setFileViewer((p) => (p ? { ...p, index: idx } : null))
          }
          onClose={() => setFileViewer(null)}
        />
      )}
    </div>
  )
}
