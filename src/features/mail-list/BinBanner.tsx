import { Button } from "@/shared/ui/Button"

/** Dải đầu danh sách Spam / Thùng rác: tự xóa sau 30 ngày, nút Dọn ngay (HT-05). */
export function BinBanner({
  name,
  onEmpty,
  disabled,
}: {
  name: string
  onEmpty: () => void
  disabled: boolean
}) {
  return (
    <div className="mx-4 mb-2 flex items-center gap-3 rounded-lg bg-surface-2 px-4 py-2">
      <p className="flex-1">Thư trong {name} tự xóa sau 30 ngày.</p>
      <Button variant="text" disabled={disabled} onClick={onEmpty}>
        Dọn ngay
      </Button>
    </div>
  )
}
