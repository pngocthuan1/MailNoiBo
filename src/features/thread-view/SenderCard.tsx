import { useNavigate } from "react-router-dom"
import { useCompose } from "@/features/compose/ComposeProvider"
import { getDepartment, employees, type Person } from "@/mock-data"
import { Avatar } from "@/shared/ui/Avatar"
import { Button } from "@/shared/ui/Button"
import { Popover } from "@/shared/ui/Popover"

/** Bấm tên người gửi: thẻ nhanh có nút Soạn thư và Xem hồ sơ. */
export function SenderCard({
  person,
  bold = true,
}: {
  person: Person
  bold?: boolean
}) {
  const navigate = useNavigate()
  const compose = useCompose()
  const emp = employees.find((e) => e.email === person.email)

  return (
    <Popover
      align="left"
      className="w-72 p-4"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={`cursor-pointer truncate rounded text-left hover:underline ${
            bold ? "font-semibold" : ""
          }`}
        >
          {person.name}
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center gap-3">
            <Avatar name={person.name} size={48} status={emp?.status} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{person.name}</p>
              <p className="truncate text-xs text-muted">{person.email}</p>
              {emp && (
                <p className="truncate text-xs text-muted">
                  {emp.title} · {getDepartment(emp.departmentId)?.name}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => {
                compose.open({ to: [person.email] })
                close()
              }}
            >
              Soạn thư
            </Button>
            {emp && (
              <Button
                variant="ghost"
                onClick={() => {
                  close()
                  navigate(`/contacts/${emp.id}`)
                }}
              >
                Xem hồ sơ
              </Button>
            )}
          </div>
        </div>
      )}
    </Popover>
  )
}
