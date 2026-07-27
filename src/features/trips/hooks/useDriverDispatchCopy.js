import { useState } from "react";
import { isDevMode } from "@/api";
import {
  APP,
  copyTextToClipboard,
  EMPTY_VALUE,
  formatMoney,
  formatSnakeCasedStringAsLabel,
} from "@/utils";
import { useLocale, useLocationMap, useTimezone, useToast } from "@/hooks";
import { useTripsHelper } from "./useTripsHelper";

function getLocationName(location) {
  return location?.display_name || location?.address || EMPTY_VALUE;
}

function getLocationAddress(location) {
  return location?.address && location.address !== location.display_name
    ? location.address
    : "";
}

function getHopLocation(hop) {
  return hop?.location || hop;
}

function compactLines(lines) {
  return lines.filter((line) => line !== null && line !== undefined);
}

function getWhatsAppPhoneNumber(phoneNumber) {
  return phoneNumber ? String(phoneNumber).replace(/\D/g, "") : "";
}

function getWhatsAppUrl(phoneNumber, message) {
  const encodedMessage = encodeURIComponent(message);
  const normalizedPhone = getWhatsAppPhoneNumber(phoneNumber);

  if (normalizedPhone) {
    return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
  }

  return `https://wa.me/?text=${encodedMessage}`;
}

function buildDriverMessage({
  bookingDetail,
  destinationMapUrl,
  formattedStart,
  originMapUrl,
  priceBreakdown,
  overageRates,
  extraChargesText,
}) {
  const currencyCode = bookingDetail?.currency?.code;
  const origin = bookingDetail?.origin;
  const destination = bookingDetail?.destination;
  const hops = Array.isArray(bookingDetail?.hops)
    ? bookingDetail.hops.map(getHopLocation).map(getLocationName).filter(Boolean)
    : [];
  const customerName = bookingDetail?.customer?.name || "Customer";
  const customerPhone = bookingDetail?.customer?.phone_number || EMPTY_VALUE;
  const tripName =
    bookingDetail?.trip_type?.display_name ||
    formatSnakeCasedStringAsLabel(bookingDetail?.trip_type?.trip_type);
  const fleetText = [
    bookingDetail?.fleet?.name || bookingDetail?.fleet?.car_type,
    bookingDetail?.fleet?.fuel_type ? `(${bookingDetail.fleet.fuel_type})` : null,
  ]
    .filter(Boolean)
    .join(" ");
  const breakdownLines = priceBreakdown.map(([key, value]) => {
    return `• ${formatSnakeCasedStringAsLabel(key)}: ${formatMoney(
      value,
      currencyCode,
    )}`;
  });
  const overageLines = overageRates.map(([label, value]) => {
    return `• ${label}: ${formatMoney(value, currencyCode)}`;
  });
  const includedLines = compactLines([
    bookingDetail?.included_kms
      ? `• Included km: ${bookingDetail.included_kms} km`
      : null,
    bookingDetail?.package?.included_hours
      ? `• Included hours: ${bookingDetail.package.included_hours}h`
      : null,
    bookingDetail?.package?.included_km
      ? `• Package km: ${bookingDetail.package.included_km} km`
      : null,
    bookingDetail?.total_days
      ? `• Trip days: ${bookingDetail.total_days}`
      : null,
  ]);
  const specialContextLines = compactLines([
    bookingDetail?.flight_number
      ? `• Flight number: ${bookingDetail.flight_number}`
      : null,
    bookingDetail?.terminal_number
      ? `• Terminal: ${bookingDetail.terminal_number}`
      : null,
    bookingDetail?.placard_required && bookingDetail?.placard_name
      ? `• Placard name: ${bookingDetail.placard_name}`
      : null,
    bookingDetail?.special_needs_requests
      ? `• Special request: ${bookingDetail.special_needs_requests}`
      : null,
    bookingDetail?.fleet?.roof_carrier ? "• Roof carrier required: Yes" : null,
  ]);
  const driverFareText = formatMoney(
    bookingDetail?.cost_to_driver,
    currencyCode,
  );
  const driverFareLine = `• Driver fare offered: ${driverFareText}${
    extraChargesText ? ` (${extraChargesText.toLowerCase()})` : ""
  }`;

  const lines = compactLines([
    `🚕 ${APP.name} trip assignment`,
    `🧾 Booking ID: ${bookingDetail?.booking_id || EMPTY_VALUE}`,
    `🚘 Trip type: ${tripName}`,
    `🕒 Start time: ${formattedStart || EMPTY_VALUE}`,
    "",
    "👤 Customer",
    `• Name: ${customerName}`,
    `• Phone: ${customerPhone}`,
    "",
    "📍 Route",
    `• Pickup: ${getLocationName(origin)}`,
    getLocationAddress(origin)
      ? `  Address: ${getLocationAddress(origin)}`
      : null,
    originMapUrl ? `  Map: ${originMapUrl}` : null,
    "",
    destination ? `• Drop: ${getLocationName(destination)}` : null,
    destination && getLocationAddress(destination)
      ? `  Address: ${getLocationAddress(destination)}`
      : null,
    destinationMapUrl ? `  Map: ${destinationMapUrl}` : null,
    hops.length > 0 ? `• Via: ${hops.join(" → ")}` : null,
    "",
    "💰 Cab and fare",
    fleetText ? `• Cab: ${fleetText}` : null,
    bookingDetail?.fleet?.capacity
      ? `• Capacity: ${bookingDetail.fleet.capacity}`
      : null,
    driverFareLine,
    ...includedLines,
    overageLines.length > 0 ? "" : null,
    overageLines.length > 0 ? "📏 Extra usage rates" : null,
    ...overageLines,
    breakdownLines.length > 0 ? "" : null,
    breakdownLines.length > 0 ? "🧮 Fare breakup" : null,
    ...breakdownLines,
    specialContextLines.length > 0 ? "" : null,
    specialContextLines.length > 0 ? "📝 Trip notes" : null,
    ...specialContextLines,
    "",
    "⚠️ Driver instruction",
    "Please call the customer at least 15 minutes before pickup/arrival.",
    "Do not discuss or negotiate fares directly with the customer. For any fare or trip clarification, contact Cabbo operations.",
  ]);

  return lines.join("\n");
}

function useDriverDispatchCopy(bookingDetail) {
  const { showToast } = useToast();
  const { locale } = useLocale();
  const { timezone: clientTimezone } = useTimezone();
  const [isCopying, setIsCopying] = useState(false);
  const originPlaceId = bookingDetail?.origin?.place_id;
  const destinationPlaceId = bookingDetail?.destination?.place_id;
  const originMapQuery = useLocationMap(originPlaceId, false);
  const destinationMapQuery = useLocationMap(destinationPlaceId, false);
  const {
    canShowFareDetails,
    canShowOverageRates,
    formatTripDate,
    getExtraChargesText,
    getOperationalStatus,
    getVisibleOverageRates,
    getVisiblePriceBreakdown,
    getDriverState,
  } = useTripsHelper();

  const hasAssignedDriver = getDriverState(bookingDetail)?.assigned || false;

  const copyDriverDispatchDetails = async () => {
    if (isCopying) return;

    setIsCopying(true);
    try {
      const [originMapResult, destinationMapResult] = await Promise.all([
        originPlaceId
          ? originMapQuery.refetch()
          : Promise.resolve({ data: null }),
        destinationPlaceId
          ? destinationMapQuery.refetch()
          : Promise.resolve({ data: null }),
      ]);
      const originMapUrl = originMapResult?.data || null;
      const destinationMapUrl = destinationMapResult?.data || null;
      const operationalStatus = getOperationalStatus(bookingDetail);
      const shouldShowFareDetail = canShowFareDetails(
        operationalStatus.needsReview,
        bookingDetail?.status,
      );
      const shouldShowOverageRates = canShowOverageRates(
        bookingDetail?.trip_type?.trip_type,
      );
      const message = buildDriverMessage({
        bookingDetail,
        destinationMapUrl,
        extraChargesText: shouldShowFareDetail
          ? getExtraChargesText(bookingDetail)
          : "",
        formattedStart: formatTripDate(
          bookingDetail?.start_datetime,
          locale,
          clientTimezone?.timezone ?? bookingDetail?.timezone,
        ),
        originMapUrl,
        overageRates:
          shouldShowFareDetail && shouldShowOverageRates
            ? getVisibleOverageRates(bookingDetail)
            : [],
        priceBreakdown: shouldShowFareDetail
          ? getVisiblePriceBreakdown(bookingDetail)
          : [],
      });

      await copyTextToClipboard(message);
      showToast("Driver trip details copied.", "success");
      window.open(
        getWhatsAppUrl(bookingDetail?.driver?.phone, message),
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      if (isDevMode) {
        console.error("Error copying driver trip details:", error);
      }
      showToast(
        "Could not copy driver trip details. Please try again.",
        "error",
      );
    } finally {
      setIsCopying(false);
    }
  };

  return {
    copyDriverDispatchDetails,
    isCopying,
    hasAssignedDriver,
  };
}

export { useDriverDispatchCopy };
