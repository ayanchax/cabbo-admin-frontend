import { useQuery } from "@tanstack/react-query";
import { getBookingDetail } from "@/api";

export const useTripBookingDetail = (booking_id) => {
    return useQuery({
        queryKey: ["tripBookingDetail", booking_id],
        queryFn: () => getBookingDetail(booking_id),
        enabled: !!booking_id, // only run if booking_id is provided
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};