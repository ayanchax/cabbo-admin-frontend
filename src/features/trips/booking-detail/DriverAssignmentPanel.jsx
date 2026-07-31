import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CarFront,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  PencilLine,
  Search,
  UserRound,
} from "lucide-react";
import { isDevMode } from "@/api";
import { CabDriverInfo } from "@/features/trips/components";
import {
  useSearchDriverQuery,
  useAssignDriverMutation,
  useToast,
} from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { TRIP_OCCURENCE_LABELS, TRIP_STATUS } from "@/utils";

const MIN_DRIVER_SEARCH_LENGTH = 2;
const RECENT_UPDATE_HIGHLIGHT_MS = 2200;

function getDriverRows(response) {
  if (Array.isArray(response?.drivers)) return response.drivers;
  return [];
}

function updateTripDriverInCache(response, bookingId, driver) {
  if (!response || !bookingId) return response;

  if (Array.isArray(response)) {
    return response.map((trip) =>
      trip?.booking_id === bookingId ? { ...trip, driver } : trip,
    );
  }

  if (Array.isArray(response.trips)) {
    return {
      ...response,
      trips: response.trips.map((trip) =>
        trip?.booking_id === bookingId ? { ...trip, driver } : trip,
      ),
    };
  }

  return response;
}

function DriverAssignmentPanel({ bookingDetail, driverState }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const panelContentRef = useRef(null);
  const searchInputRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const trimmedSearchText = searchText.trim();
  const debouncedSearchText = useDebounce(trimmedSearchText, 350);
  const assignedDriver = bookingDetail?.driver || null;
  const canManageDriverAssignment =
    (bookingDetail?.needs_driver && bookingDetail?.needs_review) ||
    (bookingDetail?.label === TRIP_OCCURENCE_LABELS.UPCOMING &&
      [TRIP_STATUS.CREATED, TRIP_STATUS.CONFIRMED].includes(
        bookingDetail?.status,
      ));
  const showPanel =
    driverState?.assigned ||
    (driverState?.label === "Needs driver" && canManageDriverAssignment);
  const actionLabel = driverState?.assigned
    ? "Reassign driver"
    : "Assign driver";
  const headerSubtitle = "Search by driver name and choose a suitable cab.";

  const queryOptions = useMemo(
    () => ({
      page: 1,
      limit: 5,
      name: debouncedSearchText,
    }),
    [debouncedSearchText],
  );

  const shouldSearch =
    canManageDriverAssignment &&
    isOpen &&
    debouncedSearchText.length >= MIN_DRIVER_SEARCH_LENGTH;
  const { data, isFetching, isError } = useSearchDriverQuery(
    queryOptions,
    shouldSearch,
  );
  const drivers = getDriverRows(data);

  const assignDriverMutation = useAssignDriverMutation();
  const isAssigning = assignDriverMutation.isPending;
  const selectedDriverId = selectedDriver?.id || null;
  const showMinimumSearchHint =
    trimmedSearchText.length > 0 &&
    trimmedSearchText.length < MIN_DRIVER_SEARCH_LENGTH;
  const showNoDriversMessage =
    shouldSearch && !isFetching && !isError && drivers.length === 0;
  const canAssign =
    Boolean(bookingDetail?.booking_id) &&
    Boolean(selectedDriverId) &&
    canManageDriverAssignment &&
    !isAssigning;

  useEffect(() => {
    if (!isOpen) return;

    window.requestAnimationFrame(() => {
      panelContentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      searchInputRef.current?.focus({ preventScroll: true });
    });
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  if (!showPanel) {
    return null;
  }

  const handleAssign = async () => {
    if (!canAssign) {
      return;
    }
    try {
      const response = await assignDriverMutation.mutateAsync({
        bookingId: bookingDetail?.booking_id,
        driverId: selectedDriverId,
      });

      showToast(
        response?.data?.message || "Driver assigned successfully.",
        "success",
      );
      queryClient.setQueryData(
        ["tripBookingDetail", bookingDetail?.booking_id],
        (currentBookingDetail) =>
          currentBookingDetail
            ? {
                ...currentBookingDetail,
                driver: selectedDriver,
              }
            : currentBookingDetail,
      );
      queryClient.setQueriesData(
        { queryKey: ["tripBookingsDashboard"] },
        (currentTripsResponse) =>
          updateTripDriverInCache(
            currentTripsResponse,
            bookingDetail?.booking_id,
            selectedDriver,
          ),
      );
      setRecentlyUpdated(true);
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
      highlightTimeoutRef.current = window.setTimeout(() => {
        setRecentlyUpdated(false);
      }, RECENT_UPDATE_HIGHLIGHT_MS);
      setIsOpen(false);
      setSearchText("");
      setSelectedDriver(null);
    } catch (error) {
      if (isDevMode) {
        console.error("Error assigning driver:", error);
      }
      showToast(
        error?.response?.data?.detail ||
          "Error assigning driver at this moment",
        "error",
      );
    }
  };

  const searchPanel = (
    <div ref={panelContentRef} className="mt-3 border-t border-slate-100 pt-3">
      <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs leading-5 text-amber-900">
        <AlertCircle
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600"
          aria-hidden="true"
        />
        <p>
          Before assigning, review cab, luggage, and promised amenities for this
          booking.
        </p>
      </div>

      <label
        htmlFor="driver-search"
        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        Driver name
      </label>
      <div className="mt-2 flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-primary/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
        <Search
          className="h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={searchInputRef}
          id="driver-search"
          disabled={isAssigning}
          type="search"
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setSelectedDriver(null);
          }}
          placeholder="Search driver by name"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />

        {isFetching && (
          <LoaderCircle
            className="h-4 w-4 shrink-0 animate-spin text-primary"
            aria-hidden="true"
          />
        )}
      </div>

      {showMinimumSearchHint && (
        <p className="mt-2 text-xs text-slate-500">
          Type at least {MIN_DRIVER_SEARCH_LENGTH} characters to see drivers.
        </p>
      )}

      {isError && (
        <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Driver search is unavailable right now. Please try again.
        </p>
      )}

      {showNoDriversMessage && (
        <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
          No drivers found for this name.
        </p>
      )}

      {drivers.length > 0 && (
        <div className="mt-3 grid gap-2">
          {drivers.map((driver) => {
            const driverId = driver?.id;
            const isSelected = selectedDriverId === driverId;

            return (
              <button
                key={driverId}
                type="button"
                onClick={() => {
                  if (!isAssigning) {
                    setSelectedDriver(driver);
                  }
                }}
                disabled={isAssigning}
                className={`flex min-w-0 cursor-pointer items-start justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
                  isSelected
                    ? "border-primary/30 bg-primary/5 ring-2 ring-primary/10"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span className="flex min-w-0 gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-100">
                    <CarFront className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <CabDriverInfo driver={driver} inlinePhone showRegistrationBadge />
                </span>
                {isSelected && (
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        <span />
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          {driverState?.assigned && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSearchText("");
                setSelectedDriver(null);
              }}
              disabled={isAssigning}
              className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAssign}
            type="button"
            disabled={!canAssign}
            className={`inline-flex h-9 flex-1 items-center justify-center rounded-md px-3 text-xs font-semibold transition sm:flex-none ${
              canAssign
                ? "cursor-pointer bg-primary text-white shadow-sm hover:bg-primary/90"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            {isAssigning ? "Assigning..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );

  if (driverState?.assigned) {
    return (
      <section
        className={`rounded-lg border bg-white p-4 transition ${
          recentlyUpdated
            ? "border-sky-300 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
            : "border-slate-200"
        }`}
        aria-label="Assigned driver"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <span className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-100">
              <UserRound className="h-4 w-4" aria-hidden="true" />
            </span>
            <CabDriverInfo
              driver={assignedDriver}
              label="Assigned driver"
              showRegistrationBadge
              inlinePhone
            />
          </span>

          {!isOpen && canManageDriverAssignment && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              disabled={isAssigning}
              className="inline-flex h-8 w-fit shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-expanded={isOpen}
            >
              <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
              Reassign
            </button>
          )}
        </div>

        {isOpen && searchPanel}
      </section>
    );
  }

  return (
    <section
      className={`rounded-lg border bg-white p-4 transition ${
        recentlyUpdated
          ? "border-sky-300 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
          : "border-slate-200"
      }`}
      aria-label="Driver assignment"
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        disabled={isAssigning}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100">
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-950">
              {actionLabel}
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              {headerSubtitle}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && searchPanel}
    </section>
  );
}

export { DriverAssignmentPanel };
