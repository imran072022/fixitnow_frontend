import { Skeleton } from "@/components/ui/skeleton";

export function ListingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full py-42 px-4 ">
        {/* Search */}
        <Skeleton className="h-12 w-full rounded-md" />

        {/* Filters + Sort */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Mobile: Filter + Sort buttons */}
          <div className="flex w-full gap-3 md:hidden">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 flex-1 rounded-md" />
          </div>

          {/* Desktop: 3 Filters */}
          <div className="hidden gap-3 md:flex">
            <Skeleton className="h-9 w-44 rounded-md" />
            <Skeleton className="h-9 w-44 rounded-md" />
            <Skeleton className="h-9 w-44 rounded-md" />
          </div>

          {/* Desktop: Sort */}
          <Skeleton className="hidden h-9 w-44 rounded-md md:block" />
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border p-4 bg-white"
            >
              {/* Image */}
              <Skeleton className="h-36 w-full rounded-md" />

              {/* Title */}
              <Skeleton className="h-5 w-3/4" />

              {/* Description */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />

              {/* Bottom */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 md:h-9 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
