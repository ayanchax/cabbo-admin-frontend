import React from "react";
import { MapPinned, Activity } from "lucide-react";

const quickFilters = ["Today", "Unassigned", "Ongoing", "Disputes"];

function Dashboard() {
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
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Queue
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Needs Driver
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            In Progress
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Exceptions
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
        </div>
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
            <div className="grid grid-cols-[1.1fr_0.8fr_1.5fr_0.8fr_0.8fr] bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Booking</span>
              <span>Status</span>
              <span>Route</span>
              <span>Driver</span>
              <span>Action</span>
            </div>
            <div className="flex min-h-64 items-center justify-center border-t border-slate-200 bg-white px-4 text-center">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Trips operations table will appear here.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Next step is wiring the bookings list endpoint, filters,
                  pagination, and row-level trip detail navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { Dashboard };
