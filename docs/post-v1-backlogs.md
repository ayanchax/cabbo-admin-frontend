# Cabbo Admin/Ops Post-V1 Backlogs

These items are deliberately deferred beyond Admin/Ops V1.

V1 should stay focused on daily operations: monitoring trips, inspecting bookings, assigning drivers, updating trip status, and handling refund recovery where needed.

Deferred items should be picked only after launch if booking volume, team size, operational friction, funding, or compliance needs justify them.

## Admin And User Management

- Driver CRUD.
- Driver onboarding and verification management.
- Driver document/KYC review screens.
- Driver availability calendar with date-range overlap checks.
- System user CRUD.
- Admin role/permission management UI.
- Admin invite and onboarding flow.
- Admin account deactivation/suspension UI.

## Booking And Audit Enhancements

- Booking detail audit timeline.
- Read-only trip status audit display:
  - actor/committer
  - status/action
  - reason
  - timestamp
- Internal notes on bookings.
- Internal note creation if backend endpoint exists.
- Assignment history timeline.
- Cancellation/refund lifecycle timeline.
- Dispute timeline with comments and supporting details.

## Driver Assignment Enhancements

- Soft driver-fit indicators:
  - good fit
  - capacity to verify
  - amenities to verify
  - cab/fuel mismatch warning
- Driver assignment calendar.
- Advanced driver availability planning for future non-overlapping trips.
- Bulk assignment tools for high-volume days.
- Driver performance/rating signals during assignment.

## Configuration And Catalog Management

- Pricing/config CRUD.
- Region/state/package/fleet/category editors.
- Trip package management.
- Fleet/cab category management.
- Amenity catalog management.
- Cancellation/refund policy editor.
- Fare and charge configuration editor.

## Legal, Support, And Content

- Legal/support content CMS.
- Support ticketing or inbox workflow.
- Customer escalation queue.
- Grievance workflow UI.
- Template editor for driver/customer support messages.

## Finance And Refunds

- Finance reconciliation tooling.
- Razorpay/payment provider reconciliation views.
- Refund settlement monitoring.
- Refund failure/pending-age alert dashboard.
- Manual finance review queues.
- Exportable payment/refund reports.

## Operations Reporting

- Dashboards and analytics.
- Booking volume trends.
- Revenue and advance-payment trend cards.
- Cancellation reason analytics.
- Driver utilization analytics.
- Trip SLA and delay monitoring.
- Region/state/city performance reports.

## Notifications And Automation

- Advanced notification workflows.
- Manual resend controls for customer/driver notifications.
- Ops-triggered driver reminder messages.
- Automated stale-trip escalation.
- Automated driver-release exception alerts.

## Data And Exports

- Bulk exports.
- CSV/PDF exports for bookings, refunds, drivers, and disputes.
- Saved admin filters.
- Scheduled operational reports.

## Product Rule

Do these after V1 only when Cabbo has enough traction or operational pain to justify the additional product, engineering, QA, and security surface. And above all, if it justifies, do not start alone - this time - because justification means we have a proven business now - so seek investment from investor and then only plan the next engineering roadmap for Cabbo.
