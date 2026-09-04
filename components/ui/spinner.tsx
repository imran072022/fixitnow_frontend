import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-5 lg:size-6 animate-spin", className)}
      {...props}
    />
  );
}

export function SpinnerCustom() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
}
