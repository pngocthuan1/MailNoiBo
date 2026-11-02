import { useState } from "react"
import { UserPlus } from "lucide-react"
import {
  currentUser,
  employees,
  getDepartment,
  getEmployee,
  type Email,
} from "@/mock-data"
import { Avatar } from "@/shared/ui/Avatar"
import { Popover } from "@/shared/ui/Popover"
import type { useMailActions } from "./useMailActions"

type Props = { email: Email actions: ReturnType<typeof useMailActions> }

/** Cột "Người xử lý" của hộp thư dùng chung kèm menu "Giao cho" (NB-02). */
export function AssigneeCell({ email, actions }: Props) {
  const assignee = email.assigneeId ? getEmployee(email.assigneeId) : undefined
  const [q, setQ] = useState("")

  return (
    <span
      className="flex w-44 shrink-0 items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      {assignee ? (
        <span
          className="flex min-w-0 flex-1 items-center gap-2"
          title={`${assignee.name} - ${assignee.title}`}
        >
          <Avatar name={assignee.name} size={24} status={assignee.status} />
          <span className="truncate text-xs font-medium">
            {assignee.name.split(" ").slice(-2).join(" ")}
          </span>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => actions.assign([email.id], currentUser.id, "bạn")}
          className="h-8 flex-1 cursor-pointer rounded-full border border-accent px-3 text-xs font-medium text-accent hover:bg-accent-soft"
        >
          Nhận xử lý
        </button>
      )}
      <Popover
        className="w-72"
        trigger={({ toggle }) => (
          <button
            type="button"
            aria-label="Giao cho"
            title="Giao cho"
            onClick={toggle}
            className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
          >
            <UserPlus size={16} />
          </button>
        )}
      >
        {(close) => (
          <div className="py-2 font-normal">
            <p className="px-4 pb-1 text-xs font-medium text-muted">Giao cho</p>
            <div className="px-3 pb-2">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm đồng nghiệp"
                aria-label="Tìm đồng nghiệp"
                className="h-8 w-full rounded-lg border border-line bg-surface px-3 outline-none focus:border-accent"
              />
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {employees
                .filter((m) =>
                  `${m.name} ${m.email}`
                    .toLowerCase()
                    .includes(q.trim().toLowerCase()),
                )
                .map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        actions.assign([email.id], m.id, m.name)
                        close()
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left hover:bg-hover"
                    >
                      <Avatar name={m.name} size={32} status={m.status} />
                      <span className="min-w-0">
                        <span className="block truncate">{m.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {getDepartment(m.departmentId)?.name}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
            {assignee && (
              <button
                type="button"
                onClick={() => {
                  actions.assign([email.id], undefined)
                  close()
                }}
                className="mt-1 flex h-9 w-full cursor-pointer items-center border-t border-line px-4 text-danger hover:bg-hover"
              >
                Bỏ giao
              </button>
            )}
          </div>
        )}
      </Popover>
    </span>
  )
}
