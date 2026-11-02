import { Dialog } from '@/shared/ui/Dialog'

const groups = [
  {
    title: 'Điều hướng',
    items: [
      { keys: ['j'], text: 'Thư kế tiếp' },
      { keys: ['k'], text: 'Thư trước đó' },
      { keys: ['Enter'], text: 'Mở thư đang chọn' },
      { keys: ['u'], text: 'Quay lại danh sách' },
      { keys: ['/'], text: 'Chuyển tới ô tìm kiếm' },
      { keys: ['?'], text: 'Xem danh sách phím tắt' },
    ],
  },
  {
    title: 'Thao tác thư',
    items: [
      { keys: ['e'], text: 'Lưu trữ' },
      { keys: ['#'], text: 'Xóa' },
      { keys: ['s'], text: 'Gắn sao hoặc bỏ gắn sao' },
    ],
  },
  {
    title: 'Soạn thư',
    items: [
      { keys: ['c'], text: 'Soạn thư mới' },
      { keys: ['r'], text: 'Trả lời (trong thư đang đọc)' },
      { keys: ['a'], text: 'Trả lời tất cả' },
      { keys: ['f'], text: 'Chuyển tiếp' },
    ],
  },
]

export function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog title="Phím tắt" onClose={onClose} width={480}>
      <div className="space-y-4">
        {groups.map((g) => (
          <section key={g.title}>
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">{g.title}</h3>
            <ul>
              {g.items.map((i) => (
                <li key={i.text} className="flex h-9 items-center justify-between border-b border-line last:border-0">
                  <span>{i.text}</span>
                  <span className="flex gap-1">
                    {i.keys.map((k) => (
                      <kbd
                        key={k}
                        className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-line bg-surface-2 px-2 font-mono text-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Dialog>
  )
}
