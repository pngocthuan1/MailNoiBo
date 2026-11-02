import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { folders, type FolderId } from "@/mock-data"
import { useThread } from "@/shared/state/mailStore"
import { ThreadDemoSwitcher } from "./ThreadDemoSwitcher"
import { ThreadError } from "./ThreadError"
import { ThreadSkeleton } from "./ThreadSkeleton"
import { ThreadView } from "./ThreadView"
import { setThreadDemo, useThreadDemoStore } from "./threadDemoStore"

/** Trang Đọc thư: /mail/:folder/:threadId. Thư không tồn tại hoặc không có quyền xem thì chuyển tới /404. */
export function ThreadPage() {
  const { folder, threadId } = useParams()
  const email = useThread(threadId)
  const view = useThreadDemoStore((s) => s.view)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    setBooting(true)
    const t = window.setTimeout(() => setBooting(false), 400)
    return () => window.clearTimeout(t)
  }, [threadId])

  if (!email || email.draft || !folders.some((f) => f.id === folder))
    return <Navigate to="/404" replace />

  const state = booting && view === "normal" ? "loading" : view
  const retry = () => {
    setThreadDemo({ view: "loading" })
    window.setTimeout(() => setThreadDemo({ view: "normal" }), 800)
  }

  return (
    <div>
      <ThreadDemoSwitcher folder={folder!} current={email.threadId} />
      {state === "loading" && (
        <div className="mx-auto max-w-[960px]">
          <ThreadSkeleton />
        </div>
      )}
      {state === "error" && <ThreadError onRetry={retry} />}
      {state === "normal" && (
        <ThreadView
          key={email.threadId}
          email={email}
          folder={folder as FolderId}
        />
      )}
    </div>
  )
}
