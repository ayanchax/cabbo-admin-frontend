import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A generic, reusable collapsible section component.
 *
 * Props:
 * - title: string (required) - The label for the toggle button.
 * - children: ReactNode (required) - Content to show/hide inside the collapsible.
 * - defaultOpen: boolean (optional) - If true, section is expanded by default.
 * - className: string (optional) - Additional classes for the outer div.
 * - titleClassName: string (optional) - Additional classes for the title text.
 * - showPrefix: boolean (optional) - If true, shows "Show"/"Hide" prefix before title.
 */
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = "",
  titleClassName = "",
  showPrefix = false,
  id,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    if (!id || typeof window === "undefined") return;

    const openFromHash = () => {
      if (window.location.hash === `#${id}`) {
        setOpen(true);
        setHighlighted(true);
        setTimeout(() => setHighlighted(false), 2000); // Remove highlight after 2 seconds

      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    return () => window.removeEventListener("hashchange", openFromHash);
  }, [id]);

  return (
    <div id={id || 'collapsible-section'} className={`w-full mt-2 scroll-mt-24  ${className}`}>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-primary-600 font-medium focus:outline-none mb-1"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {showPrefix && (
        <span className={`inline-block  ${titleClassName}`}>{open ? "Hide" : "Show"} {title}</span>
        )}
        {!showPrefix && (
          <span className={`inline-block ${titleClassName}`}>{title}</span>
        )}
        <span className={`inline-block transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div
          className={`mt-1  ${
            highlighted
              ? "bg-blue-50/40 ring-2 ring-primary/25 ring-offset-2 rounded-lg transition-all duration-300 ring-offset-white"
              : ""
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export  {CollapsibleSection};
