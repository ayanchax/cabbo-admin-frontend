function QuickFilters({ activeFilter = "", filters = [], onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onSelect?.(isActive ? "" : filter.value)}
            className={`h-9 shrink-0 cursor-pointer rounded-lg border px-3 text-sm font-semibold transition ${
              isActive
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export { QuickFilters };
