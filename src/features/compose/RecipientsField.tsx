import { useMemo, useRef, useState, type ReactNode } from "react"
import { Users } from "lucide-react"
import { getDepartment, type ComposeRecipient } from "@/mock-data"
import { Avatar } from "@/shared/ui/Avatar"
import { GroupPill } from "./GroupPill"
import { RecipientPill } from "./RecipientPill"
import {
  groupLabel,
  groupRecipient,
  personRecipient,
  recipientFromText,
  suggest,
} from "./recipients"

type Props = {
  label: string
  value: ComposeRecipient[]
  onChange: (v: ComposeRecipient[]) => void
  trailing?: ReactNode
  autoFocus?: boolean
}

/** Ô nhập người nhận: thẻ người/nhóm, gợi ý liên hệ thường dùng, phòng ban và nhóm. */
export function RecipientsField({
  label,
  value,
  onChange,
  trailing,
  autoFocus,
}: Props) {
  const [text, setText] = useState("")
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = useMemo(() => suggest(text, value), [text, value])

  const commitText = () => {
    const parts = text.split(/[,;\s]+/).filter(Boolean)
    if (!parts.length) return
    const next = [...value]
    for (const p of parts) {
      const r = recipientFromText(p)
      const dup =
        r.kind === "person" &&
        next.some((x) => x.kind === "person" && x.email === r.email)
      if (!dup) next.push(r)
    }
    onChange(next)
    setText("")
  }

  const pick = (i: number) => {
    const s = suggestions[i]
    if (!s) return
    onChange([
      ...value,
      s.type === "person"
        ? personRecipient(s.employee)
        : groupRecipient(s.group),
    ])
    setText("")
    setActive(0)
    inputRef.current?.focus()
  }

  const replaceAt = (i: number, items: ComposeRecipient[]) => {
    const next = value.flatMap((r, idx) => (idx === i ? items : [r]))
    // loại người trùng sau khi mở rộng nhóm
    const seen = new Set<string>()
    onChange(
      next.filter((r) => {
        if (r.kind !== "person") return true
        if (seen.has(r.email)) return false
        seen.add(r.email)
        return true
      }),
    )
  }

  return (
    <div
      className="relative flex min-h-10 items-start gap-1 border-b border-line px-3 py-1"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }}
    >
      <span className="w-10 shrink-0 pt-1.5 text-muted">{label}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 py-0.5">
        {value.map((r, i) =>
          r.kind === "person" ? (
            <RecipientPill
              key={`${r.email}-${i}`}
              {...r}
              onRemove={() => replaceAt(i, [])}
            />
          ) : (
            <GroupPill
              key={r.id}
              group={r}
              onChange={(g) => replaceAt(i, g ? [g] : [])}
              onExpand={(people) => replaceAt(i, people)}
            />
          ),
        )}
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          aria-label={label}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setActive(0)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            commitText()
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && suggestions.length) {
              e.preventDefault()
              setActive((a) => (a + 1) % suggestions.length)
            } else if (e.key === "ArrowUp" && suggestions.length) {
              e.preventDefault()
              setActive(
                (a) => (a - 1 + suggestions.length) % suggestions.length,
              )
            } else if (e.key === "Enter" || e.key === "," || e.key === ";") {
              e.preventDefault()
              if (suggestions.length && e.key === "Enter") pick(active)
              else commitText()
            } else if (e.key === "Tab" && suggestions.length && text.trim()) {
              e.preventDefault()
              pick(active)
            } else if (e.key === "Backspace" && !text && value.length) {
              onChange(value.slice(0, -1))
            }
          }}
          className="h-7 min-w-24 flex-1 bg-transparent outline-none"
        />
      </div>
      {trailing && <div className="flex shrink-0 gap-1 pt-1">{trailing}</div>}

      {focused && suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Gợi ý người nhận"
          className="absolute top-full left-12 z-30 mt-1 max-h-72 w-[min(420px,90%)] overflow-y-auto rounded-xl border border-line bg-surface py-1 shadow-pop"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.type === "person" ? s.employee.id : s.group.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(i)
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-1.5 ${
                i === active ? "bg-hover" : ""
              }`}
            >
              {s.type === "person" ? (
                <>
                  <Avatar name={s.employee.name} size={32} />
                  <div className="min-w-0">
                    <div className="truncate text-sm">{s.employee.name}</div>
                    <div className="truncate text-xs text-muted">
                      {s.employee.email} ·{" "}
                      {getDepartment(s.employee.departmentId)?.name}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Users size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm">
                      {groupLabel(s.group)}
                    </div>
                    <div className="text-xs text-muted">
                      {s.group.kind === "department"
                        ? "Phòng ban"
                        : "Nhóm liên hệ"}
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
