import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailSection,
} from "./BookingDetailShared";

function AirportTransferBookingDetail({ bookingDetail }) {
  return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
    </BookingDetailFrame>
  );
}

export { AirportTransferBookingDetail };
