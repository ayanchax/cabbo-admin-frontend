# Trip Detail Rationale

The trip detail page is the controlled action surface for Admin/Ops V1.

The trips dashboard card should help an operator scan trips and answer driver
call questions quickly. It should not expose sensitive mutations directly. The
detail page gives the operator enough context to make and confirm operational
changes safely.

## Detail Page Scope

Show the full operational context needed before mutating a trip:

- booking ID and internal trip summary
- customer context needed for operations
- route, pickup, drop, stops, dates, package, cab type, passenger count, and
  luggage preferences
- payment summary:
  - booking amount
  - amount paid
  - amount due to driver
  - payment status
  - Razorpay/reference IDs only if backend exposes safe internal fields
- refund and cancellation summary for cancelled trips
- assigned driver and cab details
- special requests/customer notes
- support context with booking ID prominently visible
- audit history/internal notes if backend supports them
- loading, missing-trip, forbidden, and generic-error states

## Allowed Mutations

Mutations belong on the trip detail page, not on the dashboard cards.

### Driver Assignment

- assign driver
- reassign driver
- search/select driver from backend-provided options
- show selected driver/cab preview before submit
- require confirmation for reassignment
- refresh trip detail after successful assignment
- show backend validation errors clearly

Backend endpoint:

- `POST /api/v1/admin/trips/{trip_id}/assign-driver/{driver_id}`

### Operational Status Updates

Show only allowed next actions based on the current trip status and backend
rules.

Supported V1 transitions:

- `confirmed -> ongoing`
- `confirmed -> cancelled`
- `ongoing -> completed`
- `ongoing -> dispute`
- stale/past open trip -> completed
- stale/past open trip -> dispute

Status updates should:

- require reason/note where the backend requires it
- require confirmation for destructive or sensitive transitions
- refresh trip detail after success
- show backend validation errors for invalid transitions

Backend endpoint:

- `PATCH /api/v1/admin/trips/{trip_id}/status/{status}`

### Refund Recovery

Refund recovery is a privileged operational recovery action. It should not be a
general-purpose refund interface.

Show refund recovery only when:

- a refund is applicable
- backend refund initiation is still needed
- the normal cancellation workflow refund initiation failed or did not execute

Scope the UI to:

- `super_admin`
- `finance_admin`

The action initiates or queues refund processing for the backend refund workflow
and Razorpay provider attempt.

Backend endpoint:

- `GET /api/v1/admin/trips/refunds/booking/{booking_id}/initiate-refund`

Refund recovery should:

- require confirmation before initiating
- show success, backend validation failure, forbidden, and generic failure states
- refresh refund/cancellation context after successful initiation

## Dashboard Boundary

The dashboard should keep a single primary action:

- `Open`

Avoid direct mutation buttons on dashboard cards in V1. Quick actions can be
considered later, but the first controlled version should make operators open
the trip before assigning drivers, changing status, or initiating refund
recovery.
