import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'text' | 'danger'
}

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  ghost: 'border border-line text-fg hover:bg-hover',
  text: 'text-accent hover:bg-accent-soft',
  danger: 'bg-danger text-white hover:opacity-90',
}

export function Button({ variant = 'primary', className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    />
  )
}
