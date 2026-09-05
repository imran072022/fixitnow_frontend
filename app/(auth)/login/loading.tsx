import { SpinnerCustom } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <SpinnerCustom />
    </div>
  );
}
