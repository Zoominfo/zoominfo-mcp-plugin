---
name: account-plan
description: Build a strategic account plan for a target company. Use when preparing for account-based selling, territory planning, or strategic deal pursuit. Provides org mapping, buying committee identification, and engagement strategy.
---

# Account Plan

Build a comprehensive account plan for a target company using ZoomInfo intelligence.

## Input

The user will provide a company name, domain, or ID via `$ARGUMENTS`. They may also specify a product/solution they're selling, which should inform the buying committee mapping.

## Workflow

1. **Enrich the company** using `enrich_companies` to get full firmographic profile. Extract the ZoomInfo company ID from the result.
2. **Map the buying committee** using `get_recommended_contacts` with `useCaseType: "PROSPECTING"` and `ziCompanyId` set to the company's ZoomInfo ID. Request `pageSize: 25`.
3. **Resolve management levels** using `lookup` with `fields: [{"fieldName": "management-levels"}]` to get the correct IDs for C-Level, SVP, and VP.
4. **Find executive leadership** using `search_contacts` with `companyId` and `managementLevel` set to the resolved C-Level and VP values from lookup. Get 15 results.
5. **Identify similar companies** using `find_similar_companies` with the `companyId` to understand the peer set and potential competitive displacement opportunities.

## Output Format

### Company Profile
- Full firmographic summary: revenue, employees, industry, HQ, business model
- Growth signals: employee growth rates, funding history, recent rankings
- Corporate structure: parent company, subsidiaries, divisions

### Buying Committee Map
Organize recommended contacts into a buying committee structure:
- **Economic Buyer**: Who controls budget (typically C-suite or SVP)
- **Champion**: Who would advocate internally (typically Director/VP in relevant dept)
- **Technical Evaluator**: Who assesses fit (typically Sr. Manager/Director in IT or relevant function)
- **End User**: Who would use the product daily

For each person include: Name, Title, Department, and why they were recommended (use the metadata from the recommendation).

### Engagement Strategy
- Recommended entry point (which contact to approach first and why)
- Multi-threading plan (sequence of contacts to engage)
- Key talking points based on company signals
- Potential objections based on company profile

### Peer Companies
List the top 5 similar companies with their similarity scores. Note which ones could serve as reference accounts or competitive displacement targets.

Be specific and actionable. Avoid generic advice.
