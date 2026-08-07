---
name: mutual-action-plan
description: 'Build a mutual action plan (MAP) from what was actually discussed on recent calls — the shared, dated set of steps each side owns to reach the goal. Reviews recent engagements and goes deep with conversation_intelligence scoped to individual calls to pull open items, agreed next steps, owners, and the timelines discussed. Identify the account by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone says "build a mutual action plan for Acme", "turn our last calls into a MAP", "what are the next steps and dates on both sides", or needs a close or onboarding plan. Evidence-based: it plans only what was discussed and asks for the target date if one was not stated.'
---

# Mutual Action Plan

Turn the commitments and timelines from recent calls into a single shared plan: who does what, by when, on both sides, toward an agreed goal.

## Prerequisites

`browse_engagements` (to find the calls) is free but requires an active calendar/meeting integration; `conversation_intelligence` (to read them) requires at least one connected meeting or email source and consumes AI credits (minimum ~9 per call), and this skill calls it once per key engagement, so the spend scales with how many calls you deep-read. `account_research` (optional deal context) consumes AI credits. If no conversation data exists, say so rather than inventing a plan.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **Goal & target date** (ask if it matters and was not given) — the close date, go-live, or objective the plan drives toward. Do not assume it; if the plan needs a date that was never discussed, ask the user.

## Workflow

1. **Resolve the account.** If no account was supplied, ask the user which one before proceeding. Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies` (`browse_engagements` filters by company ID + date, not by name).
2. **Find the recent calls.** Call `browse_engagements` (account-scoped, `engagementType: MEETINGS`, `sort: -chronological`). Pick the few most recent substantive calls that carry plan-relevant content (typically the last 2-4); each gets its own CI call, which costs credits, so do not fan out across the whole history. Keep their engagement IDs.
3. **Deep-read each call.** Run `conversation_intelligence` scoped to each engagement ID (one CI call per engagement) for open items, agreed next steps, who owns each (us vs them), and any dates, deadlines, or sequencing discussed. Keep each query to its single engagement; CI sees only the last few engagements and cannot topic-search or count.
4. **Confirm the goal.** If a target close/go-live date or objective was discussed, anchor the plan on it. If the plan needs one and it was never stated, ask the user rather than inventing a date.
5. **Assemble the MAP.** Merge the items into one plan, deduping across calls. Give each a clear owner and a target date where one was discussed. Order by date. Mark anything discussed without an owner or date as needing confirmation. Include only steps the conversations support; do not pad with a generic playbook.

## Output Format

### Mutual Action Plan — [Company]

*Goal: [stated objective and target date, or "target date not stated — confirm with the customer".]*

| # | Step | Owner | Target date | Status | Source |
|---|------|-------|-------------|--------|--------|
| 1 | | Us / Them | | open / done / at risk | [call] |

Ordered by target date (undated steps last).

**Gaps to confirm** — steps that were discussed without a clear owner or date, and any dependency the calls left unresolved. These are the first things to nail down with the customer.

### When there is no data

If `browse_engagements` finds no recent calls, or they have no transcripts to read, tell the user a MAP cannot be built from conversations and offer to draft one from items they provide, rather than fabricating steps or dates.
