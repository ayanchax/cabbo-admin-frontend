function SectionTitle({
  className = "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3",
  title = "",
  version = "",
  icon = null,
}) {
  const Icon = icon;
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {icon && <Icon className="h-4 w-4 text-primary" />}
        {title && (
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        )}
      </div>
      {version && (
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
          {version}
        </span>
      )}
    </div>
  );
}

export { SectionTitle };
