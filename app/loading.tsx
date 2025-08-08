import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50" aria-busy="true" aria-live="polite">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <Skeleton className="h-5 w-56" />
          </div>
          <div className="p-6 space-y-6">
            {/* Search bar row */}
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-28" />
            </div>

            {/* Tabs and selects */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-24 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
