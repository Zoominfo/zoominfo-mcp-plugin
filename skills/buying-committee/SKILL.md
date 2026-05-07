---
name: buying-committee
description: Map the buying committee at a target account. Identifies decision-makers, prioritizes who to engage, and surfaces gaps and multi-thread risks. Leads with a TL;DR (top 3 to engage, biggest gap, multi-thread risk), uses compact tables, and deep-researches top stakeholders to catch stale records. Provide a company name, domain, or ZoomInfo ID.
---

# Buying Committee

Map the buying group at a target account — who matters, what role they play, and who to engage first. Output is scannable: headline first, compact tables, deeper profiles only for the top 3-5.

## Input

The user will provide via `$ARGUMENTS`:
- A company name, domain, or ZoomInfo company ID (required)
- Optionally: a use case — "prospecting", "deal acceleration", or "renewal" (defaults to PROSPECTING)
- Optionally: persona focus (e.g., "security leadership", "VP Engineering and above")

## Workflow

Parallelize aggressively — once the company is resolved, account research, enrichment, recommendations, scoops, and supplemental search can all fan out in parallel.

1. **Lookup metadata first** — call `lookup` for any fields relevant to the request (management levels, departments, job functions). Use returned `id` values in subsequent calls.

2. **Get GTM context** — call `get_gtm_context` with `detailed: true` to retrieve full personas, ICP segments, offerings, and competitors. The detailed mode matters here because committee mapping benefits from full persona definitions. If empty, proceed without and note the gap in the TL;DR.

3. **Resolve the company** — use `search_companies` with `companyWebsite` or `companyName`, or use the provided company ID directly. Then `enrich_companies` for firmographics including `employeeCountByDepartment`.

4. **Get the committee from `account_research`** (primary source) — call with the company ID and a query asking for named individuals organized by function, with engagement status, and the deal context (stage, last activity, competition). This routinely returns a pre-mapped, CRM-aware committee.
   - Normalize engagement to two states: **Engaged** (explicit prior interaction signal) or **New** (everything else, including ambiguous). Default to New when in doubt.
   - If `account_research` surfaces dates in the past (renewal, contract end, last activity), retain them but tag for verification — they may signal active negotiation, broken CRM sync, or a missed milestone.

5. **Pull recommendations and supplemental search** (parallel with step 4):
   - `get_recommended_contacts` with the mapped use case enum (`PROSPECTING` / `DEAL_ACCELERATION` / `RENEWAL_AND_GROWTH`) — treat as supplemental signal. Empty results are common (cold-start tenants, no CRM data); note as a confidence indicator rather than retrying.
   - `search_contacts` with persona filters resolved from GTM context or role-based heuristics (economic buyer, technical evaluator, champion-shaped roles). Sort by `-contactAccuracyScore`.

6. **Check scoops for recent executive moves** (parallel with step 4) — call `enrich_scoops` or `search_scoops` with a 90-day window. Parse for **New Hire / Lateral Move / Executive Move / Promotion** at VP+ level. For each newly-named person, run `search_contacts` and add to the committee with a `RECENTLY APPOINTED` flag and the event date. These often pre-date what `account_research` knows.

7. **Enrich and deep-research** — merge contacts from steps 4-6, dedupe by `personId`:
   - `enrich_contacts` in batches of 10 on the top 20 merged contacts. `NO_MATCH` failures are normal — note them, don't retry.
   - `contact_research` in parallel on the top 3-5 (highest seniority + engagement + persona match). This is where stale records get caught — if research indicates the person has departed, route them to **Excluded / Needs Verification**, not the main map.

8. **Synthesize conservatively**:
   - **Champions** require explicit engagement evidence (CRM activity, demo attended, prior emails). Title alone is never sufficient — without a signal, place under Influencers > Potential Champions.
   - **Technical Evaluators** are Director+ in IT, Engineering, or the function being sold to. Sales Ops VPs are Influencers > Operations unless the product evaluates against criteria they own.
   - **Economic Buyers** hold budget — C-Level Finance, the function head sponsoring the deal, or CEO for strategic deals.
   - **Influencers** use named sub-buckets (Strategic Partnerships, Communications, Adjacent Marketing, M&A / Corp Dev, Operations, Legal / Compliance, HR / Talent, Potential Champions). Skip empty buckets.
   - Tag every contact with source: `[from account_research]`, `[from search]`, `[from recommendations]`, `[from scoops]`. Flag source disagreements.

## Output Format

### Buying Committee: [Company Name]

**[Industry]** | **[Employees]** | **[Revenue]** | **[HQ]**

### TL;DR

One paragraph. Top 3 contacts to engage (named, one-line reasoning each), biggest coverage gap (specific role/function with risk), and multi-threading risk in one sentence. If a past-date reference came back from `account_research`, lead with: *"Renewal/contract date in CRM appears stale — verify deal state before acting on this map."*

### Company Snapshot

One-paragraph context — what they do, where they sit in the buying journey.

### GTM Fit

Omit this section if no GTM context was retrieved. Otherwise:
- **ICP Match**: fit assessment
- **Persona Coverage**: matched / partial / missing — flag gaps
- **Relevant Offerings**: which products apply
- **Competitive Presence**: any defined competitors at the account

### Account Context

- **Deal Status**: stage, value, close date, competition
- **Engaged Stakeholders**: who we've talked to
- **Key Signals**: intent, recent activity, executive appointments from scoops
- **Open Issues / Blockers**: from CRM

If a past date was surfaced: *"`account_research` references [event] on [date], in the past. Verify deal state before relying on the engagement strategy below."*

### Committee Map (visual, additive)

After the contact tables below, include a `mermaid flowchart TD` block showing the committee organized by role with engagement state color-coded (engaged / new / recently appointed / stale-excluded / gap) and the recommended sequencing path overlaid (e.g., green dashed arrows for "engage 1st → 2nd → 3rd"; red dashed for "departed, replaced by"). Keep the chart additive — every name in it must also appear in a contact table below, since not all markdown clients render mermaid (Slack, plain email, basic viewers fall back to the code block).

Use a class definition block at the top so the colors render consistently:
```
classDef engaged fill:#d4edda,stroke:#155724,color:#155724
classDef new fill:#f8f9fa,stroke:#6c757d,color:#212529
classDef recent fill:#fff3cd,stroke:#856404,color:#856404
classDef stale fill:#f8d7da,stroke:#721c24,color:#721c24
classDef gap fill:#e2e3e5,stroke:#383d41,color:#383d41,stroke-dasharray: 5 5
```

Then below the chart, a one-line legend: `🟢 Engaged · ⚪ New · 🟡 Recently appointed · 🔴 Stale (excluded) · ⬛ Gap`.

### Committee Map (tables)

Per category, lead with a 5-column table.

#### Economic Buyers

| Name | Title | Email | Status | Source |
|------|-------|-------|--------|--------|

#### Champions

| Name | Title | Email | Status | Source |
|------|-------|-------|--------|--------|

(Explicit engagement evidence required. If none: "No Champions identified — see Potential Champions under Influencers.")

#### Technical Evaluators

| Name | Title | Email | Status | Source |
|------|-------|-------|--------|--------|

#### Influencers

Group by named sub-bucket (Strategic Partnerships, Communications, Adjacent Marketing, Operations, Legal, HR, Potential Champions, etc.). One 5-column table per bucket that has contacts.

#### Recently Appointed (last 90 days)

| Name | Title | Appointment Date | Email | Status |
|------|-------|------------------|-------|--------|

These also appear in their primary category with a `RECENTLY APPOINTED` flag — this is a duplicated index for visibility.

### Key Stakeholders (top 3-5)

Richer profiles for the deep-researched contacts.

#### [Name] — [Title]
- **Role**: Economic Buyer / Champion / Technical Evaluator / Influencer:Sub-bucket
- **ZoomInfo counterpart**: mapped internal contact based on title (CEO ↔ ZoomInfo CEO, CRO ↔ ZoomInfo CRO, etc.; use GTM context for explicit mappings if defined)
- **Background**: career summary, time in role
- **Engagement history**: prior interactions, or "No prior engagement recorded"
- **Why they matter**: tied to role and account context
- **Flags**: `stale data`, `research data limited`, `RECENTLY APPOINTED`, source disagreements
- **Recommended approach**: specific to active pilots, current operational engagement, or pending decision moments

### Engagement Strategy

Specific to this account — not a generic playbook. Anchor each step to a named person and a real account-context signal (active pilot, recent appointment, contract date, coverage gap).

1. **Immediate priorities (next 2 weeks)**: top 3 actions, each tied to a specific person and signal.
2. **Coverage gaps**: specific empty persona slots — "No Finance stakeholder below the CFO; Director-level FP&A search recommended."
3. **Sequencing**: ordered outreach with named people and reasons.
4. **Multi-threading risk**: current single-thread dependencies and the moves to fix them.

### Excluded / Needs Verification

| Name | Reason | Recommended Action |
|------|--------|--------------------|

Use for: contacts confirmed departed via deep research, `NO_MATCH` failures with no fallback, account_research records flagged for data quality issues. Do **not** include in the main map.

### Next Steps

- `/zoominfo:enrich-contact` to deep-dive on any specific person
- `/zoominfo:find-similar` from a top contact to find similar personas at other accounts
- `/zoominfo:meeting-prep` ahead of any committee meeting
- `/zoominfo:build-list` to fill specific persona coverage gaps
- For anyone in **Excluded / Needs Verification**, run a fresh `search_contacts` with the relevant filters to find their successor
