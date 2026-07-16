# Trips Display Rationale

The admin trips screen is an operations console. It should help an admin find a
booking, understand the service state, and assign or support the driver quickly.
It should not mirror the customer checkout or receipt UI.

## Pricing Display

For admin and driver operations, show:

- `cost_to_driver`
- operational price breakdown fields such as base fare, toll, parking, permit
  fee, placard charge, and driver allowance when present

Do not show:

- platform fee
- advance payment
- balance payment

Those fields describe customer payment collection and Cabbo unit economics.
They are useful in customer checkout, customer support, or finance workflows,
but they are distracting in the driver assignment flow. The driver/admin
question at assignment time is simpler: what total fare are we offering to the
driver, and what operational components explain that fare?

## Console Display

The trips list should stay dense and scannable:

- booking ID and customer contact for support lookup
- trip type, fleet, passengers, and route for matching supply
- start time and occurrence label for scheduling
- status and driver assignment state for operational action
- paginated navigation based on the backend response

The list may use the backend pagination metadata:

```json
{
  "page": 1,
  "limit": 10,
  "total": 20,
  "total_pages": 2,
  "has_next": true,
  "has_previous": false
}
```

The UI should continue to tolerate the legacy sample shape where the response is
only an array of trips, but the target production shape is the paginated wrapper.
