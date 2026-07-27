# Driver Assignment Panel Rationale

## Purpose

The driver assignment panel exists to help Cabbo operations assign or reassign a driver only when the booking is still actionable.

The panel should make the current driver state obvious, avoid accidental changes, and keep assignment rules consistent across trip types.

## Placement

Driver assignment appears on the booking detail page after:

- Trip summary
- Route details
- Cab and luggage preferences
- Cab readiness checklist

This order is intentional. Operators should first understand the trip, verify cab/luggage requirements, and review promised amenities before assigning or reassigning a driver.

## Visibility Rules

The panel is shown in these cases:

- Upcoming trip with status `created` or `confirmed` and no assigned driver.
- Any trip with an assigned driver, so operations can still see who was assigned.

The panel is not shown for past or ongoing trips without a driver. That case is treated as bad or stale data, not something operations should fix by assigning a driver after the fact.

## Assignment Rules

Driver assignment or reassignment is allowed only when:

- The trip occurrence label is `upcoming`.
- The trip status is `created` or `confirmed`.

Past, ongoing, completed, cancelled, closed, and disputed trips must not allow assignment or reassignment from the admin UI.

The UI also blocks the mutation itself using the same rule. This prevents accidental assignment even if the panel state changes unexpectedly.

## Driver Search Strategy

Driver search is intentionally broad in V1. The backend search returns available drivers by name instead of strictly filtering by cab type, luggage capacity, or every promised amenity.

This is intentional because assignment is an operations-assisted workflow. A strict backend filter can create false scarcity when:

- Driver or cab metadata is incomplete.
- An amenity can be substituted operationally.
- A driver has a suitable cab even if one metadata field is not perfect.
- Ops needs to make a practical call for an urgent booking.

The admin UI therefore shows a guidance note before assignment: operators must review cab preference, luggage requirement, and promised amenities before selecting a driver.

In future, Cabbo may add soft fit indicators such as `Good fit`, `Capacity mismatch`, or `Amenities to verify`. These should guide operators, not hide otherwise available drivers unless the backend introduces a fully reliable matching model.

## V1 Availability Strategy

V1 uses a conservative one-driver-one-active-assignment model.

When a driver is assigned to a trip, the backend marks the driver unavailable. The driver becomes available again only when the assigned trip is completed, cancelled, or reassigned to another driver.

This means a driver assigned to one future trip cannot be assigned to another non-overlapping future trip until they are released from the first assignment. This is deliberate for V1.

The benefits are:

- No accidental double assignment.
- No date-range overlap bugs.
- Simpler operational reasoning for a small ops team.
- Ops is encouraged to keep trip statuses timely and accurate.
- The system avoids pretending to have a driver calendar before that workflow is fully hardened.

A future version can introduce a driver assignment calendar with date ranges and overlap checks. At that point, `is_available` can become a derived current-availability signal instead of the only assignment gate. We will do it - if we see good amount 
of customer traction and adoption in the app and bookings rise.

For V1, assignment should happen closer to the trip date using drivers who are currently free, and any assigned driver should be released only after trip completion, cancellation, or reassignment.

## Assigned Driver Behavior

When a driver is already assigned:

- Driver details are always visible.
- Reassignment is a small explicit action.
- The reassignment search form opens only after clicking `Reassign`.
- The current driver remains visible while reassignment is open.

This avoids hiding important operational information behind a collapsible section.

## Unassigned Driver Behavior

When an upcoming actionable trip needs a driver:

- The assignment panel can be expanded.
- Operators search by driver name.
- Search starts only after the minimum character count.
- The assign button stays disabled until a driver is selected.

This keeps the flow simple for operations and avoids noisy empty-state messages.

## Pending Mutation Behavior

While assignment or reassignment is pending:

- Search input is disabled.
- Driver result selection is disabled.
- Cancel and panel toggle actions are disabled.
- The submit button shows `Assigning...`.

This prevents double-submits, accidental driver changes, and confusing UI transitions while the backend is processing the assignment.

## Dashboard Scope

The trips dashboard card shows only driver name and phone number when assigned.

Cab registration number, model/make, fuel type, and full driver details belong on the booking detail page. The dashboard should stay dense and scannable.
