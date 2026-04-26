---
name: account-signals
description: Get a full sales-trigger intelligence brief for any company — leadership changes, funding rounds, expansions, layoffs, strategic initiatives, and recent news coverage. Surfaces the highest-priority signals with recommended outreach angles.
---

# Account Signals

Pull a complete sales-trigger intelligence brief for a company using ZoomInfo Scoops and News.

## Input

The user will provide via `$ARGUMENTS`:
- A company name (e.g., `Snowflake`), domain (e.g., `snowflake.com`), or ZoomInfo company ID
- Optionally: a signal type focus — "leadership", "funding", "expansion", "layoffs", "initiatives", or "all" (default: all)
- Optionally: a date range — "last 30 days", "last 90 days", "this quarter" (default: last 90 days)

## Workflow

1. **Lookup metadata first** — before calling any other MCP tool, use `lookup` to load reference data for any fields relevant to the request. Use the returned `id` values (not display names) in all subsequent API calls.

2. **Resolve the company** if the user did not provide a ZoomInfo company ID:
   - Domain or URL → use `companyWebsite`
   - Company name → use `companyName`
   - If ambiguous, use `search_companies` to find the best match and confirm with the user before proceeding.

3. **Enrich the company** using `enrich_companies` with the resolved match key to get baseline context: industry, employee count, revenue, HQ location. This anchors the signal analysis.

4. **Pull Scoops** using `search_scoops` filtered to the resolved company:
   - Filter by `companyId` or `companyName`
   - Apply date range: map "last 30 days" → `scoopPublishedStartDate`, "last 90 days" → 90 days back from today, etc.
   - If the user specified a signal type, map it to `scoopType`:
     - "leadership" → leadership change scoops
     - "funding" → funding/investment scoops
     - "expansion" → new office, hiring surge, new market entry
     - "layoffs" → reduction in force
     - "initiatives" → strategic project, technology investment
     - "all" → no scoopType filter
   - Request up to 25 results.

5. **Pull News** using `enrich_news` for the resolved company to get recent press coverage.

6. **Synthesize and prioritize** signals by sales relevance (see Output Format).

## Output Format

### [Company Name] — Signal Brief
*[Industry] | [Employee Count] employees | [Revenue] | [HQ Location]*
*Signals from: [date range]*

---

### Top Signals

Lead with the 3 highest-priority signals — the ones most actionable for outreach right now. For each signal, include:

**[Signal Title]**
- **Type**: Leadership Change / Funding / Expansion / Layoff / Initiative / News
- **Date**: [published date]
- **Summary**: [1-2 sentence description of what happened]
- **Why it matters**: [1 sentence on the sales implication — who is newly in seat, what budget was just unlocked, what pain this creates]
- **Recommended angle**: [specific outreach hook tied to this signal]

---

### All Scoops ([count])

| Date | Type | Signal | Relevance |
|------|------|--------|-----------|
| | Leadership Change | [Name] appointed as [Title] | New decision-maker in seat |
| | Funding | Raised $[X]M Series [X] | New budget, growth mandate |
| | Expansion | Opening [X] office in [City] | New location, new team |
| | Initiative | Investing in [project/technology] | Active buying signal |
| | Layoff | Reduced headcount by [X]% | Cost pressure, consolidation signal |

Sort by date descending. If filtered by signal type, show only matching rows.

---

### Recent News ([count])

| Date | Headline | Source | Signal Type |
|------|----------|--------|-------------|
| | | | |

---

### Signal Summary

- **Total signals in period**: [X scoops + Y news items]
- **Hottest signal type**: [whichever category has the most activity]
- **Account temperature**: 🔥 Hot (3+ signals in 30 days) / Warm (1-3 signals in 90 days) / Cool (no recent signals)
- **Best time to reach out**: [now if hot signals exist / note if account is in transition]

---

### Outreach Recommendations

Based on the signals above, suggest:
1. **Best entry point**: Which signal creates the strongest outreach hook right now?
2. **Best contact**: What type of persona should be contacted given these signals? (e.g., "New CFO means a new finance leader open to vendor evaluation — target the CFO + VP Finance")
3. **Suggested subject line**: One example subject line that references a specific signal without being gimmicky.

---

## Important Notes

- **Leadership change signals** are among the most valuable — new executives re-evaluate inherited vendors in their first 90 days. Prioritize these.
- **Funding signals** unlock new budget; the buying window is typically 30-60 days after announcement.
- **Layoff signals** indicate cost pressure and consolidation — leads well into efficiency, automation, or platform-consolidation positioning.
- **No signals returned** does not mean the account is unworthy — it means ZoomInfo hasn't picked up a trigger recently. Suggest the user check back in 30 days or pivot to `/zoominfo:enrich-company` for a full firmographic review.
- Scoops are curated by ZoomInfo's editorial and ML pipeline. News is sourced from press and media. Both require a ZoomInfo account with the relevant data entitlements.
