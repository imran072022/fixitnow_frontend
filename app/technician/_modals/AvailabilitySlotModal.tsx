"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAvailability,
  updateAvailability,
} from "../_data/availability.client";
import {
  availabilityDays,
  type AvailabilitySlot,
  type DayOfWeek,
} from "../_types/availability";
import {
  availabilitySchema,
  type AvailabilityFormValues,
} from "../_zodSchema/availability";

const timeOptions = Array.from({ length: 49 }, (_, index) => {
  const minute = index * 30;
  const hour = Math.floor(minute / 60);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return {
    value: minute,
    label: `${displayHour}:${String(minute % 60).padStart(2, "0")} ${period}`,
  };
});

const dayLabels: Record<DayOfWeek, string> = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
};

type AvailabilitySlotModalProps = {
  slot?: AvailabilitySlot;
  trigger?: ReactElement;
  onSaved?: () => void;
};

export function AvailabilitySlotModal({
  slot,
  trigger,
  onSaved,
}: AvailabilitySlotModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEditing = Boolean(slot);
  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      dayOfWeek: slot?.dayOfWeek ?? "MONDAY",
      startMinute: slot?.startMinute ?? 540,
      endMinute: slot?.endMinute ?? 1020,
    },
  });

  const dayOfWeek = form.watch("dayOfWeek");
  const startMinute = form.watch("startMinute");
  const endMinute = form.watch("endMinute");

  async function onSubmit(values: AvailabilityFormValues) {
    try {
      if (slot) {
        await updateAvailability(slot.id, values);
      } else {
        await createAvailability(values);
      }
      toast.success(
        isEditing ? "Availability updated." : "Availability created.",
      );
      setOpen(false);
      router.refresh();
      onSaved?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save availability.",
      );
    }
  }

  function onInvalid(errors: typeof form.formState.errors) {
    const firstError = Object.values(errors)[0]?.message;
    toast.error(
      firstError
        ? String(firstError)
        : "Please correct the highlighted fields.",
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? <Button>Create availability</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update availability" : "Create availability"}
          </DialogTitle>
          <DialogDescription>
            Set the hours when you are available for appointments.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-5"
        >
          <FieldError message={form.formState.errors.dayOfWeek?.message} />
          <label className="grid gap-2 text-sm font-medium">
            Day
            <Select
              value={dayOfWeek}
              onValueChange={(value) =>
                form.setValue("dayOfWeek", (value ?? "MONDAY") as DayOfWeek, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>{dayLabels[dayOfWeek]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availabilityDays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {dayLabels[day]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <TimeField
              label="Start time"
              value={startMinute}
              onChange={(value) =>
                form.setValue("startMinute", value, { shouldValidate: true })
              }
            />
            <TimeField
              label="End time"
              value={endMinute}
              onChange={(value) =>
                form.setValue("endMinute", value, { shouldValidate: true })
              }
            />
          </div>
          <FieldError message={form.formState.errors.endMinute?.message} />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update slot"
                  : "Create slot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Select
        value={String(value)}
        onValueChange={(nextValue) =>
          nextValue !== null && onChange(Number(nextValue))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {timeOptions.find((time) => time.value === value)?.label ??
              "Select time"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((time) => (
            <SelectItem key={time.value} value={String(time.value)}>
              {time.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}
