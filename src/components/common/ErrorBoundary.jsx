import { RefreshCcw } from "lucide-react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { APP } from "@/utils";
import {Footer} from "@/components";

function ErrorFallback({ resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 animate-shake">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Accent */}
        <div className="h-1 bg-primary w-full" />

        <div className="px-6 py-8 flex flex-col items-center text-center">
          {/* Illustration */}
          <div className="mb-0 -mt-1">
            <img
              src="https://cabbo.s3.ap-south-2.amazonaws.com/car-on-bumpy-surface.png"
              alt="Something went wrong"
              className=" object-contain select-none -mb-10"
              draggable="false"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-900">
            We hit a speed bump
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-slate-500 leading-6 max-w-xs">
  Something unexpected happened.
  Please try again in a moment — our team is already on it.
</p>

          {/* CTA */}
          <button
            onClick={resetErrorBoundary}
            className="mt-6 w-full cursor-pointer bg-primary hover:bg-primary-hover text-white rounded-xl py-3 font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>

          {/* Footer */}
           
          <Footer className="mt-6 text-[11px] text-slate-400"/>
        </div>
      </div>
    </div>
  );
}

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ReactErrorBoundary>
);

export { ErrorBoundary };