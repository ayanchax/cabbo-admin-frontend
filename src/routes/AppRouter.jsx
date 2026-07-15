import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils";
import { PublicRoute, ProtectedRoute } from "@/routes";
import { Splash } from "@/components";
import { AdminLayout } from "@/layouts";
// Lazy load all routes
const LazyLoadedRoutes = {
  Home: lazy(() => import("@/pages/Home")),
  Login: lazy(() => import("@/pages/auth/Login")),
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Splash message="Loading Cabbo Admin..." />}>
        <Routes>
          <Route element={<PublicRoute />}>
            {/* Public auth routes, if user is not logged in, they can access these */}
            <Route path={ROUTES.LOGIN} element={<LazyLoadedRoutes.Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            {/* Protected app routes, only accessible if user is logged in */}
            <Route element={<AdminLayout />}>
              <Route path={ROUTES.HOME} element={<LazyLoadedRoutes.Home />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
