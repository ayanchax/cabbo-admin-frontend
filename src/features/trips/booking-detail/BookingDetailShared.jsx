import { RouteTimeline } from "@/components";
import { DEFAULT_CURRENCY_CODE, formatSnakeCasedStringAsLabel } from "@/utils";
import {
  EMPTY_VALUE,
  formatCurrency,
  formatDateTime,
} from "./bookingDetailFormatters";
import { InCarAmenities } from "../components/InCarAmenities";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return EMPTY_VALUE;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
};

const getPassengerText = (bookingDetail) => {
  const passengerParts = [
    bookingDetail?.num_adults
      ? `${bookingDetail.num_adults} adult${bookingDetail.num_adults === 1 ? "" : "s"}`
      : null,
    bookingDetail?.num_children
      ? `${bookingDetail.num_children} child${bookingDetail.num_children === 1 ? "" : "ren"}`
      : null,
  ].filter(Boolean);

  return passengerParts.length > 0
    ? passengerParts.join(" + ")
    : `${bookingDetail?.num_passengers ?? 0} pax`;
};

const getLuggageText = (bookingDetail) => {
  const luggageParts = [
    bookingDetail?.num_large_suitcases
      ? `${bookingDetail.num_large_suitcases} large suitcases`
      : null,
    bookingDetail?.num_carryons
      ? `${bookingDetail.num_carryons} carry-on`
      : null,
    bookingDetail?.num_backpacks
      ? `${bookingDetail.num_backpacks} backpack`
      : null,
    bookingDetail?.num_other_bags
      ? `${bookingDetail.num_other_bags} other`
      : null,
  ].filter(Boolean);

  return luggageParts.length > 0
    ? luggageParts.join(", ")
    : `${bookingDetail?.num_luggages ?? 0} luggage`;
};

function DetailSection({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function DetailField({ className = "", label, value }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-slate-950">
        {formatValue(value)}
      </p>
    </div>
  );
}

function DetailGrid({ children }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

function DetailList({ items = [] }) {
  const visibleItems = items.filter(Boolean);

  if (visibleItems.length === 0) {
    return <p className="text-sm text-slate-500">{EMPTY_VALUE}</p>;
  }

  return (
    <ul className="grid gap-2 text-sm text-slate-700">
      {visibleItems.map((item) => (
        <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

function PriceBreakdown({ bookingDetail }) {
  const currencyCode = bookingDetail?.currency?.code || DEFAULT_CURRENCY_CODE;
  const items = Object.entries(bookingDetail?.price_breakdown || {}).filter(
    ([, value]) => value !== null && value !== undefined,
  );

  return (
    <DetailSection title="Fare">
      <DetailGrid>
        <DetailField
          label="Driver Fare"
          value={formatCurrency(bookingDetail?.cost_to_driver, currencyCode)}
        />
        {items.map(([key, value]) => (
          <DetailField
            key={key}
            label={formatSnakeCasedStringAsLabel(key)}
            value={formatCurrency(value, currencyCode)}
          />
        ))}
      </DetailGrid>
    </DetailSection>
  );
}

function BookingDetailFrame({ bookingDetail, children }) {
  const tripType = bookingDetail?.trip_type;
  const status = formatSnakeCasedStringAsLabel(bookingDetail?.status);
  const currencyCode = bookingDetail?.currency?.code || DEFAULT_CURRENCY_CODE;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="break-all font-mono text-xs font-semibold tracking-wide text-slate-500">
              {bookingDetail?.booking_id}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {tripType?.display_name ||
                formatSnakeCasedStringAsLabel(tripType?.trip_type)}
            </h2>
          </div>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
            {status}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DetailField
            label="Start"
            value={formatDateTime(
              bookingDetail?.start_datetime,
              bookingDetail?.timezone,
            )}
          />
          <DetailField label="Customer" value={bookingDetail?.customer?.name} />
          <DetailField
            label="Passengers"
            value={getPassengerText(bookingDetail)}
          />
          <DetailField
            label="Driver Fare"
            value={formatCurrency(bookingDetail?.cost_to_driver, currencyCode)}
          />
        </div>
      </section>

      <DetailSection title="Route">
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <RouteTimeline
            pickupLocation={bookingDetail?.origin}
            dropoffLocation={bookingDetail?.destination}
            hops={bookingDetail?.hops || []}
            showReturn={Boolean(bookingDetail?.is_round_trip)}
            viewAsRouteTimeline
          />
        </div>
      </DetailSection>

      <DetailSection title="Customer">
        <DetailGrid>
          <DetailField label="Name" value={bookingDetail?.customer?.name} />
          <DetailField
            label="Phone"
            value={bookingDetail?.customer?.phone_number}
          />
          <DetailField label="Email" value={bookingDetail?.customer?.email} />
          <DetailField
            label="Updates Opt-In"
            value={bookingDetail?.customer?.opt_in_updates}
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Cab And Preferences">
          <DetailGrid>
          <DetailField
            className="w-28 sm:w-32"
            label="Cab Type"
            value={bookingDetail?.fleet?.car_type}
          />
          <DetailField
            className="w-28 sm:w-32"
            label="Fuel"
            value={bookingDetail?.fleet?.fuel_type}
          />
          <DetailField
            className="w-28 sm:w-32"
            label="Capacity"
            value={bookingDetail?.fleet?.capacity}
          />
          {bookingDetail?.num_luggages > 0 && (
            <DetailField
              className="w-28 sm:w-32"
              label="Luggage"
              value={getLuggageText(bookingDetail)}
            />
          )}
          {bookingDetail?.fleet?.roof_carrier && (
            <DetailField
              className="w-28 sm:w-32"
              label="Roof Carrier"
              value={bookingDetail?.fleet?.roof_carrier}
            />
          )}

        
        </DetailGrid>

        <DetailGrid>
          <div className="mt-5 max-w-3xl">
          <InCarAmenities {...bookingDetail?.in_car_amenities} className="" header="Amenities" />
        </div>
        </DetailGrid>
      </DetailSection>

      {children}

      <PriceBreakdown bookingDetail={bookingDetail} />
    </div>
  );
}

export {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailList,
  DetailSection,
};
