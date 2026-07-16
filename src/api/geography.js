import { api } from "@/api";
import { ENDPOINTS } from "@/utils";

 

export const fetchClientGeography = async () => {
  const {data } = await api.get(ENDPOINTS.GEOGRAPHY.CLIENT);
  return data;
}