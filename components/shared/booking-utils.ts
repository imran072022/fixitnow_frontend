import type { Booking } from "../../app/(public)/_types/bookings";

const historyStatuses = ["DENIED", "CANCELLED", "COMPLETED"] as const;
const technicianActiveStatuses = ["ACCEPTED", "PAID", "IN_PROGRESS"] as const;
const requestedStatuses = ["REQUESTED"] as const;

export const requestedBookings = (bookings: Booking[]) =>
  bookings.filter((booking) =>
    requestedStatuses.includes(
      booking.status as (typeof requestedStatuses)[number],
    ),
  );

export const incomingBookings = (bookings: Booking[]) =>
  bookings.filter((booking) => booking.status === "REQUESTED");

export const technicianActiveBookings = (bookings: Booking[]) =>
  bookings.filter((booking) =>
    technicianActiveStatuses.includes(
      booking.status as (typeof technicianActiveStatuses)[number],
    ),
  );

export const activeBookings = (bookings: Booking[]) =>
  bookings.filter(
    (booking) =>
      !requestedStatuses.includes(
        booking.status as (typeof requestedStatuses)[number],
      ) &&
      !historyStatuses.includes(
        booking.status as (typeof historyStatuses)[number],
      ),
  );

export const bookingHistory = (bookings: Booking[]) =>
  bookings.filter((booking) =>
    historyStatuses.includes(
      booking.status as (typeof historyStatuses)[number],
    ),
  );
