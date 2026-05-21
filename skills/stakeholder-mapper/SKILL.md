---
name: stakeholder-mapper
description: Map stakeholders at a target account by role, seniority, likely influence, buying-committee coverage, and recommended outreach order.
---

# Stakeholder Mapper

Map stakeholders at a target account by role, seniority, likely influence, buying-committee coverage, and recommended outreach order.

## Input

The user will describe the job via `$ARGUMENTS`. Capture any supplied accounts, contacts, domains, companies, CRM rows, segments, territories, product motion, timeframe, output format, or activation target.

If a required entity is missing, ask one concise clarifying question. If the request is broad but actionable, proceed with a stated assumption rather than blocking.

## MCP Tool Selection

Use the contact stack in order:

- `find_recommended_contacts`: first choice for who-to-contact recommendations at a named account because it uses ZoomInfo activity and CRM win patterns when available.
- `search_contacts`: fill explicit persona or committee gaps not covered by recommendations.
- `enrich_contacts`: reveal full contact data only for selected contacts, in batches up to 25.
- `contact_research`: synthesize CRM/conversation context for named high-priority stakeholders.
- `account_research`: use when the stakeholder map depends on account history, deal stage, or relationship context.
- `lookup`: resolve management level, department, function, and location filters before searching.

## Workflow

1. **Clarify the motion and account**: new logo, expansion, renewal, technical evaluation, procurement, executive alignment, or general mapping.
2. **Resolve the account through company ID, domain, or `search_companies` and enrich the company profile.**
3. **Use `lookup` for management levels, departments, and job functions; then search for contacts in priority persona groups.**
4. **Use `find_recommended_contacts` when the use case maps to prospecting, deal acceleration, or renewal/growth.**
5. **Classify contacts as economic buyer, technical buyer, evaluator, user champion, procurement/legal, executive sponsor, blocker, or unknown.**
6. **Rank outreach order by likely influence, relevance, seniority, contact accuracy, and coverage gaps.**

## Output Format

Return a concise operator-ready artifact:

- **Objective**: what this run is solving
- **Inputs used**: accounts, contacts, filters, timeframe, and assumptions
- **ZoomInfo workflow**: MCP tools used and why
- **Results**: Stakeholder map with roles, influence, evidence, contact confidence, gaps, and recommended outreach sequence.
- **Evidence**: source fields, signal dates, confidence, and caveats
- **Next actions**: the 3-5 highest-leverage follow-ups

## Quality Bar

- Resolve taxonomy-backed fields with `lookup` before search or enrichment.
- Prefer stable identifiers: ZoomInfo IDs, company domains, and emails before fuzzy names.
- Keep confidence visible. Do not hide unmatched, ambiguous, stale, or conflicting records.
- Separate verified ZoomInfo data from inference and recommendations.
- Do not invent customer pain, internal initiatives, tools, budgets, or competitor usage without evidence.
