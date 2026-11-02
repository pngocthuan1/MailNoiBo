import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "./authStore"

export function RequireAuth() {
  const location = useLocation()
  const { currentUser, sessionStatus } = useAuthStore()

  if (sessionStatus === "pending_2fa") {
    return (
      <Navigate
        to={`/verify-2fa${location.search ? location.search : ""}`}
        replace
      />
    )
  }

  if (sessionStatus === "expired") {
    return <Navigate to="/login?expired=1" replace />
  }

  if (!currentUser || sessionStatus !== "authenticated") {
    const fullPath = location.pathname + location.search
    const redirectParam = encodeURIComponent(fullPath)
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />
  }

  return <Outlet />
}
