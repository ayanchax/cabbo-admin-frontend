function TripStats({
  className = "mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
  isLoading = false,
  stats = [],
}) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-slate-200 bg-white p-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {stat.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {isLoading ? "--" : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export { TripStats };
