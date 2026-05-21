---
name: account-prioritization
description: Rank accounts by ICP fit, intent, trigger signals, whitespace, and explainable next-best action.
---

# Account Prioritization

Rank accounts by ICP fit, intent, trigger signals, whitespace, and explainable next-best action.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Use free discovery before credit-consuming depth:

- `search_companies`: normalize or build the account universe.
- `search_intent`: discover accounts already researching relevant topics.
- `search_scoops`: discover accounts with recent events that create urgency.
- `enrich_companies`: deepen only the accounts being scored.
- `enrich_intent`, `enrich_scoops`, `enrich_news`: add why-now evidence for known accounts.
- `find_recommended_contacts`: include reachability/stakeholder strength in the score when seller actionability matters.
- `account_research`: use for synthesized context when CRM/conversation history can change the ranking.

## Workflow

1. **Capture the prioritization goal**: new logo, expansion, renewal, competitive takeout, territory focus, or campaign audience.
2. **Normalize the input account list or build one with `search_companies`; resolve all filters with `lookup`.**
3. **Enrich accounts with firmographics, technologies, hierarchy, growth, and department data via `enrich_companies`.**
4. **Pull intent, scoops, and news where relevant; keep only signals that map to the prioritization goal.**
5. **Score accounts with transparent factors**: ICP fit, timing/urgency, reachable personas, data confidence, and strategic value.
6. **Assign each account to an action tier with a concise why-now rationale and recommended owner action.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Ranked account list with score breakdown, evidence, confidence, action tier, and next-best action.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
