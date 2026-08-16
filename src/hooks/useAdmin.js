import { useContext } from "react";
import { AdminContext } from "@/context";

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


export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }

  return {
    ...context,
    adminLabel:getAdminLabel(context?.admin),
    adminRole:formatRole(context?.admin?.role)
  };
};