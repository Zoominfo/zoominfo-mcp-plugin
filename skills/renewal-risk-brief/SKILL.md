---
name: renewal-risk-brief
description: Assess renewal or expansion risk using account signals, champion status, stakeholder gaps, growth/contraction clues, and next actions.
---

# Renewal Risk Brief

Assess renewal or expansion risk using account signals, champion status, stakeholder gaps, growth/contraction clues, and next actions.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Use renewal-specific account and contact context:

- `account_research`: preferred for renewal risk because CRM and conversation history often determine true risk.
- `contact_research`: inspect named champions, detractors, and executive sponsors.
- `enrich_contacts`: verify champion movement, title changes, reachability, and employment status.
- `find_recommended_contacts`: renewal/growth use case for missing stakeholders and expansion paths.
- `enrich_companies`, `enrich_intent`, `enrich_scoops`, `enrich_news`: company health, signal trend, and disruption evidence.

## Workflow

1. **Capture customer/account, renewal date if known, product, current champions, sentiment, and open concerns.**
2. **Resolve and enrich the company, then pull relevant news, scoops, and intent for expansion, contraction, leadership change, M&A, or budget risk.**
3. **Verify champions with `enrich_contacts`; flag departures, title changes, low contact accuracy, and company moves.**
4. **Map renewal committee gaps across executive sponsor, business owner, technical owner, procurement, legal/security, and day-to-day users.**
5. **Score risk by champion health, signal trend, stakeholder coverage, company health, and data confidence.**
6. **Recommend retention actions and expansion plays separately.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Renewal risk brief with score, evidence, champion status, stakeholder gaps, retention actions, and expansion hypotheses.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
