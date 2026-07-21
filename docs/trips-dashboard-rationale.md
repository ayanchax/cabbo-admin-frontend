# Trips Dashboard Rationale

## Filter Model

The trips dashboard separates filters into two groups:

- Quick filters: high-frequency operational views.
- Trip filters: explicit list constraints chosen by the user.

This keeps the dashboard useful for daily operations without turning the top bar into a full duplicate of the filter form.

## Quick Filters

Current quick filters:

- Today
- Ongoing
- Disputes

These are kept because they represent common operational modes:

- Today focuses the dashboard on trips scheduled for the current day.
- Ongoing focuses the dashboard on trips currently in progress.
- Disputes focuses the dashboard on exception handling.

Quick filters should stay limited to broad workflows that users are likely to check repeatedly. They should not become a shortcut for every possible status.

When a quick filter is selected, it layers onto the currently applied trip filters. Unrelated filters, such as trip type, are preserved. When a quick filter is switched or deselected, only the fields controlled by the previous quick filter are cleared.

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

Trip type and date range are kept because they support natural list filtering and can combine cleanly with quick filters.

## Excluded Filters

Booking ID search is intentionally not part of the trip filter group. A booking ID behaves like a direct lookup for one trip, not a list or group filter. Keeping it in the grouped filter form makes the filtering model ambiguous.

Derived card states such as Needs driver and Needs review are also not quick filters for now. They are visible on trip cards as operational signals, but they are not first-class backend query filters. Adding them as quick filters would imply a list-level filtering behavior that may need either API support or client-side derived filtering.

If the backend later supports explicit query parameters for these derived queues, they can be reconsidered as quick filters.
