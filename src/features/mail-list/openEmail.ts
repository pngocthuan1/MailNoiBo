import type { NavigateFunction } from "react-router-dom"
import type { Email } from "@/mock-data"
import { draftToInit } from "@/features/compose/buildCompose"
import type { ComposeOpenInit } from "@/features/compose/ComposeProvider"
import { patchEmails } from "@/shared/state/mailStore"

type ComposeApi = { open: (initial?: ComposeOpenInit) => unknown }

/** Mở một thư: nháp mở cửa sổ soạn, còn lại sang trang đọc thư và đánh dấu đã đọc. */
export function openEmail(
  email: Email,
  navigate: NavigateFunction,
  compose: ComposeApi,
) {
  if (email.folder === "drafts") {
    compose.open(draftToInit(email))
    return
  }
  if (email.unread) patchEmails([email.id], () => ({ unread: false }))
  navigate(`/mail/${email.folder}/${email.threadId}`)
}
