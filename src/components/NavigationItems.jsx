import React from "react";
import { ROUTES } from "@/utils";
import { ClipboardList } from "lucide-react";
import { NavLink } from "react-router-dom";

const defaultNavigationItems = [
  {
    label: "Trips",
    to: ROUTES.HOME,
    icon: ClipboardList,
    end: true,
  },
];
function NavigationItems({
  navigationItems = defaultNavigationItems,
  headerNavigation = false,
  onClickNavItem=()=>{}
}) {
  if (headerNavigation) {
    return (
      <>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={() => onClickNavItem(false)}
              className={({ isActive }) =>
                `flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </>
    );
  }

  return (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </>
  );
}

export { NavigationItems };
