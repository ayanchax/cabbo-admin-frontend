import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const getLocationMapUrl = async (placeId) => {
  if (!placeId) return null;

  const { data } = await api.get(ENDPOINTS.LOCATIONS.MAP_URL, {
    params: { place_id: placeId },
  });

  return data?.map_url || null;
};
