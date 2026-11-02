import { Outlet } from 'react-router-dom'
import { AnnouncementBanner } from '@/features/app-shell/AnnouncementBanner'
import { Header } from '@/features/app-shell/Header'
import { OfflineBanner } from '@/features/app-shell/OfflineBanner'
import { Sidebar } from '@/features/app-shell/Sidebar'
import { ComposeContainer } from '@/features/compose/ComposeContainer'
import { MailShortcuts } from '@/features/mail-list/MailShortcuts'
import { ComposeProvider } from '@/features/compose/ComposeProvider'

export function AppShell() {
  return (
    <ComposeProvider>
      <div className="flex h-full flex-col bg-bg">
        <Header />
        <OfflineBanner />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-y-auto rounded-tl-2xl bg-surface md:mr-2 md:mb-2 md:rounded-2xl">
            <AnnouncementBanner />
            <Outlet />
          </main>
        </div>
        <ComposeContainer />
        <MailShortcuts />
      </div>
    </ComposeProvider>
  )
}
