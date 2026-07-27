import { ClipboardCopy, LoaderCircle } from "lucide-react";
import { useDriverDispatchCopy } from "@/features/trips/hooks";

function CopyDriverTripDetailsAction({ bookingDetail }) {
  const { isCopying, hasAssignedDriver, copyDriverDispatchDetails } =
    useDriverDispatchCopy(bookingDetail);
  if (!hasAssignedDriver) {
    return null;
  }

  const handleCopy = async () => {
    await copyDriverDispatchDetails();
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-100">
            <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-950">
              Driver dispatch copy
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Copy the trip handoff details for the assigned driver.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={isCopying}
          className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isCopying ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
          )}
          {isCopying ? "Preparing..." : "Copy for driver"}
        </button>
      </div>
    </section>
  );
}

export { CopyDriverTripDetailsAction };
