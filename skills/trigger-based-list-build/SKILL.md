---
name: trigger-based-list-build
description: Build account or contact lists around buying triggers such as intent, scoops, news, funding, hiring, technology, and leadership changes.
---

# Trigger-Based List Build

Build account or contact lists around buying triggers such as intent, scoops, news, funding, hiring, technology, and leadership changes.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Start from the trigger type:

- Topic/keyword demand: `search_intent` to discover companies researching a topic.
- Business event: `search_scoops` to discover companies with recent leadership, funding, hiring, layoffs, project, pain-point, expansion, or launch events.
- Known account deepening: `enrich_intent`, `enrich_scoops`, and `enrich_news`.
- Persona activation: `search_contacts` for explicit roles or `find_recommended_contacts` for account-specific who-to-contact decisions.
- Lookalike trigger expansion: `find_similar_companies` or `find_similar_contacts` from known good accounts/champions.
- Full details: `enrich_companies` and `enrich_contacts` only for selected records.

## Workflow

1. **Define the trigger thesis**: what event indicates urgency, which personas matter, and what action the seller or marketer should take.
2. **Resolve company/contact filters with `lookup` and build the base universe with `search_companies` or `search_contacts`.**
3. **Layer trigger data**: use `enrich_intent` for topic demand, `enrich_scoops` for project/buying signals, and `enrich_news` for recent events.
4. **For contact lists, search or recommend contacts at triggered accounts and prioritize by persona fit and contact accuracy.**
5. **Rank records by trigger strength, ICP fit, recency, and activation readiness; separate high-priority, nurture, and review queues.**
6. **Include the evidence behind every trigger so the user can personalize outreach without hallucinated claims.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Prioritized triggered list with evidence, recency, recommended persona/action, confidence, and export-ready fields.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
