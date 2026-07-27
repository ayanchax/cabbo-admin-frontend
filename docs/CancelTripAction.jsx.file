import React, { useState } from "react";
import { AlertTriangle, ChevronDown, X } from "lucide-react";
import { useCancelTripBooking, useToast, useFragmentScroll } from "@/hooks";
import { APP } from "@/utils";

const MAX_CANCELLATION_REASON_LENGTH = 250;
const CANCELLATION_REASONS = [
  "Plans changed",
  "Booked by mistake",
  "Found another ride",
  "Driver/cab not assigned yet",
  "Other",
];
const OTHER_REASON = "Other";

function CancelTripAction({ bookingId, className = "" }) {
  const { scrollToFragment } = useFragmentScroll();
  const { showToast } = useToast();
  const cancelTripApi = useCancelTripBooking();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const trimmedCustomReason = customReason.trim();
  const charsLeft = MAX_CANCELLATION_REASON_LENGTH - customReason.length;
  const finalReason =
    selectedReason === OTHER_REASON ? trimmedCustomReason : selectedReason;
  const canCancel =
    Boolean(bookingId) && Boolean(finalReason) && !cancelTripApi.isPending;

  const handleDiscardChanges = () => {
    setIsOpen(false);
    setSelectedReason("");
    setCustomReason("");
  };

   

  const handleCancelTrip = async () => {
    if (!canCancel) return;

    const payload = {
      reason: finalReason,
      cancelation_detail: {
        cancellation_sub_status: "customer_cancelled",
        reason: finalReason,
      },
    };

    try {
      await cancelTripApi.mutateAsync({ bookingId, payload });
      showToast(
        "Trip cancelled. Refund details will update shortly.",
        "success",
      );
      setIsOpen(false);
    } catch {
      showToast(
        "We couldn't cancel this trip. Please try again or contact support.",
        "error",
      );
    }
  };

  return (
    <section
      className={`rounded-xl border border-red-100 bg-white p-3 shadow-sm sm:p-4 ${className}`}
      aria-label="Cancel Trip"
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-red-100"
        aria-expanded={isOpen}
        disabled={isOpen && cancelTripApi.isPending} // Disable the button while the cancellation is in progress
      >
        <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100 sm:h-10 sm:w-10">
            <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-950">
              Cancel this trip
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-gray-500">
             Review cancellation and refund details before confirming.
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="mt-3 border-t border-red-50 pt-3 sm:mt-4 sm:pt-4">
          <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-[11px] leading-5 text-amber-800 sm:text-xs">
            <AlertTriangle
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>
              Cancel only if you no longer need this ride. {APP.name} will
              calculate any refund based on the{" "}
              <a
                href="#refunds-and-cancellations"
                onClick={(event) => scrollToFragment(event, "refunds-and-cancellations")}
                className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700"
              >
                cancellation policy
              </a>{" "}
              for this booking.
            </span>
          </div>

          <label className="mt-3 block text-sm font-semibold text-gray-700">
            Reason for cancellation
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {CANCELLATION_REASONS.map((reasonOption) => {
              const isSelected = selectedReason === reasonOption;

              return (
                <button
                  key={reasonOption}
                  type="button"
                  onClick={() => setSelectedReason(reasonOption)}
                  className={`inline-flex min-h-8 cursor-pointer items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ring-1 transition sm:px-3 sm:text-xs ${
                    isSelected
                      ? "bg-red-50 text-red-700 ring-red-200"
                      : "bg-gray-50 text-gray-600 ring-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {reasonOption}
                </button>
              );
            })}
          </div>

          {selectedReason === OTHER_REASON && (
            <>
              <textarea
                value={customReason}
                onChange={(event) => setCustomReason(event.target.value)}
                maxLength={MAX_CANCELLATION_REASON_LENGTH}
                rows={3}
                className="mt-3 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-800 outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
                placeholder="Tell us why you are cancelling."
              />
              <div className="mt-1 text-right">
                <span
                  className={`text-xs ${
                    charsLeft < 20 ? "text-amber-700" : "text-gray-400"
                  }`}
                >
                  {charsLeft} characters left
                </span>
              </div>
            </>
          )}

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span
              className={`text-xs leading-5 ${
                finalReason ? "text-gray-400" : "text-amber-700"
              }`}
            >
              {finalReason
                ? "You can review once more before confirming."
                : selectedReason !== OTHER_REASON
                  ? "Select a reason to continue."
                  : "Please provide a reason to cancel."}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:px-4"
              >
                Keep trip
              </button>
              <button
                type="button"
                onClick={handleCancelTrip}
                disabled={!canCancel}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-red-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
              >
                {cancelTripApi.isPending
                  ? "Cancelling..."
                  : "Confirm cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export { CancelTripAction };
