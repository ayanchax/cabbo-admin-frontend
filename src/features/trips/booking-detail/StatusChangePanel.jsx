import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  ChevronDown,
  LoaderCircle,
  ShieldAlert,
} from "lucide-react";
import { isDevMode } from "@/api";
import { useToast, useUpdateTripStatusMutation } from "@/hooks";
import {
  EMPTY_ACTIONS,
  TRIP_STATUS,
  formatSnakeCasedStringAsLabel,
} from "@/utils";
import { useStatusChangeHelper, useTripsHelper } from "../hooks";
import { TripBadge } from "@/features/trips/components";

const ACTION_OPEN_HIGHLIGHT_MS = 2200;

function FieldControl({ disabled, field, onChange, value }) {
  const { FIELD_TYPES } = useStatusChangeHelper();
  const id = `status-field-${field.name}`;
  const commonClassName =
    "mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 disabled:opacity-60";

  return (
    <div className={`min-w-0 transition ${disabled ? "opacity-60" : ""}`}>
      <label
        htmlFor={id}
        className="wrap-break-word text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        {field.label || formatSnakeCasedStringAsLabel(field.name)}
        {field.required && <span className="text-rose-600"> *</span>}
      </label>

      {field.type === FIELD_TYPES.ENUM ? (
        <select
          id={id}
          disabled={disabled}
          value={value ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={commonClassName}
        >
          <option value="">Select</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {formatSnakeCasedStringAsLabel(option)}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          disabled={disabled}
          type={
            field.type === FIELD_TYPES.DATETIME
              ? "datetime-local"
              : field.type === FIELD_TYPES.NUMBER
                ? "number"
                : "text"
          }
          min={field.type === FIELD_TYPES.NUMBER ? "0" : undefined}
          step={field.type === FIELD_TYPES.NUMBER ? "0.01" : undefined}
          value={value ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.label || formatSnakeCasedStringAsLabel(field.name)}
          className={commonClassName}
        />
      )}

      {field.description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {field.description}
        </p>
      )}
    </div>
  );
}

function PayloadFields({
  className = "grid gap-3",
  disabled,
  fields = [],
  onChange,
  values,
}) {
  const { FIELD_TYPES } = useStatusChangeHelper();
  if (!fields.length) return null;

  return (
    <div className={className}>
      {fields.map((field) => {
        if (field.type === FIELD_TYPES.OBJECT && Array.isArray(field.fields)) {
          return (
            <div
              key={field.name}
              className={`min-w-0 rounded-lg border border-slate-100 bg-slate-50/70 p-3 transition md:col-span-2 ${
                disabled ? "opacity-60" : ""
              }`}
            >
              <p className="wrap-break-word text-xs font-semibold uppercase tracking-wide text-slate-500">
                {field.label || formatSnakeCasedStringAsLabel(field.name)}
                {field.required && <span className="text-rose-600"> *</span>}
              </p>
              {field.description && (
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {field.description}
                </p>
              )}
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <PayloadFields
                  className="contents"
                  disabled={disabled}
                  fields={field.fields || []}
                  onChange={onChange}
                  values={values}
                />
              </div>
            </div>
          );
        }

        return (
          <FieldControl
            key={field.name}
            disabled={disabled}
            field={field}
            onChange={onChange}
            value={values[field.name]}
          />
        );
      })}
    </div>
  );
}

function StatusChangePanel({ bookingDetail }) {
  const { getDriverState, getOperationalStatus } = useTripsHelper();
  const {
    getMissingRequiredFields,
    getInitialFormValues,
    buildPayload,
    updateTripStatusInCache,
    getErrorMessage,
    STATUS_ACTION_STYLES,
  } = useStatusChangeHelper();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const actions = bookingDetail?.allowed_status_transitions || EMPTY_ACTIONS;
  const driverState = getDriverState(bookingDetail);
  const operationalStatus = getOperationalStatus(bookingDetail);

  const [activeStatus, setActiveStatus] = useState(null);
  const [formValuesByStatus, setFormValuesByStatus] = useState({});
  const [confirmationByStatus, setConfirmationByStatus] = useState({});
  const [recentlyOpenedAction, setRecentlyOpenedAction] = useState(false);
  const activeActionPanelRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const updateStatusMutation = useUpdateTripStatusMutation();
  const isUpdating = updateStatusMutation.isPending;

  const activeAction = useMemo(
    () => actions.find((action) => action.target_status === activeStatus),
    [actions, activeStatus],
  );
  const activeFormValues = activeAction
    ? formValuesByStatus[activeAction.target_status] || {}
    : {};
  const missingRequiredFields = activeAction
    ? getMissingRequiredFields(activeAction, activeFormValues)
    : [];
  const userHasReviewedAndConfirmedActiveAction =
    !activeAction?.requires_confirmation ||
    Boolean(confirmationByStatus[activeAction.target_status]);
  const activeActionNeedsDriver =
    activeAction?.target_status === TRIP_STATUS.ONGOING &&
    !driverState?.assigned;
  const canSubmitStatusChange =
    Boolean(activeAction) &&
    !isUpdating &&
    !activeActionNeedsDriver &&
    userHasReviewedAndConfirmedActiveAction &&
    missingRequiredFields.length === 0;

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!recentlyOpenedAction) return;

    window.requestAnimationFrame(() => {
      activeActionPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [recentlyOpenedAction]);

  if (!actions.length) {
    return null;
  }

  const openAction = (action) => {
    const actionNeedsDriver =
      action?.target_status === TRIP_STATUS.ONGOING && !driverState?.assigned;
    if (isUpdating || actionNeedsDriver) return;

    const targetStatus = action.target_status;
    const shouldOpen = activeStatus !== targetStatus;

    setActiveStatus((currentStatus) =>
      currentStatus === targetStatus ? null : targetStatus,
    );
    setFormValuesByStatus((currentValues) => ({
      ...currentValues,
      [targetStatus]:
        currentValues[targetStatus] || getInitialFormValues(action),
    })); // {ongoing: {....}}

    if (shouldOpen) {
      setRecentlyOpenedAction(true);
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
      highlightTimeoutRef.current = window.setTimeout(() => {
        setRecentlyOpenedAction(false);
      }, ACTION_OPEN_HIGHLIGHT_MS);
    }
  };

  const updateField = (fieldName, value) => {
    if (!activeStatus) return;

    setFormValuesByStatus((currentValues) => ({
      ...currentValues,
      [activeStatus]: {
        ...(currentValues[activeStatus] || {}),
        [fieldName]: value,
      },
    }));
  };

  const resetActiveAction = () => {
    if (!activeStatus) return;

    setFormValuesByStatus((currentValues) => {
      const nextValues = { ...currentValues };
      delete nextValues[activeStatus];
      return nextValues;
    });
    setConfirmationByStatus((currentValue) => {
      const nextValue = { ...currentValue };
      delete nextValue[activeStatus];
      return nextValue;
    });
    setActiveStatus(null);
  };

  const handleStatusUpdate = async () => {
    if (!activeAction || isUpdating || activeActionNeedsDriver) return;

    const targetStatus = activeAction.target_status;
    const formValues = formValuesByStatus[targetStatus] || {};
    const missingFields = getMissingRequiredFields(activeAction, formValues);

    if (missingFields.length) {
      showToast(
        `Fill ${missingFields.map((field) => field.label || field.name).join(", ")} before continuing.`,
        "error",
      );
      return;
    }

    if (
      activeAction.requires_confirmation &&
      !confirmationByStatus[targetStatus]
    ) {
      showToast("Confirm this status change before submitting.", "error");
      return;
    }

    try {
      const response = await updateStatusMutation.mutateAsync({
        bookingId: bookingDetail?.booking_id,
        status: targetStatus,
        payload: buildPayload(activeAction, formValues),
      });

      showToast(
        response?.data?.message ||
          `Trip moved to ${formatSnakeCasedStringAsLabel(targetStatus)}.`,
        "success",
      );
      queryClient.invalidateQueries({
        queryKey: ["tripBookingDetail", bookingDetail?.booking_id],
      });
      queryClient.setQueriesData(
        { queryKey: ["tripBookingsDashboard"] },
        (currentTripsResponse) =>
          updateTripStatusInCache(
            currentTripsResponse,
            bookingDetail?.booking_id,
            targetStatus,
          ),
      );
      queryClient.invalidateQueries({ queryKey: ["tripBookingsDashboard"] });
      setActiveStatus(null);
      setConfirmationByStatus({});
    } catch (error) {
      if (isDevMode) {
        console.error("Error updating trip status:", error);
      }
      showToast(getErrorMessage(error), "error");
    }
  };

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4"
      aria-label="Trip status actions"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">Change Status</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Choose one of the available next steps for this trip.
          </p>
        </div>

        <TripBadge className={`ring-1 ${operationalStatus.className}`}>
          {operationalStatus.label}
        </TripBadge>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {actions.map((action) => {
          const targetStatus = action.target_status;
          const isActive = activeStatus === targetStatus;
          const actionNeedsDriver =
            targetStatus === TRIP_STATUS.ONGOING && !driverState?.assigned;
          const isDisabled = isUpdating || actionNeedsDriver;
          const styles = STATUS_ACTION_STYLES[targetStatus] || {
            iconClassName: "bg-slate-50 text-slate-600 ring-slate-100",
            buttonClassName: "bg-slate-900 text-white hover:bg-slate-800",
          };

          return (
            <button
              key={targetStatus}
              type="button"
              onClick={() => openAction(action)}
              disabled={isDisabled}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
                isActive
                  ? "border-primary/30 bg-primary/5 ring-2 ring-primary/10"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
              aria-expanded={isActive}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${styles.iconClassName}`}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-950">
                    {action.label ||
                      formatSnakeCasedStringAsLabel(targetStatus)}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {actionNeedsDriver
                      ? "Assign a driver before starting the trip"
                      : `Move to ${formatSnakeCasedStringAsLabel(targetStatus)}`}
                  </span>
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  isActive ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {activeAction && (
        <div
          ref={activeActionPanelRef}
          className={`mt-3 rounded-lg border p-3 transition ${
            recentlyOpenedAction
              ? "border-sky-300 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
              : "border-slate-100"
          }`}
        >
          <div
            className={`mb-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-5 ${
              activeAction.confirmation_level === "strong"
                ? "border-rose-100 bg-rose-50/70 text-rose-900"
                : "border-amber-100 bg-amber-50/70 text-amber-900"
            }`}
          >
            {activeAction.confirmation_level === "strong" ? (
              <ShieldAlert
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            )}
            <p>
              Updating this status can trigger operational side effects such as
              customer notifications, driver release, refunds, or dispute
              handling.
            </p>
          </div>

          <PayloadFields
            className="grid gap-3 md:grid-cols-2"
            disabled={isUpdating}
            fields={activeAction.payload_fields || []}
            onChange={updateField}
            values={activeFormValues}
          />

          {activeAction.requires_confirmation && (
            <label
              className={`mt-3 flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs leading-5 text-slate-600 transition ${
                isUpdating ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                disabled={isUpdating}
                checked={Boolean(
                  confirmationByStatus[activeAction.target_status],
                )}
                onChange={(event) =>
                  setConfirmationByStatus((currentValue) => ({
                    ...currentValue,
                    [activeAction.target_status]: event.target.checked,
                  }))
                }
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span>
                I have reviewed this booking and want to change the trip status
                to {activeStatus}
              </span>
            </label>
          )}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={resetActiveAction}
              className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmitStatusChange}
              onClick={handleStatusUpdate}
              className={`cursor-pointer inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-60 ${
                canSubmitStatusChange
                  ? STATUS_ACTION_STYLES[activeAction.target_status]
                      ?.buttonClassName ||
                    "bg-slate-900 text-white hover:bg-slate-800"
                  : ""
              }`}
            >
              {isUpdating && (
                <LoaderCircle
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
              )}
              {isUpdating ? "Updating..." : activeAction.label}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export { StatusChangePanel };
