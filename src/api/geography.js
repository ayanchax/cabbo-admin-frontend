import { ENDPOINTS } from "@/utils";

export const fetchClientGeography = async () => {
  const response = await fetch(ENDPOINTS.GEOGRAPHY.CLIENT, {
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch client geography.");
  }

  const data = await response.json();
  return data;
}
