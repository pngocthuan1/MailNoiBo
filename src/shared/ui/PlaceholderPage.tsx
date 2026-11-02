export function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-xl font-semibold">{name}</h1>
      <p className="text-muted">Trang này sẽ được xây dựng ở bước sau.</p>
    </div>
  )
}
