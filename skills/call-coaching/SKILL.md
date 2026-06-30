---
name: call-coaching
description: Coach a rep on how they handled a specific call — discovery quality, objection handling, talk dynamics, and next-call focus. Name the call if you know it, or let the skill pull recent calls and identify the most likely candidate to confirm. Uses conversation_intelligence to read how the conversation actually went. Use when someone asks "how did I do on the Acme call", "coach me on my last discovery call", "where did I lose them", or wants actionable feedback before the next conversation. Analyzes one call at a time.
---

# Call Coaching

Give a rep specific, actionable feedback on a single call: what worked, what to improve, and what to focus on next time.

## Prerequisites

`browse_engagements` (to find the call) is free but requires an active calendar/meeting integration; `conversation_intelligence` (to analyze it) requires at least one connected meeting source and consumes AI credits. If the call has no transcript to analyze, say so rather than coaching from assumption.

## Input

Provided via `$ARGUMENTS`:

- **Which call** (optional) — an account and/or date. If omitted, the skill identifies the most likely recent call and confirms before analyzing.
- **Focus** (optional) — e.g. "discovery", "the pricing objection", "did I talk too much". Targets the coaching.

## Workflow

1. **Identify the call.** `browse_engagements` filters by date and by company/contact ID, not by call name, so resolve any named account or contact first via `search_companies` / `search_contacts`, then call `browse_engagements` (`engagementType: MEETINGS`, `sort: -chronological`) scoped to that ID and date window and pick the matching meeting from the results. If nothing was named, call `browse_engagements` for the user's recent meetings, propose the most likely candidate, and confirm it before spending credits. If more than one meeting plausibly matches, ask. Keep the chosen engagement ID.
2. **Analyze how it went.** Run `conversation_intelligence` scoped to that engagement ID. Ask how the rep handled discovery (did they uncover pain, budget, timeline, decision process), how objections were handled, what the customer's reactions and sentiment were, and where the conversation stalled or advanced. Keep the query scoped to this one call.
3. **Coach against good practice.** Assess the call against solid discovery and objection-handling fundamentals — open questions over pitching, listening over talking, surfacing next steps, addressing concerns directly. Ground every point in a specific moment from the call; cite what was said. Be candid and useful, not generic. If the transcript is too thin to judge something, say so rather than inventing a critique.

## Output Format

### Call coaching — [Call title, date]

**What went well** (2-3) — specific strengths, each tied to a moment in the call.

**What to improve** (2-3) — the highest-leverage changes, each with the moment that shows it and a concrete alternative ("when they raised price, you discounted; instead anchor on the value point from earlier").

**Talk dynamics** — a quick read on balance (who drove, listening vs pitching, questions asked) if the data supports it.

**Focus for the next call** — one or two things to do differently next time, tied to where this deal now stands.

### When there is no data

If the call cannot be found or has no transcript, tell the user and offer to coach from notes they provide, rather than fabricating an assessment.
