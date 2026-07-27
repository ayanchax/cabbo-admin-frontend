import { useQuery } from "@tanstack/react-query";
import { getLocationMapUrl } from "@/api";

export const useLocationMap = (place_id, enabled = true) => {
  return useQuery({
    queryKey: ["mapurl", place_id],
    queryFn: () => getLocationMapUrl(place_id),
    enabled,// only fetch profile if enabled is true, which can be controlled by the caller (e.g. only fetch if user is logged in)
    staleTime: 1000 * 60 * 10, // 10 min
  });
};