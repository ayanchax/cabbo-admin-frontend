import { useTripsDashboardHelper } from "../hooks/useTripsDashboardHelper";
import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailSection,
  formatDateTime
} from "@/features/trips/booking-detail";
import { useTimezone, useLocale } from "@/hooks";
import { AlertTriangle, Milestone } from "lucide-react";
function OutstationBookingDetail({ bookingDetail }) {
  const { timezone: clientTimezone } = useTimezone();
    const { locale } = useLocale();
    const {canShowActualEndDateTime} = useTripsDashboardHelper()
    const showActualEndDateTime = canShowActualEndDateTime(bookingDetail)
    return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
      <DetailSection title="Outstation Plan" icon={Milestone}>
        <DetailGrid>
          <DetailField
            label="Round Trip"
            value={bookingDetail?.is_round_trip}
          />
          <DetailField
            label="Interstate"
            value={bookingDetail?.is_interstate}
          />
          <DetailField label="Total Days" value={bookingDetail?.total_days} />
          <DetailField
            label="Included Km"
            value={bookingDetail?.included_kms}
          />
          <DetailField label="Rate Per Km" value={bookingDetail?.rate_per_km} />
          <DetailField
            label="Expected End"
            value={formatDateTime(
              bookingDetail?.expected_end_datetime,
              locale,
              clientTimezone?.timezone ?? bookingDetail?.timezone,
            )}
          />


           {showActualEndDateTime && <DetailField
            label="Actual End"
            value={formatDateTime(
              bookingDetail?.end_datetime,
              locale,
              clientTimezone?.timezone ?? bookingDetail?.timezone,
            )}
          />}
          
        </DetailGrid>
      </DetailSection>

      {bookingDetail?.special_needs_requests && (
        <DetailSection title="Special Requests" icon={AlertTriangle}>
          <p className="whitespace-pre-wrap rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
            {bookingDetail.special_needs_requests}
          </p>
        </DetailSection>
      )}
    </BookingDetailFrame>
  );
}

export { OutstationBookingDetail };
