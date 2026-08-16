import { GeographyContext } from "@/context";
import { useGeographyQuery } from "@/hooks";

export const GeographyProvider = ({ children }) => {
  const { clientGeographyData, clientGeographyLoading, fallbackGeography } =
    useGeographyQuery();
  if (clientGeographyLoading) {
    return null; // or splash screen
  }

  return (
    <GeographyContext.Provider
      value={{
        clientGeo: clientGeographyData,
        fallbackGeo: fallbackGeography,
      }}
    >
      {children}
    </GeographyContext.Provider>
  );
};
