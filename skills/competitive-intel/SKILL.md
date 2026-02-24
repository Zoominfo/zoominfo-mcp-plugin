---
name: competitive-intel
description: Research a competitor's organization, leadership, and hiring patterns. Use when preparing competitive battle cards, displacement campaigns, or market analysis. Provide a competitor company name or domain.
---

# Competitive Intel

Build a competitive intelligence brief on a target company.

## Input

The user will provide via `$ARGUMENTS`:
- Competitor company name or domain (required)
- Optionally: specific areas of focus (e.g., "their sales org", "leadership team", "recent hires")

## Workflow

1. **Enrich the company** using `enrich_companies` for full firmographic profile. Extract the ZoomInfo company ID.
2. **Resolve management levels** using `lookup` with `fields: [{"fieldName": "management-levels"}]` to get the correct IDs for C-Level, SVP, and VP.
3. **Map leadership** using `search_contacts` with `companyId` and `managementLevel` set to the resolved C-Level and SVP+ values from lookup. Get 20 results.
4. **Map key departments** using `search_contacts` with `companyId` for the departments the user cares about (default: Sales, Marketing, Engineering, Product). Use `lookup` with `fields: [{"fieldName": "departments"}]` to resolve department values. For each, get a count and senior leaders.
5. **Find similar companies** using `find_similar_companies` with the `companyId` to understand their competitive peer set.
6. **Check for recent hires** using `search_contacts` with `companyId` and `positionStartDateMin` set to 6 months ago to identify recent senior hires (signals strategic shifts).

## Output Format

### Company Profile
- Full firmographic summary
- Business model, primary industries
- Corporate structure (parent/subs)

### Leadership Team
| Name | Title | Department | Time in Role |
|------|-------|------------|-------------|

Note any recent leadership changes (started within last 6 months).

### Organizational Footprint
For each key department:
- Estimated headcount (based on ZoomInfo contact count)
- Senior leaders
- Notable recent hires

### Growth Signals
- Employee growth rate (1yr and 2yr)
- Recent funding or financial events
- Hiring patterns (which departments are growing?)

### Competitive Peer Set
Top 10 similar companies — these are the other vendors competing for the same customers.

### Strategic Implications
Based on the data:
- Where are they investing? (hiring patterns signal strategy)
- What are their likely strengths and weaknesses?
- Displacement opportunities (areas where their org is thin or leadership is new)
