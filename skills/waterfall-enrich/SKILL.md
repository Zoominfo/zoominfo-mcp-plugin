---
name: waterfall-enrich
description: Enrich company and contact records with ZoomInfo-first matching, field-level confidence, provenance, unresolved rows, and activation-ready output.
---

# Waterfall Enrich

Enrich company and contact records with ZoomInfo-first matching, field-level confidence, provenance, unresolved rows, and activation-ready output.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## Workflow

1. **Identify whether the input rows are companies, contacts, or mixed records; preserve the original row ID for auditability.**
2. **Resolve all requested fields and any filter values with `lookup` before search or enrichment; do not invent enum IDs.**
3. **For companies, resolve by domain first, then name using `search_companies`; enrich matched records with `enrich_companies`.**
4. **For contacts, resolve by email first, then name + company using `enrich_contacts`; fall back to `search_contacts` only when enrichment cannot identify a record.**
5. **Score each populated field as high / medium / low confidence based on exact match, ZoomInfo IDs, contact accuracy score, and recency signals.**
6. **Do not silently fill conflicting values. Route ambiguous, duplicate, low-confidence, and unmatched rows into review queues.**
7. **If the client exposes approved non-ZoomInfo enrichment providers, use them only for fields ZoomInfo cannot confidently fill and record source + cost. Otherwise mark the fallback as unavailable.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Enriched table with original row ID, ZoomInfo IDs, populated fields, confidence, source/provenance, unresolved rows, conflicts, and recommended writeback action.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
