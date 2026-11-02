import { Image } from "lucide-react"
import { useRef } from "react"

type Props = { onInsert: (dataUrl: string) => void }

/** Nút chèn ảnh inline vào editor (SO-11) */
export function ImageInserter({ onInsert }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (dataUrl) onInsert(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <button
        type="button"
        title="Chèn ảnh"
        aria-label="Chèn ảnh"
        onClick={() => fileInput.current?.click()}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
      >
        <Image size={17} />
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </>
  )
}
