import { Check, RotateCcw } from "lucide-react";
import {
  TRIP_STATUS,
  TRIP_TYPES,
  formatSnakeCasedStringAsLabel,
} from "@/utils";

const statusOptions = [
  TRIP_STATUS.CONFIRMED,
  TRIP_STATUS.ONGOING,
  TRIP_STATUS.COMPLETED,
  TRIP_STATUS.CANCELLED,
  TRIP_STATUS.DISPUTED,
];
const tripTypeOptions = Object.values(TRIP_TYPES);

function TripFilters({ filters, isDirty = false, onApply, onChange, onReset }) {
  const updateFilter = (key, value) => {
    onChange?.({ ...filters, [key]: value });
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(120px,1fr)_minmax(120px,1fr)_minmax(135px,1fr)_minmax(135px,1fr)_auto]">
        <label className="min-w-0">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </span>
          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatSnakeCasedStringAsLabel(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Trip Type
          </span>
          <select
            value={filters.tripType}
            onChange={(event) => updateFilter("tripType", event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="">All</option>
            {tripTypeOptions.map((tripType) => (
              <option key={tripType} value={tripType}>
                {formatSnakeCasedStringAsLabel(tripType)}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            From
          </span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => updateFilter("startDate", event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </label>

        <label className="min-w-0">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            To
          </span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => updateFilter("endDate", event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </label>

        <div className="flex flex-wrap items-end gap-2 sm:col-span-2 xl:col-span-1 xl:flex-nowrap xl:justify-end">
          <button
            type="button"
            disabled={!isDirty}
            onClick={onApply}
            className="inline-flex h-10 min-w-24 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Apply
          </button>

          <button
            type="button"
            disabled={!hasFilters}
            onClick={onReset}
            className="inline-flex h-10 min-w-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export { TripFilters };
