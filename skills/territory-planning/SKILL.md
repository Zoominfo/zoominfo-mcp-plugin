---
name: territory-planning
description: Design or rebalance territories using ZoomInfo account counts, fit, coverage, trigger density, and rep-actionable segments.
---

# Territory Planning

Design or rebalance territories using ZoomInfo account counts, fit, coverage, trigger density, and rep-actionable segments.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Clarify planning objective**: carve new territory, rebalance, quota support, account assignment, industry/geography coverage, or white-space analysis.
2. **Translate territory rules into filters and resolve taxonomy values with `lookup`.**
3. **Use `search_companies` counts to size each territory and segment by geography, employee count, revenue, industry, and technology where relevant.**
4. **Pull sample accounts per territory and flag concentration risk, sparse data, or skew toward subsidiaries/parents.**
5. **Layer intent/scoops/news on representative or high-value accounts to estimate near-term actionability.**
6. **Recommend territory boundaries that balance account volume, ICP quality, revenue potential, and signal density.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Territory plan with counts, segment breakdowns, account samples, risks, and recommended assignment logic.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
