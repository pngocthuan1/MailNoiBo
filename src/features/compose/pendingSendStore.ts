import { create } from "zustand"
import type { OutgoingMail } from "@/shared/state/mailStore"
import { sendMail } from "@/shared/state/mailStore"

export type PendingSend = {
  id: string
  mail: OutgoingMail
  draftId?: string
  scheduledAt?: number
  countdown: number
  totalSeconds: number
  startedAt: number
}

const STORAGE_KEY = "mail-pending-sends"

function loadFromStorage(): PendingSend[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveToStorage(items: PendingSend[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors
  }
}

type PendingSendState = {
  pendingSends: PendingSend[]
}

export const usePendingSendStore = create<PendingSendState>(() => {
  const initial = loadFromStorage()
  // Any pending send from prior reload: finalize immediately as requirement states:
  // "Closing the page tab while a send is held must not lose the mail (store it as pending and send on next load)."
  if (initial.length > 0) {
    setTimeout(() => {
      for (const item of initial) {
        sendMail(item.mail)
      }
      localStorage.removeItem(STORAGE_KEY)
      usePendingSendStore.setState({ pendingSends: [] })
    }, 100)
  }
  return { pendingSends: [] }
})

export function addPendingSend(item: PendingSend) {
  const next = [...usePendingSendStore.getState().pendingSends, item]
  usePendingSendStore.setState({ pendingSends: next })
  saveToStorage(next)
}

export function removePendingSend(id: string): PendingSend | undefined {
  const current = usePendingSendStore.getState().pendingSends
  const found = current.find((p) => p.id === id)
  const next = current.filter((p) => p.id !== id)
  usePendingSendStore.setState({ pendingSends: next })
  saveToStorage(next)
  return found
}

export function updatePendingSend(id: string, patch: Partial<PendingSend>) {
  const next = usePendingSendStore
    .getState()
    .pendingSends.map((p) => (p.id === id ? { ...p, ...patch } : p))
  usePendingSendStore.setState({ pendingSends: next })
  saveToStorage(next)
}
