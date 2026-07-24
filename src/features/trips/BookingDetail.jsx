import { EmptyState } from "@/components";
import { TRIP_TYPES, formatSnakeCasedStringAsLabel } from "@/utils";
import {
  AirportTransferBookingDetail,
  LocalHourlyRentalBookingDetail,
  OutstationBookingDetail,
} from "./booking-detail";

function BookingDetail({ bookingDetail }) {
  const tripType = bookingDetail?.trip_type?.trip_type;

  if (
    tripType === TRIP_TYPES.AIRPORT_PICKUP ||
    tripType === TRIP_TYPES.AIRPORT_DROPOFF
  ) {
    return <AirportTransferBookingDetail bookingDetail={bookingDetail} />;
  }

  if (tripType === TRIP_TYPES.LOCAL) {
    return <LocalHourlyRentalBookingDetail bookingDetail={bookingDetail} />;
  }

  if (tripType === TRIP_TYPES.OUTSTATION) {
    return <OutstationBookingDetail bookingDetail={bookingDetail} />;
  }

  return (
    <EmptyState
      title="Unsupported trip type"
      message={`No booking detail view is configured for ${formatSnakeCasedStringAsLabel(
        tripType,
      )}.`}
    />
  );
}

export { BookingDetail };
