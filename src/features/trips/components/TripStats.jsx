import { LoaderCircle } from "lucide-react";

function TripStats({
  className = "mb-4 grid gap-3 xs:grid-cols-1 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4",
  isLoading = false,
  stats = [],
}) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-lg border bg-white p-3 ${
              stat.featured
                ? "border-primary/20 shadow-[0_0_0_3px_rgba(37,99,235,0.06)]"
                : "border-slate-200"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${
                stat.accentClassName ||
                "from-slate-300 via-slate-100 to-transparent"
              }`}
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 flex h-8 items-center text-2xl font-semibold text-slate-950">
                  {isLoading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin text-slate-400" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>

              {Icon && (
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
                    stat.iconClassName ||
                    "bg-slate-50 text-slate-600 ring-slate-100"
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { TripStats };
