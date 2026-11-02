import { EmptyIllustration, type EmptyKind } from "./EmptyIllustration"

const messages: Record<EmptyKind, string> = {
  inbox: "Hộp thư trống, bạn đã xử lý hết",
  starred: "Chưa có thư nào được gắn sao",
  snoozed: "Chưa có thư nào được hoãn",
  important: "Chưa có thư quan trọng nào",
  sent: "Bạn chưa gửi thư nào",
  drafts: "Không có thư nháp nào",
  scheduled: "Chưa có thư nào được lên lịch gửi",
  todo: "Không còn việc nào cần xử lý, tuyệt vời",
  spam: "Không có thư spam nào",
  trash: "Thùng rác trống",
  label: "Chưa có thư nào với nhãn này",
  shared: "Hộp thư dùng chung này chưa có thư",
}

/** Trạng thái trống: mỗi hộp thư có hình minh họa và một câu riêng. */
export function MailEmptyState({ kind }: { kind: EmptyKind }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <EmptyIllustration kind={kind} />
      <p className="text-base font-medium">{messages[kind]}</p>
    </div>
  )
}
