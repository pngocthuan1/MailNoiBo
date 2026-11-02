import { Users } from "lucide-react"
import { sharedMailboxes } from "@/mock-data"
import { sharedUnassigned } from "@/shared/state/mailSelectors"
import { useMailStore } from "@/shared/state/mailStore"
import { SidebarItem } from "./SidebarItem"

export function SidebarSharedMailboxes({ collapsed }: { collapsed: boolean }) {
  const emails = useMailStore((st) => st.emails)
  return (
    <section aria-label="Hộp thư dùng chung">
      {collapsed ? (
        <div className="my-2 border-t border-line" />
      ) : (
        <h2 className="flex h-8 items-center pl-3 text-xs font-semibold tracking-wide text-muted uppercase">
          Hộp thư dùng chung
        </h2>
      )}
      <ul className="flex flex-col gap-0.5">
        {sharedMailboxes.map((m) => (
          <li key={m.id}>
            <SidebarItem
              to={`/mail/shared/${m.id}`}
              label={m.name}
              icon={<Users size={18} />}
              count={sharedUnassigned(emails, m.id)}
              collapsed={collapsed}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
