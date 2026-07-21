---
name: call-recap
description: Recap a recent call with a tight summary, the decisions made, action items, and open questions. Name the call (account and/or date) if you know it, or let the skill pull your most recent calls and offer a shortlist to pick from. Uses conversation_intelligence to read what was actually said, with light account_research for deal context. Use when someone says "recap my last call", "what came out of the Acme meeting", "summarize yesterday's call", or needs a post-call writeup. The output adapts to the request — for example decisions-only or action-items-only.
---

# Call Recap

Turn a just-finished call into a compact, high-signal recap: what was discussed, what was decided, who owns what, and what is still open.

## Prerequisites

`browse_engagements` (to find the call) requires an active calendar/email/meeting integration. `conversation_intelligence` (to read the call) requires at least one connected meeting or email source. Both `conversation_intelligence` and `account_research` consume AI credits. If no conversation data is available for the call, say so and point the user to their ZoomInfo admin rather than guessing at content.

## Input

Provided via `$ARGUMENTS`:

- **Which call** (optional) — an account and/or a date ("the Acme call", "yesterday's demo"). If omitted, the skill lists recent calls to pick from.
- **Emphasis** (optional) — e.g. "just the action items", "what did we decide", "for my manager". Shapes the output.

## Workflow

1. **Identify the call.**
   - If the user named an account or date, resolve the account via `search_companies` first if needed (`browse_engagements` filters by company/contact ID and date, not by call name), then call `browse_engagements` (`engagementType: MEETINGS`, `sort: -chronological`) scoped to that ID and date window and confirm the match.
   - If nothing was named, call `browse_engagements` for the user's recent meetings and present a numbered shortlist (date, title, account, participants). Let the user pick one (or several) before spending AI credits. Keep each chosen engagement's ID.

2. **Read the call with `conversation_intelligence`.** Scope CI to the chosen engagement ID and ask for a structured read: what was discussed, decisions made, action items with owners and any stated due dates, open questions, and notable customer statements. For multiple selected calls, run one CI call per engagement (do not ask one CI call to span several). Keep the query specific to that engagement; CI cannot search by topic or count mentions.

3. **Add light context (optional).** If deal/relationship framing helps, pull `account_research` for the account — kept brief. Skip it if the user just wants the recap itself; this is a recap, not a full account brief.

4. **Synthesize.** Write the recap from the CI output. Attribute decisions and action items only when the conversation supports them; never invent an owner or a due date that was not stated (mark those "owner not stated" / "no date given"). Cite the source meeting.

## Output Format

Default compact template (adapt to the user's emphasis):

**[Call title] — [date]**
*Participants: [names].*

**Summary** — 2-4 sentences on what the call was about and where it landed.

**Decisions**
- [Decision, with who made/agreed it if stated.]

**Action items**
- [Owner — action — due date or "no date given"]

**Open questions / unresolved**
- [What is still hanging, with the source moment.]

**Suggested next step** *(one line, only if the conversation points to one.)*

### Adapting the template

If the user asked for a subset ("just action items", "decisions for the QBR notes"), lead with that section and trim the rest. If they asked for a manager-facing version, keep it to summary + decisions + next step. Match the format to the request rather than always emitting every section.

### When there is no call or no data

If no recent calls are found, say so and ask the user to name the account or widen the date range. If a call is found but `conversation_intelligence` has no transcript for it (e.g. not recorded, or indexed within the last several hours), report that the recording was not available to analyze rather than fabricating a recap.
