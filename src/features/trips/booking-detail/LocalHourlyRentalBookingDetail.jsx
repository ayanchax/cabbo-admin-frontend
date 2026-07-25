import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailSection,
} from "./BookingDetailShared";
import { formatDateTime } from "./bookingDetailFormatters";
import { useTimezone, useLocale } from "@/hooks";
import { PackageCheck } from "lucide-react";

function LocalHourlyRentalBookingDetail({ bookingDetail }) {
  const { timezone: clientTimezone } = useTimezone();
  const { locale } = useLocale();
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
            value={bookingDetail?.package?.included_km ?? bookingDetail?.included_kms}
          />
          <DetailField
            label="Expected End"
            value={formatDateTime(
              bookingDetail?.expected_end_datetime,
              locale,
              clientTimezone?.timezone ??bookingDetail?.timezone,
            )}
          />

          
          <DetailField label="Rate Per Minute" value={bookingDetail?.rate_per_min} />
           
        </DetailGrid>
      </DetailSection>

    </BookingDetailFrame>
  );
}

export { LocalHourlyRentalBookingDetail };
