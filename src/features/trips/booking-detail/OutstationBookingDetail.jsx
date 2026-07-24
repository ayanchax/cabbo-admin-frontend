import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailList,
  DetailSection,
} from "./BookingDetailShared";
import { formatDateTime } from "./bookingDetailFormatters";

function OutstationBookingDetail({ bookingDetail }) {
  return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
      <DetailSection title="Outstation Plan">
        <DetailGrid>
          <DetailField label="Round Trip" value={bookingDetail?.is_round_trip} />
          <DetailField label="Interstate" value={bookingDetail?.is_interstate} />
          <DetailField label="Total Days" value={bookingDetail?.total_days} />
          <DetailField label="Included Km" value={bookingDetail?.included_kms} />
          <DetailField label="Estimated Km" value={bookingDetail?.estimated_km} />
          <DetailField label="Rate Per Km" value={bookingDetail?.rate_per_km} />
          <DetailField
            label="Expected End"
            value={formatDateTime(
              bookingDetail?.expected_end_datetime,
              bookingDetail?.timezone,
            )}
          />
          <DetailField
            label="Actual End"
            value={formatDateTime(bookingDetail?.end_datetime, bookingDetail?.timezone)}
          />
        </DetailGrid>
      </DetailSection>

      {bookingDetail?.special_needs_requests && (
        <DetailSection title="Special Requests">
          <p className="whitespace-pre-wrap rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
            {bookingDetail.special_needs_requests}
          </p>
        </DetailSection>
      )}

      <DetailSection title="Overage Rules">
        <DetailGrid>
          <DetailField
            label="Extra Km"
            value={
              bookingDetail?.overages?.overage_amount_per_km
                ? `${bookingDetail.overages.overage_amount_per_km} per km`
                : null
            }
          />
          <DetailField
            label="Estimated Overage"
            value={bookingDetail?.overages?.overage_estimate_amount}
          />
        </DetailGrid>
         
      </DetailSection>
    </BookingDetailFrame>
  );
}

export { OutstationBookingDetail };
