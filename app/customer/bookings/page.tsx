import { BookingSection } from "@/components/shared/BookingCard";
import {
  activeBookings,
  bookingHistory,
  requestedBookings,
} from "@/components/shared/booking-utils";

import { getBookingsServer } from "../../(public)/_data/bookings.server";

const Bookings = async () => {
  const { bookings } = (await getBookingsServer()).data;

  return (
    <div className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Track your service requests and appointments.
        </p>
      </div>
      <BookingSection
        title="Requested bookings"
        bookings={requestedBookings(bookings)}
        role="customer"
      />
      <BookingSection
        title="Active bookings"
        bookings={activeBookings(bookings)}
        role="customer"
      />
      <BookingSection
        title="Booking history"
        bookings={bookingHistory(bookings)}
        role="customer"
      />
    </div>
  );
};

export default Bookings;
