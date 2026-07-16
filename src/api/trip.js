import { api } from "@/api";
import { ENDPOINTS } from "@/utils";
export const getAllTrips = async (
    { config = {
        page: 1,
        limit: 10,
    } } = {}
) => {
    const { data } = await api.get(ENDPOINTS.TRIPS.ALL, { params: config });
    return data;
}
