import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPinned,
  Plane,
  RefreshCw,
} from "lucide-react";
import { Forbidden } from "@/components";
import { useTripBookings, useLocale, useTimezone } from "@/hooks";
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_USER_LOCALE,
  TRIP_OCCURENCE_LABELS,
  TRIP_STATUS,
  TRIP_TYPES,
  formatMoney,
  humanReadableDateTime,
} from "@/utils";
import { EmptyState, TripsLoaderSkeleton } from "@/components";

const quickFilters = ["Today", "Unassigned", "Ongoing", "Disputes"];
const PAGE_SIZE = 10;
const FORBIDDEN_STATUS_CODE = 403;
const HIDDEN_PRICE_KEYS = new Set([
  "platformfee",
  "platform_fee",
  "advancepayment",
  "advance_payment",
  "balancepayment",
  "balance_payment",
]);

const normalizeKey = (key) => key.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();

const formatLabel = (value) => {
  if (!value) return "Not set";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

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

const getRouteText = (trip) => {
  if (getTripType(trip) === TRIP_TYPES.LOCAL) {
    return trip?.origin?.display_name || "Pickup pending";
  }

  const origin = trip?.origin?.display_name || "Origin pending";
  const destination = trip?.destination?.display_name || "Destination pending";
  return `${origin} -> ${destination}`;
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

const getRouteMetaText = (trip) => {
  const tripType = getTripType(trip);

  if (tripType === TRIP_TYPES.OUTSTATION) {
    const originRegion = trip.origin?.region_code;
    const destinationRegion = trip.destination?.region_code;
    const includedKm = trip.included_kms;
    const routeRegions =
      originRegion || destinationRegion
        ? `${originRegion || "--"} to ${destinationRegion || "--"}`
        : "";
    const includedKmText = includedKm ? `${includedKm} km included` : "";
    return [routeRegions, includedKmText].filter(Boolean).join(" | ");
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
    extras.push("Toll");
  }

  if (!breakdownKeys.has("parking")) {
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
    label: formatLabel(trip.status),
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

  if (Number(trip.num_luggages) > 0) {
    meta.push(
      `${trip.num_luggages} ${trip.num_luggages === 1 ? "luggage" : "luggages"}`,
    );
  }

  if (trip.fleet?.roof_carrier) {
    meta.push("roof carrier");
  }

  if (getTripType(trip) === TRIP_TYPES.OUTSTATION && trip.total_days) {
    meta.push(`${trip.total_days} ${trip.total_days === 1 ? "day" : "days"}`);
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
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className="h-9 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {isLoading ? "--" : stat.value}
            </p>
          </div>
        ))}
      </div>

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
              {isLoading &&
                
                <TripsLoaderSkeleton/>
                }

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
                  subTitle="Try another status, date range, or booking search once
                    filters are enabled."
                />
              )}

              {!isLoading &&
                !isError &&
                sortedTrips.map((trip) => {
                  const breakdown = getVisiblePriceBreakdown(trip);
                  const driverState = getDriverState(trip);
                  const operationalStatus = getOperationalStatus(trip);
                  const routeMetaText = getRouteMetaText(trip);
                  const attentionChips = getAttentionChips(trip);
                  const extraChargesText = getExtraChargesText(trip);
                  const overageRates = operationalStatus.needsReview
                    ? []
                    : getVisibleOverageRates(trip);
                  const currencyCode =
                    trip?.currency?.code || DEFAULT_CURRENCY_CODE;

                  return (
                    <article
                      key={trip.id || trip.booking_id}
                      className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                    >
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
                              {trip.customer?.name || "Customer pending"} ·{" "}
                              {trip.customer?.phone_number ||
                                trip.customer?.email ||
                                "--"}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {driverState &&
                              (!operationalStatus.needsReview ||
                                driverState.assigned) && (
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${driverState.className}`}
                                >
                                  {driverState.label}
                                </span>
                              )}
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${operationalStatus.className}`}
                            >
                              {operationalStatus.label}
                            </span>
                          </div>
                        </div>

                        {attentionChips.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {attentionChips.map((chip) => {
                              const Icon = chip.icon;
                              return (
                                <span
                                  key={chip.label}
                                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600"
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                  {chip.label}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)_minmax(220px,0.8fr)]">
                          <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Route / Pickup
                            </p>
                            <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-950">
                              {getRouteText(trip)}
                            </p>
                            {routeMetaText && (
                              <p className="mt-1 text-xs text-slate-800">
                                {routeMetaText}
                              </p>
                            )}
                          </div>

                          <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Trip
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-950">
                              {trip.trip_type?.display_name ||
                                formatLabel(trip.trip_type?.trip_type)}
                            </p>
                            <p className="mt-1 text-xs text-slate-800">
                              {trip.fleet?.name || "Fleet pending"} ·{" "}
                              {getTripMetaText(trip)}
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Start
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-950">
                              {formatTripDate(
                                trip.start_datetime,
                                locale,
                                clientTimezone?.timezone ?? trip.timezone,
                              )}
                            </p>
                            <p className="mt-1 text-xs  text-slate-800">
                              {formatLabel(trip.label)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Driver Fare
                            </p>
                            <p className="mt-1 text-lg font-semibold text-slate-950">
                              {formatMoney(trip.cost_to_driver, currencyCode)}
                            </p>
                            {extraChargesText && (
                              <p className="mt-1 text-xs font-semibold text-emerald-700">
                                {extraChargesText}
                              </p>
                            )}
                            {(breakdown.length > 0 ||
                              overageRates.length > 0) && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {breakdown.map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600"
                                  >
                                    {formatLabel(key)}{" "}
                                    {formatMoney(value, currencyCode)}
                                  </span>
                                ))}
                                {overageRates.map(([label, value]) => (
                                  <span
                                    key={label}
                                    className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                                  >
                                    {label} {formatMoney(value, currencyCode)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            className="h-9 cursor-pointer rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    </article>
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
