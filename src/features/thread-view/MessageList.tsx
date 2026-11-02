import { useMemo, useState } from "react"
import type { Email, Message } from "@/mock-data"
import { CollapsedMessage } from "./CollapsedMessage"
import { HiddenMessagesBar } from "./HiddenMessagesBar"
import { MessageCard } from "./MessageCard"
import type { MessageCtx } from "./types"

const LONG_THREAD = 50
const PAGE = 10

type Item = { type: "message" message: Message collapsed: boolean } | {
  type: "bar"
  ids: string[]
}

/**
 * Các thư theo thời gian (DT-02): thư mới nhất và thư chưa đọc mở sẵn, thư cũ thu một dòng,
 * từ 3 thư cũ liền nhau trở lên gộp thành dải "N thư đã ẩn". Chuỗi hơn 50 thư chỉ tải 10 thư mới nhất.
 */
export function MessageList({
  messages,
  email,
  ctx,
}: {
  messages: Message[]
  email: Email
  ctx: MessageCtx
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(
    messages.length > LONG_THREAD ? PAGE : messages.length,
  )

  const items = useMemo(() => {
    const visible = messages.slice(messages.length - visibleCount)
    const lastId = visible[visible.length - 1].id
    const isCollapsed = (m: Message) =>
      m.id !== lastId && !m.unread && !expanded.has(m.id)
    const out: Item[] = []
    let run: Message[] = []
    const flush = () => {
      if (run.length >= 3) out.push({ type: "bar", ids: run.map((m) => m.id) })
      else
        run.forEach((m) =>
          out.push({ type: "message", message: m, collapsed: true }),
        )
      run = []
    }
    visible.forEach((m, i) => {
      if (isCollapsed(m) && i === 0)
        out.push({ type: "message", message: m, collapsed: true })
      else if (isCollapsed(m)) run.push(m)
      else {
        flush()
        out.push({ type: "message", message: m, collapsed: false })
      }
    })
    flush()
    return out
  }, [messages, visibleCount, expanded])

  const expand = (ids: string[]) =>
    setExpanded((prev) => new Set([...prev, ...ids]))
  const hiddenOlder = messages.length - visibleCount

  return (
    <div className="space-y-3" aria-label="Các thư trong chuỗi">
      {hiddenOlder > 0 && (
        <button
          type="button"
          onClick={() =>
            setVisibleCount((c) => Math.min(messages.length, c + PAGE))
          }
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-line text-accent hover:bg-accent-soft"
        >
          Tải thêm thư cũ ({hiddenOlder} thư)
        </button>
      )}
      {items.map((item) =>
        item.type === "bar" ? (
          <HiddenMessagesBar
            key={item.ids[0]}
            count={item.ids.length}
            onExpand={() => expand(item.ids)}
          />
        ) : item.collapsed ? (
          <CollapsedMessage
            key={item.message.id}
            message={item.message}
            onExpand={() => expand([item.message.id])}
          />
        ) : (
          <MessageCard
            key={item.message.id}
            message={item.message}
            email={email}
            ctx={ctx}
          />
        ),
      )}
    </div>
  )
}
