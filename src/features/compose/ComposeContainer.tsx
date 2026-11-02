import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMailStore } from "@/shared/state/mailStore"
import { ComposeDemoSwitcher } from "./ComposeDemoSwitcher"
import { ComposeWindow } from "./ComposeWindow"
import { useCompose } from "./ComposeProvider"
import { draftToInit, replyToInit } from "./buildCompose"

/**
 * Vùng chứa các cửa sổ soạn thư nổi (góc dưới bên phải, tối đa 3 cửa sổ mở rộng).
 * Mở bằng ?compose=new, ?compose=MÃ_NHÁP hoặc ?reply=MÃ_CHUỖI&mode=reply|replyall|forward;
 * tham số được gỡ sau khi mở để có thể mở thêm cửa sổ khác.
 */
export function ComposeContainer() {
  const { windows, open } = useCompose()
  const location = useLocation()
  const navigate = useNavigate()
  const handled = useRef<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const compose = params.get("compose")
    const reply = params.get("reply")
    if ((!compose && !reply) || handled.current === location.key) return
    handled.current = location.key

    if (compose === "new") open()
    else if (compose) {
      const email = useMailStore.getState().emails.find((e) => e.id === compose)
      open(email ? draftToInit(email) : undefined)
    } else if (reply) {
      const m = params.get("mode")
      const mode =
        m === "forward"
          ? "forward"
          : m === "replyall" || m === "replyAll"
            ? "replyAll"
            : "reply"
      open(replyToInit(reply, mode) ?? undefined)
    }
    params.delete("compose")
    params.delete("reply")
    params.delete("mode")
    const search = params.toString()
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : "" },
      { replace: true },
    )
  }, [location, navigate, open])

  const fullscreen = windows.find((w) => w.fullscreen)

  return (
    <>
      {fullscreen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          aria-hidden
        />
      )}
      {windows.length > 0 && <ComposeDemoSwitcher />}
      <div className="pointer-events-none fixed right-4 bottom-0 z-[46] flex items-end gap-4">
        {windows.map((w) => (
          <ComposeWindow key={w.id} draft={w} />
        ))}
      </div>
    </>
  )
}
