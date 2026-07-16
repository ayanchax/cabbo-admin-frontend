import { useGeographyQuery } from "./query";
import { DEFAULT_USER_LOCALE } from "@/utils";
export const useLocale = () => {
    const { clientGeographyData } = useGeographyQuery();
    
    const raw = clientGeographyData?.languages
    // Output is a string separated by commas, like "en-US,fr-FR"
    // We can take the first language as the primary locale
    const primaryLocale = raw ? raw.split(',')[0] : DEFAULT_USER_LOCALE;
    const locale = primaryLocale || DEFAULT_USER_LOCALE; // Default to en-US if locale is not available

    return { locale }
}
