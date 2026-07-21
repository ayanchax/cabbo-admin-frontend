import { useState } from "react";
import { MapPinned, RefreshCw } from "lucide-react";
import { useTripBookings, useLocale, useTimezone } from "@/hooks";
import { useTripsDashboardHelper } from "@/features/trips/hooks";
import {
  DEFAULT_CURRENCY_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  formatSnakeCasedStringAsLabel,
} from "@/utils";
import { EmptyState, Forbidden, SectionTitle } from "@/components";
import {
  TripCard,
  TripsLoaderSkeleton,
  TripStats,
  QuickFilters,
  TripFilters,
  TripsPagination,
  TripsDashboardHeader,
} from "@/features/trips/components";

function Dashboard() {
  const {
    defaultFilters: DEFAULT_FILTERS,
    pageSize: PAGE_SIZE,
    quickFilters,
    getTripQueryParams,
    getTripsFromResponse,
    sortTripsByNearestStart,
    getPaginationFromResponse,
    getPageStats,
    getQuickFilterValues,
    getVisiblePriceBreakdown,
    getDriverState,
    getOperationalStatus,
    getAttentionChips,
    getExtraChargesText,
    getVisibleOverageRates,
    getRouteTimelineParams,
    formatTripDate,
    getTripMetaText,
  } = useTripsDashboardHelper();
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const { locale } = useLocale();
  const { timezone: clientTimezone } = useTimezone();
  const queryParams = getTripQueryParams(appliedFilters);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTripBookings({
      page,
      limit: PAGE_SIZE,
      ...queryParams,
    });

  const trips = getTripsFromResponse(data);
  const sortedTrips = sortTripsByNearestStart(trips);
  const pagination = getPaginationFromResponse(data);
  const stats = getPageStats(trips, pagination);
  const currentPage = pagination.page ?? page;
  const totalPages = pagination.total_pages ?? pagination.totalPages ?? 1;
  const hasPrevious = pagination.has_previous ?? currentPage > 1;
  const hasNext = pagination.has_next ?? currentPage < totalPages;
  const isForbidden = error?.response?.status === FORBIDDEN_STATUS_CODE;
  const isNotFound = error?.response?.status === NOT_FOUND_STATUS_CODE;
  const shouldShowEmptyState =
    !isLoading && (isNotFound || (!isError && sortedTrips.length === 0));
  const filtersAreDirty =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const resetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const selectQuickFilter = (quickFilter) => {
    const nextFilters = getQuickFilterValues(appliedFilters, quickFilter);
    setDraftFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  const handleOpen = (bookingId) => {
    console.log(`Open request for ${bookingId}`);
  };

  return (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <TripsDashboardHeader />

        <QuickFilters
          activeFilter={appliedFilters.quick}
          filters={quickFilters}
          onSelect={selectQuickFilter}
        />
      </div>
      <div className="mb-4">
        <TripFilters
          filters={draftFilters}
          isDirty={filtersAreDirty}
          onApply={applyFilters}
          onChange={setDraftFilters}
          onReset={resetFilters}
        />
      </div>
      <TripStats stats={stats} isLoading={isLoading} />

      <section className="rounded-lg border border-slate-200 bg-white">
        <SectionTitle
          title="Operations Workbench"
          version="V1"
          icon={MapPinned}
        />

        <div className="p-3 sm:p-4">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <div className="grid gap-2 p-2  sm:p-3">
              {isLoading && <TripsLoaderSkeleton />}

              {isForbidden && !isLoading && (
                <Forbidden message="You do not have permission to view trips operations." />
              )}

              {isError && !isForbidden && !isLoading && !isNotFound && (
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

              {shouldShowEmptyState && (
                <EmptyState
                  message="No trips found."
                  subTitle="Try another status, trip type, or date range."
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
                      onOpen={handleOpen}
                    />
                  );
                })}
            </div>

            <TripsPagination
              currentPage={currentPage}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              isFetching={isFetching}
              onNext={() => setPage((current) => current + 1)}
              onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
              totalItems={pagination.total}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>
    </>
  );
}
export { Dashboard };
