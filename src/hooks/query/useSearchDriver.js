import { useQuery } from "@tanstack/react-query";
import { searchDrivers } from "@/api"

const DEFAULT_CONFIG = {
    page: 1,
    limit: 5,
};

export const useSearchDriverQuery = (options = {}, enabled = true) => {
    const config = {
        ...DEFAULT_CONFIG,
        ...options,
    };

    return useQuery({
        queryKey: ["searchDriver", config],
        queryFn: () => searchDrivers({ config }),
        enabled,
        retry: false, // don't retry on failure
        staleTime: 1000 * 60 * 10, // 10 min cache
    });
};
