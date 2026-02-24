---
name: lead-enrichment
description: Enrich a list of leads with ZoomInfo data. Provide names, emails, domains, or company names and get back full profiles with contact details, firmographics, and accuracy scores. Works with up to 10 records at a time.
---

# Lead Enrichment

Bulk enrich contacts or companies from a user-provided list.

## Input

The user will provide via `$ARGUMENTS` a list of leads in any format:
- Email addresses
- Names + company combinations
- Company domains or names
- A mix of the above

## Workflow

1. **Parse the input** to identify whether the user is enriching contacts, companies, or both.
2. **For contacts**: Use `enrich_contacts` in batch mode (up to 10 per call). Match using the best available identifier:
   - Email address (preferred)
   - firstName + lastName + companyName
   - fullName + companyName
3. **For companies**: Use `enrich_companies` in batch mode (up to 10 per call). Match using:
   - Domain (preferred)
   - companyName
4. **Handle misses**: If any records don't match, note them clearly and suggest alternative search strategies (e.g., try a different spelling, use search_contacts with fuzzy matching).

## Output Format

### Enrichment Results

**Contacts** (if applicable):

| Name | Title | Company | Email | Direct Phone | Accuracy Score | Location |
|------|-------|---------|-------|-------------|----------------|----------|

**Companies** (if applicable):

| Company | Industry | Employees | Revenue | HQ Location | Website | Type |
|---------|----------|-----------|---------|-------------|---------|------|

### Match Summary
- X of Y records successfully enriched
- List any records that failed to match with the reason

### Data Quality Notes
- Flag any contacts with accuracy scores below 80
- Note any stale records (last updated > 6 months ago)
- Highlight high-value finds (C-level contacts, high accuracy scores)

If the user has more than 10 records, process them in batches and combine the results. Let the user know the batch processing approach.
