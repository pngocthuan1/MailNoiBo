import type { Attachment } from "@/mock-data"

export function formatSize(bytes: number) {
  if (bytes >= 1_000_000)
    return `${(bytes / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} MB`
  return `${Math.max(1, Math.round(bytes / 1000))} KB`
}

/** Cắt giữa tên tệp, giữ lại phần đầu và đuôi mở rộng. */
export function middleTruncate(name: string, max = 30) {
  if (name.length <= max) return name
  const keepEnd = 12
  return `${name.slice(0, max - keepEnd - 1)}…${name.slice(-keepEnd)}`
}

export function formatDateTime(ts: number) {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, "0")
  return `${p(d.getHours())}:${p(d.getMinutes())}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

/** Ảnh minh họa dạng SVG (không cần mạng) cho tệp ảnh đính kèm. */
export function mockImageUrl(name: string) {
  const bars = [60, 95, 80, 140, 120, 175, 150]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
<rect width="800" height="500" fill="#f4f7fb"/>
<text x="40" y="56" font-family="Inter,Arial" font-size="26" font-weight="700" fill="#1f2430">So sánh chi phí bảo trì 3 năm</text>
<text x="40" y="86" font-family="Inter,Arial" font-size="15" fill="#5f6877">${name.replace(/&/g, "")}</text>
${bars.map((h, i) => `<rect x="${70 + i * 100}" y="${440 - h * 1.8}" width="60" height="${h * 1.8}" rx="6" fill="${i % 2 ? "#1a73e8" : "#8ab4f8"}"/><text x="${100 + i * 100}" y="468" text-anchor="middle" font-family="Inter,Arial" font-size="14" fill="#5f6877">Q${(i % 4) + 1}</text>`).join("")}
<line x1="50" y1="440" x2="770" y2="440" stroke="#c9d1dc" stroke-width="2"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function downloadText(
  filename: string,
  content: string,
  mime = "text/plain",
) {
  const url = URL.createObjectURL(
    new Blob([content], { type: `${mime};charset=utf-8` }),
  )
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadAttachment(att: Attachment) {
  if (att.blocked) return
  if (att.kind === "image") {
    const a = document.createElement("a")
    a.href = mockImageUrl(att.name)
    a.download = att.name.replace(/\.png$/, ".svg")
    a.click()
    return
  }
  downloadText(
    att.name,
    `Tệp mô phỏng của bản demo: ${att.name}\n`,
    "application/octet-stream",
  )
}
