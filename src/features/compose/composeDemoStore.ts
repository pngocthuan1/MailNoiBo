import { create } from 'zustand'

type ComposeDemo = {
  /** Lần gửi kế tiếp sẽ thất bại (tự tắt sau khi xảy ra) */
  sendFails: boolean
  /** Giả lập mất kết nối */
  offline: boolean
  /** Tệp kế tiếp sẽ lỗi khi đang tải lên (tự tắt sau khi gán) */
  uploadError: boolean
}

export const useComposeDemoStore = create<ComposeDemo>(() => ({ sendFails: false, offline: false, uploadError: false }))
export const setComposeDemo = (patch: Partial<ComposeDemo>) => useComposeDemoStore.setState(patch)
