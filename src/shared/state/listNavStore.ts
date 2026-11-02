import { create } from 'zustand'

/** Trạng thái điều hướng bàn phím của danh sách thư (CD-07), dùng chung với bộ phím tắt. */
type ListNav = {
  focusedId: string | null
  visibleIds: string[]
  selectedIds: string[]
  /** Đang ở Spam / Thùng rác */
  bin: boolean
  helpOpen: boolean
}

export const useListNavStore = create<ListNav>(() => ({
  focusedId: null,
  visibleIds: [],
  selectedIds: [],
  bin: false,
  helpOpen: false,
}))

export const setListNav = (patch: Partial<ListNav>) => useListNavStore.setState(patch)
