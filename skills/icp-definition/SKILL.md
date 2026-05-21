---
name: icp-definition
description: Derive a reusable ICP from target accounts, winners, hypotheses, or market criteria using ZoomInfo firmographic and signal data.
---

# ICP Definition

Derive a reusable ICP from target accounts, winners, hypotheses, or market criteria using ZoomInfo firmographic and signal data.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Capture the ICP purpose**: prospecting, campaign targeting, TAM sizing, scoring, territory planning, or product strategy.
2. **If seed accounts are provided, resolve and enrich them; if not, start from the user hypothesis and build candidate cohorts with `search_companies`.**
3. **Analyze common traits**: industry, size, revenue, growth, geography, tech stack, hierarchy, department footprint, intent, scoops, and news patterns.
4. **Distinguish hard filters from scoring signals; do not overfit to small seed lists.**
5. **Run broader/narrower searches to estimate addressability and identify filter cliffs.**
6. **Produce a reusable filter schema compatible with list building, TAM sizing, scoring, and campaign segmentation.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: ICP definition with hard filters, scoring signals, exclusions, addressability estimate, examples, and open assumptions.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
