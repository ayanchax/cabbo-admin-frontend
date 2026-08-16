import React from "react";

function TripsDashboardHeader() {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-semibold ">Live Monitoring</span>
      </div>

      <h1 className="mt-1 text-2xl font-semibold text-slate-950">
        Trips Dashboard
      </h1>
    </div>
  );
}

export { TripsDashboardHeader };
