import { api } from "@/api";
import { ENDPOINTS } from "@/utils";
export const isLoggedIn = async () => {

    const { data } = await api.get(ENDPOINTS.ADMIN.IS_LOGGED_IN);
    return data;
}

export const getProfile = async () => {
    const { data } = await api.get(ENDPOINTS.ADMIN.PROFILE);
    return data;
}

export const logout = () => {
  return api.post(ENDPOINTS.ADMIN.LOGOUT, {});
};
