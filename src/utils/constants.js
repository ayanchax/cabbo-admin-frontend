
export const APP = {
    name: "Cabbo",
    tagline: "Your ride, simplified"
}
export const LOCAL_STORAGE_KEYS = {
    "token": "atoken",

}
export const API_VERSION = import.meta.env.VITE_API_VERSION || "/api/v1";


export const ENDPOINTS = {
    AUTH: {

    },

    ADMIN: {
        IS_LOGGED_IN: `${API_VERSION}/admin/profile/is-logged-in`,
        PROFILE: `${API_VERSION}/admin/profile`,

    },



}

export const ROUTES = {
    LOGIN: "/login",
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
    ALREADY_BOOKED_ON_THIS_SLOT: "ALREADY_BOOKED_ON_THIS_SLOT",
    INVALID_BOOKING_DATA: "INVALID_BOOKING_DATA",
    TRIP_NOT_FOUND: "TRIP_NOT_FOUND",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

