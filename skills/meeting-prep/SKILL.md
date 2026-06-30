---
name: meeting-prep
description: Prepare for an upcoming meeting with a company. Identify the account by ZoomInfo account/company ID (preferred) or by company name, domain, or ticker (which triggers a lookup step) — or name no account at all and let the skill pick the meeting from your upcoming calendar. Provide attendee names or emails and rich context on the meeting purpose, stakes, and known dynamics to get a tight, decision-ready brief — headline, relationship posture per attendee, prior-conversation context (open threads and unresolved questions from past calls and emails), ranked talking points, discovery questions, suggested agenda, and what NOT to do. Use when prepping for a sales or customer call, QBR, renewal, or demo. Optimized for a 30-min slot.
---

# Meeting Prep

Produce a tight, decision-ready brief for a ~30-minute meeting. Lead with a TL;DR (top 3 to know plus an opener), then back it with company, relationship, attendee, and conversation context.

## Prerequisites

The calendar-picker and prior-conversation steps read ZoomInfo engagement data, which requires an active calendar, email, or meeting integration in the workspace (`conversation_intelligence` needs at least one connected email or meeting source). If none is connected, still produce the research-based brief and note that conversation context was unavailable — point the user to their ZoomInfo admin to enable it. `account_research`, `contact_research`, and `conversation_intelligence` consume AI credits; `enrich_*` consume bulk data credits.

## Input

The user will provide via `$ARGUMENTS` an account identifier (required), attendees (recommended), plus optional context:

- **Account identifier (required, unless picking from your calendar)** — one of:
  - **Preferred**: a ZoomInfo account/company ID (numeric). Use directly as `companyId`; skip the search step.
  - **Fallback**: a company name, domain, or ticker. Resolve to a `companyId` via `search_companies` as a first step (see Workflow step 3).
  - **Or name no account**: if the user says "prep me for my next meeting", "what should I know for my 2pm", or "prep my meetings this week", skip the identifier and pick the meeting from the calendar (see Workflow step 0). The chosen meeting's account and attendees are resolved from the engagement record.
- **Attendees (recommended)** — names and/or email addresses. Without attendees, the brief is necessarily generic.
- **Meeting context (strongly recommended)** — a free-form description of the meeting and what success looks like. Richer is better — flat enums like "discovery / QBR / renewal / demo" produce flat briefs. Capture as much as is true: the meeting purpose, the stakes, what's been discussed before, the deal stage, what you want to walk out with, known tensions or open questions, competitive context, the offering in play, and any working hypotheses you want to test or pitfalls to avoid. Examples:
  - *"30-min discovery with the CISO and Director of SecOps. They downloaded the report on identity sprawl last month. Goal: get to a technical evaluation. Worried they're already late-stage with Acme — need to test that fast without burning credibility."*
  - *"Renewal QBR. $600K ARR up in 60 days. Champion left two months ago, new VP Eng hasn't engaged. Need to surface value delivered, find the new owner, and avoid a price-only negotiation."*
  - *"Demo for the Director of Data Platform. Came inbound on the streaming use case. They have an in-house ETL setup. Goal: land a paid pilot. Don't lead with the AI features — they'll see it as a distraction."*

If the identifier is ambiguous (e.g., a bare string that could be a name or a ticker), prefer the most specific interpretation: all-digits → ID; short all-caps token (≤5 chars) → ticker; a string containing a dot or known TLD → domain; otherwise → name.

## Workflow

Parallelize aggressively — most calls only need the `companyId` and can fan out together. Per-attendee, run `contact_research` and `enrich_contacts` in parallel: `contact_research` returns narrative context but quality varies, so `enrich_contacts` guarantees a structured fallback (title, email, phone, employment history) when narrative data is redacted or thin.

0. **Pick the meeting (only if no account was named).** If the user named an account or attendees, skip this step. Otherwise call `browse_engagements` with a forward window (today through ~7-14 days ahead, `engagementType: MEETINGS`, `sort: chronological`, `userIntent` set to the request) and present a short numbered shortlist — time, title, account, attendees — for the user to pick from before spending research or AI credits. From the chosen engagement, carry its ZoomInfo company ID forward as the account: pass it as `zoominfoCompanyId` to `browse_engagements`/`conversation_intelligence` and as `companyId` to the research/enrich tools (same ID, different parameter names per tool). Use its participants as the attendees below, and keep its engagement ID for step 4b. If `browse_engagements` returns nothing, tell the user no upcoming meetings were found and ask them to name an account instead (or check that a calendar integration is connected).

1. **Anchor on purpose.** Read the meeting context from `$ARGUMENTS`.
   - If supplied, restate it in 1-2 sentences as the *meeting purpose* and keep it as the framing lens for every downstream step.
   - If missing, ask the user once. If they decline or say "just general prep", default to **general meeting prep** and state that assumption at the top of the brief.
   - From the context, derive: a **meeting purpose** (1 line), the **desired outcome** (what walking out successful looks like), **priority topics/themes** (3-5 — e.g., identity sprawl, ETL pain, renewal value), and any **named risks or hypotheses to test** (e.g., "test if they're already late-stage with Acme"). These priorities drive the `account_research` query, attendee framing, talking-point ranking, and the suggested agenda.

2. **Get GTM context** — Call `get_gtm_context` (no params, no credits). Use it to tailor talking points to your offerings and strategic priorities, flag competitor presence, and frame around your ICP. If empty, proceed without.

3. **Resolve the company.**
   - If the user supplied a ZoomInfo account/company ID, use it directly as `companyId` — do not call `search_companies`.
   - Otherwise, call `search_companies` with the appropriate field (`companyWebsite` for a domain, `companyTicker` for a ticker, `companyName` for a name) and extract `companyId` from the top match. If no confident match, surface the ambiguity to the user before continuing rather than guessing.

4. **Fan out company research in parallel (retrieval, not filtering).** Treat each tool call as a context-retrieval step. Pull broadly now; decide what's relevant during synthesis. Steps that only need the `companyId` can run together — `account_research`, `enrich_companies`, and `enrich_company_signals` (intent, news, and scoops in one call).
   - **Tailor the `account_research` query to the meeting purpose.** Don't pass a generic "tell me about this account" string. Inject the full meeting context — purpose, desired outcome, priority topics, named hypotheses, attendees if known — and ask for relationship history, deal context, engagement signals, competitive presence, and anything that would change how you walk into the meeting.
   - **Signals retrieval**: call `enrich_company_signals` with the `companyId` and `signalTypes: ["INTENT", "NEWS", "SCOOP"]` (or omit `signalTypes` for all three). It returns recent intent, news, and scoops in one call; topic resolution and recency are handled server-side, so do **not** pre-filter. Triage happens in step 6.

4b. **Pull prior-conversation context (runs in parallel with step 4; skip if no engagement data).** Run `conversation_intelligence` scoped to the account (`zoominfoCompanyId`) — or to the specific engagement ID when you picked the meeting in step 0 — asking what was discussed in recent conversations, which threads are still open, which questions went unresolved, and what the customer asked us to follow up on. This is the "what was actually said" layer that research and enrichment miss. Keep the query scoped and specific; do not ask CI to search by topic, filter by call type, or count mentions (it cannot, and only sees the last few engagements). If no conversation data is available, skip this and note it in the brief.

5. **Resolve and research attendees in parallel** — Run `search_contacts` for all attendees in one batch (by email, name + companyId, or title + companyId). Then run `contact_research` and `enrich_contacts` in parallel for the resolved set (batch up to 10 per `enrich_contacts` call). If an attendee can't be resolved, note it — don't fabricate.

6. **Synthesize the brief.** Each retrieval is raw context — now decide what makes the brief, framed by the meeting purpose and priority topics. Apply these principles:
   - **Intent triage**: review every intent topic returned by `enrich_company_signals`. Keep topics that map to the meeting purpose, priority topics, your GTM offerings, or a non-obvious signal worth flagging (e.g., a competitor's category, an adjacent buying motion). Drop topics that are noise. If nothing meaningful remains, skip the intent section.
   - **News/scoops triage**: keep items that connect to the meeting purpose, the deal stage, attendees, or priority topics. Drop generic press releases unrelated to the agenda.
   - **Conversation context**: from `conversation_intelligence`, surface open threads, unresolved questions, and commitments. These are the highest-signal inputs for the opener and talking points — a warm-dormant posture paired with an open thread from the last call is the strongest possible opening. Cite the source meeting where CI provides it.
   - **Classify relationship posture per attendee** from `employmentHistory` and `contact_research` cues: **Cold**, **Warm-but-dormant** (significant past engagement at a prior employer or directly, but no current activity — highest leverage), **Active**, or **Hostile**. The opener depends on this.
   - **Talking-point ranking**: cap at 3-5, ranked by relevance to the desired outcome. Each must tie to a specific surfaced fact and (where possible) a named attendee.
   - **Hypothesis check**: explicitly address each named hypothesis or risk from step 1 — did the data confirm, contradict, or fail to resolve it? Surface in the TL;DR.
   - **Source tagging**: tag key claims with sources (`[CRM]`, `[contact_research]`, `[enrichment]`, `[news]`, `[scoops]`, `[intent]`). When `contact_research` is redacted/minimal, mark the attendee profile with a confidence note.
   - **Past-date flag**: for any date in `account_research` that is in the past relative to today, retain and flag for verification rather than dropping silently — could be active negotiation, a stale CRM sync, or a missed milestone.

7. **Write the TL;DR last,** after the rest is drafted. Frame it explicitly by the meeting purpose and desired outcome.

## Output Format

### TL;DR

> **Meeting purpose / desired outcome**: [restate the user's context in one line, or "general meeting prep (no context supplied)" if defaulted].
>
> **Top 3 to know walking in** (each tied to the desired outcome):
> 1. [Most decision-relevant fact]
> 2. [Second]
> 3. [Third]
>
> **Hypothesis check** (one line per named hypothesis from the input): confirmed / contradicted / unresolved.
>
> **Carrying over from last time** (if conversation data exists): 1-2 open threads, unresolved questions, or promised follow-ups from prior calls/emails, each with the source meeting.
>
> **Open with**: "[Single recommended opening line — verbatim, calibrated to attendee posture and any open thread]"

### Company Snapshot

| Field | Value |
|-------|-------|
| Industry | |
| Employees | |
| Revenue | |
| HQ | |
| Business Model | |
| Website | |

One-paragraph overview from the enrichment description.

### Relationship Context

Summarize from `account_research` with source tags: deal status, last engagement, account health, and key history. If no CRM data, say so explicitly. For any past date (renewal, contract end, expiration, last activity, opp close), retain it and flag inline: *"Verify — date is in the past; may indicate active negotiation, stale CRM, or missed milestone."*

### Prior Conversations

*From `conversation_intelligence`. Omit if no conversation data was available, and note that an email/meeting integration is not connected.*

- **Recent themes**: what has actually been discussed across the last few calls/emails.
- **Open threads / unresolved questions**: what is still hanging, with the source meeting.
- **Commitments**: what we promised and what they promised, if surfaced.

Keep this tight (3-6 bullets). This is recent-conversation context only — the last few engagements, not full history.

### Attendees

For each attendee:

#### [Name] — [Title]

| Field | Value |
|-------|-------|
| Department | |
| Management Level | |
| Email | |
| Time in Role | |
| Posture | Cold / Warm-but-dormant / Active / Hostile |

**Why they matter for THIS meeting**: 2 lines max. Connect role/background to the decision in front of them.

**Talking points for them**: 1-2 specific to this attendee.

If `contact_research` returned redacted/minimal data, add: *"Profile data restricted — verify externally."*

### Talking Points (3-5)

Ranked by impact, each tagged for its audience.

1. **[Topic]** `[for: <attendee names or "all">]`: [Why to raise it + supporting data point with source tag]
2. ...

Prioritize items that show homework, connect to your GTM offerings, surface competitive angles, or hit a specific persona.

### Discovery Questions (3-5)

Specific, anchored in concrete facts from the brief — not generic.

1. **[for: <attendee or "group">]** — [Question grounded in something surfaced above.]
2. ...

### Suggested Agenda (~30 min)

- **(0-5) Open**: [Specific opener — relationship-continuity for warm-dormant, value-frame for cold, status-check for active]
- **(5-15) Explore**: [Primary discovery thread — top talking point + 2 questions]
- **(15-25) Develop**: [Second thread — secondary point, demo, or proposal]
- **(25-30) Close**: [Specific desired next step]

### What NOT to Do

1-3 specific failure modes for *this* meeting. Concrete, not generic.

- **Don't [specific anti-pattern]** — [why it would backfire here].
