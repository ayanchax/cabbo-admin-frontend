import {
    TRIP_OCCURENCE_LABELS,
    TRIP_STATUS,
    TRIP_TYPES,
    humanReadableDateTime,
    normalizeKey,
    formatSnakeCasedStringAsLabel,
} from "@/utils";
import {
    AlertTriangle,
    FileText,
    Plane,

} from "lucide-react";
export const useTripsDashboardHelper = () => {
    const quickFilters = [
        { label: "Today", value: "today" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Disputes", value: "disputes" },
    ];
    const PAGE_SIZE = 10;
    const DEFAULT_FILTERS = {
        status: "",
        tripType: "",
        startDate: "",
        endDate: "",
    };
    const HIDDEN_PRICE_KEYS = new Set([
        "platformfee",
        "platform_fee",
        "advancepayment",
        "advance_payment",
        "balancepayment",
        "balance_payment",
    ]);

    const getDateInputValue = (date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const clearQuickFilterValues = (filters, quickFilter) => {
        const nextFilters = { ...filters, quick: "" };

        if (quickFilter === "today") {
            nextFilters.startDate = "";
            nextFilters.endDate = "";
        }

        if (quickFilter === "ongoing" || quickFilter === "disputes") {
            nextFilters.status = "";
        }

        return nextFilters;
    };

    const getQuickFilterValues = (filters, quickFilter) => {
        const nextFilters = clearQuickFilterValues(filters, filters.quick);

        if (quickFilter === "today") {
            const today = getDateInputValue();
            return {
                ...nextFilters,
                quick: quickFilter,
                startDate: today,
                endDate: today,
            };
        }

        if (quickFilter === "ongoing") {
            return {
                ...nextFilters,
                quick: quickFilter,
                status: TRIP_STATUS.ONGOING,
            };
        }

        if (quickFilter === "disputes") {
            return {
                ...nextFilters,
                quick: quickFilter,
                status: TRIP_STATUS.DISPUTED,
            };
        }

        return nextFilters;
    };

    const getTripQueryParams = (filters) => {
        const queryParams = {};

        if (filters.status) queryParams.status = filters.status;
        if (filters.tripType) queryParams.trip_type = filters.tripType;
        if (filters.startDate) queryParams.start_date = filters.startDate;
        if (filters.endDate) queryParams.end_date = filters.endDate;

        return queryParams;
    };

    const getTripsFromResponse = (response) => {
        if (Array.isArray(response)) return response;
        return response?.trips || [];
    };

    const getPaginationFromResponse = (response) => {
        if (!response || Array.isArray(response)) return {};
        return response?.pagination || {};
    };

    const formatTripDate = (date, locale, timezone) => {
        if (!date) return "Not scheduled";
        const normalizedDatetime =
            date && !/Z$|[+-]\d{2}:\d{2}$/.test(date)
                ? { ...date, isoString: date + "Z" }
                : date;
        return humanReadableDateTime(normalizedDatetime, locale, timezone);
    };

    const getTripStartTimestamp = (trip) => {
        if (!trip?.start_datetime) return Number.POSITIVE_INFINITY;
        const normalizedDatetime = !/Z$|[+-]\d{2}:\d{2}$/.test(trip.start_datetime)
            ? `${trip.start_datetime}Z`
            : trip.start_datetime;
        const timestamp = new Date(normalizedDatetime).getTime();
        return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
    };

    const sortTripsByNearestStart = (trips) => {
        return [...trips].sort((firstTrip, secondTrip) => {
            const firstTripIsAssignable = isUpcomingAssignableTrip(firstTrip);
            const secondTripIsAssignable = isUpcomingAssignableTrip(secondTrip);

            if (firstTripIsAssignable !== secondTripIsAssignable) {
                return firstTripIsAssignable ? -1 : 1;
            }

            return getTripStartTimestamp(firstTrip) - getTripStartTimestamp(secondTrip);
        });
    };

    const getTripType = (trip) => trip?.trip_type?.trip_type;

    const isUpcomingAssignableTrip = (trip) => {
        return (
            trip?.label === TRIP_OCCURENCE_LABELS.UPCOMING &&
            [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED].includes(trip?.status)
        );
    };

    const isPastOpenTrip = (trip) => {
        return (
            trip?.label === TRIP_OCCURENCE_LABELS.PAST &&
            [TRIP_STATUS.CONFIRMED, TRIP_STATUS.CREATED, TRIP_STATUS.ONGOING].includes(
                trip?.status,
            )
        );
    };

    const needsDriverAssignment = (trip) => {
        return !trip?.driver?.name && isUpcomingAssignableTrip(trip);
    };

    const getDriverState = (trip) => {
        if (trip?.driver?.name) {
            return {
                label: trip.driver.name,
                className: "bg-emerald-50 text-emerald-700",
                assigned: true,
            };
        }

        if (needsDriverAssignment(trip)) {
            return {
                label: "Needs driver",
                className: "bg-amber-50 text-amber-700",
                assigned: false,
            };
        }

        if (trip?.status === TRIP_STATUS.CANCELLED) {
            return null;
        }

        return {
            label: "Not assigned",
            className: "bg-slate-100 text-slate-600",
            assigned: false,
        };
    };

    const getPackageMetaText = (trip) => {
        const tripType = getTripType(trip);

        if (tripType === TRIP_TYPES.OUTSTATION) {
            const includedKm = trip.included_kms;
            const includedKmText = includedKm ? `${includedKm} km included` : "";
            return [includedKmText].filter(Boolean).join(" | ");
        }

        if (tripType === TRIP_TYPES.LOCAL) {
            const includedHours = trip.package?.included_hours;
            const includedKm = trip.package?.included_km ?? trip.included_kms;
            if (!includedHours && !includedKm) return "";
            return [
                includedHours ? `${includedHours}h` : null,
                includedKm ? `${includedKm} km` : null,
            ]
                .filter(Boolean)
                .join(" / ");
        }

        return "";
    };

    const isExceptionTrip = (trip) => {
        return (
            isPastOpenTrip(trip) ||
            trip.status === TRIP_STATUS.DISPUTED ||
            trip.status === TRIP_STATUS.CANCELLED
        );
    };

    const areSameLocation = (firstLocation, secondLocation) => {
        if (!firstLocation || !secondLocation) return false;

        if (firstLocation.place_id && secondLocation.place_id) {
            return firstLocation.place_id === secondLocation.place_id;
        }

        return (
            firstLocation.lat === secondLocation.lat &&
            firstLocation.lng === secondLocation.lng
        );
    };

    const getRouteTimelineParams = (trip) => {
        const tripType = getTripType(trip);
        const pickupLocation = trip?.origin || null;
        const dropoffLocation = trip?.destination || null;

        if (tripType === TRIP_TYPES.LOCAL) {
            const isSameLocation = areSameLocation(pickupLocation, dropoffLocation);

            return {
                pickupLocation,
                dropoffLocation: isSameLocation ? null : dropoffLocation,
                viewAsRouteTimeline: !isSameLocation,
            };
        }

        if (
            tripType === TRIP_TYPES.AIRPORT_PICKUP ||
            tripType === TRIP_TYPES.AIRPORT_DROPOFF
        ) {
            return {
                pickupLocation,
                dropoffLocation,
            };
        }

        return {
            pickupLocation,
            dropoffLocation,
            hops: trip?.hops || [],
            showReturn: true,
        };
    };

    const getVisiblePriceBreakdown = (trip) => {
        if (Number(trip?.cost_to_driver) === 0) return [];

        const visibleBreakdown = Object.entries(trip?.price_breakdown || {})
            .filter(([key, value]) => {
                return (
                    !HIDDEN_PRICE_KEYS.has(normalizeKey(key)) &&
                    value !== null &&
                    Number(value) !== 0
                );
            })
            .map(([key, value]) => {
                if (
                    normalizeKey(key) === "driver_allowance" &&
                    getTripType(trip) === TRIP_TYPES.OUTSTATION &&
                    Number(trip?.total_days) > 0
                ) {
                    return [
                        "driver_allowance_per_day",
                        Number(value) / Number(trip.total_days),
                    ];
                }

                return [key, value];
            })
            .sort(([, firstValue], [, secondValue]) => {
                return Number(secondValue) - Number(firstValue);
            });

        if (
            visibleBreakdown.length === 1 &&
            Number(visibleBreakdown[0][1]) === Number(trip?.cost_to_driver)
        ) {
            return [];
        }

        return visibleBreakdown;
    };

    const getVisibleOverageRates = (trip) => {
        if (Number(trip?.cost_to_driver) === 0) return [];

        const overageRates = [
            ["Extra hour", trip?.overages?.overage_amount_per_hour],
            ["Extra km", trip?.overages?.overage_amount_per_km],
        ];

        return overageRates.filter(([, value]) => {
            return value !== null && value !== undefined && Number(value) > 0;
        });
    };

    const getExtraChargesText = (trip) => {
        if (Number(trip?.cost_to_driver) === 0) return "";

        const tripType = getTripType(trip);

        if (tripType === TRIP_TYPES.OUTSTATION || tripType === TRIP_TYPES.LOCAL) {
            return "Toll + parking extra";
        }

        if (
            tripType !== TRIP_TYPES.AIRPORT_PICKUP &&
            tripType !== TRIP_TYPES.AIRPORT_DROPOFF
        ) {
            return "";
        }

        const breakdownKeys = new Set(
            Object.entries(trip?.price_breakdown || {})
                .filter(([, value]) => Number(value) > 0)
                .map(([key]) => normalizeKey(key)),
        );
        const extras = [];

        if (!breakdownKeys.has("toll")) {
            // Toll can become payable later even when the booked route avoided it.
            extras.push("Toll");
        }

        if (!breakdownKeys.has("parking")) {
            // Parking may become extra during halts or airport dropoff workflows.
            extras.push("parking");
        }

        if (extras.length === 0) return "";

        return `${extras.join(" + ")} extra`;
    };

    const getAttentionChips = (trip) => {
        const chips = [];

        if (trip.flight_number) {
            chips.push({ label: `Flight ${trip.flight_number}`, icon: Plane });
        }

        if (trip.terminal_number) {
            chips.push({ label: `Terminal ${trip.terminal_number}`, icon: Plane });
        }

        if (trip.placard_required) {
            chips.push({ label: "Placard", icon: FileText });
        }

        if (trip.special_needs_requests) {
            chips.push({ label: "Special request", icon: AlertTriangle });
        }

        return chips;
    };

    const getStatusClassName = (status) => {
        switch (status) {
            case TRIP_STATUS.CONFIRMED:
                return "bg-sky-50 text-sky-700 ring-sky-100";
            case TRIP_STATUS.ONGOING:
                return "bg-blue-50 text-blue-700 ring-blue-100";
            case TRIP_STATUS.COMPLETED:
                return "bg-emerald-50 text-emerald-700 ring-emerald-100";
            case TRIP_STATUS.CLOSED:
                return "bg-teal-50 text-teal-700 ring-teal-100";
            case TRIP_STATUS.CANCELLED:
                return "bg-rose-50 text-rose-700 ring-rose-100";
            case TRIP_STATUS.DISPUTED:
                return "bg-amber-50 text-amber-700 ring-amber-100";
            default:
                return "bg-slate-50 text-slate-600 ring-slate-200";
        }
    };

    const getOperationalStatus = (trip) => {
        if (isPastOpenTrip(trip)) {
            return {
                label: "Needs review",
                className: "bg-rose-50 text-rose-700 ring-rose-100",
                railClassName: "bg-rose-500",
                needsReview: true,
            };
        }

        return {
            label: formatSnakeCasedStringAsLabel(trip.status),
            className: getStatusClassName(trip.status),
            railClassName:
                trip.status === TRIP_STATUS.ONGOING
                    ? "bg-emerald-500"
                    : trip.status === TRIP_STATUS.CANCELLED
                        ? "bg-rose-500"
                        : trip.status === TRIP_STATUS.DISPUTED
                            ? "bg-amber-500"
                            : "bg-primary",
            needsReview: false,
        };
    };

    const getTripMetaText = (trip) => {
        const meta = [`${trip.num_passengers ?? 0} pax`];
        const packageMetaText = getPackageMetaText(trip);

        if (Number(trip.num_luggages) > 0) {
            meta.push(
                `${trip.num_luggages} ${trip.num_luggages === 1 ? "luggage" : "luggages"}`,
            );
        }

        if (trip.fleet?.roof_carrier) {
            meta.push("Needs roof carrier");
        }

        if (getTripType(trip) === TRIP_TYPES.OUTSTATION && trip.total_days) {
            meta.push(`${trip.total_days} ${trip.total_days === 1 ? "day" : "days"}`);
        }

        if (packageMetaText) {
            meta.push(packageMetaText);
        }

        return meta.join(" | ");
    };

    const getPageStats = (trips, pagination) => {
        return [
            {
                label: "Total Trips",
                value: pagination?.total ?? trips.length ?? 0,
            },
            {
                label: "Needs Driver",
                value: trips.filter(needsDriverAssignment).length,
            },
            {
                label: "In Progress",
                value: trips.filter((trip) => trip.status === TRIP_STATUS.ONGOING).length,
            },
            {
                label: "Exceptions",
                value: trips.filter(isExceptionTrip).length,
            },
        ];
    };

    return {
        quickFilters,
        pageSize: PAGE_SIZE,
        defaultFilters: DEFAULT_FILTERS,
        hiddenPriceKeys: HIDDEN_PRICE_KEYS,
        getQuickFilterValues, getTripQueryParams, getTripsFromResponse, getPaginationFromResponse,
        formatTripDate, sortTripsByNearestStart,
        getDriverState, getRouteTimelineParams, getVisibleOverageRates,
        getVisiblePriceBreakdown, getExtraChargesText,
        getAttentionChips,
        getOperationalStatus,
        getTripMetaText,
        getPageStats
    }

}
