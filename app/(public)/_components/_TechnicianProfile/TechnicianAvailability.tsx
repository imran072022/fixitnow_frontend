import { CalendarDays, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AvailabilitySlot } from "../../_types/technicians";

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const minutesTo12HourTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
};

const formatDayName = (day: string) =>
  day.charAt(0) + day.slice(1).toLowerCase();

const groupSlotsByDay = (slots: AvailabilitySlot[]) => {
  const grouped: Record<string, AvailabilitySlot[]> = {};

  for (const slot of slots) {
    if (!grouped[slot.dayOfWeek]) {
      grouped[slot.dayOfWeek] = [];
    }

    grouped[slot.dayOfWeek].push(slot);
  }

  return grouped;
};

type TechnicianAvailabilityProps = {
  slots: AvailabilitySlot[];
};

export function TechnicianAvailability({ slots }: TechnicianAvailabilityProps) {
  const groupedSlots = groupSlotsByDay(slots);

  const sortedDays = DAY_ORDER.filter((day) => groupedSlots[day]);

  return (
    <Card className="sticky top-6 border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
          </div>

          <CardTitle className="text-lg font-semibold">Availability</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {sortedDays.length > 0 ? (
          <div className="flex flex-col gap-4">
            {sortedDays.map((day) => (
              <div key={day}>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Clock
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {formatDayName(day)}
                  </span>
                </div>

                <div className="ml-5 flex flex-col gap-1.5 border-l-2 border-primary/20 pl-4">
                  {groupedSlots[day].map((slot) => (
                    <div
                      key={slot.id}
                      className="text-sm font-medium text-foreground"
                    >
                      <span className="font-mono text-sm">
                        {minutesTo12HourTime(slot.startMinute)}
                      </span>

                      <span className="mx-1.5 text-muted-foreground">–</span>

                      <span className="font-mono text-sm">
                        {minutesTo12HourTime(slot.endMinute)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No availability schedule set.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
