import { formatMoney, formatSnakeCasedStringAsLabel } from "@/utils";

function FareSummary({
  breakdown = [],
  currencyCode,
  extraChargesText = "",
  fare,
  overageRates = [],
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Driver Fare
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-950">
          {formatMoney(fare, currencyCode)}
        </p>
        {extraChargesText && (
          <p className="mt-1 text-xs font-semibold text-emerald-700">
            {extraChargesText}
          </p>
        )}
        {(breakdown.length > 0 || overageRates.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {breakdown.map(([key, value]) => (
              <span
                key={key}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600"
              >
                {formatSnakeCasedStringAsLabel(key)}{" "}
                {formatMoney(value, currencyCode)}
              </span>
            ))}
            {overageRates.map(([label, value]) => (
              <span
                key={label}
                className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {label} {formatMoney(value, currencyCode)}
              </span>
            ))}
          </div>
        )}
      </div>


       
      
    </div>
  );
}

export { FareSummary };
