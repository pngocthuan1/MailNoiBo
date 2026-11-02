import { company } from '@/mock-data'

export function Logo({ showName = true }: { showName?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-on-accent">
        HL
      </span>
      {showName && <span className="hidden text-lg font-semibold whitespace-nowrap sm:inline">{company.appName}</span>}
    </span>
  )
}
