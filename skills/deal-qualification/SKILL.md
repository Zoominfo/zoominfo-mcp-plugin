---
name: deal-qualification
description: Qualify an account or opportunity using firmographics, buyer fit, urgency signals, stakeholder coverage, and data confidence.
---

# Deal Qualification

Qualify an account or opportunity using firmographics, buyer fit, urgency signals, stakeholder coverage, and data confidence.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Use qualification-specific evidence:

- `account_research`: preferred when the decision depends on CRM, opportunity, or conversation history.
- `enrich_companies`: firmographic, technographic, hierarchy, and growth fit.
- `enrich_intent`: known-account buyer-intent topics and trend.
- `enrich_scoops` / `enrich_news`: event urgency and public narrative.
- `find_recommended_contacts`: stakeholder/actionability strength.
- `search_contacts`: explicit persona coverage gaps.

## Workflow

1. **Clarify qualification framework if supplied; otherwise use fit, pain/trigger, stakeholder access, timing, and data confidence.**
2. **Resolve the account and enrich core firmographics, technologies, company structure, and growth indicators.**
3. **Pull intent, scoops, and news to assess urgency; do not substitute generic industry assumptions for account-specific evidence.**
4. **Map relevant stakeholders and contactability using `search_contacts` and recommended contacts.**
5. **Score each qualification dimension with evidence and uncertainty; identify which missing fact would change the decision.**
6. **Recommend qualify, nurture, disqualify, or investigate with one next action.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Qualification scorecard with evidence, gaps, decision recommendation, and next action.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
