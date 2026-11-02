import type { ButtonHTMLAttributes, ReactNode } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
}

/** Nút biểu tượng, vùng bấm tối thiểu 32px. */
export function IconButton({
  label,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-hover hover:text-fg ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
