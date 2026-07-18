import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPinned,
  Plane,
  RefreshCw,
} from "lucide-react";
import { useTripBookings, useLocale, useTimezone } from "@/hooks";
import {
  DEFAULT_CURRENCY_CODE,
  TRIP_OCCURENCE_LABELS,
  TRIP_STATUS,
  TRIP_TYPES,
  humanReadableDateTime,
  FORBIDDEN_STATUS_CODE,
  normalizeKey,
  formatSnakeCasedStringAsLabel,
} from "@/utils";
import { EmptyState, Forbidden } from "@/components";
import {
  TripCard,
  TripsLoaderSkeleton,
  TripStats,
  QuickFilters,
} from "@/features/trips/components";

const quickFilters = ["Today", "Unassigned", "Ongoing", "Disputes"];
const PAGE_SIZE = 10;
const HIDDEN_PRICE_KEYS = new Set([
  "platformfee",
  "platform_fee",
  "advancepayment",
  "advance_payment",
  "balancepayment",
  "balance_payment",
]);

const getTripsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  return response?.trips || [];
};

const getPaginationFromResponse = (response) => {
  if (!response || Array.isArray(response)) return {};
  return response?.pagination || {};
};

const formatTripDate = (date, locale, timezone) => {
  if (!date) return "Not scheduled";
  const normalizedDatetime =
    date && !/Z$|[+-]\d{2}:\d{2}$/.test(date)
      ? { ...date, isoString: date + "Z" }
      : date;
  return humanReadableDateTime(normalizedDatetime, locale, timezone);
};

const getTripStartTimestamp = (trip) => {
  if (!trip?.start_datetime) return Number.POSITIVE_INFINITY;
  const normalizedDatetime = !/Z$|[+-]\d{2}:\d{2}$/.test(trip.start_datetime)
    ? `${trip.start_datetime}Z`
    : trip.start_datetime;
  const timestamp = new Date(normalizedDatetime).getTime();
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
};

const sortTripsByNearestStart = (trips) => {
  return [...trips].sort((firstTrip, secondTrip) => {
    const firstTripIsAssignable = isUpcomingAssignableTrip(firstTrip);
    const secondTripIsAssignable = isUpcomingAssignableTrip(secondTrip);

    if (firstTripIsAssignable !== secondTripIsAssignable) {
      return firstTripIsAssignable ? -1 : 1;
    }

    return getTripStartTimestamp(firstTrip) - getTripStartTimestamp(secondTrip);
  });
};

const getTripType = (trip) => trip?.trip_type?.trip_type;

const isUpcomingAssignableTrip = (trip) => {
  return (
    trip?.label === TRIP_OCCURENCE_LABELS.UPCOMING &&
    [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED].includes(trip?.status)
  );
};

const isPastOpenTrip = (trip) => {
  return (
    trip?.label === TRIP_OCCURENCE_LABELS.PAST &&
    [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED, TRIP_STATUS.ONGOING].includes(
      trip?.status,
    )
  );
};

const needsDriverAssignment = (trip) => {
  return !trip?.driver?.name && isUpcomingAssignableTrip(trip);
};

const getDriverState = (trip) => {
  if (trip?.driver?.name) {
    return {
      label: trip.driver.name,
      className: "bg-emerald-50 text-emerald-700",
      assigned: true,
    };
  }

  if (needsDriverAssignment(trip)) {
    return {
      label: "Needs driver",
      className: "bg-amber-50 text-amber-700",
      assigned: false,
    };
  }

  if (trip?.status === TRIP_STATUS.CANCELLED) {
    return null;
  }

  return {
    label: "Not assigned",
    className: "bg-slate-100 text-slate-600",
    assigned: false,
  };
};

const getPackageMetaText = (trip) => {
  const tripType = getTripType(trip);

  if (tripType === TRIP_TYPES.OUTSTATION) {
    const includedKm = trip.included_kms;
    const includedKmText = includedKm ? `${includedKm} km included` : "";
    return [includedKmText].filter(Boolean).join(" | ");
  }

  if (tripType === TRIP_TYPES.LOCAL) {
    const includedHours = trip.package?.included_hours;
    const includedKm = trip.package?.included_km ?? trip.included_kms;
    if (!includedHours && !includedKm) return "";
    return [
      includedHours ? `${includedHours}h` : null,
      includedKm ? `${includedKm} km` : null,
    ]
      .filter(Boolean)
      .join(" / ");
  }

  return "";
};

const isExceptionTrip = (trip) => {
  return (
    isPastOpenTrip(trip) ||
    trip.status === TRIP_STATUS.DISPUTED ||
    trip.status === TRIP_STATUS.CANCELLED
  );
};

const areSameLocation = (firstLocation, secondLocation) => {
  if (!firstLocation || !secondLocation) return false;

  if (firstLocation.place_id && secondLocation.place_id) {
    return firstLocation.place_id === secondLocation.place_id;
  }

  return (
    firstLocation.lat === secondLocation.lat &&
    firstLocation.lng === secondLocation.lng
  );
};

const getRouteTimelineParams = (trip) => {
  const tripType = getTripType(trip);
  const pickupLocation = trip?.origin || null;
  const dropoffLocation = trip?.destination || null;

  if (tripType === TRIP_TYPES.LOCAL) {
    const isSameLocation = areSameLocation(pickupLocation, dropoffLocation);

    return {
      pickupLocation,
      dropoffLocation: isSameLocation ? null : dropoffLocation,
      viewAsRouteTimeline: !isSameLocation,
    };
  }

  if (
    tripType === TRIP_TYPES.AIRPORT_PICKUP ||
    tripType === TRIP_TYPES.AIRPORT_DROPOFF
  ) {
    return {
      pickupLocation,
      dropoffLocation,
    };
  }

  return {
    pickupLocation,
    dropoffLocation,
    hops: trip?.hops || [],
    showReturn: true,
  };
};

const getVisiblePriceBreakdown = (trip) => {
  if (Number(trip?.cost_to_driver) === 0) return [];

  const visibleBreakdown = Object.entries(trip?.price_breakdown || {})
    .filter(([key, value]) => {
      return (
        !HIDDEN_PRICE_KEYS.has(normalizeKey(key)) &&
        value !== null &&
        Number(value) !== 0
      );
    })
    .map(([key, value]) => {
      if (
        normalizeKey(key) === "driver_allowance" &&
        getTripType(trip) === TRIP_TYPES.OUTSTATION &&
        Number(trip?.total_days) > 0
      ) {
        return [
          "driver_allowance_per_day",
          Number(value) / Number(trip.total_days),
        ];
      }

      return [key, value];
    })
    .sort(([, firstValue], [, secondValue]) => {
      return Number(secondValue) - Number(firstValue);
    });

  if (
    visibleBreakdown.length === 1 &&
    Number(visibleBreakdown[0][1]) === Number(trip?.cost_to_driver)
  ) {
    return [];
  }

  return visibleBreakdown;
};

const getVisibleOverageRates = (trip) => {
  if (Number(trip?.cost_to_driver) === 0) return [];

  const overageRates = [
    ["Extra hour", trip?.overages?.overage_amount_per_hour],
    ["Extra km", trip?.overages?.overage_amount_per_km],
  ];

  return overageRates.filter(([, value]) => {
    return value !== null && value !== undefined && Number(value) > 0;
  });
};

const getExtraChargesText = (trip) => {
  if (Number(trip?.cost_to_driver) === 0) return "";

  const tripType = getTripType(trip);

  if (tripType === TRIP_TYPES.OUTSTATION || tripType === TRIP_TYPES.LOCAL) {
    return "Toll + parking extra";
  }

  if (
    tripType !== TRIP_TYPES.AIRPORT_PICKUP &&
    tripType !== TRIP_TYPES.AIRPORT_DROPOFF
  ) {
    return "";
  }

  const breakdownKeys = new Set(
    Object.entries(trip?.price_breakdown || {})
      .filter(([, value]) => Number(value) > 0)
      .map(([key]) => normalizeKey(key)),
  );
  const extras = [];

  if (!breakdownKeys.has("toll")) {
    // Toll can become payable later even when the booked route avoided it.
    extras.push("Toll");
  }

  if (!breakdownKeys.has("parking")) {
    // Parking may become extra during halts or airport dropoff workflows.
    extras.push("parking");
  }

  if (extras.length === 0) return "";

  return `${extras.join(" + ")} extra`;
};

const getAttentionChips = (trip) => {
  const chips = [];

  if (trip.flight_number) {
    chips.push({ label: `Flight ${trip.flight_number}`, icon: Plane });
  }

  if (trip.terminal_number) {
    chips.push({ label: `Terminal ${trip.terminal_number}`, icon: Plane });
  }

  if (trip.placard_required) {
    chips.push({ label: "Placard", icon: FileText });
  }

  if (trip.special_needs_requests) {
    chips.push({ label: "Special request", icon: AlertTriangle });
  }

  return chips;
};

const getStatusClassName = (status) => {
  switch (status) {
    case TRIP_STATUS.CONFIRMED:
      return "bg-sky-50 text-sky-700 ring-sky-100";
    case TRIP_STATUS.ONGOING:
      return "bg-blue-50 text-blue-700 ring-blue-100";
    case TRIP_STATUS.COMPLETED:
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case TRIP_STATUS.CLOSED:
      return "bg-teal-50 text-teal-700 ring-teal-100";
    case TRIP_STATUS.CANCELLED:
      return "bg-rose-50 text-rose-700 ring-rose-100";
    case TRIP_STATUS.DISPUTED:
      return "bg-amber-50 text-amber-700 ring-amber-100";
    default:
      return "bg-slate-50 text-slate-600 ring-slate-200";
  }
};

const getOperationalStatus = (trip) => {
  if (isPastOpenTrip(trip)) {
    return {
      label: "Needs review",
      className: "bg-rose-50 text-rose-700 ring-rose-100",
      railClassName: "bg-rose-500",
      needsReview: true,
    };
  }

  return {
    label: formatSnakeCasedStringAsLabel(trip.status),
    className: getStatusClassName(trip.status),
    railClassName:
      trip.status === TRIP_STATUS.ONGOING
        ? "bg-emerald-500"
        : trip.status === TRIP_STATUS.CANCELLED
          ? "bg-rose-500"
          : trip.status === TRIP_STATUS.DISPUTED
            ? "bg-amber-500"
            : "bg-primary",
    needsReview: false,
  };
};

const getTripMetaText = (trip) => {
  const meta = [`${trip.num_passengers ?? 0} pax`];
  const packageMetaText = getPackageMetaText(trip);

  if (Number(trip.num_luggages) > 0) {
    meta.push(
      `${trip.num_luggages} ${trip.num_luggages === 1 ? "luggage" : "luggages"}`,
    );
  }

  if (trip.fleet?.roof_carrier) {
    meta.push("Needs roof carrier");
  }

  if (getTripType(trip) === TRIP_TYPES.OUTSTATION && trip.total_days) {
    meta.push(`${trip.total_days} ${trip.total_days === 1 ? "day" : "days"}`);
  }

  if (packageMetaText) {
    meta.push(packageMetaText);
  }

  return meta.join(" | ");
};

const getPageStats = (trips, pagination) => {
  return [
    {
      label: "Total Trips",
      value: pagination?.total ?? trips.length ?? 0,
    },
    {
      label: "Needs Driver",
      value: trips.filter(needsDriverAssignment).length,
    },
    {
      label: "In Progress",
      value: trips.filter((trip) => trip.status === TRIP_STATUS.ONGOING).length,
    },
    {
      label: "Exceptions",
      value: trips.filter(isExceptionTrip).length,
    },
  ];
};

function Dashboard() {
  const [page, setPage] = useState(1);
  const { locale } = useLocale();
  const { timezone: clientTimezone } = useTimezone();

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTripBookings({
      page,
      limit: PAGE_SIZE,
    });

  const trips = useMemo(() => getTripsFromResponse(data), [data]);
  const sortedTrips = useMemo(() => sortTripsByNearestStart(trips), [trips]);
  const pagination = useMemo(() => getPaginationFromResponse(data), [data]);
  const stats = useMemo(
    () => getPageStats(trips, pagination),
    [trips, pagination],
  );
  const currentPage = pagination.page ?? page;
  const totalPages = pagination.total_pages ?? pagination.totalPages ?? 1;
  const hasPrevious = pagination.has_previous ?? currentPage > 1;
  const hasNext = pagination.has_next ?? currentPage < totalPages;
  const isForbidden = error?.response?.status === FORBIDDEN_STATUS_CODE;

  return (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold ">Live Monitoring</span>
          </div>

          <h1 className="mt-1 text-2xl font-semibold text-slate-950">
            Trips Dashboard
          </h1>
        </div>

        <QuickFilters filters={quickFilters} />
      </div>
      <TripStats stats={stats} isLoading={isLoading} />

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-slate-950">
              Operations Workbench
            </h2>
          </div>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
            V1
          </span>
        </div>
        <div className="p-3 sm:p-4">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <div className="grid gap-2 p-2 sm:p-3">
              {isLoading && <TripsLoaderSkeleton />}

              {isForbidden && !isLoading && (
                <Forbidden message="You do not have permission to view trips operations." />
              )}

              {isError && !isForbidden && !isLoading && (
                <EmptyState
                  message="Could not load trips."
                  subTitle={error?.message || "Please retry the bookings list."}
                >
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </button>
                </EmptyState>
              )}

              {!isLoading && !isError && sortedTrips.length === 0 && (
                <EmptyState
                  message="No trips found."
                  subTitle="Try another status, date range, or booking search once filters are enabled."
                />
              )}

              {!isLoading &&
                !isError &&
                sortedTrips.map((trip) => {
                  const breakdown = getVisiblePriceBreakdown(trip);
                  const driverState = getDriverState(trip);
                  const operationalStatus = getOperationalStatus(trip);
                  const attentionChips = getAttentionChips(trip);
                  const extraChargesText = getExtraChargesText(trip);
                  const overageRates = operationalStatus.needsReview
                    ? []
                    : getVisibleOverageRates(trip);
                  const currencyCode =
                    trip?.currency?.code || DEFAULT_CURRENCY_CODE;
                  const routeParams = getRouteTimelineParams(trip);

                  return (
                    <TripCard
                      key={trip.id || trip.booking_id}
                      attentionChips={attentionChips}
                      breakdown={breakdown}
                      currencyCode={currencyCode}
                      driverState={driverState}
                      extraChargesText={extraChargesText}
                      occurrenceLabel={formatSnakeCasedStringAsLabel(
                        trip.label,
                      )}
                      operationalStatus={operationalStatus}
                      overageRates={overageRates}
                      routeParams={routeParams}
                      startText={formatTripDate(
                        trip.start_datetime,
                        locale,
                        clientTimezone?.timezone ?? trip.timezone,
                      )}
                      trip={trip}
                      tripMetaText={getTripMetaText(trip)}
                    />
                  );
                })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-3">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
                {pagination.total !== undefined
                  ? ` | ${pagination.total} trips`
                  : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!hasPrevious || isFetching}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!hasNext || isFetching}
                  onClick={() => setPage((current) => current + 1)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export { Dashboard };
