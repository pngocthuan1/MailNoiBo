import { useCallback } from "react"
import { type Email } from "@/mock-data"
import { useSnackbar } from "@/shared/ui/Snackbar"
import { futureTime } from "./mailFormat"
import {
  addLabel,
  removeLabel,
  patchEmails,
  removeEmails,
  restoreEmails,
  useAllLabels,
} from "@/shared/state/mailStore"

const plural = (n: number) => (n === 1 ? "1 thư" : `${n} thư`)

/** Các thao tác thư; mọi thao tác đều hiện thanh thông báo ngắn kèm Hoàn tác (HT-06). */
export function useMailActions() {
  const snackbar = useSnackbar()
  const labels = useAllLabels()

  const run = useCallback(
    (message: string, snapshot: Email[]) => {
      snackbar.show({
        message,
        actionLabel: "Hoàn tác",
        onAction: () => restoreEmails(snapshot),
      })
    },
    [snackbar],
  )

  return {
    archive: (ids: string[]) =>
      run(
        `Đã lưu trữ ${plural(ids.length)}`,
        patchEmails(ids, () => ({ archived: true, snoozedUntil: undefined })),
      ),
    remove: (ids: string[]) =>
      run(
        `Đã chuyển ${plural(ids.length)} vào Thùng rác`,
        patchEmails(ids, (e) => ({
          folder: "trash",
          prevFolder: e.folder,
          snoozedUntil: undefined,
        })),
      ),
    spam: (ids: string[]) =>
      run(
        `Đã báo cáo ${plural(ids.length)} là spam`,
        patchEmails(ids, (e) => ({ folder: "spam", prevFolder: e.folder })),
      ),
    restore: (ids: string[]) =>
      run(
        `Đã khôi phục ${plural(ids.length)}`,
        patchEmails(ids, (e) => ({
          folder: e.prevFolder ?? "inbox",
          prevFolder: undefined,
        })),
      ),
    deleteForever: (ids: string[]) =>
      run(`Đã xóa vĩnh viễn ${plural(ids.length)}`, removeEmails(ids)),
    markRead: (ids: string[], read: boolean) =>
      run(
        read
          ? `Đã đánh dấu ${plural(ids.length)} là đã đọc`
          : `Đã đánh dấu ${plural(ids.length)} là chưa đọc`,
        patchEmails(ids, () => ({ unread: !read })),
      ),
    snooze: (ids: string[], ts: number) =>
      run(
        `Đã hoãn ${plural(ids.length)} đến ${futureTime(ts)}`,
        patchEmails(ids, () => ({ snoozedUntil: ts })),
      ),
    unsnooze: (ids: string[]) =>
      run(
        `Đã bỏ hoãn ${plural(ids.length)}`,
        patchEmails(ids, () => ({ snoozedUntil: undefined })),
      ),
    reschedule: (ids: string[], ts: number) =>
      run(
        `Đã đổi giờ gửi sang ${futureTime(ts)}`,
        patchEmails(ids, () => ({ scheduledAt: ts })),
      ),
    cancelSchedule: (ids: string[]) =>
      run(
        "Đã hủy lịch gửi, thư được chuyển về Nháp",
        patchEmails(ids, () => ({ folder: "drafts", scheduledAt: undefined })),
      ),
    markTodoDone: (ids: string[]) =>
      run(
        `Đã hoàn thành ${plural(ids.length)} cần xử lý`,
        patchEmails(ids, () => ({ todoDue: undefined })),
      ),
    toggleStar: (ids: string[], starred: boolean) =>
      run(
        starred ? "Đã gắn sao" : "Đã bỏ gắn sao",
        patchEmails(ids, () => ({ starred })),
      ),
    toggleImportant: (ids: string[], important: boolean) =>
      run(
        important ? "Đã đánh dấu quan trọng" : "Đã bỏ đánh dấu quan trọng",
        patchEmails(ids, () => ({ important, importantSuggested: false })),
      ),
    /** Gắn hoặc gỡ một nhãn cho nhiều thư (NH-02, HT-12). */
    setLabel: (ids: string[], labelId: string, on: boolean) => {
      const name = labels.find((l) => l.id === labelId)?.name ?? ""
      run(
        on
          ? `Đã gắn nhãn "${name}" cho ${plural(ids.length)}`
          : `Đã gỡ nhãn "${name}" khỏi ${plural(ids.length)}`,
        patchEmails(ids, (e) => ({
          labelIds: on
            ? e.labelIds.includes(labelId)
              ? e.labelIds
              : [...e.labelIds, labelId]
            : e.labelIds.filter((l) => l !== labelId),
        })),
      )
    },
    createLabelAndApply: (ids: string[], name: string) => {
      const label = addLabel(name)
      const snapshot = patchEmails(ids, (e) => ({
        labelIds: [...e.labelIds, label.id],
      }))
      snackbar.show({
        message: `Đã tạo nhãn "${label.name}" và gắn cho ${plural(ids.length)}`,
        actionLabel: "Hoàn tác",
        onAction: () => {
          restoreEmails(snapshot)
          removeLabel(label.id)
        },
      })
    },
    assign: (
      ids: string[],
      assigneeId: string | undefined,
      assigneeName?: string,
    ) =>
      run(
        assigneeId
          ? `Đã giao ${plural(ids.length)} cho ${assigneeName}`
          : `Đã bỏ giao ${plural(ids.length)}`,
        patchEmails(ids, () => ({ assigneeId })),
      ),
    mute: (ids: string[], muted: boolean) =>
      run(
        muted ? "Đã tắt tiếng chuỗi thư" : "Đã bỏ tắt tiếng",
        patchEmails(ids, () => ({ muted })),
      ),
    setFollowUp: (ids: string[], ts: number | undefined) =>
      run(
        ts ? "Đã đặt hạn xử lý" : "Đã bỏ hạn xử lý",
        patchEmails(ids, () => ({ todoDue: ts })),
      ),
  }
}
