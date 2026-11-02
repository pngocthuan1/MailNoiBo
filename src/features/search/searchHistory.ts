import { recentSearches } from "@/mock-data"

const STORAGE_KEY = "mail_search_history"
const MAX_HISTORY = 8

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveHistory(recentSearches.slice(0, MAX_HISTORY))
      return recentSearches.slice(0, MAX_HISTORY)
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : []
  } catch {
    return recentSearches.slice(0, MAX_HISTORY)
  }
}

function saveHistory(list: string[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list.slice(0, MAX_HISTORY)),
    )
  } catch {
    // Ignore storage quota
  }
}

let subscribers: Array<(history: string[]) => void> = []

function notify(list: string[]) {
  subscribers.forEach((cb) => cb(list))
}

export const searchHistory = {
  get(): string[] {
    return loadHistory()
  },

  add(query: string): string[] {
    const trimmed = query.trim()
    if (!trimmed) return loadHistory()
    const current = loadHistory()
    const next = [
      trimmed,
      ...current.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_HISTORY)
    saveHistory(next)
    notify(next)
    return next
  },

  remove(item: string): string[] {
    const current = loadHistory()
    const next = current.filter((q) => q !== item)
    saveHistory(next)
    notify(next)
    return next
  },

  clear(): string[] {
    saveHistory([])
    notify([])
    return []
  },

  subscribe(callback: (history: string[]) => void): () => void {
    subscribers.push(callback)
    callback(loadHistory())
    return () => {
      subscribers = subscribers.filter((cb) => cb !== callback)
    }
  },
}
