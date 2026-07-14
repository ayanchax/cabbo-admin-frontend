import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

export const login = (payload) => {
  return api.post(ENDPOINTS.AUTH.LOGIN, payload);
};

 

 