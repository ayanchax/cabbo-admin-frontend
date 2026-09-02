import React, { useState } from "react";
import { useAdmin } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ROUTES } from "@/utils";
import {
  LogOut,
  UserRound,
} from "lucide-react";
import { clientLogout } from "@/api";

function DisplayAccount({
  placement = "bottom",
  showLogout = false,
  isCollapsed = false,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { adminLabel, adminRole } = useAdmin();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (!showLogout || isLoggingOut) return;
    setIsLoggingOut(true);
    void logout.mutateAsync().catch(() => {
      // Even if the backend logout call fails, clear this device's session.
    });
    clientLogout();
    navigate(ROUTES.LOGIN, { replace: true }); // redirect to login page and remove the current page from history so that user cannot go back to it using browser back button
  };
  if (placement == "top") {
    return (
      <div className="ml-auto flex items-center gap-3 md:ml-0">
        <div className="hidden text-right sm:block">
          <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
            {adminLabel}
          </p>
          <p className="text-xs text-slate-500">{adminRole}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          disabled={isLoggingOut}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 disabled:cursor-wait disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (isCollapsed) {
    return (
      <div className="border-t border-white/10 p-3">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10"
            title={`${adminLabel} - ${adminRole}`}
          >
            <UserRound className="h-4 w-4 text-slate-200" />
          </div>
          {showLogout && (
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              disabled={isLoggingOut}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 p-3">
      <div className="rounded-lg bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <UserRound className="h-4 w-4 text-slate-200" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{adminLabel}</p>
            <p className="truncate text-xs text-slate-400">{adminRole}</p>
          </div>
        </div>
        {showLogout && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-3 flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export { DisplayAccount };
