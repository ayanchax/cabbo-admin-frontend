import { Outlet } from "react-router-dom";
import { AppSidebar, AppHeader } from "@/components";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <AppSidebar />
      <div className="lg:pl-64">
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] px-4 py-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
