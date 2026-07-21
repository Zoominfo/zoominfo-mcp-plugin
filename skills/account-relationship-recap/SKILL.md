---
name: account-relationship-recap
description: Recap where things stand with a company across recent conversations, with emphasis on how the relationship is evolving. Identify the account by ZoomInfo company ID (preferred) or by name or domain (triggers a lookup). Blends account_research for deal and firmographic context with company-scoped conversation_intelligence for what has actually been said recently. Use when someone asks "where are we with Acme", "how is the relationship trending", "recap our recent conversations with this account", or wants a relationship read before a check-in. Reasons over the last few engagements only.
---

# Account Relationship Recap

Where we stand with an account, read from recent conversations: the current state, and the direction it is moving.

## Prerequisites

Company-scoped `conversation_intelligence` requires at least one connected email or meeting source; `account_research` and `conversation_intelligence` consume AI credits (`browse_engagements`, used for optional cadence, is free). If no conversation data exists for the account, produce the `account_research`-based read and note that conversation context was unavailable, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **Lens** (optional) — e.g. "renewal risk", "expansion", "post-exec-change". Frames the recap.

## Workflow

1. **Resolve the company.** Use the ZoomInfo ID directly; otherwise resolve a name/domain via `search_companies` and confirm an ambiguous match before spending credits.
2. **Read the relationship.** Run `account_research` (deal status, history, stakeholders) and company-scoped `conversation_intelligence` in parallel. Ask CI what has been discussed recently, how sentiment and engagement have shifted, which threads are open, and whether new people have entered the conversation. Keep CI scoped to this one account; it cannot search by topic or count mentions, and sees only the last few engagements.
3. **Anchor cadence (optional).** If useful, call `browse_engagements` (company-scoped, `-chronological`) for the recent engagement cadence and the gap since last contact.
4. **Synthesize the trajectory.** Decide whether the relationship is warming, steady, or cooling, and say why with evidence. Tie every claim to a source (CI, account_research, CRM). Do not assert momentum or risk the data does not support.

## Output Format

### Where we stand — [Company]

**Trajectory** — one line: warming / steady / cooling, with the evidence in a clause.

**Recent conversations** — 3-5 bullets on what has actually been discussed lately (from CI, with source meetings).

**What's changed** — the relationship shifts that matter: new or departed stakeholders, a change in tone or responsiveness, momentum gained or lost. Each tied to evidence.

**Open threads / risks** — what is unresolved or worth watching.

**Suggested next step** — one evidence-based move (only if the data points to one).

### When there is no data

If conversation data is unavailable, give the `account_research` view and state plainly that the relationship-trajectory read is limited without connected conversation history.
