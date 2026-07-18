import React, { useState } from "react";
import { Menu, Search, ShieldCheck } from "lucide-react";
import { NavigationItems } from "../navigation/NavigationItems";
import { DisplayAccount } from "../DisplayAccount";
function AppHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsMobileNavOpen((current) => !current)}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-slate-800">
            Internal Tool
          </span>
        </div>

        <div className="ml-auto hidden h-10 min-w-64 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
          <Search className="h-4 w-4" />
          <span>Search bookings, drivers, customers</span>
        </div>

        <DisplayAccount placement="top" showLogout />
      </div>

      {isMobileNavOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            <NavigationItems
              headerNavigation
              onClickNavItem={setIsMobileNavOpen}
            />
          </div>
        </nav>
      )}
    </header>
  );
}

export { AppHeader };
