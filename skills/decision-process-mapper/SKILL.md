---
name: decision-process-mapper
description: Map a prospect's buying process as voiced on recent calls — their stated decision criteria, timeline, steps, and approvers. Uses conversation_intelligence over an account's recent engagements, with account_research for stakeholder context. Identify the account by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone asks "what's their buying process", "who actually signs off", "what's the timeline and what do they need to decide", or wants to qualify a deal against MEDDIC-style criteria. Captures only what was actually stated; gaps are marked as unknown rather than inferred.
---

# Decision-Process Mapper

Reconstruct how the prospect actually buys, from what they have told you: criteria, steps, timeline, and the people who decide.

## Prerequisites

`conversation_intelligence` requires at least one connected meeting or email source; `conversation_intelligence` and `account_research` consume AI credits. If no conversation data exists, build what you can from `account_research` and mark the rest unknown, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **Framework** (optional) — e.g. "MEDDIC", "just the approvers and timeline". Shapes which fields to foreground.

## Workflow

1. **Resolve the account.** Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
2. **Extract the process.** Run `conversation_intelligence` scoped to the account, asking what the prospect has said about how they will decide: the decision criteria, the evaluation steps, the timeline and any deadlines, the budget or procurement process, and who is involved in or approves the decision. Run `account_research` for the org/stakeholder picture. Keep CI scoped to one account; it sees only the last few engagements and cannot topic-search, so map what was said, not the whole sales cycle.
3. **Map, and mark gaps honestly.** Assemble the process. For anything not actually stated in conversation, label it **not stated** rather than inferring it. Distinguish a named approver from a guessed one. Tie each filled field to the source moment.

## Output Format

### Decision process — [Company]

| Element | What they said | Source / status |
|---------|----------------|-----------------|
| Decision criteria | | |
| Evaluation steps | | |
| Timeline / deadline | | |
| Budget / procurement | | |
| Decision-makers & approvers | | |
| Champion | | |

Use **not stated** in any cell the conversations did not cover.

**Biggest gaps** — the two or three unknowns that most need confirming, and a question to surface each on the next call.

### When there is no data

If conversation data is unavailable, present the `account_research` stakeholder view, mark the process fields unknown, and note the read is limited without connected conversation history.
