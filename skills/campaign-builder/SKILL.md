---
name: campaign-builder
description: Turn an ICP, trigger, or product motion into a segmented campaign audience with personas, proof points, messaging angles, and activation fields.
---

# Campaign Builder

Turn an ICP, trigger, or product motion into a segmented campaign audience with personas, proof points, messaging angles, and activation fields.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Select tools based on campaign source:

- ICP/firmographic campaign: `lookup` → `search_companies` → optional `enrich_companies`.
- Persona campaign: `search_contacts` after account or company filters are resolved.
- Intent campaign: `search_intent` for net-new in-market accounts; `enrich_intent` for known-account depth.
- Event campaign: `search_scoops` for trigger discovery; `enrich_scoops` and `enrich_news` for evidence on selected accounts.
- Account-based stakeholder campaign: `find_recommended_contacts`; add `contact_research` only when relationship history matters.
- Lookalike campaign: `find_similar_companies` or `find_similar_contacts` from seed wins/champions.

## Workflow

1. **Clarify campaign goal, offer, target segment, exclusion rules, and success metric. If absent, assume outbound prospecting and state it.**
2. **Build the account universe with `search_companies`; resolve filters through `lookup` first.**
3. **Identify target personas using `search_contacts`, `find_recommended_contacts`, or buying-committee logic depending on whether the account list is known.**
4. **Enrich account context with `enrich_companies`, `enrich_intent`, `enrich_scoops`, and `enrich_news` for segmentation and proof points.**
5. **Create practical segments**: fit tier, trigger type, persona, industry, company size, and activation priority.
6. **Draft campaign angles that cite observed data only; never invent initiatives, tools, or pains not supported by evidence.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Segmented campaign audience, persona map, proof points, messaging angles, exclusion logic, and export schema.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
