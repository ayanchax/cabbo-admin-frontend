import { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { MapPinned, RefreshCw } from "lucide-react";
import { useTripBookings, useLocale, useTimezone } from "@/hooks";
import { useTripsDashboardHelper } from "@/features/trips/hooks";
import {
  DEFAULT_CURRENCY_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  ROUTES,
  formatSnakeCasedStringAsLabel,
} from "@/utils";
import { EmptyState, Forbidden, SectionTitle } from "@/components";
import {
  TripCard,
  TripsLoaderSkeleton,
  TripStats,
  TripFilters,
  TripsPagination,
  TripsDashboardHeader,
} from "@/features/trips/components";

const NoTripsSVG = (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="96" height="96" rx="24" fill="#F3F4F6"/>
    <path d="M28 68c0-8 8-12 20-12s20 4 20 12" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/>
    <rect x="36" y="36" width="24" height="16" rx="8" fill="#E5E7EB"/>
    <circle cx="44" cy="60" r="4" fill="#A3A3A3"/>
    <circle cx="52" cy="60" r="4" fill="#A3A3A3"/>
    <path d="M40 44h16" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/>
    <path d="M48 36v8" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
function Dashboard() {
  const {
    defaultFilters: DEFAULT_FILTERS,
    pageSize: PAGE_SIZE,
    getTripQueryParams,
    getTripsFromResponse,
    sortTripsByNearestStart,
    getPaginationFromResponse,
    getPageStats,
    getVisiblePriceBreakdown,
    getDriverState,
    getOperationalStatus,
    getAttentionChips,
    getExtraChargesText,
    getVisibleOverageRates,
    formatTripDate,
    getTripMetaText,
  } = useTripsDashboardHelper();
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const navigate = useNavigate();
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

  const shouldShowErrorState =
    isError && !isForbidden && !isLoading && !isNotFound;
  const filtersAreDirty =
    JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);
  const errorMessage =
    typeof error?.message === "string" && error.message
      ? error.message
      : "Please try after sometime.";

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const resetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleOpen = (bookingId) => {
    if (!bookingId) return;
    navigate(generatePath(ROUTES.BOOKING_DETAIL, { id: bookingId }));
  };

  return (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <TripsDashboardHeader />
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
            <div className="grid gap-2 p-2 sm:p-3">
              {isLoading && <TripsLoaderSkeleton />}

              {isForbidden && !isLoading && (
                <Forbidden message="You do not have permission to view trips operations." />
              )}

              {shouldShowErrorState && (
                <EmptyState
                  illustration = {NoTripsSVG}
                  title="Could not load trips."
                  message={errorMessage}
                  action={
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </button>
                  }
                />
              )}

              {shouldShowEmptyState && (
                <EmptyState
                  illustration = {NoTripsSVG}
                  title="No trips found."
                  message="Try another status, trip type, or date range."
                />
              )}

              {!isLoading && !isError && sortedTrips.length > 0 && (
                <>
                  {sortedTrips.map((trip) => {
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
                </>
              )}
            </div>
            
            {!shouldShowEmptyState && <TripsPagination
              currentPage={currentPage}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              isFetching={isFetching}
              onNext={() => setPage((current) => current + 1)}
              onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
              totalItems={pagination.total}
              totalPages={totalPages}
            />}
            
          </div>
        </div>
      </section>
    </>
  );
}
export { Dashboard };
