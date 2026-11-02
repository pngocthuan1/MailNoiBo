import { folders, type Email, type FolderId } from "@/mock-data"

export type Scope = { kind: "folder" id: FolderId } | {
  kind: "label"
  id: string
} | { kind: "shared" id: string }

export const folderName = (id: FolderId) =>
  folders.find((f) => f.id === id)!.name

/** Thư thuộc một hộp thư / nhãn / hộp thư dùng chung, đã sắp xếp theo yêu cầu của từng hộp thư. */
export function selectEmails(all: Email[], scope: Scope): Email[] {
  const own = all.filter((e) => !e.mailboxId)
  let list: Email[]
  if (scope.kind === "shared") {
    list = all.filter(
      (e) => e.mailboxId === scope.id && e.folder === "inbox" && !e.archived,
    )
  } else if (scope.kind === "label") {
    list = own.filter(
      (e) =>
        e.labelIds.includes(scope.id) &&
        e.folder !== "trash" &&
        e.folder !== "spam",
    )
  } else {
    switch (scope.id) {
      case "inbox":
        list = own.filter(
          (e) => e.folder === "inbox" && !e.archived && !e.snoozedUntil,
        )
        break
      case "starred":
        list = own.filter((e) => e.starred && e.folder !== "trash")
        break
      case "snoozed":
        list = own.filter((e) => e.snoozedUntil && e.folder === "inbox")
        break
      case "important":
        list = own.filter((e) => e.important && e.folder !== "trash")
        break
      case "todo":
        list = own.filter((e) => e.todoDue && e.folder !== "trash")
        break
      case "sent":
        list = own.filter(
          (e) =>
            e.folder === "sent" ||
            (!!e.sentTs && e.folder !== "trash" && e.folder !== "drafts"),
        )
        break
      default:
        list = own.filter((e) => e.folder === scope.id)
    }
  }
  if (scope.kind === "folder" && scope.id === "todo")
    return [...list].sort((a, b) => a.todoDue! - b.todoDue!)
  if (scope.kind === "folder" && scope.id === "snoozed")
    return [...list].sort((a, b) => a.snoozedUntil! - b.snoozedUntil!)
  if (scope.kind === "folder" && scope.id === "scheduled")
    return [...list].sort((a, b) => a.scheduledAt! - b.scheduledAt!)
  if (scope.kind === "folder" && scope.id === "sent")
    return [...list].sort((a, b) => (b.sentTs ?? b.ts) - (a.sentTs ?? a.ts))
  return [...list].sort((a, b) => b.ts - a.ts)
}

// --- Số thư hiển thị ở thanh bên, tính từ kho thư ---

/** Inbox, Quan trọng, Spam...: thư chưa đọc. Nháp và Cần xử lý: tổng số thư. */
export function folderCount(all: Email[], id: FolderId): number {
  const list = selectEmails(all, { kind: "folder", id })
  if (id === "drafts" || id === "todo") return list.length
  if (id === "sent" || id === "trash" || id === "scheduled") return 0
  return list.filter((e) => e.unread).length
}

/** Thư chưa đọc của nhãn, gồm cả các nhãn con. */
export function labelUnread(
  all: Email[],
  labels: { id: string parentId?: string }[],
  labelId: string,
): number {
  const ids = new Set([labelId])
  let grew = true
  while (grew) {
    grew = false
    for (const l of labels) {
      if (l.parentId && ids.has(l.parentId) && !ids.has(l.id)) {
        ids.add(l.id)
        grew = true
      }
    }
  }
  return all.filter(
    (e) =>
      !e.mailboxId &&
      e.unread &&
      e.folder !== "trash" &&
      e.folder !== "spam" &&
      e.labelIds.some((l) => ids.has(l)),
  ).length
}

/** Số thư chưa có người nhận xử lý trong hộp thư dùng chung. */
export function sharedUnassigned(all: Email[], mailboxId: string): number {
  return selectEmails(all, { kind: "shared", id: mailboxId }).filter(
    (e) => !e.assigneeId,
  ).length
}
