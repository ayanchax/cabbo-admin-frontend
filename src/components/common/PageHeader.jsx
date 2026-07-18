import React from "react";
import { ArrowLeft } from "lucide-react";

function PageHeader({
  onBack, // Optional callback for back button; if not provided, back button won't render
  title = "Unknown", // Default title if not provided
  subtitle = "", // Optional subtitle to show below the title
  subtitleClassName = "",
  className = "", // Additional class names for styling
  label = "", // Optional label to display next to the title, e.g. for status or category
  tag = null, // Optional JSX rendered beside the title
}) {
  return (
    <div className={`flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 ${className}`}>
      <div className="flex min-w-0 flex-row items-center">
        {onBack && (
          <button
            className="flex shrink-0 items-center text-primary hover:underline text-sm font-medium cursor-pointer"
            onClick={onBack}
            type="button"
            aria-label="Go back"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
          </button>
        )}
        <div className="flex min-w-0 flex-col">
          <div className="ml-2 flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="min-w-0 text-xl font-bold">{title}</h2>
            {tag && <div className="shrink-0">{tag}</div>}
          </div>
          {subtitle && (
            <p
              className={`ml-2 min-w-0 text-sm text-gray-500 ${subtitleClassName}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {/* On large screens, label is inline */}
        {label && (
          <span className="hidden sm:inline sm:ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            {label}
          </span>
        )}
      </div>
      {/* On mobile, label is below */}
      {label && (
        <div className="sm:hidden flex justify-start w-full">
          <span className="inline-block px-2 ml-5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold w-auto">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export { PageHeader };
