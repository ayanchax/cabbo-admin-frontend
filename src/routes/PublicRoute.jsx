import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useIsLoggedInQuery } from "@/hooks";
import { Splash } from "@/components";


const PublicRoute = () => {
  const { 
    data:isAdminLoggedIn, 
    isLoading:isAdminLoggedInStatusLoading, 
    error:isAdminLoggedInStatusError 
  } = useIsLoggedInQuery(true, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // checking session
  if (isAdminLoggedInStatusLoading) {
        return <Splash message='Loading your experience...' />;

  }

  // If already logged in → redirect to home
  if (!isAdminLoggedInStatusError && isAdminLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Otherwise allow access to public auth pages
  return <Outlet />;
};

export default PublicRoute;
