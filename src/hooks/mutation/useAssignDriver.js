import { useMutation } from "@tanstack/react-query";
import { assignDriverToTrip } from "@/api";

export const useAssignDriverMutation = (options = {}) => {
  return useMutation({
    mutationFn: assignDriverToTrip,
    ...options, // allows override (onSuccess, onError etc.)
  });
};