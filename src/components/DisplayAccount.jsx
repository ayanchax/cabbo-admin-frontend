import React from "react";
import { useAdmin } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ROUTES } from "@/utils";
import { useToast } from "@/hooks";
import {
  LogOut,
  UserRound,
} from "lucide-react";
function DisplayAccount({ placement = "bottom", showLogout = false }) {
  const navigate = useNavigate();
  const { logout, clearAuthToken } = useAuth();
  const { showToast } = useToast();
  const { adminLabel, adminRole } = useAdmin();

  const handleLogout = async () => {
    if (!showLogout) return;
    try {
      await logout.mutateAsync();
      clearAuthToken();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      showToast("Error logging you out, please try again in sometime", "error");
    }
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
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
        >
          <LogOut className="h-4 w-4" />
        </button>
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
            className="mt-3 flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
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
