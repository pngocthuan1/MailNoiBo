import { CloudOff } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

export function MailErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-20 text-center">
      <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-danger-soft text-danger">
        <CloudOff size={40} strokeWidth={1.5} />
      </span>
      <p className="text-base font-medium">Không tải được danh sách thư</p>
      <p className="text-muted">Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng thử lại.</p>
      <Button onClick={onRetry}>Thử lại</Button>
    </div>
  )
}
