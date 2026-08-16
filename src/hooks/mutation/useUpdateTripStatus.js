import { useMutation } from "@tanstack/react-query";
import { updateTripStatus } from "@/api";

export const useUpdateTripStatusMutation = (options = {}) => {
  return useMutation({
    mutationFn: updateTripStatus,
    ...options, // allows override (onSuccess, onError etc.)
  });
};
