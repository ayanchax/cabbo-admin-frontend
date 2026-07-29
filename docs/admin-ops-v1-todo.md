# Cabbo Admin/Ops V1 TODO

Execution checklist for the deliberately boring Admin/Ops MVP.

This project exists to support launch operations. Keep the scope narrow: run
daily trips safely, assign drivers, update operational status, and inspect the
context needed for customer support.

## Focus Rules

- Build operational workflows, not dashboards.
- Prefer dense, scannable operations UI over marketing-style pages. Use compact cards where they reduce horizontal scrolling and improve operator scan speed.
- Every list must be paginated and filterable enough to avoid expensive broad queries.
- Every mutation must show loading, success, validation-error, and failure states.
- Do not add pricing/config CRUD, analytics, legal CMS, fleet/package editors, or support-ticketing in V1.
- Admin UI should only call admin/ops endpoints exposed by the backend, not customer-facing endpoints.

## Target V1 Shape

| Component | Target |
| --- | --- |
| Admin frontend dev | `https://admin.dev.cabbo.co.in` |
| Admin frontend prod | `https://admin.cabbo.co.in` |
| Backend API dev | existing `https://api.dev.cabbo.co.in` |
| Backend API prod | existing `https://api.cabbo.co.in` |

Backend direction:

- For V1, keep admin/ops endpoints in the existing backend to avoid delaying launch.
- Keep admin auth, roles, internal DTOs, and audit logging clearly separated from customer-facing routes and DTOs inside the backend.
- Defer splitting customer and admin APIs into separate deployed services until traffic, team size, or operational risk justifies it.

## 1. Admin App Foundation

- [x] Create the Admin/Ops frontend project structure.
- [x] Configure routing.
- [x] Configure environment variables:
  - `VITE_API_BASE_URL`
  - app environment name
- [x] Add API client with auth header support.
- [x] Add central error handling and friendly failure messages.
- [x] Add authenticated route guard.
- [x] Add login UI.
- [x] Add logout UI.
- [x] Persist admin token/session safely.
- [x] Clear admin session on logout.
- [x] Add base layout:
  - compact sidebar/top navigation
  - current admin identity
  - logout action
  - responsive mobile/tablet fallback

## 2. Trips Operations List

- [x] Build trips/bookings operations cards as the first screen.
- [x] Show essential card fields:
  - booking ID
  - trip type
  - customer
  - route summary
  - start time
  - operational status
  - assigned driver/cab state
  - driver fare and driver-call context
- [x] Show driver-call context on cards:
  - passenger and luggage count
  - local package hours/km
  - outstation included km and total days
  - driver allowance per day for outstation
  - extra km/hour rates where relevant
  - toll/parking extra strip for driver-call clarity
  - airport flight/terminal/placard indicators
  - special-request indicator without exposing the full request text
- [x] Hide misleading/noisy card fields:
  - no assignment-needed badge for past/completed/cancelled trips
  - no synthetic driver state when a trip needs review
  - no zero-value fare breakdowns
  - no overage rates when driver fare is zero or trip needs review
  - no toll/parking extra strip when driver fare is zero
- [x] Sort visible trips by nearest start time.
- [x] Add backend-backed filters:
  - [x] status
  - [x] trip type
  - [x] date range
  - [x] booking ID
- [ ] Add super-admin-only `Today's bookings` filter/view:
  - filter by booking/order creation date instead of trip start date
  - keep existing status/trip-type filters compatible where practical
  - use existing trip stats/cards so this does not become a separate dashboard
  - backend must enforce elevated access even if frontend hides the control

- [x] Add pagination.
- [x] Add loading, empty, error, retry, and forbidden states.

- [x] Open trip detail from each card.

## 3. Trip Detail

- [x] Show internal booking/trip summary.
- [x] Show customer context needed for operations.
- [x] Show route, pickup/drop, stops, dates, package, cab type, and passenger/luggage preferences.
- [x] Show cab readiness checklist for promised amenities before driver assignment.
- [ ] Show refund/cancellation summary for cancelled trips.
- [x] Show assigned driver and cab details.
- [x] Show special requests/customer notes.
- [x] Show support context with booking ID prominently visible.
- [x] Add booking-detail refresh action.
- [x] Add copy-to-driver trip details action:
  - customer name and phone number
  - pickup location with Google Maps link
  - drop location with Google Maps link when applicable
  - hop names when applicable, without generating multiple hop links
  - offered driver fare and relevant extra km/hour rates
  - toll, parking, state permit, and included-charge context where applicable
  - fare breakdown such as base fare and driver allowance where applicable
  - professional driver instruction to call the customer at least 15 minutes before arrival and avoid direct fare bargaining with the customer
  - lazy map-link lookup through the location map hook
  - WhatsApp-friendly copy with scannable formatting and prefilled WhatsApp handoff
- [x] Add loading, missing-trip, forbidden, and generic-error states.

## 4. Driver Assignment

- [x] Show unassigned state for eligible upcoming bookings.
- [x] Add driver assignment action.
- [x] Add driver reassignment action.
- [x] Keep assigned driver details always visible.
- [x] Restrict assignment/reassignment to upcoming `created` or `confirmed` trips.
- [x] Search/select driver from backend-provided options.
- [x] Debounce driver search and show minimum-character helper.
- [x] Show selected driver/cab preview before submit.
- [x] Show assignment guidance to review cab, luggage, and promised amenities before selecting a driver.
- [x] Disable input, cancel/toggle actions, driver choices, and submit while assignment is pending.
- [x] Patch booking detail and trips list cache after successful assignment/reassignment.
- [x] Show a brief recent-change highlight after successful assignment/reassignment.
- [x] Handle backend validation errors clearly.
- [x] Document driver assignment rules in `driver-assignment-panel-rationale.md`.

## 5. Operational Status Updates

- [x] Show allowed next actions based on backend-provided status.
- [x] Support V1 transitions:
  - `confirmed -> ongoing`
  - `confirmed -> cancelled`
  - `ongoing -> completed`
  - `ongoing -> dispute`
  - stale/past open trip -> completed
  - stale/past open trip -> dispute
- [x] Require reason/note where backend requires it.
- [x] Confirm destructive/sensitive transitions.
- [x] Refresh trip detail after success.
- [x] Show backend validation errors for invalid transitions.

## 6. Refund Recovery

- [ ] Show refund recovery action only where a refund is applicable and backend refund initiation is still needed.
- [ ] Scope refund initiation UI to `super_admin` and `finance_admin` only.
- [ ] Call `GET /api/v1/admin/trips/refunds/booking/{booking_id}/initiate-refund`.
- [ ] Explain in UI copy that this initiates/queues refund processing for the backend refund workflow and Razorpay provider attempt.
- [ ] Use this only as an operational recovery path when the normal cancellation workflow refund initiation failed or did not execute.
- [ ] Require confirmation before initiating refund recovery.
- [ ] Show success, backend validation failure, forbidden, and generic failure states.
- [ ] Refresh refund/cancellation context after successful initiation.


## 8. Access, Security, And Privacy

- [ ] Confirm admin auth mechanism with backend.
- [x] Confirm role/permission model for V1:
  - trip operations: roles allowed by backend
  - refund recovery: `super_admin`, `finance_admin`
  - today's bookings/founder view: `super_admin`
- [x] Ensure customer-safe and internal DTOs stay separate.
- [x] Never expose admin tokens or admin-only API behavior through customer frontend code.
- [x] Avoid storing unnecessary PII in frontend state.
- [x] Redact sensitive values in client-side logs.
- [x] Handle `401` and `403` distinctly.
- [x] Show server-enforced `403` forbidden state in trips list.
- [x] Verify admin frontend calls only admin/ops backend endpoints.

## 9. QA Checklist

- [x] Admin login works.
- [x] Admin logout clears session and route access.
- [x] Unauthorized users cannot access protected admin screens.
- [x] Trip list filters work.
- [x] Trip list pagination works.
- [x] Trip detail loads for valid booking IDs.
- [x] Trips list forbidden state is clear.
- [x] Missing/forbidden trip detail states are clear.
- [x] Driver assignment works.
- [x] Driver reassignment works.
- [x] Operational status updates work for allowed transitions.
- [x] Invalid transitions show clear backend errors.
- [ ] Payment/refund summaries display accurately.
- [ ] Refund recovery action is visible only to `super_admin` and `finance_admin`.
- [ ] Refund recovery initiation handles success, `400`, `403`, and generic failures.
- [x] Special requests/customer notes are visible where expected.
- [ ] Layout works on laptop and mobile-width emergency usage.
- [ ] No text overflow in cards, filters, buttons, or modals.

## Deferred Beyond Admin/Ops V1

Deferred items are tracked in `post-v1-backlogs.md`.

## Done Means

- Admin can log in.
- Admin can find a booking quickly.
- Admin can inspect the operational context for a booking.
- Admin can assign or reassign a driver.
- Admin can perform the required V1 operational status transitions.
- Admin can see payment/refund context needed for support.
- All mutation flows have confirmation, loading, success, and error states.
- Admin/Ops frontend never calls customer-facing endpoints directly.
