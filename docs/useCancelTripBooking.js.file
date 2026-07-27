import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelTripBooking } from "@/api";

export const useCancelTripBooking = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelTripBooking,
    onSuccess: (_data, variables) => {
      if (variables?.bookingId) {
        queryClient.invalidateQueries({
          queryKey: ["tripBookingDetail", variables.bookingId], // Invalidate tripBookingDetail query so that any key with tripBookingDetail is refetched.
        });
      }
      queryClient.invalidateQueries({ queryKey: ["tripBookingsFeed"] }); // Invalidate tripBookingsFeed so that any key with tripBookingsFeed is refetched.
      options?.onSuccess?.(_data, variables);
    },
    ...options,
  });
};
