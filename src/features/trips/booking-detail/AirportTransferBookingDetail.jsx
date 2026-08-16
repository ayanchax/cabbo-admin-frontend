import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailSection,
} from "@/features/trips/booking-detail";
import { useTripsHelper } from "@/features/trips/hooks";
import { useTimezone, useLocale } from "@/hooks";
import { Clock3 } from "lucide-react";

function AirportTransferBookingDetail({ bookingDetail }) {
  const { timezone: clientTimezone } = useTimezone();
  const { locale } = useLocale();
  const { canShowActualEndDateTime, formatDateTime } = useTripsHelper();
  const showActualEndDateTime = canShowActualEndDateTime(bookingDetail);

  return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
      {showActualEndDateTime && (
        <DetailSection title="Trip Timing" icon={Clock3}>
          <DetailGrid>
            <DetailField
              label="Actual End"
              value={formatDateTime(
                bookingDetail?.end_datetime,
                locale,
                clientTimezone?.timezone ?? bookingDetail?.timezone,
              )}
            />
          </DetailGrid>
        </DetailSection>
      )}
    </BookingDetailFrame>
  );
}

export { AirportTransferBookingDetail };
