import { useTripsHelper } from "@/features/trips/hooks";

function CabDriverInfo({
  driver,
  label = null,
  showRegistrationBadge = false,
  inlinePhone = false,
  className = "",
}) {
  const { getDriverCabText } = useTripsHelper();

  if (!driver?.name) {
    return null;
  }

  const cabText = getDriverCabText(driver);

  return (
    <div className={`min-w-0 ${className}`}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      )}
      <div className="mt-1 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {driver.name}
            {inlinePhone && driver.phone ? (
              <span className="font-medium text-slate-500">
                {" "}
                ({driver.phone})
              </span>
            ) : null}
          </p>
          {!inlinePhone && driver.phone && (
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
              {driver.phone}
            </p>
          )}
          {cabText && (
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
              {showRegistrationBadge &&
                driver.cab_registration_number &&
                inlinePhone && (
                  <span className="inline-flex w-fit shrink-0 rounded-full bg-white mr-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    {driver.cab_registration_number}
                  </span>
                )}
              {cabText}
            </p>
          )}
        </div>
        {showRegistrationBadge &&
          driver.cab_registration_number &&
          !inlinePhone && (
            <span className="inline-flex w-fit shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              {driver.cab_registration_number}
            </span>
          )}
      </div>
    </div>
  );
}

export {  CabDriverInfo };
