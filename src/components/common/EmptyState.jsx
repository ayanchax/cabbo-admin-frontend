import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

// A highly reusable empty state component for various empty/error/zero-result scenarios
// Props:
// - illustration: JSX (SVG, Lottie, etc.)
// - title: string
// - message: string
// - action: optional JSX (button, link, etc.)
// - className: optional string for custom styling
// - dismissable: optional boolean to show a dismiss/close button

const EmptyState = ({
  illustration,
  title,
  message,
  action,
  className = "",
  dismissable = false,
  autoDismiss = false, // if true, will auto-dismiss after a certain time (e.g., 5 seconds)
  autoDismissTime = 5000, // default auto-dismiss time in milliseconds
  onDismiss, // callback when dismissed
}) => {

  // Use a ref to store the timer so we can clear it on manual dismiss or unmount
  const timerRef = useRef();

  useEffect(() => {
    if (autoDismiss && typeof onDismiss === "function") {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        onDismiss();
      }, autoDismissTime);
    }
    return () => {
      // Clear the timer if the component unmounts or if autoDismiss changes, to prevent memory leaks or unexpected dismissals
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoDismiss, autoDismissTime, onDismiss]);

  // Dismiss handler that clears the timer if user clicks X
  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (typeof onDismiss === "function") {
      onDismiss();
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in ${className}`}
      style={{ minHeight: 320 }}
    >
      {dismissable && typeof onDismiss === "function" && (
        <button
          aria-label="Dismiss"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <X size={20} aria-hidden="true" />
        </button>
      )}
      {illustration && (
        <div className="mb-6 w-32 h-32 flex items-center justify-center">
          {illustration}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-500 mb-4 max-w-md">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export { EmptyState };
