---
name: objection-blocker-tracker
description: Track the open objections and blockers on a deal and how they have evolved across recent calls. Uses conversation_intelligence over an account's or contact's recent engagements. Identify the account or contact by ZoomInfo ID (preferred) or name (triggers a lookup). Use when someone asks "what objections are still open with Acme", "what's blocking this deal", "how has the security concern evolved", or wants a blocker check before a forecast or a next call. Reasons over the last few engagements only, so it tracks recent movement rather than full deal history.
---

# Objection & Blocker Tracker

Surface the concerns standing between you and the deal, and show whether each is getting better or worse.

## Prerequisites

`conversation_intelligence` requires at least one connected meeting or email source and consumes AI credits. `browse_engagements` (to scope or pick calls) requires an active integration and is free. If no conversation data exists, say so rather than reporting "no objections" (the absence of data is not the absence of objections).

## Input

Provided via `$ARGUMENTS`:

- **Scope** (required) — an account or contact (ZoomInfo ID, or a name to resolve).
- **Focus** (optional) — e.g. "just pricing", "anything technical", "security and procurement". Narrows the read.

## Workflow

1. **Resolve scope.** If no account or contact was supplied, ask the user which one before proceeding. Use a ZoomInfo ID directly, or resolve a name via `search_companies` / `search_contacts`.
2. **Extract objections and blockers.** Run `conversation_intelligence` scoped to the account or contact. Ask it to list the objections, concerns, and blockers raised across recent conversations, who raised each, when, and how it was last left. Keep CI scoped to one ID; it sees only the last few engagements and cannot count or topic-search, so present this as recent movement, not a complete tally.
3. **Track the trajectory.** For each item, classify status: newly raised, addressed/resolved, recurring (keeps coming back), or escalating. Tie each to the source moments. Do not record an objection the conversation does not support, and do not mark something resolved without evidence it was.

## Output Format

### Open objections & blockers — [Account / Contact]

*From the last few engagements (through [date]).*

For each, most pressing first:

**[Objection / blocker]** — `[status: new | recurring | escalating | addressed]`
- **Raised by:** [who, when]
- **Evolution:** how it has moved across calls (e.g. "raised in discovery, partially addressed in the demo, resurfaced on the last call").
- **Where it stands:** the current state and what would move it.

Close with **Most likely to stall the deal** — the one or two items to resolve first, with why.

### When there is no data

If conversation data is unavailable, report that open objections cannot be tracked from conversations and point the user to their ZoomInfo admin.
