import { CornerDownRight, MapPin } from "lucide-react";
import { TRIP_STATUS, TRIP_TYPES, formatSnakeCasedStringAsLabel } from "@/utils";
import { AttentionChips, FareSummary, TripBadge } from "@/features/trips/components";
import { useTripsDashboardHelper } from "@/features/trips/hooks";


const getLocationLabel = (location) =>
  location?.display_name || location?.address || "--";

const getHopLocation = (hop) => hop?.location || hop;



//Private Composition Helpers for TripCard.jsx
function RouteText({ trip }) {
  const {areSameLocation} = useTripsDashboardHelper()
  const origin = getLocationLabel(trip?.origin);
  const destination = getLocationLabel(trip?.destination);
  const isLocalLoop = areSameLocation(trip?.origin, trip?.destination);
  const hops = Array.isArray(trip?.hops) ? trip.hops.map(getHopLocation) : [];
  const visibleHops = hops.slice(0, 2).map(getLocationLabel);
  const hiddenHopCount = Math.max(hops.length - visibleHops.length, 0);

  return (
    <div className="grid min-w-0 gap-1.5">
      <div className="flex min-w-0 items-start gap-1.5 text-sm font-medium text-slate-950">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="line-clamp-2">{origin}</span>
      </div>
      {!isLocalLoop && (
        <div className="flex min-w-0 items-start gap-1.5 text-sm font-medium text-slate-950">
          <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-2">{destination}</span>
        </div>
      )}
      {visibleHops.length > 0 && (
        <p className="line-clamp-2 pl-5 text-xs font-medium text-slate-500">
          Via {visibleHops.join(", ")}
          {hiddenHopCount > 0 ? ` +${hiddenHopCount} more` : ""}
        </p>
      )}
    </div>
  );
}

function BookingCell({ trip }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-mono text-xs font-semibold tracking-wide text-slate-500">
        {trip.booking_id || trip.id}
      </p>
      <p className="mt-1 truncate text-xs text-slate-500">
        {trip.customer?.name || "Customer pending"} -{" "}
        {trip.customer?.phone_number || trip.customer?.email || "--"}
      </p>
      
    </div>
  );
}

function TripCell({ trip, tripMetaText }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-950">
        {trip.trip_type?.display_name ||
          formatSnakeCasedStringAsLabel(trip.trip_type?.trip_type)}
      </p>
      <p className="mt-1 line-clamp-2 text-xs text-slate-600">
        {[trip.fleet?.name, tripMetaText, trip?.is_round_trip?'Round trip' :''].filter(Boolean).join(" - ")}
      </p>
       
    </div>
  );
}

function StartCell({ occurrenceLabel, startText }) {
  return (
    <div className="min-w-0">
      <p className="line-clamp-2 text-sm font-semibold text-slate-950">
        {startText}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500">
        {occurrenceLabel}
      </p>
    </div>
  );
}

function StatusBadges({ driverState, operationalStatus }) {
  const shouldShowDriverBadge =
    driverState && (!operationalStatus.needsReview || driverState.assigned);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
      {shouldShowDriverBadge && (
        <TripBadge className={driverState.className}>
          {driverState.label}
        </TripBadge>
      )}
      <TripBadge className={`ring-1 ${operationalStatus.className}`}>
        {operationalStatus.label}
      </TripBadge>
    </div>
  );
}

function Field({ className = "", label, children }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function DriverFare({
  breakdown,
  currencyCode,
  extraChargesText,
  fare,
  overageRates,
  shouldShowFareDetails,
  shouldShowOverageRates,
}) {
  return (
    <FareSummary
      breakdown={shouldShowFareDetails ? breakdown : []}
      className="min-w-0"
      currencyCode={currencyCode}
      extraChargesText={shouldShowFareDetails ? extraChargesText : undefined}
      fare={fare}
      overageRates={
        shouldShowFareDetails && shouldShowOverageRates ? overageRates : []
      }
    />
  );
}

//Private Composition Helpers for TripCard.jsx - END

function TripCard({
  attentionChips,
  breakdown,
  currencyCode,
  driverState,
  extraChargesText,
  occurrenceLabel,
  onOpen,
  operationalStatus,
  overageRates,
  startText,
  trip,
  tripMetaText,
}) {
  const {canShowFareDetails, canShowOverageRates} = useTripsDashboardHelper()
  const shouldShowFareDetails = canShowFareDetails(operationalStatus.needsReview,trip?.status)
  const shouldShowOverageRates = canShowOverageRates(trip?.trip_type?.trip_type)
  const handleOpen = () => onOpen(trip?.booking_id);
  const fareProps = {
    breakdown,
    currencyCode,
    extraChargesText,
    fare: trip.cost_to_driver,
    overageRates,
    shouldShowFareDetails,
    shouldShowOverageRates
  };

  return (
    <article className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${operationalStatus.railClassName}`}
      />
      <div className="grid gap-3 p-3 pl-4 sm:p-4 sm:pl-5">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-3">
          <BookingCell trip={trip} />
          <StatusBadges
            driverState={driverState}
            operationalStatus={operationalStatus}
          />
        </div>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field label="Trip">
            <TripCell trip={trip} tripMetaText={tripMetaText} />
          </Field>
          <Field label="Start">
            <StartCell occurrenceLabel={occurrenceLabel} startText={startText} />
          </Field>
          <Field label="Route">
            <RouteText trip={trip} />
          </Field>
          <Field label="Driver Fare">
            <DriverFare {...fareProps} />
          </Field>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 md:flex-row md:items-start md:justify-between">
          <AttentionChips
            chips={attentionChips}
            className="mt-0 md:min-w-0 md:flex-1"
          />

          <button
            type="button"
            onClick={handleOpen}
            className="h-9 w-full shrink-0 cursor-pointer rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 md:ml-auto md:h-8 md:w-auto"
          >
            Open
          </button>
        </div>
      </div>
    </article>
  );
}

export { TripCard };
