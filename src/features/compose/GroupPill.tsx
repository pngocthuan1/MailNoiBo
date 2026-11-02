import { Users, X } from "lucide-react"
import type { ComposeRecipient } from "@/mock-data"
import { Avatar } from "@/shared/ui/Avatar"
import { Popover } from "@/shared/ui/Popover"
import { personRecipient } from "./recipients"
import { employees } from "@/mock-data"

type Group = Extract<ComposeRecipient, { kind: "group" }>
type Props = {
  group: Group
  /** `null` khi nhóm không còn thành viên hoặc bị xóa */
  onChange: (next: Group | null) => void
  onExpand: (people: ComposeRecipient[]) => void
}

/** Thẻ nhóm/phòng ban: hiện số thành viên; bấm để xem, xóa từng người hoặc mở rộng thành từng người. */
export function GroupPill({ group, onChange, onExpand }: Props) {
  return (
    <span className="inline-flex h-7 items-center rounded-full border border-line bg-accent-soft text-xs text-fg">
      <Popover
        align="left"
        className="w-80"
        trigger={({ toggle, open }) => (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-l-full pr-1 pl-2 hover:bg-hover"
          >
            <Users size={14} className="text-accent" aria-hidden />
            <span className="max-w-48 truncate">{group.name}</span>
            <span className="rounded-full bg-surface px-1.5 text-[11px] text-muted">
              {group.members.length}
            </span>
          </button>
        )}
      >
        {(close) => (
          <div>
            <div className="border-b border-line px-3 py-2 text-sm font-semibold">
              {group.name} ({group.members.length} người)
            </div>
            <ul className="max-h-56 overflow-y-auto py-1">
              {group.members.map((m) => (
                <li
                  key={m.email}
                  className="flex items-center gap-2 px-3 py-1.5"
                >
                  <Avatar name={m.name} size={24} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{m.name}</div>
                    <div className="truncate text-xs text-muted">{m.email}</div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Xóa ${m.name} khỏi nhóm`}
                    onClick={() => {
                      const members = group.members.filter(
                        (x) => x.email !== m.email,
                      )
                      onChange(members.length ? { ...group, members } : null)
                      if (!members.length) close()
                    }}
                    className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-2">
              <button
                type="button"
                onClick={() => {
                  onExpand(
                    group.members.map((m) => {
                      const e = employees.find((x) => x.email === m.email)
                      return e
                        ? personRecipient(e)
                        : {
                            kind: "person" as const,
                            email: m.email,
                            name: m.name,
                            valid: true,
                          }
                    }),
                  )
                  close()
                }}
                className="h-8 w-full cursor-pointer rounded-full text-sm font-medium text-accent hover:bg-accent-soft"
              >
                Mở rộng thành từng người
              </button>
            </div>
          </div>
        )}
      </Popover>
      <button
        type="button"
        aria-label={`Xóa nhóm ${group.name}`}
        onClick={() => onChange(null)}
        className="mr-1 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
      >
        <X size={12} />
      </button>
    </span>
  )
}
