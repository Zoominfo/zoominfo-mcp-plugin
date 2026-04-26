---
name: enrich-technology
description: Look up the full technology stack installed at a company — CRM, marketing automation, ERP, cloud infrastructure, analytics, and more. Supports tech-stack-based prospecting to find all companies running a specific technology.
---

# Enrich Technology

Look up the installed technology stack at a company, or find companies running a specific technology.

## Input

The user will provide via `$ARGUMENTS` one of:

**Tech stack lookup (what does this company use?):**
- A company name (e.g., `Salesforce`)
- A company domain (e.g., `salesforce.com`)
- A ZoomInfo company ID

**Tech stack prospecting (who uses this technology?):**
- A technology name or combination (e.g., `companies using HubSpot`, `SAP + Snowflake customers`, `Salesforce users in financial services with 500+ employees`)

Determine which workflow to use based on whether the user is asking about a specific company or looking for companies by technology.

---

## Workflow A — Tech Stack Lookup (specific company)

1. **Lookup metadata first** — before calling any other MCP tool, use `lookup` to load reference data for any fields relevant to the request. Use the returned `id` values (not display names) in all subsequent API calls.

2. **Resolve the company** if the user did not provide a ZoomInfo company ID:
   - Domain or URL → use `companyWebsite`
   - Company name → use `companyName`
   - Ticker → use `companyTicker`

3. **Enrich the company** using `enrich_companies` with the resolved match key. Request output fields that include technology data:
   - `techAttributeTagList` — installed technologies (vendor, product, category tags)
   - `id`, `name`, `website`, `industry`, `employeeCount`, `revenue` — for context

4. **If no match**, try a fallback:
   - Use `search_companies` with `companyName` for fuzzy matching
   - Present the top 3 candidates and ask the user to confirm

5. **Parse and categorize** the returned `techAttributeTagList` by category (see Output Format).

---

## Workflow B — Tech Stack Prospecting (find companies by technology)

1. **Lookup metadata first** — use `lookup` to resolve valid values for any firmographic filters the user mentioned (industry, employee count, revenue, geography, company type). Use returned `id` values in all search calls.

2. **Parse the technology criteria** from the user's input:
   - Single technology → one `techAttributeTagList` value
   - Multiple technologies → multiple values (AND logic — companies that have all specified technologies)
   - Combined with firmographics → add the appropriate filters (industry, `employeeCountMin`/`Max`, `revenueMin`/`Max`, `state`, `country`)

3. **Search companies** using `search_companies` with:
   - `techAttributeTagList`: the technology name(s) as filter values
   - Any additional firmographic filters resolved from step 1
   - Sort by `-employeeCount` (largest companies first) or `-revenue` if the user specifies
   - Request up to 100 results

4. **Enrich the top results** using `enrich_companies` on the top 10 (batch of 10) to get full firmographic detail including full tech stack, revenue, employee count, and HQ.

5. **Output as a structured table** (see Output Format — Prospecting).

---

## Output Format

### Workflow A — Tech Stack Lookup

**[Company Name]** — [Industry] | [Employee Count] employees | [Revenue] | [HQ Location]

#### Installed Technologies

Group technologies by category. Common categories:

| Category | Technologies |
|----------|-------------|
| CRM | Salesforce Sales Cloud, HubSpot CRM |
| Marketing Automation | Marketo, Pardot |
| ERP / Finance | SAP S/4HANA, Oracle NetSuite |
| Data & Analytics | Snowflake, Tableau, Looker |
| Cloud Infrastructure | AWS, Microsoft Azure, Google Cloud |
| Collaboration | Slack, Microsoft Teams, Zoom |
| Customer Support | Zendesk, Salesforce Service Cloud |
| Data Enrichment | ZoomInfo, Clearbit |
| Advertising | Google Ads, LinkedIn Campaign Manager |
| Other | [any remaining technologies] |

Omit categories with no detected technologies. If a category has more than 5 technologies, show the top 5 and note the total count.

#### Technology Signals

After the table, surface actionable intelligence:

- **Integration opportunities**: Technologies that commonly pair with the user's product (if inferable from context)
- **Competitive signals**: Technologies that indicate an incumbent competitor is installed
- **Displacement signals**: Technologies that are commonly replaced by the user's product
- **Stack sophistication**: Is this company early-stage (few tools, basic stack) or mature (deep, redundant tooling)?

If no signals can be inferred, omit this section.

#### Data Notes
- Note that ZoomInfo technographic data reflects detected signals and may not represent the full installed stack
- Include the ZoomInfo Company ID for follow-up commands

---

### Workflow B — Tech Stack Prospecting

#### Search Criteria Applied

| Filter | Value |
|--------|-------|
| Technology | [tech name(s)] |
| Industry | [if specified] |
| Employee Count | [if specified] |
| Revenue | [if specified] |
| Geography | [if specified] |

#### Companies Using [Technology Name]

| # | Company | Industry | Employees | Revenue | HQ | Website | ZoomInfo ID |
|---|---------|----------|-----------|---------|-----|---------|-------------|
| 1 | | | | | | | |
| 2 | | | | | | | |

Show the top 25 by default. If the user asks for more, show up to 100.

#### List Summary
- **Total matches found**: X (showing top Y)
- **Industry breakdown**: Top 3 industries represented
- **Size distribution**: Breakdown by employee range
- **Geography**: Top 3 countries/states represented

#### Refinement Options
If results are too broad or too narrow, suggest specific filter adjustments:
- "Add `industry` filter to narrow from 1,200 to ~150 results"
- "Add `employeeCountMin: 200` to focus on mid-market and above"
- "Add a second technology (e.g., `Snowflake`) to find companies running both"

---

## Important Notes

- **Technographic data coverage** varies by company size. Enterprise companies (1,000+ employees) typically have the richest tech stack data. SMB coverage may be limited.
- **Freshness**: ZoomInfo technographic signals are refreshed regularly but may lag actual deployments by weeks to months. Flag this when surfacing competitive or displacement signals.
- **Tech stack prospecting** works best with well-known vendor names (Salesforce, HubSpot, SAP, Workday, etc.). Obscure or niche tools may not return results.
- This skill requires a ZoomInfo account with technographics data enabled.
