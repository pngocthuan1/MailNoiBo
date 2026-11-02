import {
  threadMessages,
  type Attachment,
  type Email,
  type Label,
} from "@/mock-data"
import { folderName } from "@/shared/state/mailSelectors"
import type {
  AdvancedFilters,
  MatchedAttachmentInfo,
  OperatorToken,
  ParsedQuery,
  QuickFilters,
  SearchResultItem,
  SearchScope,
} from "./searchTypes"

/** Chuẩn hóa xâu tiếng Việt: chữ thường và chuyển Unicode dựng sẵn */
export function normalizeVi(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .trim()
}

/** Kiểm tra chuỗi ngày có đúng định dạng YYYY-MM-DD không */
export function isValidDateStr(val: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false
  const [y, m, d] = val.split("-").map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  const date = new Date(val)
  return !Number.isNaN(date.getTime())
}

/**
 * Phân tích chuỗi tìm kiếm thành các token toán tử và từ khóa tự do (TM-06).
 */
export function parseSearchQuery(query: string): ParsedQuery {
  const tokens: OperatorToken[] = []
  const invalidTokens: OperatorToken[] = []
  const freeWords: string[] = []

  let hasAttachment: boolean | undefined = undefined
  let isUnread: boolean | undefined = undefined
  let fromMe: boolean | undefined = undefined
  let from: string | undefined = undefined
  let to: string | undefined = undefined
  let subject: string | undefined = undefined
  let beforeTs: number | undefined = undefined
  let afterTs: number | undefined = undefined
  let label: string | undefined = undefined

  // Phân tách từ hoặc cụm ngoặc kép
  const regex = /(\b[a-zA-Z]+:[^\s"]+|"[^"]*"|\S+)/g
  const matches = query.match(regex) || []

  for (const part of matches) {
    const colonIdx = part.indexOf(":")
    if (colonIdx > 0 && !part.startsWith('"')) {
      const key = part.slice(0, colonIdx).toLowerCase()
      const val = part.slice(colonIdx + 1).replace(/^"(.*)"$/, "$1")

      if (key === "from") {
        if (!val.trim()) {
          const t: OperatorToken = {
            key: "from",
            val: "",
            raw: part,
            valid: false,
            error:
              "Toán tử from: cần tên hoặc email người gửi (ví dụ: from:an)",
          }
          tokens.push(t)
          invalidTokens.push(t)
        } else {
          tokens.push({ key: "from", val, raw: part, valid: true })
          from = val
        }
      } else if (key === "to") {
        if (!val.trim()) {
          const t: OperatorToken = {
            key: "to",
            val: "",
            raw: part,
            valid: false,
            error: "Toán tử to: cần tên hoặc email người nhận (ví dụ: to:dung)",
          }
          tokens.push(t)
          invalidTokens.push(t)
        } else {
          tokens.push({ key: "to", val, raw: part, valid: true })
          to = val
        }
      } else if (key === "subject") {
        if (!val.trim()) {
          const t: OperatorToken = {
            key: "subject",
            val: "",
            raw: part,
            valid: false,
            error:
              "Toán tử subject: cần từ khóa tiêu đề (ví dụ: subject:báo cáo)",
          }
          tokens.push(t)
          invalidTokens.push(t)
        } else {
          tokens.push({ key: "subject", val, raw: part, valid: true })
          subject = val
        }
      } else if (key === "has") {
        if (val.toLowerCase() === "attachment") {
          tokens.push({ key: "has", val: "attachment", raw: part, valid: true })
          hasAttachment = true
        } else {
          const t: OperatorToken = {
            key: "has",
            val,
            raw: part,
            valid: false,
            error: "Toán tử has: chỉ hỗ trợ has:attachment",
          }
          tokens.push(t)
          invalidTokens.push(t)
        }
      } else if (key === "is") {
        if (val.toLowerCase() === "unread") {
          tokens.push({ key: "is", val: "unread", raw: part, valid: true })
          isUnread = true
        } else {
          tokens.push({ key: "is", val, raw: part, valid: true })
        }
      } else if (key === "before") {
        if (!isValidDateStr(val)) {
          const t: OperatorToken = {
            key: "before",
            val,
            raw: part,
            valid: false,
            error:
              "Toán tử before: cần ngày dạng YYYY-MM-DD (ví dụ: before:2026-11-01)",
          }
          tokens.push(t)
          invalidTokens.push(t)
        } else {
          tokens.push({ key: "before", val, raw: part, valid: true })
          const [y, m, d] = val.split("-").map(Number)
          beforeTs = new Date(y, m - 1, d, 23, 59, 59, 999).getTime()
        }
      } else if (key === "after") {
        if (!isValidDateStr(val)) {
          const t: OperatorToken = {
            key: "after",
            val,
            raw: part,
            valid: false,
            error:
              "Toán tử after: cần ngày dạng YYYY-MM-DD (ví dụ: after:2026-10-01)",
          }
          tokens.push(t)
          invalidTokens.push(t)
        } else {
          tokens.push({ key: "after", val, raw: part, valid: true })
          const [y, m, d] = val.split("-").map(Number)
          afterTs = new Date(y, m - 1, d, 0, 0, 0, 0).getTime()
        }
      } else if (key === "label") {
        if (!val.trim()) {
          const t: OperatorToken = {
            key: "label",
            val: "",
            raw: part,
            valid: false,
            error: "Toán tử label: cần tên hoặc mã nhãn (ví dụ: label:ke-toan)",
          }
          tokens.push(t)
          invalidTokens.push(t)
        } else {
          tokens.push({ key: "label", val, raw: part, valid: true })
          label = val
        }
      } else {
        freeWords.push(part)
      }
    } else {
      freeWords.push(part.replace(/^"(.*)"$/, "$1"))
    }
  }

  return {
    tokens,
    invalidTokens,
    freeText: freeWords.join(" ").trim(),
    hasAttachment,
    isUnread,
    fromMe,
    from,
    to,
    subject,
    beforeTs,
    afterTs,
    label,
  }
}

/** Trích xuất câu hoặc đoạn văn bản chứa từ khóa */
export function extractSnippetAroundKeyword(
  fullText: string,
  keyword: string,
  maxLen = 140,
): string {
  if (!keyword.trim() || !fullText) return fullText.slice(0, maxLen)
  const normText = normalizeVi(fullText)
  const normKw = normalizeVi(keyword)
  const idx = normText.indexOf(normKw)
  if (idx === -1) return fullText.slice(0, maxLen)

  const start = Math.max(0, idx - 45)
  const end = Math.min(fullText.length, idx + keyword.length + 80)
  let snippet = fullText.slice(start, end).trim()
  if (start > 0) snippet = "..." + snippet
  if (end < fullText.length) snippet = snippet + "..."
  return snippet
}

/** Tìm kiếm bên trong các tệp đính kèm của một chuỗi thư (TM-09) */
export function searchInAttachments(
  threadId: string,
  keyword: string,
): MatchedAttachmentInfo | undefined {
  if (!keyword.trim()) return undefined
  const messages = threadMessages[threadId] || []
  const normKw = normalizeVi(keyword)

  let fileIndexCount = 0
  for (const msg of messages) {
    if (!msg.attachments || msg.attachments.length === 0) continue
    for (const file of msg.attachments) {
      // 1. Kiểm tra văn bản từng trang (pageTexts)
      if (file.pageTexts && file.pageTexts.length > 0) {
        for (const pt of file.pageTexts) {
          if (normalizeVi(pt.text).includes(normKw)) {
            return {
              file,
              page: pt.page,
              snippet: extractSnippetAroundKeyword(pt.text, keyword, 120),
              fileIndex: fileIndexCount,
            }
          }
        }
      }
      // 2. Kiểm tra tên tệp khớp từ khóa
      if (normalizeVi(file.name).includes(normKw)) {
        return {
          file,
          page: 1,
          snippet: `Tệp đính kèm: ${file.name}`,
          fileIndex: fileIndexCount,
        }
      }
      fileIndexCount++
    }
  }
  return undefined
}

/** Lấy tên nhãn hoặc hộp thư gốc của thư */
export function getEmailOriginLabel(email: Email, allLabels: Label[]): string {
  if (email.labelIds && email.labelIds.length > 0) {
    const l = allLabels.find((lbl) => lbl.id === email.labelIds[0])
    if (l) return l.name
  }
  return folderName(email.folder)
}

/**
 * Thực hiện tìm kiếm trên kho emails (TM-01, TM-02, TM-04, TM-05, TM-06, TM-09).
 */
export function executeSearch({
  emails,
  allLabels,
  query,
  scope = "all",
  quick = {},
  advanced = {},
  userEmail = "dung.le@hoanglong.vn",
}: {
  emails: Email[]
  allLabels: Label[]
  query: string
  scope?: SearchScope
  quick?: QuickFilters
  advanced?: AdvancedFilters
  userEmail?: string
}): SearchResultItem[] {
  const parsed = parseSearchQuery(query)

  // Kết hợp điều kiện giữa query cú pháp và bộ lọc
  const targetFrom = (advanced.from || parsed.from || "").trim()
  const targetTo = (advanced.to || parsed.to || "").trim()
  const targetSubject = (advanced.subject || parsed.subject || "").trim()
  const hasAttachment =
    quick.hasAttachment ?? advanced.hasAttachment ?? parsed.hasAttachment
  const isUnread = quick.unread ?? parsed.isUnread
  const fromMe = quick.fromMe ?? parsed.fromMe
  const thisWeek = quick.thisWeek
  const beforeTs = parsed.beforeTs
  const afterTs = parsed.afterTs
  const labelTarget = (parsed.label || "").trim()

  const freeKeyword = (advanced.hasWords || parsed.freeText || "").trim()
  const withoutWords = (advanced.withoutWords || "").trim()

  // Xác định phạm vi (scope)
  const effectiveScope = advanced.searchIn || scope || "all"

  const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000

  const results: SearchResultItem[] = []

  for (const email of emails) {
    // 1. Lọc theo phạm vi (Scope / SearchIn)
    // Quy tắc: bỏ qua Thùng rác (trash) và Spam (spam) trừ khi phạm vi chọn đúng chúng
    if (effectiveScope === "all") {
      if (email.folder === "trash" || email.folder === "spam") continue
    } else if (effectiveScope === "inbox") {
      if (email.folder !== "inbox") continue
    } else if (effectiveScope === "sent") {
      if (email.folder !== "sent") continue
    } else if (effectiveScope === "drafts") {
      if (email.folder !== "drafts") continue
    } else if (effectiveScope === "trash") {
      if (email.folder !== "trash") continue
    } else if (effectiveScope === "spam") {
      if (email.folder !== "spam") continue
    } else if (effectiveScope.startsWith("label:")) {
      const lid = effectiveScope.replace("label:", "")
      if (!email.labelIds.includes(lid)) continue
    }

    // 2. Lọc nhanh
    if (hasAttachment && !email.hasAttachment) continue
    if (isUnread && !email.unread) continue
    if (thisWeek && email.ts < oneWeekAgo) continue
    if (
      fromMe &&
      !email.from.toLowerCase().includes(userEmail.toLowerCase()) &&
      !email.from.toLowerCase().includes("lê hoàng dũng")
    ) {
      continue
    }

    // 3. Lọc nâng cao: Kích thước
    if (advanced.sizeMb && advanced.sizeMb > 0) {
      const bytesLimit = advanced.sizeMb * 1024 * 1024
      const estSize =
        email.preview.length + (email.hasAttachment ? 1_500_000 : 10_000)
      if (advanced.sizeOp === "lt" && estSize >= bytesLimit) continue
      if (advanced.sizeOp === "gt" && estSize <= bytesLimit) continue
    }

    // 4. Lọc nâng cao: Khoảng ngày
    if (advanced.dateFrom && isValidDateStr(advanced.dateFrom)) {
      const fromD = new Date(advanced.dateFrom).getTime()
      if (email.ts < fromD) continue
    }
    if (advanced.dateTo && isValidDateStr(advanced.dateTo)) {
      const [y, m, d] = advanced.dateTo.split("-").map(Number)
      const toD = new Date(y, m - 1, d, 23, 59, 59, 999).getTime()
      if (email.ts > toD) continue
    }

    // 5. Toán tử before: và after:
    if (beforeTs && email.ts > beforeTs) continue
    if (afterTs && email.ts < afterTs) continue

    // 6. Toán tử label:
    if (labelTarget) {
      const normLbl = normalizeVi(labelTarget)
      const hasMatchLabel = email.labelIds.some((id) => {
        const lbl = allLabels.find((l) => l.id === id)
        return (
          id.toLowerCase().includes(normLbl) ||
          (lbl && normalizeVi(lbl.name).includes(normLbl))
        )
      })
      if (!hasMatchLabel) continue
    }

    // 7. Người gửi (From)
    if (targetFrom) {
      const normFrom = normalizeVi(targetFrom)
      const emailFrom = normalizeVi(email.from)
      if (!emailFrom.includes(normFrom)) continue
    }

    // 8. Người nhận (To)
    if (targetTo) {
      const normTo = normalizeVi(targetTo)
      const toStr = normalizeVi(
        (email.to || []).join(" ") + " " + (email.sentTo || []).join(" "),
      )
      if (!toStr.includes(normTo)) continue
    }

    // 9. Tiêu đề (Subject)
    if (targetSubject) {
      const normSubj = normalizeVi(targetSubject)
      const emailSubj = normalizeVi(email.subject)
      if (!emailSubj.includes(normSubj)) continue
    }

    // 10. Không có các từ (Without words)
    if (withoutWords) {
      const normWithout = normalizeVi(withoutWords)
      const allText = normalizeVi(
        `${email.subject} ${email.from} ${email.preview}`,
      )
      if (allText.includes(normWithout)) continue
    }

    // 11. Từ khóa tự do (Keyword search: TM-01 & TM-09)
    let relevanceScore = 0
    let matchedInSubject = false
    let matchedInSender = false
    let previewSnippet: string | undefined = undefined
    let matchedAttachment: MatchedAttachmentInfo | undefined = undefined

    if (freeKeyword) {
      const normKw = normalizeVi(freeKeyword)
      const normSubj = normalizeVi(email.subject)
      const normFrom = normalizeVi(email.from)
      const normPrev = normalizeVi(email.preview)

      if (normSubj.includes(normKw)) {
        relevanceScore += 10
        matchedInSubject = true
      }
      if (normFrom.includes(normKw)) {
        relevanceScore += 5
        matchedInSender = true
      }
      if (normPrev.includes(normKw)) {
        relevanceScore += 3
        previewSnippet = extractSnippetAroundKeyword(email.preview, freeKeyword)
      }

      // Kiểm tra trong tệp đính kèm (TM-09)
      if (email.hasAttachment) {
        const attMatch = searchInAttachments(email.threadId, freeKeyword)
        if (attMatch) {
          relevanceScore += 8
          matchedAttachment = attMatch
        }
      }

      // Nếu không khớp ở đâu thì bỏ qua
      if (relevanceScore === 0) continue
    } else {
      // Không có từ khóa tự do: mọi thư thỏa mãn các bộ lọc khác đều được đưa vào
      relevanceScore = 1
    }

    results.push({
      email,
      originLabel: getEmailOriginLabel(email, allLabels),
      relevanceScore,
      previewSnippet: previewSnippet || email.preview,
      matchedAttachment,
      matchedInSubject,
      matchedInSender,
    })
  }

  return results
}
