import { BookingSection } from "@/components/shared/BookingCard";
import {
  activeBookings,
  bookingHistory,
  requestedBookings,
} from "@/components/shared/booking-utils";

import { getBookingsServer } from "../../../(public)/_data/bookings.server";

const ManageBookings = async () => {
  const { bookings } = (await getBookingsServer()).data;

  return (
    <div className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Review platform bookings and their current status.
        </p>
      </div>
      <BookingSection
        title="Incoming/Requested bookings"
        bookings={requestedBookings(bookings)}
        role="admin"
      />
      <BookingSection
        title="Active bookings"
        bookings={activeBookings(bookings)}
        role="admin"
      />
      <BookingSection
        title="Booking history"
        bookings={bookingHistory(bookings)}
        role="admin"
      />
    </div>
  );
};

export default ManageBookings;
