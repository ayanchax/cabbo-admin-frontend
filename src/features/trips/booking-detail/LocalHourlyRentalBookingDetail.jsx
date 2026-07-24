import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailList,
  DetailSection,
} from "./BookingDetailShared";
import { formatDateTime, } from "./bookingDetailFormatters";

function LocalHourlyRentalBookingDetail({ bookingDetail }) {
  return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
      <DetailSection title="Local Rental Package">
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
              bookingDetail?.timezone,
            )}
          />
          <DetailField label="Rate Per Minute" value={bookingDetail?.rate_per_min} />
           
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Overage Rules">
        <DetailGrid>
          <DetailField
            label="Extra Hour"
            value={
              bookingDetail?.overages?.overage_amount_per_hour
                ? `${bookingDetail.overages.overage_amount_per_hour} per hour`
                : null
            }
          />
          <DetailField
            label="Extra Km"
            value={
              bookingDetail?.overages?.overage_amount_per_km
                ? `${bookingDetail.overages.overage_amount_per_km} per km`
                : null
            }
          />
        </DetailGrid>
          
      </DetailSection>
    </BookingDetailFrame>
  );
}

export { LocalHourlyRentalBookingDetail };
