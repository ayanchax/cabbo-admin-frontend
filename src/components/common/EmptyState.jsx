import React from "react";

function EmptyState({
  className = "rounded-lg bg-white px-4 py-12 text-center",
  message = "",
  subTitle = "",
  children = {},
}) {
  return (
    <div className={className}>
      {message && (
        <p className="text-sm font-semibold text-slate-950">{message}</p>
      )}

      {subTitle && <p className="mt-1 text-sm text-slate-500">{subTitle}</p>}
      {children}
    </div>
  );
}

export { EmptyState };
