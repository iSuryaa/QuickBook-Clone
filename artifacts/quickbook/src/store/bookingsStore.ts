import { useState } from "react";
import { MOCK_BOOKINGS, type Booking, type BookingStatus } from "@/data/mock";

let _bookings = [...MOCK_BOOKINGS];

export function useBookingsStore() {
  const [bookings, setBookings] = useState<Booking[]>(_bookings);

  const addBooking = (b: Booking) => {
    _bookings = [b, ..._bookings];
    setBookings([..._bookings]);
  };

  const cancelBooking = (id: string) => {
    _bookings = _bookings.map(b => b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b);
    setBookings([..._bookings]);
  };

  const getBooking = (id: string) => _bookings.find(b => b.id === id);

  const filteredBookings = (filter?: BookingStatus) =>
    filter ? _bookings.filter(b => b.status === filter) : _bookings;

  return { bookings, addBooking, cancelBooking, getBooking, filteredBookings };
}
