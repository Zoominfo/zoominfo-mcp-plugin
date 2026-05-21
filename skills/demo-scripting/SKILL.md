---
name: demo-scripting
description: Create account-specific demo talk tracks using company context, persona priorities, trigger signals, and competitive angles.
---

# Demo Scripting

Create account-specific demo talk tracks using company context, persona priorities, trigger signals, and competitive angles.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Capture product/demo objective, account, attendees/personas, and desired outcome.**
2. **Enrich the company and attendees; map each attendee to likely role, priorities, and objections.**
3. **Pull recent news, scoops, intent, technology, and growth signals that can anchor the demo narrative.**
4. **Translate evidence into demo moments**: opening hook, workflow path, proof points, persona-specific benefits, and objection handling.
5. **Avoid pretending to know internal pain. Use external signals as hypotheses and phrase them as discovery-confirmed paths.**
6. **End with a crisp close plan**: success criteria, stakeholder follow-up, and next artifact.

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Demo script with opening, persona-specific talk tracks, evidence-backed proof points, objections, and close plan.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
