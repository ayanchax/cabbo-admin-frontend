import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useIsLoggedInQuery } from "@/hooks";
import { Splash } from "@/components";
import { AdminProvider } from "@/context";

const ProtectedRoute = () => {
  const { 
    data:isAdminLoggedIn, 
    isLoading:isAdminLoggedInStatusLoading, 
    error:isAdminLoggedInStatusError 
  } = useIsLoggedInQuery();

  // checking session
  if (isAdminLoggedInStatusLoading) {
    return <Splash message='Loading your experience...' />;
  }
  // ❌ No token OR invalid session
  if (isAdminLoggedInStatusError || isAdminLoggedIn === false) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // ✅ Valid session, allow access to protected pages
  return <AdminProvider isLoggedIn={isAdminLoggedIn}>{<Outlet />}</AdminProvider>;
};

export default ProtectedRoute;
