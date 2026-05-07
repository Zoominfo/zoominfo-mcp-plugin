---
name: meeting-prep
description: Prepare for an upcoming meeting with a company. Provide a company name and attendee names or emails to get a tight, decision-ready brief — headline, relationship posture per attendee, ranked talking points, discovery questions, suggested agenda, and what NOT to do. Optimized for a 30-min slot.
---

# Meeting Prep

Produce a tight, decision-ready brief for a ~30-minute meeting. Lead with a TL;DR (top 3 to know plus an opener), then back it with company, relationship, attendee, and conversation context.

## Input

The user will provide via `$ARGUMENTS`:
- A company name, domain, or ZoomInfo company ID (required)
- Attendee names and/or email addresses (recommended)
- Optionally: meeting type (e.g., "discovery", "QBR", "renewal", "demo")
- Optionally: specific topics to research

## Workflow

Parallelize aggressively — most calls only need the `companyId` and can fan out together. Per-attendee, run `contact_research` and `enrich_contacts` in parallel: `contact_research` returns narrative context but quality varies, so `enrich_contacts` guarantees a structured fallback (title, email, phone, employment history) when narrative data is redacted or thin.

1. **Get GTM context** — Call `get_gtm_context` (no params, no credits). Use it to tailor talking points to your offerings and strategic priorities, flag competitor presence, and frame around your ICP. If empty, proceed without.

2. **Resolve the company** — Use `search_companies` (or the provided ID) to extract the `companyId`.

3. **Fan out company research in parallel** — `account_research` (CRM, deals, engagement history), `enrich_companies` (firmographics), `enrich_news` (last 30 days, top 5), `enrich_scoops` (last 30 days, top 10), and `enrich_intent` (see below). Frame the `account_research` query around walking into this meeting prepared.

4. **Resolve and research attendees in parallel** — Run `search_contacts` for all attendees in one batch (by email, name + companyId, or title + companyId). Then run `contact_research` and `enrich_contacts` in parallel for the resolved set (batch up to 10 per `enrich_contacts` call). If an attendee can't be resolved, note it — don't fabricate.

5. **Validate intent topics before calling `enrich_intent`** — Call `lookup` with `fieldNames: ["intent-topics"]`, match user-specified or inferred seeds (case-insensitive substring) against returned IDs, and pass only validated IDs. `enrich_intent` returns 400 if any single topic is invalid, so on a 400, retry without the offending topics. If nothing validates, skip the intent section rather than fail.

6. **Classify relationship posture per attendee** — From `employmentHistory` and `contact_research` cues, tag each attendee as **Cold**, **Warm-but-dormant** (significant past engagement at a prior employer or directly, but no current activity — highest leverage), **Active**, or **Hostile**. The opener depends on this.

7. **Synthesize the brief** — Build the output below from the specific facts surfaced. No boilerplate. Cap talking points at 3-5. Tag key claims with sources (`[CRM]`, `[contact_research]`, `[enrichment]`, `[news]`, `[scoops]`, `[intent]`). When `contact_research` is redacted/minimal, mark the attendee profile with a confidence note. For any date in `account_research` that is in the past relative to today, retain it and flag it for verification rather than dropping it silently — it could mean active negotiation, a stale CRM sync, or a missed milestone. Write the TL;DR last, after the rest is drafted.

## Output Format

### TL;DR

> **Meeting type / stakes**: [one line]
>
> **Top 3 to know walking in**:
> 1. [Most decision-relevant fact]
> 2. [Second]
> 3. [Third]
>
> **Open with**: "[Single recommended opening line — verbatim]"

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
