import { RouteTimeline } from "@/components";
import { Armchair, IndianRupee, MapPinned } from "lucide-react";
import {
  DEFAULT_CURRENCY_CODE,
  TRIP_STATUS,
  formatSnakeCasedStringAsLabel,
} from "@/utils";
import { useTripsDashboardHelper } from "@/features/trips/hooks";
import { EMPTY_VALUE, formatCurrency } from "@/features/trips/booking-detail";
import { InCarAmenities, FareSummary , TripBadge, AttentionChips} from "@/features/trips/components";
import { useTimezone, useLocale } from "@/hooks";
import { DriverAssignmentPanel } from "./DriverAssignmentPanel";

function DetailSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-400"
          />
        )}
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function DetailField({ className = "", label, value }) {
  const {formatValue} = useTripsDashboardHelper()
  
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-slate-950">
        {formatValue(value)}
      </p>
    </div>
  );
}

function DetailGrid({ children }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

function DetailList({ items = [] }) {
  const visibleItems = items.filter(Boolean);

  if (visibleItems.length === 0) {
    return <p className="text-sm text-slate-500">{EMPTY_VALUE}</p>;
  }

  return (
    <ul className="grid gap-2 text-sm text-slate-700">
      {visibleItems.map((item) => (
        <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

function FareSection({ bookingDetail }) {
  const {
    getExtraChargesText,
    getOperationalStatus,
    getVisibleOverageRates,
    getVisiblePriceBreakdown,
    canShowOverageRates,
    canShowFareDetails
    
  } = useTripsDashboardHelper();
  const currencyCode = bookingDetail?.currency?.code || DEFAULT_CURRENCY_CODE;
  const operationalStatus = getOperationalStatus(bookingDetail);
  const shouldShowFareDetail =canShowFareDetails(operationalStatus.needsReview,bookingDetail?.status)
  
  const tripType = bookingDetail?.trip_type?.trip_type
  const shouldShowOverageRates = canShowOverageRates(tripType)
  const overageRates = shouldShowFareDetail && shouldShowOverageRates
    ? getVisibleOverageRates(bookingDetail)
    : [];
  
  const extraCharges = shouldShowFareDetail?getExtraChargesText(bookingDetail): undefined

  return (
    <DetailSection title="Driver Fare" icon={IndianRupee}>
      <FareSummary
        breakdown={
          shouldShowFareDetail
            ? getVisiblePriceBreakdown(bookingDetail)
            : []
        }
        className="flex flex-wrap items-center justify-between gap-3"
        currencyCode={currencyCode}
        extraChargesText={extraCharges}
        fare={bookingDetail?.cost_to_driver}
        overageRates={overageRates}
      />
    </DetailSection>
  );
}

function BookingDetailFrame({ bookingDetail, children }) {
  const tripType = bookingDetail?.trip_type;
  const { timezone: clientTimezone } = useTimezone();
  const { locale } = useLocale();
  const {
    formatTripDate,
    getDriverState,
    getOperationalStatus,
    getRouteTimelineParams,
    getAttentionChips,
    getPassengerText,
    getLuggageText
  } = useTripsDashboardHelper();
  const driverState = getDriverState(bookingDetail);
  const operationalStatus = getOperationalStatus(bookingDetail);
  const routeParams = getRouteTimelineParams(bookingDetail);
  const shouldShowDriverBadge =
    driverState && (!operationalStatus.needsReview || driverState.assigned);
  const currencyCode = bookingDetail?.currency?.code || DEFAULT_CURRENCY_CODE;
  const attentionChips = getAttentionChips(bookingDetail);

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 pl-5">
        <div
          className={`absolute inset-y-0 left-0 w-1 ${operationalStatus.railClassName}`}
        />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="break-all font-mono text-xs font-semibold tracking-wide text-slate-500">
              {bookingDetail?.booking_id}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {tripType?.display_name ||
                formatSnakeCasedStringAsLabel(tripType?.trip_type)}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {shouldShowDriverBadge && (
              <TripBadge className={driverState.className}>
                {driverState.label}
              </TripBadge>
            )}
            <TripBadge className={`ring-1 ${operationalStatus.className}`}>
              {operationalStatus.label}
            </TripBadge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DetailField
            label="Start"
            value={formatTripDate(
              bookingDetail?.start_datetime,
              locale,
              clientTimezone?.timezone ?? bookingDetail.timezone,
            )}
          />
          <DetailField
            label="Customer (Phone)"
            value={`${bookingDetail?.customer?.name} (${bookingDetail?.customer?.phone_number})`}
          />
          <DetailField
            label="Passengers"
            value={getPassengerText(bookingDetail)}
          />
          <DetailField
            label="Fare"
            value={formatCurrency(bookingDetail?.cost_to_driver, currencyCode)}
          />
        </div>
        <AttentionChips chips={attentionChips} />
      </section>

      <DriverAssignmentPanel
        bookingDetail={bookingDetail}
        driverState={driverState}
      />

      <DetailSection title="Route" icon={MapPinned}>
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <RouteTimeline {...routeParams} />
        </div>
      </DetailSection>

      <DetailSection title="Cab And Luggage Preferences" icon={Armchair}>
        <DetailGrid>
          <DetailField
            className="w-28 sm:w-32"
            label="Cab Type"
            value={bookingDetail?.fleet?.car_type}
          />
          <DetailField
            className="w-28 sm:w-32"
            label="Fuel"
            value={bookingDetail?.fleet?.fuel_type}
          />
          <DetailField
            className="w-28 sm:w-32"
            label="Capacity"
            value={bookingDetail?.fleet?.capacity}
          />
          {bookingDetail?.num_luggages > 0 && (
            <DetailField
              className="w-28 sm:w-32"
              label="Luggage"
              value={getLuggageText(bookingDetail)}
            />
          )}
          {bookingDetail?.fleet?.roof_carrier && (
            <DetailField
              className="w-28 sm:w-32"
              label="Roof Carrier"
              value={bookingDetail?.fleet?.roof_carrier}
            />
          )}
        </DetailGrid>

        <DetailGrid>
          <div className="mt-5 max-w-3xl">
            <InCarAmenities
              {...bookingDetail?.in_car_amenities}
              className=""
              header="Amenities"
            />
          </div>
        </DetailGrid>
      </DetailSection>

      {children}

      <FareSection bookingDetail={bookingDetail} />
    </div>
  );
}

export {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailList,
  DetailSection,
};
