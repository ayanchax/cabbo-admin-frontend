import { Outlet } from "react-router-dom";
import { AppSidebar, AppHeader } from "@/components";
import { useState } from "react";

function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />
      <div className={isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] px-4 py-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
