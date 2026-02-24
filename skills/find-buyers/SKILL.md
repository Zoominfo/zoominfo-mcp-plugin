---
name: find-buyers
description: Find the right buyers and decision-makers at a target company. Use when you need to identify who to reach out to, build a contact list, or multi-thread into an account. Supports filtering by role, department, seniority.
---

# Find Buyers

Identify and prioritize the best contacts to engage at a target company.

## Input

The user will provide via `$ARGUMENTS`:
- A company name or domain (required)
- Optionally: target persona (e.g., "VP of Sales", "IT decision makers", "marketing leaders")
- Optionally: specific departments or job functions

## Workflow

1. **Resolve the company** using `search_companies` with the company name or domain. Extract the ZoomInfo company ID.
2. **Get AI-recommended contacts** using `get_recommended_contacts` with `useCaseType: "PROSPECTING"` and `ziCompanyId` set to the company's ZoomInfo ID. Request `pageSize: 25`.
3. **Search for specific personas** if the user specified a role or department:
   - Use `lookup` to resolve management levels, departments, or job functions to their correct IDs.
   - Use `search_contacts` with the company ID and the resolved filters. Sort by `-contactAccuracyScore`.
4. **Enrich top contacts** using `enrich_contacts` on the top 5-10 most relevant contacts to get full contact details.

## Output Format

Present results as a prioritized contact list:

| Priority | Name | Title | Department | Accuracy | Email | Direct Phone | Why This Person |
|----------|------|-------|------------|----------|-------|-------------|-----------------|

For each contact, the "Why This Person" column should explain their relevance: are they a likely decision-maker, budget holder, technical evaluator, or end user? Use the recommendation metadata and title/seniority signals.

After the table, provide:
- **Recommended outreach sequence**: Which 3-5 contacts to approach in what order
- **Multi-threading strategy**: How to use initial conversations to get warm introductions to other stakeholders

If the search returns few results, suggest broadening the search criteria and explain what was tried.
