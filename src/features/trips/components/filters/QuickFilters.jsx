import React from 'react'

function QuickFilters({filters=[]}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className="h-9 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {filter}
            </button>
          ))}
        </div>
  )
}

export  {QuickFilters}