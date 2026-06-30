---
name: ae-cs-handoff
description: Produce an AE-to-CS handoff brief — everything the incoming CSM needs from the sales conversations. Builds an engagement timeline, then runs conversation_intelligence in parallel on the key engagements to pull requirements, success criteria, stakeholders and how they like to work, and the relationship state. Identify the account by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone says "build the handoff for Acme", "what does the CSM need to know", "prep the post-sale transition", or closes a deal that needs a clean handoff.
---

# AE-to-CS Handoff Brief

Capture what was promised, what success looks like, and who the people are — so the CSM starts from context, not a cold account.

## Prerequisites

`browse_engagements` (timeline) requires an active calendar/email/meeting integration; `conversation_intelligence` (the deep read) requires at least one connected source and consumes AI credits, as do `account_research` and `contact_research`. If no conversation data exists, build the structural handoff from research and flag that the conversational detail (requirements, working style) is missing, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **Context** (optional) — the product sold, deal size, go-live timing, anything the CSM specifically needs.

## Workflow

1. **Resolve the account.** Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
2. **Build the timeline.** Call `browse_engagements` (account-scoped) for the sales-cycle engagements; identify the few that carry the most signal (discovery, key demos, negotiation, commitments). Limit to roughly the 2-4 highest-signal engagements — each gets its own `conversation_intelligence` call in step 3, which costs AI credits, so do not fan out across the whole timeline. Keep their engagement IDs.
3. **Deep-read the key engagements in parallel.** Run `conversation_intelligence` on those engagement IDs (one CI call per engagement) for stated requirements and success criteria, commitments made to the customer, decision-makers and how they like to work, and any sensitivities. Pull `account_research` and `contact_research` for the structural picture. CI sees only the last few engagements, so anchor on the key ones rather than expecting full history.
4. **Assemble the handoff.** Synthesize a CSM-ready brief. Distinguish what was promised (must be honored) from what was aspirational. Attribute each requirement and commitment to the conversation it came from. Do not invent commitments.

## Output Format

### AE-to-CS handoff — [Company]

**Deal summary** — what was sold, why they bought (the core problem and desired outcome), in 2-3 lines.

**Success criteria** — how the customer defined success, in their words, with sources.

**Commitments made** — what the AE promised the customer (and any timelines). These transfer to the CSM.

**Stakeholders** — per key person: role, influence, champion/skeptic, and how they like to work (cadence, format, sensitivities) where the conversations show it.

**Open items & risks** — anything unresolved at close that the CSM inherits.

**Recommended first move** — the CSM's best opening action, tied to the above.

### When there is no data

If conversation data is unavailable, give the research-based account and stakeholder structure, and flag that requirements, commitments, and working style could not be captured from conversations.
