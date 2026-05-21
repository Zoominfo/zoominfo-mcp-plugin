---
name: competitive-battlecard
description: Build an account- or competitor-specific battlecard from firmographics, news, scoops, intent, buying committee, and positioning evidence.
---

# Competitive Battlecard

Build an account- or competitor-specific battlecard from firmographics, news, scoops, intent, buying committee, and positioning evidence.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Clarify whether the battlecard is competitor-led, account-led, or deal-led, and what decision it should support.**
2. **Resolve competitor and/or account company IDs; enrich company profiles and relevant firmographics.**
3. **Pull `enrich_news`, `enrich_scoops`, and `enrich_intent` for relevant entities; triage only signals connected to the competitive motion.**
4. **Map likely buyer personas and stakeholders at the target account when deal-specific.**
5. **Synthesize competitive strengths, vulnerabilities, likely objections, displacement triggers, and proof points.**
6. **Separate verified facts from positioning hypotheses and call out stale or low-confidence evidence.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Battlecard with competitor context, account-specific angles, objections, traps to avoid, proof points, and confidence notes.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
