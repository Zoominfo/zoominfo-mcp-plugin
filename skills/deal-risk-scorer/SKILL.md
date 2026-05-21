---
name: deal-risk-scorer
description: Score deal risk using account context, stakeholder coverage, trigger evidence, competitor signals, and missing buying-committee roles.
---

# Deal Risk Scorer

Score deal risk using account context, stakeholder coverage, trigger evidence, competitor signals, and missing buying-committee roles.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Use the account-specific enrichment stack:

- `account_research`: preferred when the user asks for deal/account risk and first-party CRM or conversation context may exist.
- `enrich_companies`: baseline company, hierarchy, firmographic, and technology context.
- `enrich_intent`, `enrich_scoops`, `enrich_news`: timing, urgency, and disruption evidence for the known account.
- `find_recommended_contacts`: stakeholder coverage and deal-acceleration contact recommendations.
- `search_contacts`: targeted gaps for economic buyer, technical buyer, procurement, finance, legal, or executive sponsor.
- `contact_research`: named stakeholder relationship/role context.

## Workflow

1. **Start from named opportunity/account context and clarify deal stage, close date, product, known stakeholders, and primary concern if available.**
2. **Resolve the account via ZoomInfo ID, domain, or `search_companies`; enrich with `enrich_companies`.**
3. **Pull relevant news, scoops, and intent; treat absence of signal as uncertainty, not proof of no risk.**
4. **Map stakeholders and gaps using `search_contacts` and recommended contacts for deal acceleration.**
5. **Assess risks across five dimensions**: account fit, timing, stakeholder coverage, competitive pressure, and data confidence.
6. **Produce a mitigation plan with one owner-ready action per material risk.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Deal risk scorecard with evidence, confidence, stakeholder gaps, top risks, and mitigation actions.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
