import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilitySlotModal } from "../_modals/AvailabilitySlotModal";
import type { AvailabilitySlot, DayOfWeek } from "../_types/availability";

const dayLabels: Record<DayOfWeek, string> = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
};

function formatMinute(minute: number) {
  const hour = Math.floor(minute / 60);
  return `${hour % 12 || 12}:${String(minute % 60).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

export function AvailabilitySlotCard({ slot }: { slot: AvailabilitySlot }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{dayLabels[slot.dayOfWeek]}</CardTitle>
        <AvailabilitySlotModal
          slot={slot}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Update ${dayLabels[slot.dayOfWeek]} availability`}
            >
              <PencilIcon />
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {formatMinute(slot.startMinute)} - {formatMinute(slot.endMinute)}
        </p>
      </CardContent>
    </Card>
  );
}
