import {
  CalendarClock,
  ClipboardList,
  LogOut,
  MapPinned,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AdminContext } from "@/context";
import { useAuth } from "@/hooks";
import { APP, ROUTES } from "@/utils";

const navigationItems = [
  {
    label: "Trips",
    to: ROUTES.HOME,
    icon: ClipboardList,
    end: true,
  },
];

const quickFilters = ["Today", "Unassigned", "Ongoing", "Disputes"];

const formatRole = (role) => {
  if (!role) return "Admin";
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getAdminLabel = (admin) => {
  return (
    admin?.name ||
    admin?.full_name ||
    admin?.username ||
    admin?.email ||
    admin?.user_id ||
    "Cabbo Admin"
  );
};

function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const adminContext = useContext(AdminContext);
  const admin = adminContext?.admin;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const adminLabel = getAdminLabel(admin);
  const adminRole = formatRole(admin?.role);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <img
            src={import.meta.env.VITE_APP_LOGO_URL}
            alt={APP.name}
            className="h-8 w-auto object-contain"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-5">Admin Console</p>
            <p className="text-xs leading-4 text-slate-400">Operations V1</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Workspace
          </p>
          <div className="mt-2 space-y-1">
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
          </div>
        </nav>

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
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
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
                Controlled Operations
              </span>
            </div>

            <div className="ml-auto hidden h-10 min-w-64 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
              <Search className="h-4 w-4" />
              <span>Search bookings, drivers, customers</span>
            </div>

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
          </div>

          {isMobileNavOpen && (
            <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      onClick={() => setIsMobileNavOpen(false)}
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
              </div>
            </nav>
          )}
        </header>

        <main className="min-h-[calc(100vh-4rem)] px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <CalendarClock className="h-4 w-4" />
                Live Operations
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950">
                Trips Control
              </h1>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="h-9 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Queue
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Needs Driver
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                In Progress
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Exceptions
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">--</p>
            </div>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-slate-950">
                  Operations Workbench
                </h2>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                V1
              </span>
            </div>
            <div className="p-4">
              <Outlet />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
