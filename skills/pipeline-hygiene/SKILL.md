---
name: pipeline-hygiene
description: Inspect open pipeline for stale deals, bad data, missing stakeholders, weak timing signals, and account-risk indicators.
---

# Pipeline Hygiene

Inspect open pipeline for stale deals, bad data, missing stakeholders, weak timing signals, and account-risk indicators.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Prioritize tools that reveal deal risk and bad data:

- `enrich_companies` and `enrich_contacts`: verify account/contact freshness, firmographics, titles, and reachability.
- `find_recommended_contacts`: identify missing stakeholders and stronger contacts for deal acceleration.
- `contact_research`: inspect relationship history for named stakeholders when conversation data matters.
- `account_research`: synthesize CRM, opportunity, and account context when available.
- `enrich_intent`, `enrich_scoops`, `enrich_news`: add known-account risk and urgency signals.
- `search_contacts`: fill specific committee gaps when recommended contacts are insufficient.

## Workflow

1. **Identify the pipeline slice**: stage, owner, close period, segment, product, or named account list.
2. **For each account, resolve company identity and enrich firmographics, hierarchy, news, scoops, and intent.**
3. **Map active stakeholders using `search_contacts`, `find_recommended_contacts`, and buying-committee patterns; flag missing economic buyer, technical buyer, procurement, or executive sponsor.**
4. **Flag hygiene issues**: stale titles, departed contacts, duplicate accounts, low-confidence contact data, outdated firmographics, and weak next step.
5. **Score deal risk based on stakeholder coverage, recent signals, data freshness, account fit, and stage/close-date consistency.**
6. **Separate data fixes from deal-coaching recommendations so ops and sales can act independently.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Pipeline hygiene report with account/deal risks, data fixes, stakeholder gaps, signal evidence, and recommended action.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
