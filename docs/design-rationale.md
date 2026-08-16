# Cabbo Admin/Ops Design Rationale

Design rationale for the Cabbo Admin/Ops V1 frontend.

The admin app is an internal operations tool. It should be responsive and
polished, but it should not look or behave like the customer-facing Cabbo app.
The goal is fast daily work: find bookings, inspect context, assign drivers,
update status, and support customers without visual noise.

## Product Feel

- Quiet, dense, and operational.
- Table/list-first, not hero-first.
- Built for repeated scanning and decision-making.
- Clear enough for laptop work, tablet usage, chromebooks, monitors, and emergency mobile use.
- No marketing-style composition, oversized cards, decorative illustrations, or promotional sections.

## Responsive Principle

Admin tools still need strong responsive behavior because operations may happen
from many devices:

- desktop monitor during planned ops work
- laptop/chromebook during normal daily management
- tablet during dispatch or field coordination
- mobile for emergency checks and quick updates

Responsive does not mean making the app playful. It means every core operation
remains usable without layout breakage, hidden critical controls, or text
overflow.

## Layout Direction

Desktop and wide screens:

- compact sidebar or top/sidebar hybrid navigation
- dense trips/bookings table as the primary surface
- detail pages with grouped operational sections
- filters visible and quick to adjust

Tablet and chromebook:

- collapsible navigation
- filters wrap cleanly without covering table content
- detail sections stack predictably
- actions remain visible near the relevant context

Mobile:

- top navigation or compact drawer
- booking rows become stacked operational summaries
- filters can move into a drawer/sheet
- critical actions remain reachable without horizontal scrolling
- mobile is supported for urgent operational work, not optimized as the primary workstation

## Typography

Use the same configured Cabbo font system:

- Satoshi for normal UI text, labels, headings, buttons, and table content.
- Geist Mono for booking IDs, technical identifiers, timestamps, currency figures, and system-like values.

This keeps the product family consistent while giving the admin app a more
technical, operational feel where needed.

## Density And Components

- Prefer compact tables, lists, panels, segmented controls, selects, date filters, and action menus.
- Use cards only for repeated entities, modal/dialog content, or genuinely grouped detail sections.
- Do not put cards inside cards.
- Avoid large empty visual areas.
- Keep headings modest in size inside operational screens.
- Use status badges sparingly and consistently.
- Use icons where they speed recognition, especially for actions such as refresh, search, filter, close, assign, and logout.

## Data Display

Operational screens must prioritize:

- booking ID
- trip type
- customer context
- route summary
- trip start time
- operational status
- payment/refund state
- assigned driver/cab state
- special requests and notes

Tables and detail views should support scanning, comparison, and quick action.
Avoid hiding important operational data behind decorative summaries.

## Forms And Actions

- Mutations must have loading, success, validation-error, and failure states.
- Sensitive actions such as reassignment, cancellation, dispute, and completion should require confirmation when appropriate.
- Backend validation errors should be shown in plain operational language.
- Disabled states must explain themselves through surrounding context or error copy.

## Accessibility And Reliability

- Text must not overflow buttons, filters, rows, cards, or modals.
- Touch targets must remain usable on mobile/tablet.
- Keyboard focus must be visible.
- Empty, loading, forbidden, missing-record, and degraded-network states must be explicit.
- Avoid layouts that require precise horizontal scrolling for critical actions.

## Visual Tone

Use a restrained admin palette:

- neutral backgrounds
- high-contrast text
- Cabbo primary blue only for primary actions and important focus states
- status colors only for meaningful states

Avoid:

- one-note color palettes
- decorative gradients
- oversized visual branding
- landing-page-style heroes
- illustrative empty sections unless they genuinely clarify a state

## Deferred Visual Work

Do not spend V1 time on:

- dashboards
- analytics visualizations
- complex charts
- custom illustration systems
- elaborate animations
- rich personalization

These can come later if admin usage proves the need. V1 should stay boring,
legible, and operationally reliable.
