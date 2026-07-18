function TripInfoPanel({ label, primary, secondary }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{primary}</p>
      {secondary && <p className="mt-1 text-xs text-slate-800">{secondary}</p>}
    </div>
  );
}

export { TripInfoPanel };
