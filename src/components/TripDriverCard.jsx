import React, {useState} from "react";
import {
  BaggageClaim,
  CarFront,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import {APP, getInitials} from "@/utils";

  

function getDriverRatingClassName(rating) {
  if (rating >= 4.5) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (rating >= 3) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  return "bg-rose-50 text-rose-700 ring-rose-100";
}

function TripDriverCard({
  driver = null,
  showContactAction = false,
  className = "",
  showGender = false,
}) {
  const [imageError, setImageError] = useState(false);
  const hasDriver = Boolean(driver?.name);
  const initials = getInitials(driver?.name);
  const phoneHref = driver?.phone ? `tel:${driver.phone}` : null;
  const cabLabel = [driver?.cab_model_and_make, driver?.cab_type]
    .filter(Boolean)
    .join(" · ");
  const fuelLabel = driver?.fuel_type ? `(${driver.fuel_type})` : "";
  const driverTrustLabel =
    typeof driver.avg_rating === "number" && driver.avg_rating >= 4.5
      ? `Top rated ${APP.name} driver`
      : `${APP.name} driver`;
  const vehicleDetailsText = [driver?.color, driver?.capacity]
    .filter(Boolean)
    .join(" · ");

  if (!hasDriver) {
    // This will show only for trips which are upcoming/confirmed/created for whom driver is not assigned.
    return (
      <section
        className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
        aria-label="Driver Details"
      >
        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 ring-1 ring-gray-100">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-950">
              Driver will be assigned soon
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Driver and cab details will appear here once your driver is assigned.
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              We will share your driver details closer to pickup, usually about 30 minutes before your trip.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}
      aria-label="Driver Details"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
            {driver.profile_picture_url && !imageError ? (
              <img
                src={driver.profile_picture_url}
                alt={`Driver profile picture of ${driver.name}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop if fallback image also fails
                  setImageError(true);
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/5 text-sm font-bold text-primary">
                {initials || <UserRound className="h-6 w-6" />}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold text-gray-950">
                {driver.name}
              </h2>
              {typeof driver.avg_rating === "number" && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${getDriverRatingClassName(driver.avg_rating)}`}
                >
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                  {driver.avg_rating.toFixed(1)}
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              {driverTrustLabel}
              {showGender && driver.gender ? ` · ${driver.gender}` : ""}
            </p>
          </div>
        </div>

        {showContactAction && phoneHref && (
          <a
            href={phoneHref}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call driver
          </a>
        )}
      </div>

      <div className="mt-4 grid gap-2 border-t border-gray-100 pt-3 text-sm text-gray-600 sm:grid-cols-1">
        {(cabLabel || driver?.cab_registration_number) && (
          <div className="flex min-w-0 items-start gap-2">
            <CarFront className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0">
              {cabLabel && (
                <p className="truncate font-medium text-gray-800">
                  {cabLabel} {fuelLabel}
                </p>
              )}
              {(driver?.cab_registration_number ||
                vehicleDetailsText ||
                driver?.roof_carrier_available) && (
                <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                  {driver?.cab_registration_number && (
                    <span className="rounded bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gray-600 ring-1 ring-gray-100">
                      {driver.cab_registration_number}
                    </span>
                  )}
                  {vehicleDetailsText && (
                    <span className="min-w-0 truncate">
                      {vehicleDetailsText}
                    </span>
                  )}
                  {driver?.roof_carrier_available && (
                    <span
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700"
                      title="This cab comes with a roof carrier for additional luggage space"
                    >
                      <BaggageClaim className="h-3 w-3" aria-hidden="true" />
                      <span>Roof carrier</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!showContactAction && (
          <p className="text-xs leading-5 text-gray-500 sm:text-right">
            Contact details are shown when the trip is active.
          </p>
        )}
        {showContactAction && (
          <p className="text-xs leading-5 text-gray-500">
            Your driver may call before pickup to coordinate.
          </p>
        )}
      </div>
    </section>
  );
}

export { TripDriverCard };
