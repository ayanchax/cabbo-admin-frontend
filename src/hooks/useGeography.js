import { useContext } from "react";
import { GeographyContext } from "@/context";

export const useGeography = () => {
  return useContext(GeographyContext);
};