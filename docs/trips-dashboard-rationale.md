# Trips Dashboard Rationale

## Filter Model

The v1 trips dashboard uses one explicit filter group:

- Trip filters: explicit list constraints chosen by the user.

This keeps the dashboard clear for internal operators and avoids a second control surface that duplicates the same query fields.

## Quick Filters

Quick filters are intentionally not rendered in v1.

The deferred quick filters were:

- Today
- Ongoing
- Disputes

They map directly to existing trip filters:

- Today sets the date range to the current day.
- Ongoing sets status to ongoing.
- Disputes sets status to dispute.

For v1, these shortcuts add convenience but not unique capability. Since the dashboard is used by trained employees, the explicit Trip Filters are enough until real operational usage shows that repeated shortcuts are worth the extra UI.

The quick filter component and helper logic may remain available in code as dormant scaffolding. If quick filters return later, they should stay limited to broad workflows that users check repeatedly and should not become a shortcut for every possible status.

## Trip Filters

Current trip filters:

- Status
- Trip Type
- From date
- To date

The status filter intentionally includes only:

- Confirmed
- Ongoing
- Completed
- Cancelled
- Dispute

These are the statuses that make sense as explicit list-level filters for admin review. Internal or less useful states such as created and closed are still handled in dashboard logic, but are not exposed in the status dropdown.

Trip type and date range are kept because they support natural list filtering.

## Excluded Filters

Booking ID search is intentionally not part of the trip filter group. A booking ID behaves like a direct lookup for one trip, not a list or group filter. Keeping it in the grouped filter form makes the filtering model ambiguous.

Derived card states such as Needs driver and Needs review are also not quick filters for now. They are visible on trip cards as operational signals, but they are not first-class backend query filters. Adding them as quick filters would imply a list-level filtering behavior that may need either API support or client-side derived filtering.

If the backend later supports explicit query parameters for these derived queues, they can be reconsidered as quick filters.
