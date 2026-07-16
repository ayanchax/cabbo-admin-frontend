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
- [ ] Add central error handling and friendly failure messages.
- [x] Add authenticated route guard.
- [x] Add login UI.
- [x] Add logout UI.
- [x] Persist admin token/session safely.
- [x] Clear admin session on logout.
- [ ] Clear admin session on unauthorized API responses.
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
  - airport flight/terminal/placard indicators
  - special-request indicator without exposing the full request text
- [x] Hide misleading/noisy card fields:
  - no assignment-needed badge for past/completed/cancelled trips
  - no synthetic driver state when a trip needs review
  - no zero-value fare breakdowns
  - no overage rates when driver fare is zero or trip needs review
- [x] Sort visible trips by nearest start time.
- [ ] Add filters:
  - status
  - trip type
  - date range
  - booking ID
  - customer phone/email only if backend safely supports it
- [x] Add pagination.
- [x] Add loading, empty, error, retry, and forbidden states.
- [ ] Preserve filters in URL query params where practical.
- [ ] Open trip detail from each card.

## 3. Trip Detail

- [ ] Show internal booking/trip summary.
- [ ] Show customer context needed for operations.
- [ ] Show route, pickup/drop, stops, dates, package, cab type, and passenger/luggage preferences.
- [ ] Show payment summary:
  - booking amount
  - amount paid
  - amount due to driver
  - payment status
  - Razorpay/reference IDs only if backend exposes safe internal fields
- [ ] Show refund/cancellation summary for cancelled trips.
- [ ] Show assigned driver and cab details.
- [ ] Show special requests/customer notes.
- [ ] Show support context with booking ID prominently visible.
- [ ] Show audit history/internal notes if backend supports them.
- [ ] Add loading, missing-trip, forbidden, and generic-error states.

## 4. Driver Assignment

- [ ] Show unassigned state for eligible bookings.
- [ ] Add driver assignment action.
- [ ] Add driver reassignment action.
- [ ] Search/select driver from backend-provided options.
- [ ] Show selected driver/cab preview before submit.
- [ ] Require confirmation for reassignment.
- [ ] Refresh trip detail after successful assignment.
- [ ] Handle backend validation errors clearly.

## 5. Operational Status Updates

- [ ] Show allowed next actions based on backend-provided status.
- [ ] Support V1 transitions:
  - `confirmed -> ongoing`
  - `confirmed -> cancelled`
  - `ongoing -> completed`
  - `ongoing -> dispute`
  - stale/past open trip -> completed
  - stale/past open trip -> dispute
- [ ] Require reason/note where backend requires it.
- [ ] Confirm destructive/sensitive transitions.
- [ ] Refresh trip detail after success.
- [ ] Show backend validation errors for invalid transitions.

## 6. Internal Notes And Audit

- [ ] Display internal notes if available.
- [ ] Add note creation only if backend endpoint exists for V1.
- [ ] Display audit entries if available:
  - actor
  - action
  - old value
  - new value
  - timestamp
  - reason/note
- [ ] Keep audit data read-only in the frontend.

## 7. Access, Security, And Privacy

- [ ] Confirm admin auth mechanism with backend.
- [ ] Confirm role/permission model for V1.
- [ ] Ensure customer-safe and internal DTOs stay separate.
- [ ] Never expose admin tokens or admin-only API behavior through customer frontend code.
- [ ] Avoid storing unnecessary PII in frontend state.
- [ ] Redact sensitive values in client-side logs.
- [ ] Handle `401` and `403` distinctly.
- [x] Show server-enforced `403` forbidden state in trips list.
- [ ] Verify admin frontend calls only admin/ops backend endpoints.

## 8. QA Checklist

- [x] Admin login works.
- [x] Admin logout clears session and route access.
- [ ] Unauthorized users cannot access protected admin screens.
- [ ] Trip list filters work.
- [x] Trip list pagination works.
- [ ] Trip detail loads for valid booking IDs.
- [x] Trips list forbidden state is clear.
- [ ] Missing/forbidden trip detail states are clear.
- [ ] Driver assignment works.
- [ ] Driver reassignment works.
- [ ] Operational status updates work for allowed transitions.
- [ ] Invalid transitions show clear backend errors.
- [ ] Payment/refund summaries display accurately.
- [ ] Special requests/customer notes are visible where expected.
- [ ] Layout works on laptop and mobile-width emergency usage.
- [ ] No text overflow in cards, filters, buttons, or modals.

## Deferred Beyond Admin/Ops V1

- Pricing/config CRUD.
- Region/state/package/fleet/category editors.
- Legal/support content CMS.
- Dashboards and analytics.
- Full support-ticketing or inbox workflow.
- Advanced notification workflows.
- Bulk exports.
- Driver onboarding/verification management.
- Finance reconciliation tooling.
> We will do the deferred items after V1 
> only if we get funded.

## Done Means

- Admin can log in.
- Admin can find a booking quickly.
- Admin can inspect the operational context for a booking.
- Admin can assign or reassign a driver.
- Admin can perform the required V1 operational status transitions.
- Admin can see payment/refund context needed for support.
- All mutation flows have confirmation, loading, success, and error states.
- Admin/Ops frontend never calls customer-facing endpoints directly.
