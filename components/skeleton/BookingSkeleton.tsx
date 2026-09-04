import { Skeleton } from "@/components/ui/skeleton";

export function BookingSkeleton() {
  return (
    <div className="w-full py-42 px-4">
      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="space-y-5 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Skeleton className=" h-5 w-28" />
              <Skeleton className=" h-5 w-28" />
            </div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-60" />
            <Skeleton className="h-5 w-24 " />
            <Skeleton className="h-5 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
