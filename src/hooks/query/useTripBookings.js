import { useQuery } from "@tanstack/react-query";
import { getAllTrips } from "@/api"

const DEFAULT_CONFIG = {
    page: 1,
    limit: 10,
};

export const useTripBookings = (options = {}) => {
    const config = {
        ...DEFAULT_CONFIG,
        ...options,
    };

    return useQuery({
        queryKey: ["tripBookings", config],
        queryFn: () => getAllTrips({ config }),
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};
