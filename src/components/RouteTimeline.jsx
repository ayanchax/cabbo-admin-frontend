import React from "react";
import { MapPin, RotateCcw } from "lucide-react";

const DEFAULT_LOCATION = {
  lat: null,
  lng: null,
  display_name: null,
  address: null,
  country: null,
  country_code: null,
  region: null,
  region_code: null,
  state: null,
  state_code: null,
  postal_code: null,
  place_id: null,
};

const getHopLocation = (hop) => hop?.location ?? hop;

const getPointKey = (point, index) =>
  point.location?.place_id
    ? `${point.type}:${point.location.place_id}`
    : `${point.type}:${point.location?.lat ?? "unknown"}:${point.location?.lng ?? index}`;

const getPointDotClassName = (type) => {
  const colorByType = {
    origin: "bg-emerald-400",
    hop: "bg-primary",
    destination: "bg-rose-400",
    return: "bg-emerald-400",
  };

  return colorByType[type] || "bg-gray-400";
};

function LocationContent({
  point,
  pickupIcon,
  dropoffIcon,
  returnIcon,
  showPickupLabel,
  showDropoffLabel,
  compact = false,
}) {
  const { type, location, label } = point;
  const icon =
    type === "origin"
      ? pickupIcon
      : type === "return"
        ? returnIcon
        : dropoffIcon;
  const shouldShowLabel =
    label &&
    (type === "hop" ||
      type === "return" ||
      (type === "origin" && showPickupLabel) ||
      (type === "destination" && showDropoffLabel));

  return (
    <div className="min-w-0">
      {shouldShowLabel && (
        <div className="mb-1 text-[13px] text-gray-500 md:text-[14px]">
          {label}
        </div>
      )}

      <div className="flex min-w-0 items-center gap-1">
        {icon}
        <span
          className={`truncate font-medium ${
            compact
              ? "text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]"
              : "text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]"
          } ${location?.display_name ? "text-gray-900" : "text-gray-400"}`}
        >
          {location?.display_name}
        </span>
      </div>

      {location?.address && (
        <span
          className={`block truncate text-gray-500 ${
            compact ? "" : "pl-5"
          } text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]`}
        >
          {location.address}
        </span>
      )}
    </div>
  );
}

/**
 * Read-only route display shared by search, booking, and booking-detail flows.
 * Hops accept either location objects or `{ location }` wrappers.
 */
function RouteTimeline({
  pickupLocation = DEFAULT_LOCATION,
  dropoffLocation = DEFAULT_LOCATION,
  hops = [],
  returnLocation = null,
  showReturn = false,
  gap = "16px",
  viewAsRouteTimeline = true,
  showPickupLabel = false,
  showDropoffLabel = false,
  pickupLabel = "Pickup",
  dropoffLabel = "Dropoff",
  returnLabel = "Return to origin",
  pickupIcon = (
    <MapPin
      className="h-4 w-4 shrink-0 text-primary"
      aria-label="Pickup location"
    />
  ),
  dropoffIcon = (
    <MapPin
      className="h-4 w-4 shrink-0 text-primary"
      aria-label="Route location"
    />
  ),
  returnIcon = (
    <RotateCcw
      className="h-4 w-4 shrink-0 text-primary"
      aria-label="Return location"
    />
  ),
  className = "",
}) {
  const normalizedHops = Array.isArray(hops) ? hops : [];
  const validHops = normalizedHops.map(getHopLocation).filter(
    (location) => location?.display_name,
  );
  const routePoints = [
    {
      type: "origin",
      location: pickupLocation,
      label: pickupLabel,
    },
    ...validHops.map((location, index) => ({
      type: "hop",
      location,
      label: `Stop ${index + 1}`,
    })),
    ...(dropoffLocation?.display_name
      ? [
          {
            type: "destination",
            location: dropoffLocation,
            label: dropoffLabel,
          },
        ]
      : []),
    ...(showReturn && (returnLocation ?? pickupLocation)?.display_name
      ? [
          {
            type: "return",
            location: returnLocation ?? pickupLocation,
            label: returnLabel,
          },
        ]
      : []),
  ].filter((point) => point.location?.display_name);

  if (routePoints.length === 0) return null;

  if (!viewAsRouteTimeline || routePoints.length === 1) {
    return (
      <div className={className}>
        {routePoints?.map((point, index) => (
          <div
            key={getPointKey(point, index)}
            style={{
              marginBottom:
                index === routePoints.length - 1 ? undefined : gap,
            }}
          >
            <LocationContent
              point={point}
              pickupIcon={pickupIcon}
              dropoffIcon={dropoffIcon}
              returnIcon={returnIcon}
              showPickupLabel
              showDropoffLabel
              compact
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4 flex gap-3">
        <div className="flex shrink-0 flex-col items-center pt-1">
          {routePoints?.map((point, index) => (
            <React.Fragment key={getPointKey(point, index)}>
              <span
                className={`z-10 h-3 w-3 rounded-full border-2 border-white shadow-sm md:h-4 md:w-4 ${getPointDotClassName(point.type)}`}
                aria-hidden="true"
              />
              {index < routePoints.length - 1 && (
                <div className="my-1 min-h-8 w-px flex-1 bg-gray-300 opacity-60" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {routePoints?.map((point, index) => (
            <div
              key={getPointKey(point, index)}
              className={index < routePoints.length - 1 ? "mb-5" : ""}
            >
              <LocationContent
                point={point}
                pickupIcon={pickupIcon}
                dropoffIcon={dropoffIcon}
                returnIcon={returnIcon}
                showPickupLabel={showPickupLabel}
                showDropoffLabel={showDropoffLabel}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { RouteTimeline };
