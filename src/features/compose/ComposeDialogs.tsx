import { Button } from "@/shared/ui/Button"
import { Dialog } from "@/shared/ui/Dialog"

export type ComposeDialogType = "no-recipient" | "invalid" | "uploading" | "upload-error" | "no-subject" | "forgot-attachment" | "confirm-close" | "confirm-delete"

type Props = {
  type: ComposeDialogType
  invalidList: string[]
  onDismiss: () => void
  onSendAnyway: () => void
  onSaveClose: () => void
  onDiscard: () => void
  onDelete: () => void
}

/** Các hộp thoại xác nhận của cửa sổ soạn thư. */
export function ComposeDialogs({
  type,
  invalidList,
  onDismiss,
  onSendAnyway,
  onSaveClose,
  onDiscard,
  onDelete,
}: Props) {
  switch (type) {
    case "no-recipient":
      return (
        <Dialog
          title="Thiếu người nhận"
          onClose={onDismiss}
          footer={<Button onClick={onDismiss}>Đóng</Button>}
        >
          <p className="text-sm">Hãy thêm ít nhất một người nhận</p>
        </Dialog>
      )
    case "invalid":
      return (
        <Dialog
          title="Địa chỉ không hợp lệ"
          onClose={onDismiss}
          footer={<Button onClick={onDismiss}>Đóng</Button>}
        >
          <p className="text-sm">
            Hãy sửa hoặc xóa các địa chỉ không hợp lệ: {invalidList.join(", ")}.
          </p>
        </Dialog>
      )
    case "uploading":
      return (
        <Dialog
          title="Đang tải tệp lên"
          onClose={onDismiss}
          footer={<Button onClick={onDismiss}>Đóng</Button>}
        >
          <p className="text-sm">
            Vui lòng đợi các tệp tải lên xong trước khi gửi.
          </p>
        </Dialog>
      )
    case "upload-error":
      return (
        <Dialog
          title="Có tệp bị lỗi"
          onClose={onDismiss}
          footer={<Button onClick={onDismiss}>Đóng</Button>}
        >
          <p className="text-sm">
            Hãy thử tải lại hoặc xóa các tệp bị lỗi trước khi gửi.
          </p>
        </Dialog>
      )
    case "no-subject":
      return (
        <Dialog
          title="Gửi thư không có tiêu đề?"
          onClose={onDismiss}
          footer={
            <>
              <Button variant="ghost" onClick={onDismiss}>
                Quay lại
              </Button>
              <Button onClick={onSendAnyway}>Gửi vẫn</Button>
            </>
          }
        >
          <p className="text-sm">Thư này chưa có tiêu đề. Bạn vẫn muốn gửi?</p>
        </Dialog>
      )
    case "forgot-attachment":
      return (
        <Dialog
          title="Bạn quên đính kèm tệp?"
          onClose={onDismiss}
          footer={
            <>
              <Button variant="ghost" onClick={onDismiss}>
                Quay lại
              </Button>
              <Button onClick={onSendAnyway}>Gửi vẫn</Button>
            </>
          }
        >
          <p className="text-sm">
            Nội dung thư có nhắc đến tệp đính kèm nhưng chưa có tệp nào được
            đính kèm.
          </p>
        </Dialog>
      )
    case "confirm-close":
      return (
        <Dialog
          title="Đóng thư đang soạn?"
          onClose={onDismiss}
          footer={
            <>
              <Button variant="text" onClick={onDismiss}>
                Tiếp tục soạn
              </Button>
              <Button variant="ghost" onClick={onDiscard}>
                Không lưu
              </Button>
              <Button onClick={onSaveClose}>Lưu nháp và đóng</Button>
            </>
          }
          width={460}
        >
          <p className="text-sm">
            Thư có thay đổi chưa được lưu. Bạn muốn làm gì?
          </p>
        </Dialog>
      )
    case "confirm-delete":
      return (
        <Dialog
          title="Xóa nháp này?"
          onClose={onDismiss}
          footer={
            <>
              <Button variant="ghost" onClick={onDismiss}>
                Hủy
              </Button>
              <Button variant="danger" onClick={onDelete}>
                Xóa nháp
              </Button>
            </>
          }
        >
          <p className="text-sm">
            Thư nháp sẽ bị xóa và không thể khôi phục từ cửa sổ này.
          </p>
        </Dialog>
      )
  }
}
