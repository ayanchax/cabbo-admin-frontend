function AttentionChips({ chips = [], className = "mt-3" }) {
  if (chips.length === 0) return null;

  return (
    <div className={`${className} flex flex-wrap gap-1`}>
      {chips.map((chip) => {
        const Icon = chip.icon;
        return (
          <span
            key={chip.label}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600"
          >
            <Icon className="h-3.5 w-3.5" />
            {chip.label}
          </span>
        );
      })}
    </div>
  );
}

export { AttentionChips };
