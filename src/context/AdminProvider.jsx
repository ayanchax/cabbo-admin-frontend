import { AdminContext } from "@/context";
import { useAdminProfileQuery } from "@/hooks";
import { Splash } from "@/components";
import { ROUTES } from "@/utils";
import { Navigate } from "react-router-dom";

export const AdminProvider = ({ children, isLoggedIn }) => {
  const { data:adminProfile, isLoading: profileLoading, error: profileError } = useAdminProfileQuery(!!isLoggedIn);
  if (profileLoading) {
    return <Splash />;
  }

  // If there's an error fetching the profile, it likely means the session is invalid, so we redirect to login
  // Plus the app cannot function without the admin profile, so we treat missing profile as an error case as well
  if (profileError || !adminProfile) {
    // May be we show a fall back error UI here instead of redirecting, but for now let's just redirect to login
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <AdminContext.Provider
      value={{
        admin: adminProfile || null,
        isLoading: profileLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
