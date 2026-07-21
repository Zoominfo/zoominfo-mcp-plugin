---
name: daily-brief
description: Brief the user on their day. Pull today's (or a named day's) meetings and, for each, synthesize the current state of play, a suggested focus or objective, and any follow-ups needed. Uses browse_engagements for the schedule, then account_research, contact_research, and conversation_intelligence per meeting. Use when someone says "what's on my plate today", "brief me for my meetings", "prep my day", or wants a morning rundown before back-to-back calls. Because it researches every meeting, it can consume meaningful AI credits — it confirms scope before fanning out across a full day.
---

# Daily Brief

Give the user a fast, per-meeting rundown of their day: where each account stands, the one thing to drive, and what to follow up on.

## Prerequisites

`browse_engagements` (the schedule) requires an active calendar/meeting integration; `conversation_intelligence` requires at least one connected meeting or email source. `account_research`, `contact_research`, and `conversation_intelligence` all consume AI credits, and this skill calls them once per meeting — so a full day of meetings can be credit-heavy. Confirm scope before fanning out (see Workflow step 2). If no integration is connected, report that and point the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Day** (optional) — defaults to today. "Tomorrow", "Monday", or a date all work.
- **Filter** (optional) — e.g. "customer meetings only", "just external", a specific account. Defaults to external meetings (ones with non-colleague participants).

## Workflow

1. **Get the schedule.** Call `browse_engagements` with a window covering the target day (`engagementType: MEETINGS`, `sort: chronological`). Drop internal-only meetings (no external participants) unless the user asked for everything.

2. **Size it and confirm.** Count the external meetings. Each one fans out three AI-credit calls (`account_research`, `contact_research`, `conversation_intelligence`), so the spend adds up quickly — even a handful of meetings is a non-trivial number of AI credits. If there are more than a few (roughly 3+), tell the user the meeting count, note that each is researched with several AI-credit calls, and offer to scope down (external customer meetings only, the most important few, or a named subset) before proceeding. This pause keeps a packed calendar from turning into a large unprompted credit spend.

3. **Research each meeting (parallel, bounded).** For the in-scope meetings, fan out per meeting: `account_research` (kept light — this is a day view, not a full brief), `contact_research` for the attendees, and `conversation_intelligence` scoped to the account or the specific engagement for recent state and open items. Parallelize across meetings, but respect the volume you confirmed in step 2. Keep each CI query scoped to one account or engagement; CI cannot search by topic, filter by call type, or count mentions, and only reasons over the last few engagements — base each card on what it returns, not on it having full history.

4. **Synthesize one card per meeting.** Frame each around the single most useful outcome for that meeting. Pull follow-ups from prior commitments surfaced by CI. Do not pad cards with generic firmographics — lead with what changes how the user shows up.

## Output Format

### Your day — [N] meetings ([date])

For each meeting, in time order:

**[time] · [title] — [account]**
- **State of play**: 1-2 lines on where things stand (from CI + research).
- **Focus**: the one outcome to drive in this meeting.
- **Follow-ups**: open commitments or items to close, from prior conversations (or "none surfaced").
- **Who's in the room**: attendees with role, one line.

Close with a single **Watch-outs** line across the day if anything connects (a renewal clock, a slipping deal, an exec sitting in) — only if it is evidence-based, not generic.

### When the day is empty or data is thin

If no meetings are found, say the day looks clear (for the chosen filter) rather than erroring. For any meeting with no conversation data, base its card on research only and note that no prior-conversation context was available.
