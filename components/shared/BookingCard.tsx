"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, CircleUserRound, MapPin, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReviewDialog } from "./ReviewDialog";

import {
  createCheckoutSession,
  updateBookingStatus,
} from "../../app/(public)/_data/bookings.client";
import type {
  Booking,
  BookingStatus,
} from "../../app/(public)/_types/bookings";

type BookingRole = "customer" | "technician" | "admin";

const statusLabels: Record<BookingStatus, string> = {
  REQUESTED: "Requested",
  DENIED: "Denied",
  ACCEPTED: "Accepted",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const statusClasses: Record<BookingStatus, string> = {
  REQUESTED: "bg-amber-100 text-amber-800",
  DENIED: "bg-red-100 text-red-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  PAID: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-green-100 text-green-800",
};

const formatBookingDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

type BookingCardProps = {
  booking: Booking;
  role: BookingRole;
  onChanged?: () => void;
};

export function BookingCard({ booking, role, onChanged }: BookingCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const serviceName = booking.service?.name ?? "Service";
  const counterparty =
    role === "customer"
      ? booking.technicianProfile?.user.name
      : booking.customer?.name;

  async function changeStatus(status: BookingStatus) {
    setIsUpdating(true);
    try {
      const response = await updateBookingStatus(booking.id, { status });
      toast.success(response.message);
      onChanged?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Booking update failed.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function payForBooking() {
    setIsPaying(true);
    try {
      const response = await createCheckoutSession(booking.id);
      if (!response.data.checkoutUrl) {
        throw new Error("Unable to start checkout.");
      }
      window.location.assign(response.data.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setIsPaying(false);
    }
  }

  return (
    <Card className="h-full border-border/70 shadow-sm">
      <CardHeader className="gap-3 border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{serviceName}</CardTitle>
            {booking.service && (
              <p className="mt-1 text-sm text-muted-foreground">
                ${(booking.service.price / 100).toFixed(2)}
              </p>
            )}
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              statusClasses[booking.status],
            )}
          >
            {statusLabels[booking.status]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="gap-2.5">
        {counterparty && (
          <p className="flex items-center gap-2 text-sm">
            <CircleUserRound className="size-4 text-muted-foreground" />
            {counterparty}
          </p>
        )}
        <p className="flex items-center gap-2 text-sm">
          <CalendarDays className="size-4 text-muted-foreground" />
          {formatBookingDate(booking.bookingDate)}
        </p>
        <p className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>{booking.location}</span>
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {booking.bookingDetails}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-2 pt-2">
        {role === "customer" && (
          <>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <Link href={`/customer/track-booking?id=${booking.id}`} />
              }
            >
              Track
            </Button>
            {booking.status === "ACCEPTED" && (
              <Button
                size="sm"
                disabled={isPaying || isUpdating}
                onClick={payForBooking}
              >
                {isPaying ? "Redirecting..." : "Pay"}
              </Button>
            )}
            {booking.status === "COMPLETED" && (
              <ReviewDialog
                bookingId={booking.id}
                existingReview={booking.review}
              />
            )}
            {["REQUESTED", "ACCEPTED", "PAID"].includes(booking.status) && (
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
                onClick={() => changeStatus("CANCELLED")}
              >
                Cancel
              </Button>
            )}
          </>
        )}

        {role === "technician" && booking.status === "REQUESTED" && (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating}
              onClick={() => changeStatus("DENIED")}
            >
              <X className="size-4" /> Deny
            </Button>
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => changeStatus("ACCEPTED")}
            >
              <Check className="size-4" /> Accept
            </Button>
          </>
        )}
        {role === "technician" && booking.status === "PAID" && (
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={() => changeStatus("IN_PROGRESS")}
          >
            Start job
          </Button>
        )}
        {role === "technician" && booking.status === "IN_PROGRESS" && (
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={() => changeStatus("COMPLETED")}
          >
            Complete job
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export const BookingSection = ({
  title,
  bookings,
  role,
  onChanged,
}: {
  title: string;
  bookings: Booking[];
  role: BookingRole;
  onChanged?: () => void;
}) => (
  <BookingSectionContent
    title={title}
    bookings={bookings}
    role={role}
    onChanged={onChanged}
  />
);

function BookingSectionContent({
  title,
  bookings,
  role,
  onChanged,
}: {
  title: string;
  bookings: Booking[];
  role: BookingRole;
  onChanged?: () => void;
}) {
  const router = useRouter();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <span className="text-sm text-muted-foreground">{bookings.length}</span>
      </div>
      {bookings.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              role={role}
              onChanged={onChanged ?? (() => router.refresh())}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No bookings in this section.
        </div>
      )}
    </section>
  );
}
