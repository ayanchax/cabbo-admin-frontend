import { BaggageClaim, Star } from "lucide-react";
import { useTripsHelper } from "@/features/trips/hooks";

function getDriverRatingClassName(rating) {
  if (rating >= 4.5) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (rating >= 3) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  return "bg-rose-50 text-rose-700 ring-rose-100";
}

function CabDriverInfo({
  driver,
  label = null,
  showRegistrationBadge = false,
  className = "",
}) {
  const { getDriverCabText } = useTripsHelper();

  if (!driver?.name) {
    return null;
  }

  const cabText = getDriverCabText(driver);
  const vehicleDetailsText = [driver?.color, driver?.capacity]
    .filter(Boolean)
    .join(" · ");
  const hasVehicleMeta =
    cabText ||
    vehicleDetailsText ||
    driver?.roof_carrier_available;

  return (
    <div className={`min-w-0 flex-1 ${className}`}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      )}
      <div className="mt-1 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-sm font-semibold text-slate-950">
              {driver.name}
            </p>
            {typeof driver.avg_rating === "number" && (
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${getDriverRatingClassName(
                  driver.avg_rating,
                )}`}
              >
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                {driver.avg_rating.toFixed(1)}
              </span>
            )}
          </div>
          {(driver.phone ||
            (showRegistrationBadge && driver.cab_registration_number)) && (
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              {driver.phone && (
                <span className="min-w-0 truncate font-medium leading-5">
                  {driver.phone}
                </span>
              )}
              {driver.phone &&
                showRegistrationBadge &&
                driver.cab_registration_number && (
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                )}
              {showRegistrationBadge && driver.cab_registration_number && (
                <span className="inline-flex w-fit shrink-0 rounded-md bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                  {driver.cab_registration_number}
                </span>
              )}
            </div>
          )}
          {hasVehicleMeta && (
            <div className="mt-1 flex min-w-0 items-center gap-2 overflow-hidden text-xs text-slate-500">
              {cabText && (
                <span className="min-w-0 shrink truncate font-medium leading-5">
                  {cabText}
                </span>
              )}
              {cabText && vehicleDetailsText && (
                <span className="shrink-0 text-slate-300" aria-hidden="true">
                  ·
                </span>
              )}
              {vehicleDetailsText && (
                <span className="min-w-0 shrink truncate leading-5">
                  {vehicleDetailsText}
                </span>
              )}
              {driver?.roof_carrier_available && (
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700"
                  title="This cab comes with a roof carrier for additional luggage space"
                >
                  <BaggageClaim className="h-3 w-3" aria-hidden="true" />
                  <span>Carrier</span> 
                  {/* Using Carrier instead of Roof carrier because carrier is a more driver community lingo */}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export {  CabDriverInfo };
