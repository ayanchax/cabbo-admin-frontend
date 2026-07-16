import { GeographyContext } from "@/context";
import { useGeographyQuery } from "@/hooks";

export const GeographyProvider = ({ children }) => {
  const {
    clientGeographyData,
    serverGeographyData,
    fallbackGeography,
    serverGeographyLoading,
    isMismatch,
  } = useGeographyQuery();
  if (serverGeographyLoading) {
    return null; // or splash screen
  }

  return (
    <GeographyContext.Provider
      value={{
        serverGeoLoading: serverGeographyLoading,
        serverGeo: serverGeographyData,
        clientGeo: clientGeographyData,
        fallbackGeo:fallbackGeography,
        isMismatch: isMismatch,
      }}
    >
      {children}
    </GeographyContext.Provider>
  );
};
