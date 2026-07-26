import { api } from "@/api";
import { ENDPOINTS } from "@/utils";
export const searchDrivers = async (
    { config = {
        page: 1,
        limit: 5,
    } } = {},
) => {
    const { data } = await api.get(ENDPOINTS.DRIVERS.SEARCH, { params: config });
    return data;
}




