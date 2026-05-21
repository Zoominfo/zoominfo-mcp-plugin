---
name: crm-cleanup
description: Audit and repair CRM account/contact data using ZoomInfo matching, confidence scoring, duplicate detection, and safe writeback recommendations.
---

# CRM Cleanup

Audit and repair CRM account/contact data using ZoomInfo matching, confidence scoring, duplicate detection, and safe writeback recommendations.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Keep cleanup deterministic and credit-aware:

- `lookup`: normalize controlled CRM values before comparing or writing.
- `search_companies` / `search_contacts`: free matching pass before enrichment.
- `enrich_companies` / `enrich_contacts`: source-of-truth values after a confident match; batch up to 25 records per call.
- `find_recommended_contacts`: not for field cleanup; use it only if cleanup expands into account coverage recommendations.
- `account_research` / `contact_research`: avoid for bulk cleanup; use only for high-value ambiguous records requiring relationship context.

## Workflow

1. **Classify the cleanup request**: stale fields, missing fields, duplicates, bad domains, inactive contacts, title drift, account hierarchy, or territory/segment hygiene.
2. **Preserve source CRM IDs and current values. Never overwrite blindly; compare current CRM data to ZoomInfo-enriched values.**
3. **Resolve companies and contacts using stable identifiers first**: domain, email, ZoomInfo ID, then name + company fallback.
4. **Use `enrich_companies` and `enrich_contacts` to fill target fields; use contact accuracy and match strength to assign confidence.**
5. **Detect duplicates by shared domain, company IDs, email, normalized names, parent/subsidiary relationships, and conflicting firmographics.**
6. **Output explicit writeback actions**: update, append, merge-review, suppress, or no-change.

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Cleanup report with proposed field updates, confidence, duplicate/merge queues, suppressions, and safe writeback file.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
