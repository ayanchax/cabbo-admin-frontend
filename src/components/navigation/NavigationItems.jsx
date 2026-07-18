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
  onClickNavItem = () => {},
  isCollapsed = false,
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
              `flex h-10 items-center rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              } ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}`
            }
            title={isCollapsed ? item.label : undefined}
            aria-label={isCollapsed ? item.label : undefined}
          >
            <Icon className="h-4 w-4" />
            {!isCollapsed && item.label}
          </NavLink>
        );
      })}
    </>
  );
}

export { NavigationItems };
