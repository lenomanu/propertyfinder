export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form skeleton */}
      <div className="space-y-5 rounded-lg border p-5">
        <div>
          <h2 className="text-lg font-semibold"></h2>
          <p className="text-sm text-muted-foreground">
          </p>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ))}
        <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}