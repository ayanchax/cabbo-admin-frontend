import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

function TripsPagination({
  currentPage,
  totalPages,
  totalItems,
  hasNext,
  hasPrevious,
  isFetching,
  onNext,
  onPrevious,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-3">
      <p className="inline-flex items-center gap-1.5 text-sm text-slate-500">
        <span>Page {currentPage} of</span>
        {isFetching && (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-slate-400" />
        )}
        {!isFetching && (
          <span>
            {totalPages}
            {totalItems !== undefined ? ` | ${totalItems} trips` : ""}
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPrevious || isFetching}
          onClick={onPrevious}
          className=" cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          type="button"
          disabled={!hasNext || isFetching}
          onClick={onNext}
          className="cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { TripsPagination };
