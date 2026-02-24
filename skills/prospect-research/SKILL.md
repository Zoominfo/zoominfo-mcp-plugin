---
name: prospect-research
description: Research a company before outreach. Use when preparing for cold outreach, qualifying a lead, or needing a quick company snapshot. Provide a company name, domain, or ticker.
---

# Prospect Research

Research a target company using ZoomInfo to build a concise prospect brief for sales outreach.

## Input

The user will provide one or more of: company name, domain/website, or ticker symbol via `$ARGUMENTS`.

## Workflow

1. **Enrich the company** using `enrich_companies` with whatever identifier the user provided (domain, companyName, or companyTicker). Extract the ZoomInfo company ID from the result.
2. **Resolve management levels** using `lookup` with `fields: [{"fieldName": "management-levels"}]` to get the correct IDs for VP-level and above.
3. **Find key contacts** using `search_contacts` with `companyId` set to the enriched company's ID, `managementLevel` set to the resolved VP+ values, and sorted by `-contactAccuracyScore`. Limit to 10 results.

## Output Format

Write a concise prospect brief in this structure:

**Company Overview**
- What the company does (1-2 sentences from description)
- HQ location, employee count, revenue range
- Industry, company type (public/private), founding year
- Website and any stock ticker

**Key Signals**
- Recent funding, growth rate, or notable rankings
- Business model (B2B/B2C/B2G)
- Any notable parent/subsidiary relationships

**Recommended Contacts**
Table with: Name, Title, Department, Accuracy Score, Email (if available), Direct Phone (if available). Prioritize high accuracy scores and decision-maker titles.

**Outreach Angle**
Based on the company profile and contacts found, suggest 2-3 specific angles for initial outreach. Be specific to the company's situation, not generic.

Keep the entire brief under 500 words. Be direct, skip filler.
