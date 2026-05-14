---
name: build-list
description: "Build a targeted list of contacts or companies from ZoomInfo matching natural-language criteria. Supports filtering by title, seniority, department, industry, company size, location, tech stack, and growth rate. Outputs a structured, exportable table. Use when the user wants to build a prospect list, generate leads, find people or companies matching specific criteria, or create a sales outreach list."
---

# Build List

Build a targeted list of contacts or companies from ZoomInfo and output as a structured table.

## Input

The user will describe what they want via `$ARGUMENTS`. Examples:
- "VP of Sales at healthcare companies using Salesforce with 500+ employees"
- "All SaaS companies in EMEA with $10M-$50M revenue"
- "Directors of Engineering at companies similar to Datadog"

The user may also specify:
- How many results they want (default: 25)
- Whether they want contacts, companies, or both
- Specific fields to include in the output

## Workflow

1. **Determine list type**: Is the user asking for contacts, companies, or both? Default to contacts if they mention titles/roles, companies if they mention firmographics only.

2. **Parse criteria** from natural language into structured filters:
   - Job titles, management levels, departments, job functions → contact filters
   - Industry, employee count, revenue, geography, tech stack, company type → company filters
   - Growth rate, funding, rankings → company filters

3. **Resolve all filter values** using `lookup` before searching — do NOT guess values:

   ```
   lookup({ fields: [{ fieldName: "management-levels" }, { fieldName: "industries" }] })
   ```
   Use the returned `id` values (e.g., `managementLevel: 4` for "VP") in all search parameters. If a lookup returns no matching values for a filter term, inform the user and suggest alternative terms before proceeding.

4. **Execute the search**:
   - For **contacts**: Use `search_contacts` with resolved filters. Sort by `-contactAccuracyScore`:

     ```
     search_contacts({
       managementLevel: [4],
       industryId: [52],
       employeeCount: ["501-1000", "1001-5000"],
       sortBy: "-contactAccuracyScore",
       pageSize: 25
     })
     ```

   - For **companies**: Use `search_companies` with resolved filters. Sort by `-employeeCount` or `-revenue`.
   - For **both**: Search companies first, then search contacts at the top results.

   If the search returns zero results, broaden filters (remove the most restrictive one) and retry. Tell the user which filter was relaxed.

5. **Enrich top results** if the search returns limited detail — use `enrich_contacts` or `enrich_companies` (batch of 10) to fill in emails, phones, and other details.

6. **Output as a clean table artifact** the user can copy or export.

## Output Format

### Search Criteria Applied

Show the exact filters used so the user can verify (table of Filter → Value).

### Results Table

For **contacts**: `# | Name | Title | Company | Email | Direct Phone | Accuracy | Location`

For **companies**: `# | Company | Industry | Employees | Revenue | HQ Location | Website | ZoomInfo ID`

### List Summary

- **Total results found**: X (showing top Y)
- **Filters applied**: brief summary
- **Average accuracy score**: X (contacts only)
- Flag any data quality concerns (low accuracy, stale records)

### Refinement Options

If the list is too broad or narrow, suggest specific filter adjustments — e.g., "Add `revenue` filter to narrow from 847 to ~200 results" or "Try adjacent industries: Information Technology Services, Internet". Suggest the exact modified command for re-running.
