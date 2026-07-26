import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CarFront,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  Search,
  UserRound,
} from "lucide-react";
import { isDevMode } from "@/api";
import { DriverCell } from "@/features/trips/components";
import {
  useSearchDriverQuery,
  useAssignDriverMutation,
  useToast,
} from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";

const MIN_DRIVER_SEARCH_LENGTH = 2;

function getDriverRows(response) {
  if (Array.isArray(response?.drivers)) return response.drivers;
  return [];
}

function DriverAssignmentPanel({ bookingDetail, driverState }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const panelContentRef = useRef(null);
  const searchInputRef = useRef(null);
  const trimmedSearchText = searchText.trim();
  const debouncedSearchText = useDebounce(trimmedSearchText, 350);
  const assignedDriver = bookingDetail?.driver || null;
  const showPanel =
    driverState?.label === "Needs driver" || driverState?.assigned;
  const actionLabel = driverState?.assigned
    ? "Reassign driver"
    : "Assign driver";
  const assignedDriverText = [
    assignedDriver?.name || "Assigned driver",
    assignedDriver?.phone ? `(${assignedDriver.phone})` : null,
  ]
    .filter(Boolean)
    .join(" ");
  const headerSubtitle =
    driverState?.assigned && isOpen
      ? "Viewing current driver details."
      : driverState?.assigned
        ? `${assignedDriverText} · Click to view or reassign`
        : "Search by driver name and choose a suitable cab.";

  const queryOptions = useMemo(
    () => ({
      page: 1,
      limit: 5,
      name: debouncedSearchText,
    }),
    [debouncedSearchText],
  );

  const shouldSearch =
    isOpen && debouncedSearchText.length >= MIN_DRIVER_SEARCH_LENGTH;
  const { data, isFetching, isError } = useSearchDriverQuery(
    queryOptions,
    shouldSearch,
  );
  const drivers = getDriverRows(data);

  const assignDriverMutation = useAssignDriverMutation();
  const selectedDriverId = selectedDriver?.id || null;
  const showNoDriversMessage =
    shouldSearch && !isFetching && !isError && drivers.length === 0;
  const canAssign =
    Boolean(bookingDetail?.booking_id) &&
    Boolean(selectedDriverId) &&
    !assignDriverMutation.isPending;

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
      setIsOpen(false);
      setSearchText("");
      setSelectedDriver(null);
      queryClient.invalidateQueries({ queryKey: ["tripBookings"] });
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

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4"
      aria-label="Driver assignment"
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary/15"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-start gap-3">
          <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
              driverState?.assigned
                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                : "bg-amber-50 text-amber-700 ring-amber-100"
            }`}
          >
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

      {isOpen && (
        <div
          ref={panelContentRef}
          className="mt-3 border-t border-slate-100 pt-3"
        >
          {driverState?.assigned && (
            <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
              <DriverCell
                driver={assignedDriver}
                label="Assigned driver"
                showRegistrationBadge
              />
            </div>
          )}
          {driverState?.assigned && (
            <p className="mb-3 text-xs leading-5 text-slate-500">
              You can search and select another driver to reassign this trip.
            </p>
          )}
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
              disabled={assignDriverMutation.isPending}
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
                    onClick={() => setSelectedDriver(driver)}
                    className={`flex min-w-0 cursor-pointer items-start justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
                      isSelected
                        ? "border-primary/30 bg-primary/5 ring-2 ring-primary/10"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex min-w-0 gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-100">
                        <CarFront className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <DriverCell driver={driver} inlinePhone />
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

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span />
            <button
              onClick={handleAssign}
              type="button"
              disabled={!canAssign}
              className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold transition ${
                canAssign
                  ? "cursor-pointer bg-primary text-white shadow-sm hover:bg-primary/90"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
            >
              {assignDriverMutation.isPending ? "Assigning..." : actionLabel}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export { DriverAssignmentPanel };
