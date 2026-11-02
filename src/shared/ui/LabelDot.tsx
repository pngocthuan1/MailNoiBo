export function labelColor(index: number) {
  return `var(--label-${((index - 1) % 8) + 1})`
}

export function LabelDot({ color, size = 10 }: { color: number; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: labelColor(color) }}
      aria-hidden
    />
  )
}
