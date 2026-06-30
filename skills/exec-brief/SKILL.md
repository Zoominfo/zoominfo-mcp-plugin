---
name: exec-brief
description: Produce a succinct one-pager for an executive dropping into a call with zero context. Blends account_research (who they are, deal state), conversation_intelligence (what has been discussed and what is open), and contact_research (who is in the room). Identify the account by ZoomInfo company ID (preferred) or name/domain (triggers a lookup); name the key attendees if known. Use when someone says "brief the VP for the Acme call", "exec one-pager for tomorrow", "my SVP is joining cold", or needs a tight pre-call brief for a senior stakeholder. Built to be read in two minutes.
---

# Exec Brief

One page an executive can absorb in the elevator: who, why now, where we stand, and the one thing to do in the room.

## Prerequisites

`conversation_intelligence` requires at least one connected meeting or email source; `account_research`, `contact_research`, and `conversation_intelligence` consume AI credits. If no conversation data exists, build from research and note that the "where we stand" view is research-based only, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **The exec and the meeting** (recommended) — who is being briefed, the meeting's purpose, and the attendees, so the one-pager is framed for their role.

## Workflow

1. **Resolve the account** (and key attendees, if named). Use ZoomInfo IDs directly, or resolve via `search_companies` / `search_contacts`.
2. **Gather, then compress.** Run `account_research` (company + deal context) and account-scoped `conversation_intelligence` (recent state, open threads, commitments) in parallel. Run `contact_research` only for attendees the user named or that research surfaces as the key deal contacts; if no attendees are known, ask before spending `contact_research` credits rather than researching the whole account. Keep CI scoped to the account; it sees only the last few engagements.
3. **Write for an exec.** Ruthlessly compress to one page. Lead with why this account matters and why now. Give the exec the single most useful thing to do or say, and the landmines to avoid. Cut firmographic detail that does not change how they show up. Every line earns its place; attribute the relationship claims.

## Output Format

### Exec brief — [Company]

**Bottom line** (2-3 sentences) — who they are, why this meeting matters, and where the relationship stands right now.

**Where we stand** — 2-3 bullets on the deal/relationship state and what is currently open (from CI + research).

**In the room** — the attendees in one line each: name, role, and what they care about.

**Your move** — the one thing for the exec to do or say to move this forward.

**Landmines** — one or two things to avoid (a sore point, a competitor, an unresolved issue), each with a reason.

Keep the whole thing to roughly one page. If a section has nothing high-signal, drop it rather than padding.

### When there is no data

If conversation data is unavailable, build the one-pager from research and state that the current-state view is not grounded in recent conversations.
