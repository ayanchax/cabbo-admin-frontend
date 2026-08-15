
import { useQuery } from "@tanstack/react-query";
import { LOCAL_STORAGE_KEYS, DEFAULT_GEOGRAPHY } from "@/utils";
import { useLocalStorage } from "../useLocalStorage";
import { fetchClientGeography } from "@/api";
// LocalStorage cache key and TTL for client geography
const CLIENT_GEO_CACHE_KEY = LOCAL_STORAGE_KEYS.clientGeography;
const CLIENT_GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms
const hasValidGeography = (geography) => Boolean(geography?.country_code);


export const useGeographyQuery = () => {
    const { getItem, setItem } = useLocalStorage();
    const fallbackGeography = DEFAULT_GEOGRAPHY;




    // Fetch client-side geography (from ipapi) with localStorage cache (24h TTL)
    // NOTE: We use ipapi (IP-based geolocation) for client geography in this hook to determine broad, non-critical details
    // such as country code, currency, and locale-specific units. This is used for platform-level display (e.g., currency symbol, country code)

    const getCachedClientGeography = () => {
        try {
            const cached = getItem(CLIENT_GEO_CACHE_KEY);
            if (!cached) return null;
            // getItem already parses JSON, so cached is an object
            const { data, timestamp } = cached;
            if (Date.now() - timestamp < CLIENT_GEO_CACHE_TTL) {
                return data;
            }
            return null;
        } catch {
            return null;
        }
    };

    const setCachedClientGeography = (data) => {
        try {
            setItem(
                CLIENT_GEO_CACHE_KEY,
                JSON.stringify({ data, timestamp: Date.now() })
            );
        } catch {
            // Ignore write errors (e.g., quota exceeded)
        }
    };

    const { data: clientData, error: clientError, isLoading:clientGeographyLoading } = useQuery({
        queryKey: ["clientGeography"],
        queryFn: async () => {
            try {
                const cached = getCachedClientGeography();
                if (hasValidGeography(cached)) return cached;
                const fresh = await fetchClientGeography();
                if (hasValidGeography(fresh)) {
                    setCachedClientGeography(fresh);
                    return fresh;
                }
                return null;
            }
            catch {
                return null
            }

        },
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
    });





    const hasClientGeography = hasValidGeography(clientData);

    // Use ipapi country_code if available, else fallback

    const clientCountryCode = clientData?.country_code?.toUpperCase() || fallbackGeography.country_code;
    const clientCountryName = clientData?.country_name || fallbackGeography.country_name;

    // Compose client geography object
    const clientGeography =
        (hasClientGeography)
            ? {
                ...fallbackGeography,
                ...clientData,
                country_code: clientCountryCode,
                country_name: clientCountryName,
            }
            : fallbackGeography;



    return {
        clientGeographyData: clientGeography,
        clientGeographyCode: clientCountryCode,
        fallbackGeography,
        clientGeographyLoading,
        clientGeographyError: clientError,
        hasClientGeography
    };
};