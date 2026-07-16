import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api";

export const useLogoutMutation = (options = {}) => {
  return useMutation({
    mutationFn: logout,
    ...options, // allows override (onSuccess, onError etc.)
  });
};