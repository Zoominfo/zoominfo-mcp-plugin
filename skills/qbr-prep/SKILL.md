---
name: qbr-prep
description: 'Assemble a QBR prep pack for a business review — value moments, usage and adoption themes, risks, and open items, with a deal and relationship snapshot. Combines account_research for the account picture with conversation_intelligence over recent calls (scoped to individual engagements) for what the customer actually said. Identify the account by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone says "prep me for the Acme QBR", "build a QBR pack", "what should I cover in the business review", or needs a review-ready summary. Evidence-based: value moments, themes, and risks come from the conversations and CRM, not from assumption.'
---

# QBR Prep Pack

Everything to walk into a quarterly business review: what value landed, what the customer has been raising, where the risks are, and what to cover.

## Prerequisites

`account_research` and `conversation_intelligence` consume AI credits (CI is a minimum ~9 per call), and this skill runs `account_research` plus CI once per key engagement, so it can be credit-heavy. `browse_engagements` (to find the calls) is free but requires an active calendar/meeting integration; `conversation_intelligence` requires at least one connected meeting or email source. If no conversation data exists, build the pack from `account_research` and flag that value moments and themes could not be drawn from conversations, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **Review scope** (optional) — the period being reviewed and the QBR's goal (renewal runway, expansion, adoption push). Shapes what to foreground; ask if it materially changes the pack and was not provided.

## Workflow

1. **Resolve the account.** If no account was supplied, ask the user which one before proceeding. Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
2. **Snapshot the account.** Run `account_research` for the deal/relationship picture, stakeholders, and recent firmographic/news context. This frames the review.
3. **Read recent calls.** Call `browse_engagements` (account-scoped, `engagementType: MEETINGS`, `sort: -chronological`) and pick the few most relevant recent calls (typically the last 2-4 — each gets its own CI call, which costs credits). Run `conversation_intelligence` scoped to each engagement ID (one call per engagement) for value moments the customer voiced, usage and adoption themes they raised, risks and concerns, and open items. Keep each query to its single engagement; CI sees only the last few engagements and cannot topic-search or count.
4. **Assemble the pack.** Synthesize into a review-ready structure. Ground value moments and risks in specific conversations or CRM context with sources; do not assert outcomes the evidence does not support. Note that usage/adoption themes here come from what was discussed, not from product telemetry (ZoomInfo does not have product-usage data).

## Output Format

### QBR Prep Pack — [Company]

**Snapshot** — deal status, relationship, key stakeholders, and any notable recent context (from `account_research`).

**Value delivered** — the value moments and outcomes the customer actually acknowledged, each with its source call. This is the heart of the review.

**Usage & adoption themes** — what the customer has said about how they are using the product and where adoption stands, drawn from the conversations (not telemetry). Note thin coverage rather than inventing it.

**Risks & open items** — evidence-backed risks and unresolved items going into the review, each with a source and, where possible, a handle.

**Suggested QBR focus** — the two or three things to lead with or land in the review, tied to the above.

### When there is no data

If conversation data is unavailable, deliver the `account_research`-based snapshot and state that value moments, adoption themes, and conversational risk could not be assembled, so the pack is limited to the account view.
