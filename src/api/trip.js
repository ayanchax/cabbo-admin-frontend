import { api } from "@/api";
import { ENDPOINTS } from "@/utils";
export const getTripsDashboard = async (
    { config = {
        page: 1,
        limit: 10,
    } } = {}
) => {
    const { data } = await api.get(ENDPOINTS.TRIPS.DASHBOARD, { params: config });
    return data;
}

export const getBookingDetail = async (
    bookingId
) => {
    const { data } = await api.get(`${ENDPOINTS.TRIPS.GET_BOOKING_BY_ID}/${bookingId}`);
    return data;
}

export const assignDriverToTrip = ({ bookingId, driverId }) => {
    return api.post(`${ENDPOINTS.TRIPS.ASSIGN_DRIVER}/${bookingId}/assign-driver/${driverId}`, {});
};

export const updateTripStatus = ({ bookingId, status, payload = {} }) => {
    return api.patch(`${ENDPOINTS.TRIPS.UPDATE_STATUS}/${bookingId}/status/${status}`, payload);
}

export const placeRefundIssuanceRequest = async (
    bookingId
) => {
    const { data } = await api.get(`${ENDPOINTS.TRIPS.ISSUE_REFUND}/${bookingId}/issue-refund`);
    return data;
}

