import {
  BookingDetailFrame,
  DetailField,
  DetailGrid,
  DetailList,
  DetailSection,
} from "./BookingDetailShared";

function AirportTransferBookingDetail({ bookingDetail }) {
  const isPickup = bookingDetail?.trip_type?.trip_type === "airport_pickup";
  const airportLocation = isPickup
    ? bookingDetail?.origin
    : bookingDetail?.destination;

  return (
    <BookingDetailFrame bookingDetail={bookingDetail}>
      <DetailSection title="Airport Transfer">
        <DetailGrid>
          <DetailField
            label="Transfer Type"
            value={isPickup ? "Airport Pickup" : "Airport Drop"}
          />
          <DetailField
            label="Airport"
            value={airportLocation?.display_name || airportLocation?.address}
          />
          <DetailField
            label="Placard Required"
            value={bookingDetail?.placard_required}
          />
          <DetailField
            label="Toll Road Preferred"
            value={bookingDetail?.toll_road_preferred}
          />
          <DetailField label="Flight Number" value={bookingDetail?.flight_number} />
          <DetailField label="Terminal" value={bookingDetail?.terminal_number} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Extra/Overage Rules">
        <DetailGrid>
          <DetailField
            label="Extra Km"
            value={
              bookingDetail?.overages?.overage_amount_per_km
                ? `${bookingDetail.overages.overage_amount_per_km} per km`
                : null
            }
          />
           
        </DetailGrid>
        
      </DetailSection>
    </BookingDetailFrame>
  );
}

export { AirportTransferBookingDetail };
