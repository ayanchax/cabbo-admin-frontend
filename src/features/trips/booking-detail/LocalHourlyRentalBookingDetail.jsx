import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailSection,
} from "@/features/trips/booking-detail";
import { useTimezone, useLocale } from "@/hooks";
import { PackageCheck } from "lucide-react";
import { useTripsHelper } from "@/features/trips/hooks";

function LocalHourlyRentalBookingDetail({ bookingDetail }) {
  const { timezone: clientTimezone } = useTimezone();
  const { locale } = useLocale();
  const { canShowActualEndDateTime, formatDateTime, formatCurrency } = useTripsHelper();
  const showActualEndDateTime = canShowActualEndDateTime(bookingDetail);

  return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
      <DetailSection title="Local Rental Package" icon={PackageCheck}>
        <DetailGrid>
          <DetailField
            label="Included Hours"
            value={bookingDetail?.package?.included_hours}
          />
          <DetailField
            label="Included Km"
            value={
              bookingDetail?.package?.included_km ?? bookingDetail?.included_kms
            }
          />
          <DetailField
            label="Expected End"
            value={formatDateTime(
              bookingDetail?.expected_end_datetime,
              locale,
              clientTimezone?.timezone ?? bookingDetail?.timezone,
            )}
          />
          {showActualEndDateTime && (
            <DetailField
              label="Actual End"
              value={formatDateTime(
                bookingDetail?.end_datetime,
                locale,
                clientTimezone?.timezone ?? bookingDetail?.timezone,
              )}
            />
          )}
          
          
          <DetailField
            label="Rate Per Minute"
            value={formatCurrency(bookingDetail?.rate_per_min, bookingDetail?.currency?.code, true)}
          />
        </DetailGrid>
      </DetailSection>
    </BookingDetailFrame>
  );
}

export { LocalHourlyRentalBookingDetail };
