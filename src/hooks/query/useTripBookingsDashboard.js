import { useQuery } from "@tanstack/react-query";
import { getTripsDashboard } from "@/api"

const DEFAULT_CONFIG = {
    page: 1,
    limit: 10,
};

export const useTripBookingsDashboard = (options = {}) => {
    const config = {
        ...DEFAULT_CONFIG,
        ...options,
    };

    return useQuery({
        queryKey: ["tripBookingsDashboard", config],
        queryFn: () => getTripsDashboard({ config }),
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};
