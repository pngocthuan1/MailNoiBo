import type { ComposeAttachment } from "@/mock-data"
import { composeFileKind } from "@/shared/state/mailStore"
import { setComposeDemo, useComposeDemoStore } from "./composeDemoStore"

export const MAX_FILE_SIZE = 25 * 1024 * 1024

/** Tạo thẻ tệp đính kèm: tệp quá 25 MB lỗi ngay, các tệp khác sẽ được mô phỏng tải lên. */
export function buildAttachments(
  files: { name: string size: number }[],
): ComposeAttachment[] {
  let failNext = useComposeDemoStore.getState().uploadError
  return files.map((f, i) => {
    const tooBig = f.size > MAX_FILE_SIZE
    const willFail = !tooBig && failNext
    if (willFail) {
      failNext = false
      setComposeDemo({ uploadError: false })
    }
    return {
      id: `att-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      size: f.size,
      kind: composeFileKind(f.name),
      progress: 0,
      status: tooBig ? "error" : "uploading",
      error: tooBig ? "Tệp vượt quá giới hạn 25 MB" : undefined,
      willFail,
    }
  })
}
