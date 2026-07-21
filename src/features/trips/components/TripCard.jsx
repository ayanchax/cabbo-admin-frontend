import { RouteTimeline } from "@/components";
import { formatSnakeCasedStringAsLabel } from "@/utils";
import { AttentionChips } from "./AttentionChips";
import { FareSummary } from "./FareSummary";
import { TripBadge } from "./TripBadge";
import { TripInfoPanel } from "./TripInfoPanel";

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
  routeParams,
  startText,
  trip,
  tripMetaText,
}) {
  const shouldShowDriverBadge =
    driverState && (!operationalStatus.needsReview || driverState.assigned);

  const shouldShowExtraChargesText = !operationalStatus.needsReview;
  const handleOpen=()=>{
    onOpen(trip?.booking_id)
  }
  return (
    <article className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md mb-4">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${operationalStatus.railClassName}`}
      />
      <div className="p-3 pl-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="max-w-full truncate font-mono text-xs font-semibold tracking-wide text-slate-500">
              {trip.booking_id || trip.id}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {trip.customer?.name || "Customer pending"} -{" "}
              {trip.customer?.phone_number || trip.customer?.email || "--"}
            </p>
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

        <AttentionChips chips={attentionChips} />

        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(240px,0.45fr)]">
          <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
            <RouteTimeline {...routeParams} className="mb-3" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <TripInfoPanel
              label="Trip"
              primary={
                trip.trip_type?.display_name ||
                formatSnakeCasedStringAsLabel(trip.trip_type?.trip_type)
              }
              secondary={`${trip.fleet?.name || "Fleet pending"} - ${tripMetaText}`}
            />

            <TripInfoPanel
              label="Start"
              primary={startText}
              secondary={occurrenceLabel} // Upcoming, Ongoing, Past.
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <FareSummary
            breakdown={breakdown}
            currencyCode={currencyCode}
            extraChargesText={
              shouldShowExtraChargesText ? extraChargesText : undefined
            }
            fare={trip.cost_to_driver}
            overageRates={overageRates}
          />

          <button
            type="button"
            onClick={handleOpen}
            className="ml-auto h-9 shrink-0 cursor-pointer rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open
          </button>
        </div>
      </div>
    </article>
  );
}

export { TripCard };
