import { useState } from "react";
import { X } from "lucide-react";

const VARIANT_STYLES = {
  default: "bg-blue-50 border-blue-200 text-blue-800 [&_button]:text-blue-500 [&_button]:hover:text-blue-700",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800 [&_button]:text-yellow-500 [&_button]:hover:text-yellow-700",
  alert:   "bg-orange-50 border-orange-200 text-orange-800 [&_button]:text-orange-500 [&_button]:hover:text-orange-700",
  error:   "bg-red-50 border-red-200 text-red-800 [&_button]:text-red-500 [&_button]:hover:text-red-700",
  success: "bg-green-50 border-green-200 text-green-800 [&_button]:text-green-500 [&_button]:hover:text-green-700",
};

const Disclaimer = ({ message, dismissible = false, variant = "default", className = "" }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={`p-3 rounded-lg border text-sm flex items-start justify-between gap-2 ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.default} ${className}`}
    >
      <span>{message}</span>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 transition-colors"
          aria-label="Dismiss"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export { Disclaimer };