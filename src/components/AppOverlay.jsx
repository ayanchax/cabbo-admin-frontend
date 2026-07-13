import React from "react";
import { X } from "lucide-react";

const AppOverlay = ({ visible, message, illustration, subtext,  onClose, ...rest }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full relative">
        {illustration && <div className="mb-6">{illustration}</div>}
        <div className="text-xl font-semibold mb-2 text-center">{message}</div>
        {subtext && <div className="text-gray-500 text-center mb-4">{subtext}</div>}
        {rest?.nextActionText && (
          <div className="text-gray-500 font-medium text-xs">{rest.nextActionText}</div>
        )}
        {onClose && rest?.canClose && (
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            onClick={onClose}
            aria-label="Close overlay"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export  {AppOverlay};
