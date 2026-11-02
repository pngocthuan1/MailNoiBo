import { create } from 'zustand'

export type ThreadDemoView = 'normal' | 'loading' | 'error'

type DemoState = {
  view: ThreadDemoView
  /** Dịch thư thất bại */
  translateFails: boolean
  /** Lần xem trước tệp đầu tiên báo lỗi (Thử lại sẽ thành công) */
  previewFails: boolean
  recallOutcome: 'success' | 'partial' | 'failed'
}

export const useThreadDemoStore = create<DemoState>(() => ({
  view: 'normal',
  translateFails: false,
  previewFails: false,
  recallOutcome: 'success',
}))

export const setThreadDemo = (patch: Partial<DemoState>) => useThreadDemoStore.setState(patch)
