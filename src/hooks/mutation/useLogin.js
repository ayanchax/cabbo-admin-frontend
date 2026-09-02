import { useMutation } from "@tanstack/react-query";
import { login, queryClient } from "@/api";

export const useLoginMutation = (options = {}) => {
  return useMutation({
    mutationFn: login,
    ...options, // allows override (onSuccess, onError etc.)
    onSuccess: (...args) => {
      queryClient.setQueryData(["isLoggedIn"], true);
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      options.onSuccess?.(...args);
    },
  });
};
