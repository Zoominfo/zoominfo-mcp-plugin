---
name: next-best-action
description: Recommend the next best action on a deal or relationship, grounded in the current conversation state. Uses conversation_intelligence as the primary source, with account_research for deal context. Identify the account or contact by ZoomInfo ID (preferred) or name (triggers a lookup), or point it at a specific engagement. Use when someone asks "what should I do next with Acme", "what's my next move here", "how do I advance this deal", or wants an evidence-based recommendation rather than a generic playbook. Reasons over the last few engagements only.
---

# Next-Best-Action

Read the current state of the conversation and recommend the one or two moves most likely to advance it.

## Prerequisites

`conversation_intelligence` requires at least one connected email or meeting source; `conversation_intelligence` and `account_research` consume AI credits. If no conversation data exists, base the recommendation on `account_research` and say the read is limited, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Scope** (required) — an account, a contact, or a specific engagement (ID, or a name to resolve).
- **Goal** (optional) — e.g. "get to a technical eval", "close this quarter", "re-engage a stalled deal". Sharpens the recommendation.

## Workflow

1. **Resolve scope.** Use a ZoomInfo ID directly, or resolve via `search_companies` / `search_contacts` and confirm an ambiguous match before spending credits (`conversation_intelligence` and `account_research` both cost AI credits, so a wrong resolution burns them). For a specific call not named, offer a `browse_engagements` shortlist first.
2. **Read the state.** Run `conversation_intelligence` scoped to the account/contact/engagement for where things stand: open threads, stated next steps, blockers, buying signals, and unanswered questions. Pull `account_research` for deal stage and stakeholder context. Keep CI scoped to one ID; it sees only the last few engagements and cannot search by topic or count, so reason from what it returns.
3. **Recommend.** Propose one to three concrete next actions, ranked, each tied to specific evidence from the conversations and aimed at the stated goal. For each, give the move, why now (the evidence), and the expected effect. Skip generic advice — if the evidence does not support a confident recommendation, say what is missing and what to find out next instead.

## Output Format

### Next best action — [Account / Contact]

**State of play** — 2-3 lines on where things stand right now, from the conversations.

**Recommended moves** (ranked, 1-3):
1. **[The move]** — *Why now:* [evidence from a specific conversation]. *Expected effect:* [what it unlocks].

**What we don't yet know** — the open question(s) that would most change the recommendation, and how to get the answer.

### When there is no data

If conversation data is unavailable, give the best `account_research`-based suggestion and flag that it is not grounded in recent conversations.
