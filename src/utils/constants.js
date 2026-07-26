
export const APP = {
    name: "Cabbo",
    tagline: "Your ride, simplified"
}
export const LOCAL_STORAGE_KEYS = {
    "token": "atoken",
    "adminUserId": "aUserId",
    "adminRole": "aRole",
    "adminTokenExpiresAt": "aTokenExpiresAt",
    "clientGeography": "clientGeography"

}
export const ADMIN_ROLES = {
    SUPER_ADMIN: "super_admin",
    DRIVER_ADMIN: "driver_admin",
    FINANCE_ADMIN: "fin_admin",
    CUSTOMER_ADMIN: "cust_admin",
    REGIONAL_ADMIN: "regional_admin",
    STATE_ADMIN: "state_admin",
}

export const V1_ALLOWED_ADMIN_ROLES = [
    ADMIN_ROLES.SUPER_ADMIN,
    ADMIN_ROLES.DRIVER_ADMIN,
]
export const API_VERSION = import.meta.env.VITE_API_VERSION || "/api/v1";


export const ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_VERSION}/admin/auth/login`,
    },

    ADMIN: {
        IS_LOGGED_IN: `${API_VERSION}/admin/profile/is-logged-in`,
        PROFILE: `${API_VERSION}/admin/profile`,
        LOGOUT: `${API_VERSION}/admin/profile/logout`
    },

    TRIPS: {
        ALL: `${API_VERSION}/admin/trips/list/all`,
        GET_BOOKING_BY_ID:`${API_VERSION}/admin/trips/booking`,
        ASSIGN_DRIVER:`${API_VERSION}/admin/trips`, // Append bookingId/assign-driver/driverId
    },

    DRIVERS:{
        SEARCH:`${API_VERSION}/admin/drivers/search/driver`,
    },

    GEOGRAPHY: {
        CLIENT: `${import.meta.env.VITE_CLIENT_GEOLOCATION_API_URL || "https://ipapi.co/json/"}`
    }



}

export const ROUTES = {
    LOGIN: "/login",
    BOOKING_DETAIL:"/booking/:id",
    HOME: "/",


};

export const TRIP_TYPES =
{
    AIRPORT_PICKUP: "airport_pickup", // pickup from airport to any drop location, also known as airport transfers
    AIRPORT_DROPOFF: "airport_drop", // drop to airport from any pickup location, also known airport transfers
    OUTSTATION: "outstation", // long-distance multi day trips outside the city, also known as outstation or inter-city rides   
    LOCAL: "local", // short-distance same day trips within the city, also known as point-to-point or intra-city rides or hourly rentals
}

export const CAB_TYPES = {
    HATCHBACK: "Hatchback",
    SEDAN: "Sedan",
    SEDAN_PLUS: "Premium Sedan",
    SUV: "SUV",
    SUV_PLUS: "SUV+"
}

export const CAB_FUEL_TYPES = {
    PETROL: "petrol",
    DIESEL: "diesel",
    CNG: "cng",
    ELECTRIC: "electric",
    HYBRID: "hybrid"
}

export const DEFAULT_USER_LOCALE = "en-US";
export const DEFAULT_USER_TIMEZONE = "UTC";
export const DEFAULT_CURRENCY_SYMBOL = "₹";
export const DEFAULT_CURRENCY_CODE = "INR";
export const PAYMENT_ORDER_STATUS = {
    CREATED: "created"
}



export const TRIP_STATUS = {
    CONFIRMED: "confirmed",
    ONGOING: "ongoing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    CLOSED: "closed",
    DISPUTED: "dispute",
    CREATED: "created",
}

export const TRIP_OCCURENCE_LABELS = {
    UPCOMING: "upcoming",
    ONGOING: "ongoing",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    PAST: "past",
}

export const REFUND_STATUS = {
    COMPLETED: "completed",
    PROCESSING: "processing",
    INITIATED: "initiated",
    FAILED: "failed",
    NOT_APPLICABLE: "not_applicable",
    UNKNOWN: "unknown",
    PROCESSED: "processed",
    PENDING: "pending",
    SUCCESS: "success",
}

export const SERVER_ERROR_CODES = {
    CREDENTIALS_NOT_PROVIDED: "CREDENTIALS_NOT_PROVIDED",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_INACTIVE: "USER_INACTIVE",
    ALREADY_LOGGED_IN: "ALREADY_LOGGED_IN",
    USER_PASSWORD_NOT_SET: "USER_PASSWORD_NOT_SET",
    ROLE_ERROR: "ROLE_ERROR",
    INCORRECT_PASSWORD: "INCORRECT_PASSWORD",
    ALREADY_BOOKED_ON_THIS_SLOT: "ALREADY_BOOKED_ON_THIS_SLOT",
    INVALID_BOOKING_DATA: "INVALID_BOOKING_DATA",
    TRIP_NOT_FOUND: "TRIP_NOT_FOUND",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const DEFAULT_GEOGRAPHY = {
        country_name: "India",
        country_code: "IN",
        phone_code: "+91",
        flag: "🇮🇳",
        currency: DEFAULT_CURRENCY_CODE,
        currency_symbol: DEFAULT_CURRENCY_SYMBOL,
        currency_decimal_places: 2,
        currency_in_words: "Rupees",
        currency_international_name: "Indian Rupee",
        timezone: "Asia/Kolkata",
        utc_offset: "+05:30",
    };


export const FORBIDDEN_STATUS_CODE = 403;
export const NOT_FOUND_STATUS_CODE = 404;


