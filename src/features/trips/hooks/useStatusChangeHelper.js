import { TRIP_STATUS } from "@/utils"
export const useStatusChangeHelper = () => {

    const FIELD_TYPES = {
        DATETIME: "datetime",
        ENUM: "enum",
        NUMBER: "number",
        STRING: "string",
        OBJECT: "object",
    };


    const STATUS_ACTION_STYLES = {
        [TRIP_STATUS.ONGOING]: {
            iconClassName: "bg-sky-50 text-sky-700 ring-sky-100",
            buttonClassName: "bg-sky-600 text-white hover:bg-sky-700",
        },
        [TRIP_STATUS.COMPLETED]: {
            iconClassName: "bg-emerald-50 text-emerald-700 ring-emerald-100",
            buttonClassName: "bg-emerald-600 text-white hover:bg-emerald-700",
        },
        [TRIP_STATUS.CANCELLED]: {
            iconClassName: "bg-rose-50 text-rose-700 ring-rose-100",
            buttonClassName: "bg-rose-600 text-white hover:bg-rose-700",
        },
        [TRIP_STATUS.DISPUTED]: {
            iconClassName: "bg-amber-50 text-amber-700 ring-amber-100",
            buttonClassName: "bg-amber-600 text-white hover:bg-amber-700",
        },
    };
    function toDatetimeLocalValue(date = new Date()) {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        localDate.setSeconds(0, 0);
        return localDate.toISOString().slice(0, 16);
    }

    function getDefaultFieldValue(field) {
        if (field?.type === FIELD_TYPES.NUMBER) return "";
        if (field?.type === FIELD_TYPES.DATETIME) {
            return toDatetimeLocalValue();
        }
        return "";
    }

    function flattenPayloadFields(fields = []) {
        return fields.flatMap((field) => {
            if (field?.type === FIELD_TYPES.OBJECT && Array.isArray(field.fields)) {
                return flattenPayloadFields(field.fields);
            }
            return field?.name ? [field] : [];
        });
    }

    function getInitialFormValues(action) {
        return flattenPayloadFields(action?.payload_fields).reduce((values, field) => {
            values[field.name] = getDefaultFieldValue(field);
            return values; 
        }, {});  // values look like {reason:'', ....}
    }

    function setNestedValue(target, path, value) {
        const parts = path.split(".");
        let cursor = target;

        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                cursor[part] = value;
                return;
            }

            cursor[part] = cursor[part] || {};
            cursor = cursor[part];
        });
    }

    function compactPayload(value) {
        if (Array.isArray(value)) {
            return value.map(compactPayload).filter((item) => item !== undefined);
        }

        if (value && typeof value === "object") {
            const compacted = Object.entries(value).reduce((result, [key, item]) => {
                const compactedItem = compactPayload(item);
                if (compactedItem !== undefined) {
                    result[key] = compactedItem;
                }
                return result;
            }, {});

            return Object.keys(compacted).length ? compacted : undefined;
        }

        if (value === "" || value === null || value === undefined) {
            return undefined;
        }

        return value;
    }

    function buildPayload(action, formValues) {
        const fields = flattenPayloadFields(action?.payload_fields);
        const payload = {};

        fields.forEach((field) => {
            const rawValue = formValues[field.name];
            let value = rawValue;

            if (field.type === FIELD_TYPES.NUMBER && rawValue !== "") {
                value = Number(rawValue);
            }

            if (field.type === FIELD_TYPES.DATETIME && rawValue) {
                value = new Date(rawValue).toISOString();
            }

            setNestedValue(payload, field.name, value);
        });

        return compactPayload(payload) || {};
    }

    function getMissingRequiredFields(action, formValues) {
        return flattenPayloadFields(action?.payload_fields).filter(
            (field) => field.required && !String(formValues[field.name] ?? "").trim(),
        );
    }

    function getErrorMessage(error) {
        const detail = error?.response?.data?.detail;

        if (typeof detail === "string") return detail;
        if (Array.isArray(detail)) {
            return detail
                .map((item) => item?.msg || item?.message)
                .filter(Boolean)
                .join(" ");
        }

        return "Could not update trip status. Please try again.";
    }

    function updateTripStatusInCache(response, bookingId, status) {
        if (!response || !bookingId) return response;

        if (Array.isArray(response)) {
            return response.map((trip) =>
                trip?.booking_id === bookingId ? { ...trip, status } : trip,
            );
        }

        if (Array.isArray(response.trips)) {
            return {
                ...response,
                trips: response.trips.map((trip) =>
                    trip?.booking_id === bookingId ? { ...trip, status } : trip,
                ),
            };
        }

        return response;
    }

    
    return {
        updateTripStatusInCache,
        getErrorMessage,
        getMissingRequiredFields,
        buildPayload,
        getInitialFormValues,
        STATUS_ACTION_STYLES,
        FIELD_TYPES

    }


}