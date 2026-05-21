---
name: business-case-builder
description: Draft a buyer-specific business case using account scale, pain hypotheses, relevant signals, stakeholders, and measurable outcome assumptions.
---

# Business Case Builder

Draft a buyer-specific business case using account scale, pain hypotheses, relevant signals, stakeholders, and measurable outcome assumptions.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Clarify buyer persona, product, desired outcome, account, and any known metric assumptions.**
2. **Enrich company data to size the opportunity**: employee count, revenue, locations, departments, growth, technologies, and hierarchy.
3. **Pull news, scoops, and intent to support urgency and business relevance.**
4. **Map stakeholders who will care about financial, operational, technical, and risk outcomes.**
5. **Build the case with explicit assumptions; use ranges when inputs are uncertain and do not fabricate ROI numbers.**
6. **Recommend proof points or data the seller should collect next to tighten the case.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Business case outline with account context, value drivers, stakeholder lens, quantified assumptions, risk notes, and next data asks.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
