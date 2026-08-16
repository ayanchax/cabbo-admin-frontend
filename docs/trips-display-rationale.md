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
- trip type, fleet, passenger/package summary, and route for matching supply
- start time and occurrence label for scheduling
- status and driver assignment state for operational action
- driver fare and driver-facing extras for assignment calls
- compact attention chips for airport, toll-road, placard, and special-request
  signals
- paginated navigation based on the backend response

The list uses compact cards instead of a horizontally scrolling table. This is
intentional: the admin needs to scan full booking context while on a driver
assignment call, and a table becomes cramped once fare, package, airport, and
assignment signals are all included.

The card should not render a full route timeline in the list. The route is shown
as compact origin/destination text, with stops summarized when present. Full
route context belongs in the booking detail page.

## Card Scope

Each card should answer the driver-call question: can the operator explain this
trip quickly enough for a driver to accept or reject it?

Show on the card:

- booking ID and customer contact
- compact route, with origin and destination
- route stops summarized as `Via ...` when present
- trip type and fleet
- passenger count and package summary where relevant
- round-trip indicator in the trip summary
- start time and occurrence label
- operational status
- real assigned driver, when present
- `Needs driver` only for upcoming assignable trips
- `Needs review` for past/open trips that need operator attention
- local package hours/km
- outstation total days and included km
- driver fare
- driver allowance per day for outstation trips
- non-zero fare breakdown items, sorted highest first
- extra km/hour rates where they matter for assignment calls
- airport flight, terminal, and placard indicators when present
- toll-road preference when present
- special-request indicator when present, without showing the full request text
- `Open` action, right-aligned on wider screens and full-width on mobile/tablet
  layouts

Do not show on the card:

- customer payment collection fields such as advance or balance payment
- detailed route timeline
- estimated outstation km, because the driver-facing rule is included km plus
  extra km rate
- zero-value breakdown items
- fare breakdown when driver fare is zero
- overage rates when driver fare is zero
- overage rates for `Needs review` trips
- extra km rates for airport trips
- synthetic assignment labels like `Not assigned` when a trip is cancelled or
  already in review
- full in-car amenities
- luggage and roof-carrier details unless they are needed for a specific
  assignment decision
- inclusions and exclusions
- full refund and cancellation policy

## Open Button Scope

The `Open` action should be used for deeper context and mutations, not for
basic driver-call facts. The detail/action surface should handle:

- assign driver and reassign driver
- search/select available drivers from admin driver endpoints
- status changes:
  - `confirmed -> ongoing`
  - `confirmed -> cancelled`
  - `ongoing -> completed`
  - `ongoing -> dispute`
  - stale/past open trip -> completed
  - stale/past open trip -> dispute
- cancellation details
- refund initiation where applicable
- refund and cancellation policy review when support context requires it
- dispute details and updates
- full trip, customer, payment, amenities, inclusions, exclusions, notes, and
  audit context

## Access States

Admin endpoints are guarded by server-side role checks. If the backend returns
`403`, the UI should show a clear forbidden state instead of a generic retry
error. This keeps the frontend aligned with the backend permission model and
avoids implying that retrying will fix a role restriction.

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
