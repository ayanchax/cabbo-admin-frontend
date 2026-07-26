import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailSection,
} from "@/features/trips/booking-detail";

function AirportTransferBookingDetail({ bookingDetail }) {
  return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
    </BookingDetailFrame>
  );
}

export { AirportTransferBookingDetail };
