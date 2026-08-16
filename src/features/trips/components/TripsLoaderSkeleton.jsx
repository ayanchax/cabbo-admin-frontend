import React from "react";

function TripsLoaderSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-slate-200 bg-white p-3"
        >
          <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="h-12 animate-pulse rounded bg-slate-100" />
            <div className="h-12 animate-pulse rounded bg-slate-100" />
            <div className="h-12 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </>
  );
}

export { TripsLoaderSkeleton };
