import {
  contactGroups,
  departments,
  employees,
  frequentContactIds,
  type ComposeRecipient,
  type Employee,
} from "@/mock-data"

export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Bỏ dấu và chữ hoa để so khớp khi gõ. */
export const fold = (s: string) =>
  s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()

export type GroupInfo = {
  id: string
  name: string
  kind: "department" | "group"
  members: { name: string email: string }[]
}

/** Phòng ban (tự động từ danh sách nhân viên) và nhóm liên hệ. */
export function allGroups(): GroupInfo[] {
  const byEmp = (ids: string[]) =>
    ids
      .map((id) => employees.find((e) => e.id === id))
      .filter((e): e is Employee => !!e)
      .map((e) => ({ name: e.name, email: e.email }))
  return [
    ...departments.map((d) => ({
      id: `dept-${d.id}`,
      name: d.name.startsWith("Ban") ? d.name : `Phòng ${d.name}`,
      kind: "department" as const,
      members: employees
        .filter((e) => e.departmentId === d.id)
        .map((e) => ({ name: e.name, email: e.email })),
    })),
    ...contactGroups.map((g) => ({
      id: g.id,
      name: g.name,
      kind: "group" as const,
      members: byEmp(g.memberIds),
    })),
  ]
}

export type Suggestion = { type: "person" employee: Employee } | {
  type: "group"
  group: GroupInfo
}

/** Gợi ý khi gõ: người hay liên lạc xếp trên cùng, sau đó là phòng ban và nhóm. */
export function suggest(
  query: string,
  taken: ComposeRecipient[],
): Suggestion[] {
  const q = fold(query.trim())
  if (!q) return []
  const takenEmails = new Set(
    taken
      .filter((r) => r.kind === "person")
      .map((r) => (r as { email: string }).email),
  )
  const takenGroups = new Set(
    taken
      .filter((r) => r.kind === "group")
      .map((r) => (r as { id: string }).id),
  )
  const rank = (e: Employee) => {
    const i = frequentContactIds.indexOf(e.id)
    return i === -1 ? 999 : i
  }
  const people = employees
    .filter(
      (e) =>
        !takenEmails.has(e.email) && fold(`${e.name} ${e.email}`).includes(q),
    )
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, "vi"))
    .slice(0, 5)
    .map((employee): Suggestion => ({ type: "person", employee }))
  const groups = allGroups()
    .filter((g) => !takenGroups.has(g.id) && fold(g.name).includes(q))
    .slice(0, 4)
    .map((group): Suggestion => ({ type: "group", group }))
  return [...people, ...groups]
}

export const personRecipient = (e: Employee): ComposeRecipient => ({
  kind: "person",
  email: e.email,
  name: e.name,
  valid: true,
})

export const groupRecipient = (g: GroupInfo): ComposeRecipient => ({
  kind: "group",
  id: g.id,
  name: g.name,
  members: g.members,
})

/** Chuyển một địa chỉ (hoặc tên) đã gõ thành người nhận; địa chỉ sai định dạng được đánh dấu không hợp lệ. */
export function recipientFromText(text: string): ComposeRecipient {
  const t = text.trim()
  const emp = employees.find(
    (e) => e.email === t.toLowerCase() || fold(e.name) === fold(t),
  )
  if (emp) return personRecipient(emp)
  return { kind: "person", email: t, name: t, valid: emailRe.test(t) }
}

export function recipientFromEmail(
  email: string,
  name?: string,
): ComposeRecipient {
  const emp = employees.find((e) => e.email === email)
  if (emp) return personRecipient(emp)
  return {
    kind: "person",
    email,
    name: name ?? email,
    valid: emailRe.test(email),
  }
}

export const groupLabel = (g: { name: string members: unknown[] }) =>
  `${g.name} (${g.members.length} người)`
