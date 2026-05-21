---
name: build-tam
description: Build a market or territory TAM using ZoomInfo company search counts, reusable ICP filters, sample accounts, and assumption notes.
---

# Build TAM

Build a market or territory TAM using ZoomInfo company search counts, reusable ICP filters, sample accounts, and assumption notes.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Translate the user request into an explicit ICP**: industries, geography, employee count, revenue, technologies, growth/funding, ownership, and exclusions.
2. **Use `lookup` for every taxonomy-backed field before search. For industries, fuzzy-match each term separately and prefer specific sub-industries over broad parents.**
3. **Run `search_companies` with `pageSize**: 1` to capture `meta.totalResults` for the headline TAM count.
4. **Run segmented counts for the dimensions that matter most**: region, employee band, industry, revenue band, or technology.
5. **Pull representative accounts with `search_companies` using sorted views such as `-employeeCount` or `-revenue`; label samples as illustrative, not a census.**
6. **Stress-test assumptions**: run a broader and narrower variant and show sensitivity of TAM to the highest-leverage filters.

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: TAM estimate, applied filters, sensitivity ranges, segment breakdowns, sample accounts, exclusions, and reusable ICP filter set.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
