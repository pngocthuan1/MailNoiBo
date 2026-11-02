import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom"
import { AdminLayout } from "@/layouts/AdminLayout"
import { AppShell } from "@/layouts/AppShell"
import { AuthLayout } from "@/layouts/AuthLayout"
import { SettingsLayout } from "@/layouts/SettingsLayout"
import { MailListPage } from "@/features/mail-list/MailListPage"
import { ThreadPage } from "@/features/thread-view/ThreadPage"
import { SearchPage } from "@/features/search/SearchPage"
import { PlaceholderPage } from "@/shared/ui/PlaceholderPage"

// Auth & Route guards
import { LoginPage } from "@/features/auth/LoginPage"
import { ActivatePage } from "@/features/auth/ActivatePage"
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage"
import { Verify2faPage } from "@/features/auth/Verify2faPage"
import { RequireAuth } from "@/features/auth/RequireAuth"
import { RequireAdmin } from "@/features/auth/RequireAdmin"

// Error pages
import { ForbiddenPage } from "@/features/error-pages/ForbiddenPage"
import { NotFoundPage } from "@/features/error-pages/NotFoundPage"
import { ServerErrorPage } from "@/features/error-pages/ServerErrorPage"

/** Trang chưa xây dựng: chỉ hiện tên trang. */
const page = (path: string, name: string): RouteObject => ({
  path,
  element: <PlaceholderPage name={name} />,
})

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/mail/inbox" replace /> },

  // Phân hệ Xác thực & Các trang lỗi
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/activate/:token", element: <ActivatePage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/verify-2fa", element: <Verify2faPage /> },
      { path: "/403", element: <ForbiddenPage /> },
      { path: "/404", element: <NotFoundPage /> },
      { path: "/500", element: <ServerErrorPage /> },
    ],
  },

  // Phân hệ Đã xác thực (RequireAuth)
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/mail", element: <Navigate to="/mail/inbox" replace /> },
          { path: "/mail/label/:labelId", element: <MailListPage kind="label" /> },
          {
            path: "/mail/shared/:mailboxId",
            element: <MailListPage kind="shared" />,
          },
          { path: "/mail/:folder", element: <MailListPage kind="folder" /> },
          { path: "/mail/:folder/:threadId", element: <ThreadPage /> },
          { path: "/search", element: <SearchPage /> },
          page("/contacts", "Danh bạ công ty"),
          page("/contacts/org", "Sơ đồ tổ chức"),
          page("/contacts/groups", "Nhóm liên hệ"),
          page("/contacts/:contactId", "Chi tiết đồng nghiệp"),
        ],
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="/settings/general" replace /> },
          page("general", "Cài đặt chung"),
          page("account", "Tài khoản"),
          page("labels", "Quản lý nhãn"),
          page("filters", "Bộ lọc tự động"),
          page("filters/new", "Tạo bộ lọc mới"),
          page("signature", "Chữ ký và mẫu thư"),
          page("vacation", "Trả lời tự động"),
          page("notifications", "Thông báo"),
          page("security", "Bảo mật"),
          page("data", "Dữ liệu của tôi"),
        ],
      },
      {
        path: "/admin",
        element: (
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        ),
        children: [
          page("", "Tổng quan quản trị"),
          page("users", "Quản lý người dùng"),
          page("quotas", "Hạn mức dung lượng"),
          page("roles", "Vai trò và quyền"),
          page("audit", "Nhật ký kiểm toán"),
          page("retention", "Lưu trữ và xuất thư"),
          page("shared-mailboxes", "Hộp thư dùng chung (quản trị)"),
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/404" replace /> },
])
