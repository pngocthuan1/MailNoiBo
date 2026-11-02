import { useState } from "react"
import { MoreVertical, PenTool, Lock } from "lucide-react"
import { Popover } from "@/shared/ui/Popover"
import { useSignatureStore } from "./signatureStore"

type Props = {
  activeSigId: string | null | undefined
  onSelectSignature: (sigId: string | null) => void
  onOpenSignatureManager: () => void
  onOpenConfidential: () => void
}

/** Menu ba chấm trong thanh công cụ dưới của cửa sổ soạn (SO-09, SO-12) */
export function ComposeMoreMenu({
  activeSigId,
  onSelectSignature,
  onOpenSignatureManager,
  onOpenConfidential,
}: Props) {
  const { signatures } = useSignatureStore()
  const [showSigSubmenu, setShowSigSubmenu] = useState(true)

  return (
    <Popover
      align="right"
      up
      className="w-56 py-1"
      trigger={({ toggle }) => (
        <button
          type="button"
          title="Tùy chọn khác"
          aria-label="Tùy chọn khác"
          onClick={toggle}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-hover hover:text-fg"
        >
          <MoreVertical size={17} />
        </button>
      )}
    >
      {(close) => (
        <div>
          {/* Chữ ký */}
          <div>
            <button
              type="button"
              onClick={() => setShowSigSubmenu((v) => !v)}
              className="flex h-9 w-full cursor-pointer items-center justify-between px-3 text-sm hover:bg-hover"
            >
              <span className="flex items-center gap-2">
                <PenTool size={15} className="text-muted" /> Chữ ký
              </span>
              <span className="text-xs text-muted">▶</span>
            </button>
            {showSigSubmenu && (
              <div className="bg-surface-2 py-1 border-y border-line">
                <button
                  type="button"
                  onClick={() => {
                    onSelectSignature(null)
                    close()
                  }}
                  className={`flex h-8 w-full cursor-pointer items-center px-6 text-xs hover:bg-hover ${
                    activeSigId === null ? "font-semibold text-accent" : ""
                  }`}
                >
                  Không dùng chữ ký
                </button>
                {signatures.map((sig) => (
                  <button
                    key={sig.id}
                    type="button"
                    onClick={() => {
                      onSelectSignature(sig.id)
                      close()
                    }}
                    className={`flex h-8 w-full cursor-pointer items-center px-6 text-xs hover:bg-hover ${
                      activeSigId === sig.id ? "font-semibold text-accent" : ""
                    }`}
                  >
                    {sig.name}
                  </button>
                ))}
                <div className="border-t border-line mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSignatureManager()
                      close()
                    }}
                    className="flex h-8 w-full cursor-pointer items-center px-6 text-xs text-accent hover:bg-hover"
                  >
                    Quản lý chữ ký
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chế độ bảo mật */}
          <button
            type="button"
            onClick={() => {
              onOpenConfidential()
              close()
            }}
            className="flex h-9 w-full cursor-pointer items-center gap-2 px-3 text-sm hover:bg-hover"
          >
            <Lock size={15} className="text-muted" /> Chế độ bảo mật
          </button>
        </div>
      )}
    </Popover>
  )
}
