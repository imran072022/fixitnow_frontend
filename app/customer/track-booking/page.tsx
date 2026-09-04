import { CalendarDays, MapPin, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getBookingServer } from "../../(public)/_data/bookings.server";
import type { BookingStatus } from "../../(public)/_types/bookings";

const statuses: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
];

const labels: Record<BookingStatus, string> = {
  REQUESTED: "Request sent",
  DENIED: "Request denied",
  ACCEPTED: "Booking accepted",
  PAID: "Payment received",
  CANCELLED: "Booking cancelled",
  IN_PROGRESS: "Job in progress",
  COMPLETED: "Job completed",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));

type TrackBookingPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function TrackBookingPage({
  searchParams,
}: TrackBookingPageProps) {
  const { id } = await searchParams;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) notFound();

  let booking;
  try {
    booking = (await getBookingServer(id)).data;
  } catch {
    notFound();
  }

  const currentIndex = statuses.indexOf(booking.status);
  const isTerminalFailure =
    booking.status === "DENIED" || booking.status === "CANCELLED";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Track booking</h1>
        <p className="mt-2 text-muted-foreground">
          Follow the progress of your service request.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{booking.service?.name ?? "Service booking"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <p className="flex items-center gap-2 text-sm">
            <UserRound className="size-4 text-muted-foreground" />
            {booking.technicianProfile?.user.name ?? "Technician"}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <CalendarDays className="size-4 text-muted-foreground" />
            {formatDate(booking.bookingDate)}
          </p>
          <p className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 text-muted-foreground" />
            {booking.location}
          </p>
          <p className="text-sm text-muted-foreground sm:col-span-2">
            {booking.bookingDetails}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-5">
            {isTerminalFailure ? (
              <li className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-destructive" />
                {labels[booking.status]}
              </li>
            ) : (
              statuses.map((status, index) => (
                <li key={status} className="flex items-center gap-3">
                  <span
                    className={`size-3 rounded-full ${index <= currentIndex ? "bg-primary" : "bg-muted"}`}
                  />
                  <span
                    className={
                      index <= currentIndex
                        ? "font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {labels[status]}
                  </span>
                </li>
              ))
            )}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
