import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useLocalStorage, useIsLoggedInQuery } from "@/hooks";
import { LOCAL_STORAGE_KEYS } from "@/utils";
import { Splash } from "@/components";
import { AdminProvider } from "@/context";

const ProtectedRoute = () => {
  const { getItem } = useLocalStorage();
  const token = getItem(LOCAL_STORAGE_KEYS.token);
  const { 
    data:isAdminLoggedIn, 
    isLoading:isAdminLoggedInStatusLoading, 
    error:isAdminLoggedInStatusError 
  } = useIsLoggedInQuery(Boolean(token));

  // checking session
  if (isAdminLoggedInStatusLoading) {
    return <Splash message='Loading your experience...' />;
  }
  // ❌ No token OR invalid session
  if (!token || isAdminLoggedInStatusError || isAdminLoggedIn === false) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // ✅ Valid session, allow access to protected pages
  return <AdminProvider isLoggedIn={isAdminLoggedIn}>{<Outlet />}</AdminProvider>;
};

export default ProtectedRoute;
