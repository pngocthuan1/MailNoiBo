import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, LogOut, Settings, UserCircle, UserPlus } from 'lucide-react'
import { Avatar } from '@/shared/ui/Avatar'
import { Popover } from '@/shared/ui/Popover'
import { useSnackbar } from '@/shared/ui/Snackbar'
import { useAuthStore } from '@/features/auth/authStore'
import { AddAccountModal } from '@/features/auth/AddAccountModal'

const rowClass = 'flex h-10 w-full cursor-pointer items-center gap-3 px-4 text-left hover:bg-hover'

export function AvatarMenu() {
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const { currentUser, accounts, switchAccount, logout } = useAuthStore()
  const [showAddModal, setShowAddModal] = useState(false)

  const activeUser = currentUser ?? {
    id: 'guest',
    name: 'Khách',
    email: 'guest@congty.vn',
    status: 'offline' as const,
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Popover
        className="w-80 py-2"
        trigger={({ toggle, open }) => (
          <button
            type="button"
            aria-label="Tài khoản"
            aria-expanded={open}
            onClick={toggle}
            className="ml-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
          >
            <Avatar name={activeUser.name} size={32} status={activeUser.status === 'locked' ? 'busy' : 'online'} />
          </button>
        )}
      >
        {(close) => (
          <div>
            <div className="flex items-center gap-3 px-4 pb-3">
              <Avatar name={activeUser.name} size={48} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{activeUser.name}</p>
                <p className="truncate text-xs text-muted">{activeUser.email}</p>
              </div>
            </div>
            <div className="border-t border-line py-2">
              <p className="px-4 pb-1 text-xs font-medium text-muted">Chuyển tài khoản</p>
              {accounts.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={rowClass}
                  onClick={() => {
                    close()
                    if (a.id !== activeUser.id) {
                      switchAccount(a.id)
                      snackbar.show({ message: `Đã chuyển sang ${a.email}` })
                    }
                  }}
                >
                  <Avatar name={a.name} size={24} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{a.name}</span>
                    <span className="block truncate text-xs text-muted">{a.email}</span>
                  </span>
                  {a.id === activeUser.id && <Check size={16} className="text-accent" />}
                </button>
              ))}
              <button
                type="button"
                className={rowClass}
                onClick={() => {
                  close()
                  setShowAddModal(true)
                }}
              >
                <UserPlus size={16} className="text-muted" />
                Thêm tài khoản
              </button>
            </div>
            <div className="border-t border-line pt-2">
              <Link to={`/contacts/${activeUser.id}`} onClick={close} className={rowClass}>
                <UserCircle size={16} className="text-muted" />
                Hồ sơ
              </Link>
              <Link to="/settings/general" onClick={close} className={rowClass}>
                <Settings size={16} className="text-muted" />
                Cài đặt
              </Link>
              <button
                type="button"
                className={rowClass}
                onClick={() => {
                  close()
                  handleLogout()
                }}
              >
                <LogOut size={16} className="text-muted" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </Popover>

      <AddAccountModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  )
}
