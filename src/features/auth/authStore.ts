import { create } from "zustand"

export type UserRole = "employee" | "admin"
export type UserStatus = "active" | "locked" | "pending_activation"

export type AuthUser = {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  status: UserStatus
  twoFactorEnabled?: boolean
  secondaryEmail?: string
  activationToken?: string
  title?: string
  avatar?: string
}

export type SessionStatus = "authenticated" | "pending_2fa" | "expired" | "unauthenticated"

export const SEED_USERS: AuthUser[] = [
  {
    id: "u-an",
    name: "Nguyễn Văn An",
    email: "an.nguyen@congty.vn",
    password: "Matkhau@123",
    role: "employee",
    status: "active",
    title: "Chuyên viên Kế hoạch",
    secondaryEmail: "an.nguyen@gmail.com",
  },
  {
    id: "u-admin",
    name: "Quản trị viên Hệ thống",
    email: "admin@congty.vn",
    password: "Admin@12345",
    role: "admin",
    status: "active",
    title: "Trưởng phòng CNTT",
    secondaryEmail: "admin.backup@gmail.com",
  },
  {
    id: "u-binh",
    name: "Trần Quốc Bình",
    email: "binh.tran@congty.vn",
    password: "Matkhau@123",
    role: "employee",
    status: "active",
    twoFactorEnabled: true,
    title: "Chuyên viên Kinh doanh",
    secondaryEmail: "binh.tran@gmail.com",
  },
  {
    id: "u-khoa",
    name: "Đặng Đình Khoa",
    email: "khoa@congty.vn",
    password: "Matkhau@123",
    role: "employee",
    status: "locked",
    title: "Chuyên viên Kỹ thuật",
  },
  {
    id: "u-chuakichhoat",
    name: "Lê Hoàng Nam",
    email: "chuakichhoat@congty.vn",
    password: "Matkhau@123",
    role: "employee",
    status: "pending_activation",
    activationToken: "valid-token-123",
    title: "Nhân viên mới",
  },
]

const STORAGE_KEY = "mail_auth_state_v1"

type StoredState = {
  users: AuthUser[]
  currentUser: AuthUser | null
  accounts: AuthUser[]
  sessionStatus: SessionStatus
  pending2faUser: AuthUser | null
  trustedDevices: string[]
}

function loadInitialState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : SEED_USERS,
        currentUser: parsed.currentUser ?? null,
        accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
        sessionStatus: parsed.sessionStatus ?? "unauthenticated",
        pending2faUser: parsed.pending2faUser ?? null,
        trustedDevices: Array.isArray(parsed.trustedDevices) ? parsed.trustedDevices : [],
      }
    }
  } catch {
    // fallback
  }

  // Mặc định lần đầu mở app là chưa đăng nhập
  return {
    users: SEED_USERS,
    currentUser: null,
    accounts: [],
    sessionStatus: "unauthenticated",
    pending2faUser: null,
    trustedDevices: [],
  }
}

type AuthStore = StoredState & {
  // Thử đăng nhập thất bại (ghi nhớ số lần và thời điểm mở khóa)
  failedAttempts: Record<string, { count: number; lockedUntil?: number }>

  login: (
    email: string,
    pass: string,
    remember?: boolean,
  ) => { success: boolean; error?: string; require2fa?: boolean }
  loginWithSSO: () => { success: boolean }
  verify2fa: (code: string, trustDevice?: boolean) => { success: boolean; error?: string }
  verifyBackupCode: (code: string) => { success: boolean; error?: string }
  logout: () => void
  switchAccount: (userId: string) => void
  addAccount: (email: string, pass: string) => { success: boolean; error?: string }
  expireSession: () => void
  activateAccount: (
    token: string,
    newPassword: string,
  ) => { success: boolean; error?: string }
  requestAdminReset: (email: string) => { requestId: string }
  requestOtpReset: (
    email: string,
  ) => { success: boolean; error?: string; secondaryEmailMasked?: string }
  verifyOtpReset: (email: string, otp: string) => { success: boolean; error?: string }
  resetPasswordWithOtp: (email: string, newPass: string) => { success: boolean }
  resetDemo: () => void
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        users: state.users,
        currentUser: state.currentUser,
        accounts: state.accounts,
        sessionStatus: state.sessionStatus,
        pending2faUser: state.pending2faUser,
        trustedDevices: state.trustedDevices,
      }),
    )
  } catch {
    // quota ignore
  }
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const initial = loadInitialState()

  return {
    ...initial,
    failedAttempts: {},

    login: (email, pass, remember = false) => {
      const normalizedEmail = email.trim().toLowerCase()
      const { users, failedAttempts, trustedDevices } = get()

      // Kiểm tra tài khoản có bị khóa tạm thời do nhập sai quá nhiều lần
      const attempt = failedAttempts[normalizedEmail]
      if (attempt?.lockedUntil && attempt.lockedUntil > Date.now()) {
        const remainingSeconds = Math.ceil((attempt.lockedUntil - Date.now()) / 1000)
        return {
          success: false,
          error: `Bạn đã thử sai 5 lần. Vui lòng thử lại sau ${remainingSeconds} giây.`,
        }
      }

      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)
      if (!user) {
        return { success: false, error: "Email hoặc mật khẩu không chính xác." }
      }

      if (user.status === "locked") {
        return {
          success: false,
          error:
            "Tài khoản đã bị khóa do vi phạm chính sách bảo mật hoặc yêu cầu từ quản trị viên. Vui lòng liên hệ admin@congty.vn.",
        }
      }

      if (user.status === "pending_activation") {
        return {
          success: false,
          error:
            "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email kích hoạt hoặc liên hệ quản trị viên.",
        }
      }

      if (user.password !== pass) {
        const curCount = (attempt?.count ?? 0) + 1
        const newAttempts = { ...failedAttempts }
        if (curCount >= 5) {
          newAttempts[normalizedEmail] = {
            count: curCount,
            lockedUntil: Date.now() + 30_000,
          }
          set({ failedAttempts: newAttempts })
          return {
            success: false,
            error: "Bạn đã thử sai 5 lần. Vui lòng thử lại sau 30 giây.",
          }
        }
        newAttempts[normalizedEmail] = { count: curCount }
        set({ failedAttempts: newAttempts })
        return { success: false, error: "Email hoặc mật khẩu không chính xác." }
      }

      // Xóa bộ đếm sai khi đúng mật khẩu
      const nextFailed = { ...failedAttempts }
      delete nextFailed[normalizedEmail]
      set({ failedAttempts: nextFailed })

      // Nếu tài khoản bật xác thực 2 bước
      if (user.twoFactorEnabled) {
        // Kiểm tra xem thiết bị này đã được tin cậy 30 ngày chưa
        const isTrusted = trustedDevices.includes(user.id)
        if (!isTrusted) {
          const nextState: StoredState = {
            ...get(),
            sessionStatus: "pending_2fa",
            pending2faUser: user,
          }
          set(nextState)
          saveState(nextState)
          return { success: true, require2fa: true }
        }
      }

      // Đăng nhập thành công
      const existingAccounts = get().accounts
      const updatedAccounts = existingAccounts.some((a) => a.id === user.id)
        ? existingAccounts.map((a) => (a.id === user.id ? user : a))
        : [...existingAccounts, user]

      const nextState: StoredState = {
        ...get(),
        currentUser: user,
        accounts: updatedAccounts,
        sessionStatus: "authenticated",
        pending2faUser: null,
      }
      set(nextState)
      saveState(nextState)
      return { success: true }
    },

    loginWithSSO: () => {
      const { users, accounts } = get()
      const an = users.find((u) => u.email === "an.nguyen@congty.vn") ?? SEED_USERS[0]
      const updatedAccounts = accounts.some((a) => a.id === an.id)
        ? accounts
        : [...accounts, an]

      const nextState: StoredState = {
        ...get(),
        currentUser: an,
        accounts: updatedAccounts,
        sessionStatus: "authenticated",
        pending2faUser: null,
      }
      set(nextState)
      saveState(nextState)
      return { success: true }
    },

    verify2fa: (code, trustDevice = false) => {
      const { pending2faUser, trustedDevices, accounts } = get()
      if (!pending2faUser) {
        return { success: false, error: "Không tìm thấy phiên xác thực." }
      }

      if (code === "123456") {
        const nextTrusted =
          trustDevice && !trustedDevices.includes(pending2faUser.id)
            ? [...trustedDevices, pending2faUser.id]
            : trustedDevices

        const updatedAccounts = accounts.some((a) => a.id === pending2faUser.id)
          ? accounts
          : [...accounts, pending2faUser]

        const nextState: StoredState = {
          ...get(),
          currentUser: pending2faUser,
          accounts: updatedAccounts,
          sessionStatus: "authenticated",
          pending2faUser: null,
          trustedDevices: nextTrusted,
        }
        set(nextState)
        saveState(nextState)
        return { success: true }
      }

      return {
        success: false,
        error: "Mã xác thực không chính xác. Vui lòng thử lại.",
      }
    },

    verifyBackupCode: (code) => {
      const { pending2faUser, accounts } = get()
      if (!pending2faUser) {
        return { success: false, error: "Không tìm thấy phiên xác thực." }
      }

      if (code.trim().toUpperCase() === "BACKUP-2026") {
        const updatedAccounts = accounts.some((a) => a.id === pending2faUser.id)
          ? accounts
          : [...accounts, pending2faUser]

        const nextState: StoredState = {
          ...get(),
          currentUser: pending2faUser,
          accounts: updatedAccounts,
          sessionStatus: "authenticated",
          pending2faUser: null,
        }
        set(nextState)
        saveState(nextState)
        return { success: true }
      }

      return {
        success: false,
        error: "Mã dự phòng không hợp lệ hoặc đã qua sử dụng.",
      }
    },

    logout: () => {
      const nextState: StoredState = {
        ...get(),
        currentUser: null,
        sessionStatus: "unauthenticated",
        pending2faUser: null,
      }
      set(nextState)
      saveState(nextState)
    },

    switchAccount: (userId) => {
      const { accounts } = get()
      const target = accounts.find((a) => a.id === userId)
      if (target) {
        const nextState: StoredState = {
          ...get(),
          currentUser: target,
          sessionStatus: "authenticated",
          pending2faUser: null,
        }
        set(nextState)
        saveState(nextState)
      }
    },

    addAccount: (email, pass) => {
      const normalizedEmail = email.trim().toLowerCase()
      const { users, accounts } = get()
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)
      if (!user || user.password !== pass) {
        return { success: false, error: "Email hoặc mật khẩu không chính xác." }
      }
      if (user.status !== "active") {
        return {
          success: false,
          error: "Tài khoản không ở trạng thái hoạt động.",
        }
      }

      const updatedAccounts = accounts.some((a) => a.id === user.id)
        ? accounts.map((a) => (a.id === user.id ? user : a))
        : [...accounts, user]

      const nextState: StoredState = {
        ...get(),
        currentUser: user,
        accounts: updatedAccounts,
        sessionStatus: "authenticated",
      }
      set(nextState)
      saveState(nextState)
      return { success: true }
    },

    expireSession: () => {
      const nextState: StoredState = {
        ...get(),
        currentUser: null,
        sessionStatus: "expired",
        pending2faUser: null,
      }
      set(nextState)
      saveState(nextState)
    },

    activateAccount: (token, newPassword) => {
      if (token.includes("expired")) {
        return {
          success: false,
          error: "Liên kết kích hoạt đã hết hạn hoặc không hợp lệ.",
        }
      }

      const { users } = get()
      const target =
        users.find((u) => u.activationToken === token) ??
        users.find((u) => u.id === "u-chuakichhoat")

      if (!target) {
        return {
          success: false,
          error: "Không tìm thấy tài khoản tương ứng với liên kết kích hoạt này.",
        }
      }

      const updatedUsers = users.map((u) =>
        u.id === target.id
          ? {
              ...u,
              status: "active" as const,
              password: newPassword,
              activationToken: undefined,
            }
          : u,
      )

      const nextState: StoredState = {
        ...get(),
        users: updatedUsers,
      }
      set(nextState)
      saveState(nextState)
      return { success: true }
    },

    requestAdminReset: (email) => {
      return { requestId: "REQ-" + Math.floor(1000 + Math.random() * 9000) }
    },

    requestOtpReset: (email) => {
      const normalizedEmail = email.trim().toLowerCase()
      const { users } = get()
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)
      if (!user) {
        return { success: false, error: "Không tìm thấy tài khoản với email này." }
      }
      if (!user.secondaryEmail) {
        return {
          success: false,
          error:
            "Tài khoản này chưa thiết lập email phụ. Vui lòng chọn Nhờ quản trị viên đặt lại.",
        }
      }

      const [name, domain] = user.secondaryEmail.split("@")
      const masked = `${name.slice(0, 2)}***@${domain}`
      return { success: true, secondaryEmailMasked: masked }
    },

    verifyOtpReset: (email, otp) => {
      if (otp === "654321") {
        return { success: true }
      }
      return { success: false, error: "Mã OTP không chính xác hoặc đã hết hạn." }
    },

    resetPasswordWithOtp: (email, newPass) => {
      const normalizedEmail = email.trim().toLowerCase()
      const { users } = get()
      const updatedUsers = users.map((u) =>
        u.email.toLowerCase() === normalizedEmail ? { ...u, password: newPass } : u,
      )
      const nextState: StoredState = {
        ...get(),
        users: updatedUsers,
      }
      set(nextState)
      saveState(nextState)
      return { success: true }
    },

    resetDemo: () => {
      localStorage.removeItem(STORAGE_KEY)
      const freshState: StoredState = {
        users: SEED_USERS,
        currentUser: null,
        accounts: [],
        sessionStatus: "unauthenticated",
        pending2faUser: null,
        trustedDevices: [],
      }
      set({ ...freshState, failedAttempts: {} })
      saveState(freshState)
    },
  }
})
