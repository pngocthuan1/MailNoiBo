import type { Email, Message } from "@/mock-data"
import { downloadText } from "./fileUtils"
import { plainText } from "./getMessages"

/** Tải về dạng .eml (DT-09): xuất toàn bộ các thư của chuỗi. */
export function downloadEml(email: Email, messages: Message[]) {
  const body = messages
    .map((m) =>
      [
        `From: ${m.from.name} <${m.from.email}>`,
        `To: ${m.to.map((p) => `${p.name} <${p.email}>`).join(", ")}`,
        m.cc?.length
          ? `Cc: ${m.cc.map((p) => `${p.name} <${p.email}>`).join(", ")}`
          : "",
        `Subject: ${email.subject}`,
        `Date: ${new Date(m.ts).toUTCString()}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=utf-8",
        "",
        plainText(m.html),
        "",
      ]
        .filter((l, i) => l !== "" || i > 5)
        .join("\r\n"),
    )
    .join("\r\n\r\n")
  downloadText(`${email.threadId}.eml`, body, "message/rfc822")
}
