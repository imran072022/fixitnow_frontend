"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock3, MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { createBooking } from "../../_data/bookings.client";
import type {
  AvailabilitySlot,
  TechnicianService,
} from "../../_types/technicians";
import {
  bookingSchema,
  type BookingFormValues,
} from "../../_validation/bookingSchema";

const dayNames = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const formatTime = (minute: number) => {
  const hour = Math.floor(minute / 60);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute % 60).padStart(2, "0")} ${period}`;
};

const toDateKey = (date: Date) => format(date, "yyyy-MM-dd");

const getDateFromKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDhakaDateTime = (dateKey: string, time: string) => {
  const minuteOfDay = Number(time);
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;

  return `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0",
  )}:00+06:00`;
};

type CreateBookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: TechnicianService[];
  availabilitySlots: AvailabilitySlot[];
};

export function CreateBookingModal({
  open,
  onOpenChange,
  services,
  availabilitySlots,
}: CreateBookingModalProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const maximumDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60),
    [today],
  );
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      bookingDate: toDateKey(today),
      bookingTime: "",
      location: "",
      bookingDetails: "",
    },
  });
  const serviceId = form.watch("serviceId");
  const bookingDate = form.watch("bookingDate");
  const bookingTime = form.watch("bookingTime");
  const selectedService = services.find((service) => service.id === serviceId);
  const selectedDate = getDateFromKey(bookingDate);
  const availableTimes = useMemo(() => {
    const weekday = dayNames[selectedDate.getDay()];
    const minutes = new Set<number>();

    availabilitySlots
      .filter((slot) => slot.dayOfWeek === weekday)
      .forEach((slot) => {
        for (
          let minute = slot.startMinute;
          minute + 30 <= slot.endMinute;
          minute += 30
        ) {
          minutes.add(minute);
        }
      });

    return [...minutes].sort((first, second) => first - second);
  }, [availabilitySlots, selectedDate]);

  useEffect(() => {
    if (bookingTime && !availableTimes.includes(Number(bookingTime))) {
      form.setValue("bookingTime", "", { shouldValidate: true });
    }
  }, [availableTimes, bookingTime, form]);

  async function onSubmit(values: BookingFormValues) {
    try {
      await createBooking({
        serviceId: values.serviceId,
        bookingDate: formatDhakaDateTime(
          values.bookingDate,
          values.bookingTime,
        ),
        location: values.location.trim(),
        bookingDetails: values.bookingDetails.trim(),
      });
      toast.success("Booking request sent successfully.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create booking request.",
      );
    }
  }

  function onInvalid(errors: typeof form.formState.errors) {
    const firstError = Object.values(errors)[0]?.message;
    toast.error(firstError ? String(firstError) : "Please complete the form.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book technician</DialogTitle>
          <DialogDescription>
            Choose a service and an available appointment time.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-4"
        >
          <label className="grid gap-2 text-sm font-medium">
            Service
            <Select
              value={form.watch("serviceId")}
              onValueChange={(value) =>
                form.setValue("serviceId", value ?? "", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedService
                    ? `${selectedService.name} ($${(selectedService.price / 100).toFixed(2)})`
                    : "Select a service"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} (${(service.price / 100).toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={form.formState.errors.serviceId?.message} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Date
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingDate && "text-muted-foreground",
                      )}
                    />
                  }
                >
                  <CalendarIcon className="size-4" />
                  {bookingDate ? format(selectedDate, "PPP") : "Pick a date"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) =>
                      date &&
                      form.setValue("bookingDate", toDateKey(date), {
                        shouldValidate: true,
                      })
                    }
                    disabled={{ before: today, after: maximumDate }}
                    startMonth={today}
                    endMonth={maximumDate}
                  />
                </PopoverContent>
              </Popover>
              <FieldError
                message={form.formState.errors.bookingDate?.message}
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Time
              <Select
                value={bookingTime}
                onValueChange={(value) =>
                  form.setValue("bookingTime", value ?? "", {
                    shouldValidate: true,
                  })
                }
                disabled={availableTimes.length === 0}
              >
                <SelectTrigger className="w-full">
                  <Clock3 className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((minute) => (
                    <SelectItem key={minute} value={String(minute)}>
                      {formatTime(minute)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                message={form.formState.errors.bookingTime?.message}
              />
              {availableTimes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No availability on this date.
                </p>
              )}
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" />
              Location
            </span>
            <Input
              {...form.register("location")}
              placeholder="Where should the service take place?"
              aria-invalid={Boolean(form.formState.errors.location)}
            />
            <FieldError message={form.formState.errors.location?.message} />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Details
            <Textarea
              {...form.register("bookingDetails")}
              placeholder="Describe what you need help with"
              rows={4}
              aria-invalid={Boolean(form.formState.errors.bookingDetails)}
            />
            <FieldError
              message={form.formState.errors.bookingDetails?.message}
            />
          </label>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting || availableTimes.length === 0
              }
            >
              {form.formState.isSubmitting
                ? "Sending..."
                : "Send booking request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}
