import React from 'react'


/**
 * Generic Loader component
 * Props:
 * - message: string (optional) - message to display below the loader
 * - className: string (optional) - additional classes for container
 */
function Loader({ message = "Loading...", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen w-full ${className}`}>
      {/* Modern animated dots */}
      <div className="flex items-end gap-2 mb-4 h-7">
        <span className="block w-4 h-4 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "-0.36s" }}></span>
        <span className="block w-4 h-4 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "-0.18s" }}></span>
        <span className="block w-4 h-4 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
      </div>
      <div className="text-base sm:text-lg text-gray-600 font-semibold text-center mt-1 tracking-wide">
        {message}
      </div>
    </div>
  );
}

export  {Loader}