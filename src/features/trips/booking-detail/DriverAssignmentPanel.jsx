import { useEffect, useMemo, useRef, useState } from "react";
import {
  CarFront,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  Search,
  UserRound,
} from "lucide-react";
import { useSearchDriverQuery } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";

const MIN_DRIVER_SEARCH_LENGTH = 2;

function getDriverRows(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.drivers)) return response.drivers;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function DriverAssignmentPanel({ bookingDetail, driverState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const panelContentRef = useRef(null);
  const searchInputRef = useRef(null);
  const trimmedSearchText = searchText.trim();
  const debouncedSearchText = useDebounce(trimmedSearchText, 350);
  const assignedDriver = bookingDetail?.driver || null;
  const showPanel = driverState?.label === "Needs driver" || driverState?.assigned;
  const actionLabel = driverState?.assigned ? "Reassign driver" : "Assign driver";

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
  const {
    data,
    isFetching,
    isError,
  } = useSearchDriverQuery(queryOptions, shouldSearch);
  const drivers = getDriverRows(data);

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
              {driverState?.assigned
                ? `Current driver: ${assignedDriver?.name || "Assigned"}`
                : "Search by driver name and choose a suitable cab."}
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
          <label
            htmlFor="driver-search"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Driver name
          </label>
          <div className="mt-2 flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-primary/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              ref={searchInputRef}
              id="driver-search"
              type="search"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setSelectedDriverId("");
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

          {trimmedSearchText.length > 0 &&
            trimmedSearchText.length < MIN_DRIVER_SEARCH_LENGTH && (
              <p className="mt-2 text-xs text-slate-500">
                Type at least {MIN_DRIVER_SEARCH_LENGTH} characters to search.
              </p>
            )}

          {isError && (
            <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
              Driver search is unavailable right now. Please try again.
            </p>
          )}

          {shouldSearch && !isFetching && !isError && drivers.length === 0 && (
            <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
              No drivers found for this name.
            </p>
          )}

          {drivers.length > 0 && (
            <div className="mt-3 grid gap-2">
              {drivers.map((driver) => {
                const driverId = driver?.id || driver?.driver_id || driver?.phone;
                const isSelected = selectedDriverId === driverId;
                const cabText = [
                  driver?.cab_type,
                  driver?.fuel_type ? `(${driver.fuel_type})` : null,
                  driver?.cab_registration_number,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={driverId}
                    type="button"
                    onClick={() => setSelectedDriverId(driverId)}
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
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-950">
                          {driver?.name || "Unnamed driver"}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500">
                          {driver?.phone || driver?.email || "Contact unavailable"}
                        </span>
                        {cabText && (
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {cabText}
                          </span>
                        )}
                      </span>
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
            <p className="text-xs leading-5 text-slate-500">
              Assignment submit will be enabled after the driver assignment API
              is wired.
            </p>
            <button
              type="button"
              disabled
              className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-md bg-slate-200 px-3 text-xs font-semibold text-slate-500"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export { DriverAssignmentPanel };
