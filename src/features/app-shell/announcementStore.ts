import { useSyncExternalStore } from 'react'

let acknowledged = false
const listeners = new Set<() => void>()

export function acknowledgeAnnouncement() {
  acknowledged = true
  listeners.forEach((l) => l())
}

export function useAnnouncementAcknowledged() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => acknowledged,
  )
}
