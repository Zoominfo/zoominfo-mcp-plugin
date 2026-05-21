---
name: procurement-prep
description: Prepare for procurement by mapping stakeholders, account structure, risk signals, vendor/contract clues, and negotiation angles.
---

# Procurement Prep

Prepare for procurement by mapping stakeholders, account structure, risk signals, vendor/contract clues, and negotiation angles.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Use tools that expose committee and negotiation context:

- `account_research`: preferred for procurement prep when CRM/conversation history may reveal deal status, objections, and relationship context.
- `enrich_companies`: structure, size, hierarchy, technologies, and financial context.
- `find_recommended_contacts`: recommended procurement-adjacent and executive contacts.
- `search_contacts`: explicit procurement, legal, finance, security, IT, and executive searches.
- `enrich_scoops` / `enrich_news`: layoffs, funding, M&A, leadership changes, vendor consolidation, or cost pressure.
- `enrich_intent`: known-account evaluation topics.

## Workflow

1. **Clarify procurement context**: new purchase, expansion, renewal, security/legal review, pricing negotiation, or vendor consolidation.
2. **Resolve and enrich the account, including hierarchy, size, revenue, locations, and relevant technologies.**
3. **Search for procurement, finance, legal, security, IT, and executive stakeholders with accurate contact data.**
4. **Pull news and scoops for cost pressure, M&A, leadership changes, hiring, vendor consolidation, or compliance events.**
5. **Identify likely procurement concerns**: budget, risk, duplication, security, implementation effort, timing, and vendor leverage.
6. **Produce a prep plan with concessions to avoid, proof points to bring, and stakeholder-specific asks.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Procurement prep brief with stakeholder map, likely concerns, evidence, negotiation angles, and meeting checklist.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
