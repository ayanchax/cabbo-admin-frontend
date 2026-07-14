import { useMutation } from "@tanstack/react-query";
import { login } from "@/api";

export const useLoginMutation = (options = {}) => {
  return useMutation({
    mutationFn: login,
    ...options, // allows override (onSuccess, onError etc.)
  });
};