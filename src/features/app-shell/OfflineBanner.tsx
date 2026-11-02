import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'

export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div
      role="alert"
      className="flex h-8 shrink-0 items-center justify-center gap-2 bg-warning-bar text-xs font-medium text-[#3b2a00]"
    >
      <WifiOff size={14} />
      Mất kết nối. Đang thử kết nối lại...
    </div>
  )
}
