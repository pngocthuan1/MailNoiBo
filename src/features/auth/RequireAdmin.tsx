import { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "./authStore"

export function RequireAdmin({ children }: { children?: ReactNode }) {
  const { currentUser } = useAuthStore()

  if (currentUser?.role !== "admin") {
    return <Navigate to="/403" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
