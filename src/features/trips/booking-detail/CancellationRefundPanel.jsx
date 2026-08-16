import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  LoaderCircle,
  ReceiptText,
} from "lucide-react";
import { isDevMode } from "@/api";
import { TripBadge } from "@/features/trips/components";
import { useIssueRefund, useLocale, useTimezone, useToast } from "@/hooks";
import {
  EMPTY_VALUE,
  TRIP_STATUS,
  formatSnakeCasedStringAsLabel,
  FORBIDDEN_STATUS_CODE
} from "@/utils";
import { useTripsHelper } from "../hooks";
import { DetailField, DetailGrid, DetailSection } from "./BookingDetailShared";

function getIssueRefundErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join(" ");
  }

  if (error?.response?.status === FORBIDDEN_STATUS_CODE) {
    return "You do not have permission to issue this refund.";
  }

  return "Could not place the refund issue request. Please try again.";
}

function getRefundStatusClassName(status) {
  switch (status) {
    case "completed":
    case "processed":
    case "success":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "processing":
    case "initiated":
    case "pending":
      return "bg-sky-50 text-sky-700 ring-sky-100";
    case "failed":
      return "bg-rose-50 text-rose-700 ring-rose-100";
    default:
      return "bg-slate-50 text-slate-600 ring-slate-200";
  }
}

function CancellationRefundPanel({ bookingDetail }) {
  const { showToast } = useToast();
  const { locale } = useLocale();
  const { timezone: clientTimezone } = useTimezone();
  const { formatCurrency, formatDateTime } = useTripsHelper();
  const issueRefund = useIssueRefund();
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [refundRequestPlaced, setRefundRequestPlaced] = useState(false);

  const cancellation = bookingDetail?.cancellation;
  const refund = bookingDetail?.refund;
  const canIssueRefund = Boolean(bookingDetail?.can_issue_refund);
  const isCancelledTrip = bookingDetail?.status === TRIP_STATUS.CANCELLED;
  const isIssuingRefund = issueRefund.isPending;
  const canSubmitRefundRequest =
    canIssueRefund && !refundRequestPlaced && hasConfirmed && !isIssuingRefund;

  if (!isCancelledTrip && !cancellation && !refund) {
    return null;
  }

  const timezone = clientTimezone?.timezone ?? bookingDetail?.timezone;
  const refundAmount =
    refund?.refund_amount !== null && refund?.refund_amount !== undefined
      ? formatCurrency(refund.refund_amount, bookingDetail?.currency?.code)
      : EMPTY_VALUE;

  const handleIssueRefund = async () => {
    if (!canSubmitRefundRequest) return;

    try {
      const response = await issueRefund.mutateAsync(bookingDetail?.booking_id);

      showToast(
        response?.message || "Refund request sent. We will try it shortly.",
        "success",
      );
      setHasConfirmed(false);
      setRefundRequestPlaced(true);
    } catch (error) {
      if (isDevMode) {
        console.error("Error issuing refund:", error);
      }
      showToast(getIssueRefundErrorMessage(error), "error");
    }
  };

  return (
    <DetailSection title="Cancellation And Refund" icon={ReceiptText}>
      <div className="grid gap-4">
        {cancellation && (
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-950">
                Cancellation Details
              </p>
              <TripBadge className="bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                Cancelled
              </TripBadge>
            </div>
            <DetailGrid>
              <DetailField
                label="Reason"
                value={cancellation?.reason || EMPTY_VALUE}
              />
              <DetailField
                label="Sub Status"
                value={formatSnakeCasedStringAsLabel(
                  cancellation?.cancellation_sub_status,
                )}
              />
              <DetailField
                label="Cancelled At"
                value={formatDateTime(cancellation?.created_at, locale, timezone)}
              />
            </DetailGrid>
          </div>
        )}

        {refund && (
          <div className="rounded-lg border border-slate-100 bg-white p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-950">
                Refund Summary
              </p>
              <TripBadge
                className={`ring-1 ${getRefundStatusClassName(
                  refund.refund_status,
                )}`}
              >
                {formatSnakeCasedStringAsLabel(refund.refund_status)}
              </TripBadge>
            </div>

            <DetailGrid>
              <DetailField label="Refund Amount" value={refundAmount} />
              <DetailField
                label="Refund Type"
                value={formatSnakeCasedStringAsLabel(refund?.refund_type)}
              />
              <DetailField
                label="Provider"
                value={formatSnakeCasedStringAsLabel(refund?.refund_provider)}
              />
              <DetailField
                label="Trigger"
                value={formatSnakeCasedStringAsLabel(refund?.refund_trigger)}
              />
              <DetailField
                label="Initiated At"
                value={formatDateTime(
                  refund?.refund_initiated_datetime,
                  locale,
                  timezone,
                )}
              />
            </DetailGrid>
            {refund?.refund_description && (
              <p className="mt-3 hidden rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
                {refund.refund_description}
              </p>
            )}
          </div>
        )}

        {canIssueRefund && refundRequestPlaced && (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-3">
            <div className="flex items-start gap-2 text-xs leading-5 text-emerald-800">
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <p>
                Refund issuance request sent. The refund status may update
                later.
              </p>
            </div>
          </div>
        )}

        {canIssueRefund && !refundRequestPlaced && (
          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
            <div className="flex items-start gap-2 text-xs leading-5 text-amber-900">
              <AlertTriangle
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <p>
                This sends one more refund issuance request now. If it does not
                go through yet, Cabbo will keep checking again later.
              </p>
            </div>

            <label
              className={`mt-3 flex items-start gap-2 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-xs leading-5 text-slate-700 ${
                isIssuingRefund ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                disabled={isIssuingRefund}
                checked={hasConfirmed}
                onChange={(event) => setHasConfirmed(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span>
                I reviewed this cancellation and want to send a refund issuance
                request now.
              </span>
            </label>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={!canSubmitRefundRequest}
                onClick={handleIssueRefund}
                className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-60"
              >
                {isIssuingRefund ? (
                  <LoaderCircle
                    className="h-3.5 w-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {isIssuingRefund ? "Sending request..." : "Issue refund"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DetailSection>
  );
}

export { CancellationRefundPanel };
