import { CalendarDaysIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AvailabilitySlotCard } from "./AvailabilitySlotCard";
import type { AvailabilitySlot } from "../_types/availability";

export function MyAvailability({ slots }: { slots: AvailabilitySlot[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">My availability</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the hours customers can book you.
        </p>
      </div>
      {slots.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {slots.map((slot) => (
            <AvailabilitySlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <CalendarDaysIcon className="size-8 text-muted-foreground" />
            <p className="font-medium">No availability slots yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first slot above.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
