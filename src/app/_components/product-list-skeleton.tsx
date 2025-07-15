import { Skeleton } from "~/components/ui/skeleton"

type ProductListSkeletonProps = {
  className?: string
  itemCount?: number
  viewMode?: "grid" | "list"
} & React.HTMLAttributes<HTMLDivElement>

export function ProductListSkeleton({
  className,
  itemCount = 8,
  viewMode = "grid",
  ...props
}: ProductListSkeletonProps) {
  return (
    <div className={` w-full px-10 space-y-6 ${className ?? ""}`} {...props}>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-6 w-px" />
          <div className="hidden md:flex items-center border rounded-md">
            <Skeleton className="h-8 w-8 rounded-l-md rounded-r-none" />
            <Skeleton className="h-8 w-8 rounded-r-md rounded-l-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="flex items-center justify-between text-sm">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-4"
      }>
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className={
            viewMode === "grid"
              ? "space-y-3"
              : "flex gap-4 p-4 border rounded-lg"
          }>
            {viewMode === "grid" ? (
              <>
                <Skeleton className="aspect-square w-full rounded-md" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
