import { Outlet } from 'react-router-dom'
import { Logo } from '@/features/app-shell/Logo'

export function AuthLayout() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-bg p-4">
      <Logo />
      <main className="w-full max-w-[420px] rounded-2xl border border-line bg-surface p-8">
        <Outlet />
      </main>
    </div>
  )
}
