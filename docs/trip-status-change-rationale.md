# Trip Status Change Rationale

## Purpose

Trip status updates are one of the most important Admin/Ops V1 workflows.

Changing a trip status is not just a visual update. It can affect customer notifications, driver availability, refund/cancellation flows, dispute handling, payment context, and operational audit history.

For that reason, the admin frontend should treat status changes as guarded operational actions, not simple dropdown edits.

## Backend Contract

The backend endpoint is:

`PATCH /api/v1/admin/trips/{trip_id}/status/{status}`

The backend accepts:

- `trip_id` in the URL.
- target `status` in the URL.
- optional `AdditionalDetailsOnTripStatusChange` payload.

Only authorized admin roles such as `super_admin` and `driver_admin` should be allowed by the backend.

The backend remains the source of truth for:

- Whether a status transition is allowed.
- Whether the transition is within the allowed time window.
- Which side effects should run.
- Whether notifications/background tasks should be scheduled.
- Driver release behavior.
- Refund, cancellation, dispute, and completion side effects.

The frontend must never assume that a visible button means the transition is guaranteed to succeed. Backend validation errors must be shown clearly.

## Recommended Allowed-Transitions Contract

The preferred approach is for the booking-detail response to include backend-derived possible target statuses for the current trip.

Example shape:

```json
{
  "status": "confirmed",
  "label": "upcoming",
  "allowed_status_transitions": [
    {
      "status": "ongoing",
      "label": "Start trip",
      "requires_reason": false,
      "requires_confirmation": true,
      "payload_fields": ["start_datetime"]
    },
    {
      "status": "cancelled",
      "label": "Cancel trip",
      "requires_reason": true,
      "requires_confirmation": true,
      "payload_fields": ["reason", "cancelation_detail"]
    }
  ]
}
```

This is better than hardcoding all transition rules in the frontend because the backend already knows:

- Current status.
- Trip occurrence label.
- Trip timing.
- Trip type.
- Time-window validation rules.
- Role restrictions.
- Stale/past open trip handling.
- Side effects for cancellation, dispute, completion, and driver release.

The frontend can still have defensive fallback logic for V1, but the long-term contract should be backend-provided allowed actions.

## V1 Transition Scope

Admin/Ops V1 should focus on the transitions needed to run daily operations safely:

- `confirmed -> ongoing`
- `confirmed -> cancelled`
- `ongoing -> completed`
- `ongoing -> dispute`
- stale/past open trip -> `completed`
- stale/past open trip -> `dispute`

Terminal states such as `completed`, `cancelled`, `closed`, and `dispute` should generally not expose casual status actions unless the backend explicitly returns an allowed transition.

## Payload Strategy

The status update payload is intentionally flexible through `AdditionalDetailsOnTripStatusChange`.

The frontend should build payloads according to the target status and the action being performed.

### Start Trip

Target status: `ongoing`

Recommended payload:

```json
{
  "reason": "Trip started by operations.",
  "start_datetime": "2026-08-03T16:30:00Z"
}
```

The start datetime helps the backend maintain actual trip timing and later calculate overages where relevant.

### Complete Trip

Target status: `completed`

Recommended payload:

```json
{
  "reason": "Trip completed by operations.",
  "end_datetime": "2026-08-03T20:30:00Z",
  "extra_payment_to_driver": {
    "toll_charges": 0,
    "parking_charges": 0,
    "overage_payment": 0,
    "tips": 0,
    "comments": "No extra charges reported."
  }
}
```

Completion may release the driver, close the operational trip lifecycle, and update customer-facing trip state.

Extra payments should be simple in V1. If there are no extras, the frontend may send zero values or omit the object based on backend preference.

### Cancel Trip

Target status: `cancelled`

Recommended payload:

```json
{
  "reason": "Driver unavailable.",
  "cancelation_detail": {
    "cancellation_sub_status": "driver_unavailable",
    "reason": "Driver unavailable."
  }
}
```

Admin cancellation is more sensitive than customer cancellation. It may affect refund eligibility, customer messaging, driver release, and operational audit history.

Cancellation should require confirmation and a reason.

### Move To Dispute

Target status: `dispute`

Recommended payload:

```json
{
  "reason": "Fare disagreement reported.",
  "dispute_detail": {
    "reason": "Fare disagreement reported.",
    "dispute_type": "fare",
    "comments": [
      {
        "comment": "Customer and driver reported different final fare amounts."
      }
    ],
    "details": {
      "fare": {
        "support_notes": "Ops moved the trip to dispute for review."
      }
    }
  }
}
```

The UI does not need to expose every structured dispute field in V1. A practical V1 flow can collect:

- Dispute type: `fare`, `service`, or `other`.
- Required reason.
- Optional support note.

The frontend can map those simple fields into the backend's structured `dispute_detail`.

## UI Placement

The status action panel should live on the booking detail page after operational context is visible.

Recommended order:

1. Booking summary.
2. Route and timing.
3. Cab/luggage preferences.
4. Cab readiness checklist.
5. Driver assignment.
6. Status actions.
7. Fare/refund/support/audit sections.

This order lets the operator understand the trip before mutating its lifecycle.

## UI Behavior

The panel should:

- Show only allowed actions.
- Prefer backend-provided actions when available.
- Use strong confirmation for cancellation and dispute.
- Require a reason where backend expects one.
- Disable all inputs/buttons while mutation is pending.
- Show success toast from backend response message when available.
- Show backend validation errors clearly.
- Refresh or patch booking detail after success.
- Refresh or patch trips list cache after success.

For actions that can release a driver, the UI should make the consequence clear.

Example copy:

`Completing or cancelling this trip may release the assigned driver for future trips.`

## Confirmation Rules

Not every transition needs the same confirmation weight.

Recommended V1 behavior:

- `confirmed -> ongoing`: confirmation light, because it starts a live operational state.
- `ongoing -> completed`: confirmation required, because it may release the driver and close trip lifecycle.
- `confirmed -> cancelled`: strong confirmation and reason required.
- `ongoing -> dispute`: strong confirmation and reason required.
- stale/past open trip -> completed/dispute: confirmation required, with copy explaining that this is correcting an operationally stale trip.

## Frontend Fallback Rules

If backend does not yet return `allowed_status_transitions`, the frontend can use conservative fallback rules:

- `confirmed`: allow `ongoing` and `cancelled`.
- `ongoing`: allow `completed` and `dispute`.
- stale/past open trips with `created`, `confirmed`, or `ongoing`: allow `completed` and `dispute`.
- terminal statuses: show no status actions.

These fallback rules should be treated as temporary. Backend-provided allowed actions are preferred.

## Audit And Notes

Every admin status update should send a `reason` where practical, even when optional.

This keeps the backend audit trail useful for:

- Customer support.
- Driver disputes.
- Refund review.
- Operations training.
- Finding lifecycle bottlenecks.

The UI should avoid generic reasons like `updated by admin` when the operator can provide meaningful context.

## Why Backend-Provided Target Statuses Are Better

Cabbo status transitions depend on more than the current status string.

They can depend on:

- Occurrence label.
- Scheduled start/end time.
- Actual start/end time.
- Trip type.
- Driver assignment state.
- Cancellation/refund state.
- Dispute state.
- Admin role.
- Backend time-window validation.

If the frontend hardcodes all of this, it will eventually drift from backend rules.

Backend-provided allowed transitions keep the UI honest and make changes safer as Cabbo scales.
