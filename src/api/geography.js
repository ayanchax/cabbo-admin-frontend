import { ENDPOINTS } from "@/utils";

export const fetchClientGeography = async () => {
  try {
    const response = await fetch(ENDPOINTS.GEOGRAPHY.CLIENT, {
      credentials: "omit",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
};