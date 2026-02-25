---
name: find-lookalikes
description: Find companies similar to a given reference company. Provide a company name, domain, or ZoomInfo ID and get a ranked list of lookalikes scored by similarity. Useful for territory expansion, TAM analysis, and competitive mapping.
---

# Find Lookalikes

Find companies similar to a reference company using ZoomInfo's ML-powered similarity model.

## Input

The user will provide via `$ARGUMENTS`:
- A company name, domain, or ZoomInfo company ID

## Workflow

1. **Lookup metadata first** — before calling any other MCP tool, use `lookup` to load reference data for any fields relevant to the request. Use the returned `id` values (not display names) in all subsequent API calls. This ensures accurate parameter resolution, especially if a search is needed to resolve the company.

2. **Resolve the company** if needed:
   - If the user gave a name or domain, use `search_companies` or `enrich_companies` to get the ZoomInfo company ID — use lookup `id` values for any filters.
3. **Find similar companies** using `find_similar_companies` with the `companyId`. This returns up to 100 results ranked by similarity score.

## Output Format

**Similar companies to [Reference Company Name]:**

| Rank | Company | Industry | Employees | Revenue | Country | Similarity Score |
|------|---------|----------|-----------|---------|---------|-----------------|
| 1 | | | | | | |
| 2 | | | | | | |
| ... | | | | | | |

Show the top 25 by default. If the user asks for more, show up to 100.

After the table:
- Note the total number of similar companies returned
- Call out any patterns (e.g., "heavily weighted toward mid-market SaaS in North America")
- Suggest next steps: use `/zoominfo:enrich-company` to get full details on any result, or `/zoominfo:find-buyers` to identify contacts at a target
