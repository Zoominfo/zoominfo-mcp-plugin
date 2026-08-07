---
name: renewal-prep
description: 'Prepare for a renewal by assembling pre-renewal context — value delivered and value moments, risk handles, and stakeholder state — from recent conversations and account_research. Identify the account by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone asks "prep me for the Acme renewal", "what''s our case for renewal", "what are the risks going into this renewal", or wants a renewal brief. Strictly evidence-based: it does not assume the renewal date or terms; if those are not provided, it asks the user before drafting.'
---

# Renewal Prep

Build the case and the risk map for a renewal: where value has landed, what could derail it, and who decides — grounded in what was actually said.

## Prerequisites

`conversation_intelligence` requires at least one connected meeting or email source; `conversation_intelligence` and `account_research` consume AI credits. `browse_engagements` (optional cadence check) is free and needs an active integration. If no conversation data exists, build from `account_research` and say the value/risk read is limited, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **Renewal details** (ask if not given) — the renewal date, term, and ARR are often not in ZoomInfo data. Do not assume them. If they matter to the brief and were not provided, ask the user before drafting.

## Workflow

1. **Resolve the account.** Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
2. **Confirm the renewal basics.** If the renewal date/term/value are not supplied and the brief depends on them, ask the user once. Do not invent a renewal date — an unprompted wrong date is worse than an acknowledged unknown.
3. **Gather evidence.** Run `conversation_intelligence` scoped to the account for value moments (wins, outcomes, positive signals customers voiced), risks and unresolved concerns, and stakeholder engagement. Pull `account_research` for deal history and relationship context. Optionally use `browse_engagements` for recent cadence. Keep CI scoped to the account; it sees only the last few engagements.
4. **Assemble the brief.** Make the renewal case from evidence (specific value the customer acknowledged), map the risks with handles, and flag any assumption you could not verify.

## Output Format

### Renewal prep — [Company]

**Renewal basics** — date, term, ARR if known; otherwise "not provided — confirm with the user" (do not guess).

**The case for renewal** — value moments and outcomes the customer actually acknowledged, with source moments.

**Risks & handles** — each risk (with evidence), and a concrete way to address it before the renewal conversation.

**Stakeholders** — who holds the renewal, champion status, anyone who has gone quiet.

**Recommended plan** — one to three evidence-based moves leading into the renewal.

### Evidence discipline

Build the case from what the customer said, not from generic value claims. Mark assumptions clearly. Where you asked the user for renewal details, attribute them.

### When there is no data

If conversation data is unavailable, give the `account_research` view, note that value moments and conversational risk could not be assessed, and ask the user for the renewal specifics.
