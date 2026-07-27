import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState, Forbidden, Loader, PageHeader } from "@/components";
import { useTripBookingDetail } from "@/hooks";
import { FORBIDDEN_STATUS_CODE, NOT_FOUND_STATUS_CODE } from "@/utils";
import { BookingDetail } from "@/features/trips";

function BookingDetailPage() {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useTripBookingDetail(bookingId);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [bookingId]);

  const statusCode = error?.response?.status;
  const isForbidden = statusCode === FORBIDDEN_STATUS_CODE;
  const isNotFound = statusCode === NOT_FOUND_STATUS_CODE;
  const errorMessage =
    typeof error?.message === "string" && error.message
      ? error.message
      : "Please retry the booking detail request.";

  const retryAction = (
    <button
      type="button"
      onClick={() => refetch()}
      className="cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <RefreshCw className="h-4 w-4" />
      Retry
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <PageHeader title="Booking Detail" onBack={() => navigate(-1)} />
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Refresh booking detail"
          title="Refresh booking detail"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isLoading && (
        <Loader
          message="Loading booking..."
          className="min-h-90 rounded-lg border border-slate-200 bg-white"
        />
      )}

      {!isLoading && !bookingId && (
        <EmptyState
          title="Missing booking ID"
          message="Open a booking from the trips dashboard to inspect its operational details."
        />
      )}

      {!isLoading && isForbidden && (
        <Forbidden message="You do not have permission to view this booking." />
      )}

      {!isLoading && isNotFound && (
        <EmptyState
          title="Booking not found"
          message="This booking may have been removed, or the booking ID may be incorrect."
          action={retryAction}
        />
      )}

      {!isLoading && isError && !isForbidden && !isNotFound && (
        <EmptyState
          title="Could not load booking"
          message={errorMessage}
          action={retryAction}
        />
      )}

      {!isLoading && !isError && data && <BookingDetail bookingDetail={data} />}
    </div>
  );
}

export default BookingDetailPage;
