import { useMemo, useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  MapPinned,
  RefreshCw,
} from "lucide-react";
import { useTripBookings, useLocale, useTimezone } from "@/hooks";
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_USER_LOCALE,
  TRIP_STATUS,
  formatMoney,
  humanReadableDateTime,
} from "@/utils";

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
  const normalizedDatetime = date && !/Z$|[+-]\d{2}:\d{2}$/.test(date)
    ? { ...date, isoString: date + "Z" }
    : date;
  return humanReadableDateTime(normalizedDatetime, locale, timezone);
};

const getRouteText = (trip) => {
  const origin = trip?.origin?.display_name || "Origin pending";
  const destination = trip?.destination?.display_name || "Destination pending";
  return `${origin} -> ${destination}`;
};

const getDriverState = (trip) => {
  return trip?.driver?.name || "Needs driver";
};

const isUnassigned = (trip) => getDriverState(trip) === "Needs driver";

const getVisiblePriceBreakdown = (trip) => {
  return Object.entries(trip?.price_breakdown || {}).filter(([key, value]) => {
    return !HIDDEN_PRICE_KEYS.has(normalizeKey(key)) && value !== null;
  });
};

const getStatusClassName = (status) => {
  switch (status) {
    case TRIP_STATUS.CONFIRMED:
      return "bg-sky-50 text-sky-700 ring-sky-100";
    case TRIP_STATUS.ONGOING:
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case TRIP_STATUS.COMPLETED:
    case TRIP_STATUS.CLOSED:
      return "bg-slate-100 text-slate-700 ring-slate-200";
    case TRIP_STATUS.CANCELLED:
      return "bg-rose-50 text-rose-700 ring-rose-100";
    case TRIP_STATUS.DISPUTED:
      return "bg-amber-50 text-amber-700 ring-amber-100";
    default:
      return "bg-slate-50 text-slate-600 ring-slate-200";
  }
};

const getPageStats = (trips, pagination) => {
  return [
    {
      label: "Total Trips",
      value: pagination.total ?? trips.length,
    },
    {
      label: "Needs Driver",
      value: trips.filter(isUnassigned).length,
    },
    {
      label: "In Progress",
      value: trips.filter((trip) => trip.status === TRIP_STATUS.ONGOING).length,
    },
    {
      label: "Exceptions",
      value: trips.filter(
        (trip) =>
          trip.status === TRIP_STATUS.DISPUTED ||
          trip.status === TRIP_STATUS.CANCELLED,
      ).length,
    },
  ];
};

function Dashboard() {
  const [page, setPage] = useState(1);
  const { locale } = useLocale();
  const { timezone:clientTimezone } = useTimezone();
  
  const { data, isLoading, isError, error, refetch, isFetching } =
    useTripBookings({
      page,
      limit: PAGE_SIZE,
    });

  const trips = useMemo(() => getTripsFromResponse(data), [data]);
  const pagination = useMemo(() => getPaginationFromResponse(data), [data]);
  const stats = useMemo(
    () => getPageStats(trips, pagination),
    [trips, pagination],
  );
  const currentPage = pagination.page ?? page;
  const totalPages = pagination.total_pages ?? pagination.totalPages ?? 1;
  const hasPrevious = pagination.has_previous ?? currentPage > 1;
  const hasNext = pagination.has_next ?? currentPage < totalPages;

  return (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Activity className="h-4 w-4" />
            Service Activity
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
        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-280 w-full text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Booking</th>
                    <th className="px-3 py-3">Trip</th>
                    <th className="px-3 py-3">Route</th>
                    <th className="px-3 py-3">Start</th>
                    <th className="px-3 py-3">Driver Fare</th>
                    <th className="px-3 py-3">Driver</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-sm">
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-3 py-4" colSpan={8}>
                          <div className="h-5 animate-pulse rounded bg-slate-100" />
                        </td>
                      </tr>
                    ))}

                  {isError && !isLoading && (
                    <tr>
                      <td className="px-4 py-12 text-center" colSpan={8}>
                        <p className="text-sm font-semibold text-slate-950">
                          Could not load trips.
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {error?.message || "Please retry the bookings list."}
                        </p>
                        <button
                          type="button"
                          onClick={() => refetch()}
                          className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Retry
                        </button>
                      </td>
                    </tr>
                  )}

                  {!isLoading && !isError && trips.length === 0 && (
                    <tr>
                      <td className="px-4 py-12 text-center" colSpan={8}>
                        <p className="text-sm font-semibold text-slate-950">
                          No trips found.
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try another status, date range, or booking search once
                          filters are enabled.
                        </p>
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    !isError &&
                    trips.map((trip) => {
                      const breakdown = getVisiblePriceBreakdown(trip);
                      const currencyCode =
                        trip?.currency?.code || DEFAULT_CURRENCY_CODE;

                      return (
                        <tr key={trip.id || trip.booking_id}>
                          <td className="px-3 py-4 align-top">
                            <p className="max-w-52 truncate font-semibold text-slate-950">
                              {trip.booking_id || trip.id}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {trip.customer?.name || "Customer pending"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {trip.customer?.phone_number ||
                                trip.customer?.email ||
                                "--"}
                            </p>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <p className="font-semibold text-slate-900">
                              {trip.trip_type?.display_name ||
                                formatLabel(trip.trip_type?.trip_type)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {trip.fleet?.name || "Fleet pending"} |{" "}
                              {trip.num_passengers ?? 0} pax
                            </p>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <p className="max-w-72 text-sm font-medium text-slate-900">
                              {getRouteText(trip)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {trip.origin?.region_code || "--"} to{" "}
                              {trip.destination?.region_code || "--"}
                            </p>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <p className="font-medium text-slate-900">
                              {formatTripDate(
                                trip.start_datetime,
                                locale,
                                clientTimezone?.timezone ?? trip.timezone,
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatLabel(trip.label)}
                            </p>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <p className="font-semibold text-slate-950">
                              {formatMoney(trip.cost_to_driver, currencyCode)}
                            </p>
                            <div className="mt-2 flex max-w-56 flex-wrap gap-1">
                              {breakdown.length > 0 ? (
                                breakdown.map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                                  >
                                    {formatLabel(key)}{" "}
                                    {formatMoney(value, currencyCode)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-500">
                                  No breakup shared
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                isUnassigned(trip)
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {getDriverState(trip)}
                            </span>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${getStatusClassName(
                                trip.status,
                              )}`}
                            >
                              {formatLabel(trip.status)}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-right align-top">
                            <button
                              type="button"
                              className="h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
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
