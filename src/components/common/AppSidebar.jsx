import React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { APP } from "@/utils";
import { NavigationItems } from "../navigation/NavigationItems";
import { DisplayAccount } from "../DisplayAccount";

function AppSidebar({ isCollapsed = false, onToggleCollapse = () => {} }) {
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-slate-950 text-white transition-[width] duration-200 lg:flex lg:flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-white/10 ${
          isCollapsed ? "h-16 justify-center px-3" : "h-20 gap-3 px-2"
        }`}
      >
        {!isCollapsed && (
          <div className="min-w-0">
            <img
              src={import.meta.env.VITE_APP_LOGO_URL}
              alt={APP.name}
              className="h-8 w-28 object-contain brightness-250 contrast-200"
            />
            <p className="mt-1 pl-4 text-xs font-semibold leading-4 text-slate-400">
              Admin Console
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white ${
            isCollapsed ? "" : "ml-auto"
          }`}
        >
          <ToggleIcon className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        {!isCollapsed && (
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Workspace
          </p>
        )}
        <div className={isCollapsed ? "space-y-1" : "mt-2 space-y-1"}>
          <NavigationItems isCollapsed={isCollapsed} />
        </div>
      </nav>

      <DisplayAccount showLogout isCollapsed={isCollapsed} />
    </aside>
  );
}

export { AppSidebar };
