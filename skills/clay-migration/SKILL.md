---
name: clay-migration
description: Convert Clay-style enrichment tables and workflows into governed ZoomInfo MCP skill runs with equivalent outputs and fewer manual provider chains.
---

# Clay Migration

Convert Clay-style enrichment tables and workflows into governed ZoomInfo MCP skill runs with equivalent outputs and fewer manual provider chains.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Map Clay steps to current GTM AI MCP tools:

- Discovery rows: `search_companies`, `search_contacts`, `search_intent`, and `search_scoops` depending on whether the table starts from ICP, persona, intent topic, or event trigger.
- Lookalikes: `find_similar_companies` for account expansion and `find_similar_contacts` for persona replication from a known champion/buyer.
- Enrichment: `enrich_companies` and `enrich_contacts`, in batches up to 25 after free search resolution.
- Why-now context: `enrich_intent`, `enrich_scoops`, and `enrich_news` for known companies.
- Stakeholder selection: `find_recommended_contacts` for account-level who-to-contact decisions.
- Narrative research: `account_research` and `contact_research` when the Clay workflow previously depended on CRM or conversation history.

## Workflow

1. **Ask for or infer the current Clay table purpose**: account list, contact list, enrichment, scoring, personalization, or campaign prep.
2. **Inventory current columns, formulas, provider calls, and downstream activation fields; separate must-have outputs from nice-to-have fields.**
3. **Map Clay provider steps to ZoomInfo MCP steps**: `search_companies`, `search_contacts`, `enrich_companies`, `enrich_contacts`, `enrich_news`, `enrich_scoops`, `enrich_intent`, and recommendation tools where relevant.
4. **Resolve all ZoomInfo filter fields with `lookup`; document any fields with no clean ZoomInfo equivalent.**
5. **Design the replacement run as a sequence**: input normalization, entity resolution, enrichment, scoring/routing, QA, export/writeback.
6. **Produce a migration plan with parity gaps, confidence thresholds, manual-review queues, and quick wins that can ship first.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Migration blueprint plus replacement ZoomInfo workflow, field mapping, parity gaps, QA checks, and first-run test plan.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
