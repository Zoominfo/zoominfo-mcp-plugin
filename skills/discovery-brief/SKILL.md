---
name: discovery-brief
description: Prepare a discovery-call brief with account context, buyer hypotheses, recent signals, personas, questions, and talk tracks.
---

# Discovery Brief

Prepare a discovery-call brief with account context, buyer hypotheses, recent signals, personas, questions, and talk tracks.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Identify account, attendee(s), product/motion, meeting objective, and known context. If attendee data is missing, still build an account-first brief.**
2. **Resolve and enrich the account with `search_companies` and `enrich_companies`.**
3. **Resolve attendees or target personas with `enrich_contacts` / `search_contacts`; capture title, function, seniority, and likely priorities.**
4. **Pull current context using `enrich_news`, `enrich_scoops`, and `enrich_intent`; keep only signals relevant to discovery.**
5. **Synthesize hypotheses, not claims. Label what is known vs inferred vs question-worthy.**
6. **Write discovery questions that tie directly to account facts, trigger signals, stakeholder role, and product relevance.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Short discovery brief with account snapshot, attendee notes, likely priorities, signal evidence, questions, and talk track.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
