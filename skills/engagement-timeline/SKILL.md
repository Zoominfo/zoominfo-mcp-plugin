---
name: engagement-timeline
description: Build a timeline of engagements (meetings and emails) with an account or contact over a date range. Identify the account or contact by ZoomInfo ID (preferred), or by name or domain (triggers a lookup), or omit both to time-line your own recent engagements. Defaults to the last 90 days and can slide the window further back for a longer history. Returns a chronological timeline, a breakdown by engagement type, and a participant list with per-person engagement counts — and keeps each engagement's ID in context so you can immediately double-click any one to ask what was discussed. Use when someone asks "when did we last meet with X", "how often have we engaged this account", "show me the history with this contact", or wants a relationship timeline before a call.
---

# Engagement Timeline

Build a timeline of meetings and emails with an account or contact, then let the user double-click any engagement to see what was discussed.

## Prerequisites

`browse_engagements` reads from the calendar, email, and meeting providers connected to ZoomInfo. It requires at least one active calendar, email, or meeting integration in the workspace. If nothing is connected, `browse_engagements` returns no results — say so plainly and point the user to their ZoomInfo admin rather than implying there has been no contact.

`browse_engagements` is free (no credits). The optional double-click step uses `conversation_intelligence`, which consumes AI credits.

## Input

Provided via `$ARGUMENTS`:

- **Scope** — one of:
  - An **account**: ZoomInfo company ID (preferred), or a company name/domain (resolve via `search_companies`).
  - A **contact**: ZoomInfo contact ID (preferred), or a name + company (resolve via `search_contacts`).
  - **Neither**: time-line the current user's own recent engagements across all accounts.
- **How far back** (optional) — default is the last 90 days. "Last quarter", "this year", "since January", or a specific range all work; for anything beyond 90 days the window slides (see Workflow).
- **Type** (optional) — meetings only, emails only, or both (default both).

## Workflow

1. **Resolve scope.** Use a supplied ZoomInfo ID directly as `zoominfoCompanyId` or `zoominfoContactId`. Otherwise resolve a name/domain via `search_companies` / `search_contacts` and confirm the top match if it is ambiguous. With no scope, call `browse_engagements` with no ID to get the user's own engagements.

2. **Set the window.** `browse_engagements` accepts a date range up to 90 days wide (`engagementDateStart`, `engagementDateEnd`), ending no more than a month in the future. Default to the last 90 days. For a longer history, **slide the window backward in 90-day chunks** (e.g. 0-90 days ago, then 90-180, then 180-270) and merge the results, stopping when a chunk comes back empty or you reach the user's requested horizon. Tell the user when you are looking back across multiple windows so the wait is expected.

3. **Pull engagements.** Call `browse_engagements` with the resolved scope, `engagementType` (default `EMAILS_AND_MEETINGS`), `sort: -chronological` (newest first), and `engagementLimit` up to 50 per call. Set `userIntent` to the user's actual request. If a window is full at the limit, narrow it and page rather than silently truncating.

4. **Aggregate.** From the merged set compute: total engagements and the date range actually covered; a split by type (meetings vs emails); and a participant list with a count of engagements per person (name, and account where it differs). Retain each engagement's ID and the account/contact IDs in your working context — do **not** print raw IDs in the user-facing timeline, but keep them so the user can pick one to analyze.

## Output Format

### Summary

One line: who this is for, how many engagements over what actual date range, and the split (e.g. "14 engagements with Acme over the last 88 days — 9 meetings, 5 emails").

### Timeline

Newest first. One line per engagement: date, type, title/subject, and the key participants. Group by month if the range spans several months. Flag the most recent engagement and the gap since (e.g. "last contact 12 days ago").

### Participants

A short table, most-engaged first:

| Person | Account | Engagements |
|--------|---------|-------------|

Note anyone who has gone quiet (engaged early in the window, absent recently) — that is often the signal worth acting on.

### Double-click any engagement

Close by offering the next step: the user can name any engagement above ("the demo on the 14th", "the last email") and you will pass its engagement ID to `conversation_intelligence` to answer what was discussed, what was decided, or what is still open. Keep CI scoped to that single engagement; do not use it to search the timeline by topic or to count mentions (it cannot).

### When there is no data

If `browse_engagements` returns nothing, do not present an empty timeline as "no relationship". State that no engagements were found for the scope and window, that this may mean no connected integration covers them, and suggest widening the window or checking integration status with the ZoomInfo admin.
