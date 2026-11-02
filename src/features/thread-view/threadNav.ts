import type { Email, FolderId } from "@/mock-data"
import { selectEmails } from "@/shared/state/mailSelectors"

/** Các thư cùng danh sách với thư đang đọc (dùng cho "12 trong 120" và thư kế tiếp). */
export function getSiblings(emails: Email[], folder: FolderId, thread: Email) {
  const list = selectEmails(emails, { kind: "folder", id: folder })
  return folder === "inbox"
    ? list.filter((m) => m.category === thread.category)
    : list
}
