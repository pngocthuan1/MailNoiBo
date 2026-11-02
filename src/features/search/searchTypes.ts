import type { Attachment, Email } from "@/mock-data"

export type SearchScope = "all" | "inbox" | "sent" | "trash" | "spam" | string

export type QuickFilters = {
  hasAttachment?: boolean
  unread?: boolean
  thisWeek?: boolean
  fromMe?: boolean
}

export type AdvancedFilters = {
  from?: string
  to?: string
  subject?: string
  hasWords?: string
  withoutWords?: string
  sizeOp?: "gt" | "lt"
  sizeMb?: number
  datePreset?: "1d" | "1w" | "1m" | "1y" | "custom"
  dateFrom?: string
  dateTo?: string
  searchIn?: string
  hasAttachment?: boolean
}

export type OperatorKey = "from" | "to" | "subject" | "has" | "before" | "after" | "label" | "is"

export type OperatorToken = {
  key: OperatorKey
  val: string
  raw: string
  valid: boolean
  error?: string
}

export type ParsedQuery = {
  tokens: OperatorToken[]
  freeText: string
  invalidTokens: OperatorToken[]
  hasAttachment?: boolean
  isUnread?: boolean
  fromMe?: boolean
  from?: string
  to?: string
  subject?: string
  beforeTs?: number
  afterTs?: number
  label?: string
}

export type MatchedAttachmentInfo = {
  file: Attachment
  page: number
  snippet: string
  fileIndex: number
}

export type SearchResultItem = {
  email: Email
  originLabel: string
  relevanceScore: number
  previewSnippet?: string
  matchedAttachment?: MatchedAttachmentInfo
  matchedInSubject: boolean
  matchedInSender: boolean
}

export type SearchSortOption = "relevance" | "newest"

export type SearchDemoView = "normal" | "loading" | "empty" | "error"
