---
name: champion-tracking
description: Track champion movement, title changes, departures, influence, and replacement contacts across target or customer accounts.
---

# Champion Tracking

Track champion movement, title changes, departures, influence, and replacement contacts across target or customer accounts.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Use contact-first tools:

- `enrich_contacts`: verify current employment, title, seniority, contact details, and ZoomInfo contact ID.
- `contact_research`: use for high-value champions when CRM/conversation history can explain relationship strength.
- `find_similar_contacts`: find champion lookalikes when the original champion profile is known.
- `search_contacts`: find replacement champions at the old account or equivalent contacts at the new account.
- `find_recommended_contacts`: identify who else to engage at the original account after champion movement.
- `enrich_companies`: qualify the champion's new company for expansion or new-logo opportunity.

## Workflow

1. **Identify known champions by email, name, company, CRM/contact ID, or supplied list. Preserve original account association.**
2. **Resolve each person with `enrich_contacts`; fall back to `search_contacts` when needed and label ambiguous matches.**
3. **Check current title, company, management level, department, contact accuracy, and employment status from ZoomInfo fields.**
4. **If a champion moved, enrich the new company and classify the opportunity**: referral, expansion, new-logo, or monitor.
5. **At the original account, use `search_contacts` or recommended contacts to identify replacement champions and coverage gaps.**
6. **Prioritize by seniority, prior relationship value, account fit, and actionability.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Champion movement tracker with status, new company, action recommendation, replacement contacts, and confidence.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
