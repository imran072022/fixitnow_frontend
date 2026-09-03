import { Button } from "@/components/ui/button";
import { AvailabilitySlotModal } from "../../_modals/AvailabilitySlotModal";
import { MyAvailability } from "../../_components/MyAvailability";
import { getMyAvailability } from "../../_data/availability.server";

export default async function AvailabilitySlots() {
  const slots = await getMyAvailability();

  return (
    <main className="mx-auto w-full max-w-5xl space-y-10 px-4 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Availability</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set the days and hours when you are available for appointments.
          </p>
        </div>
        <AvailabilitySlotModal trigger={<Button>Create availability</Button>} />
      </header>

      <MyAvailability slots={slots} />
    </main>
  );
}
