---
name: account-research
description: Produce a full intelligence brief on a target company — firmographics, CRM/account context, intent signals, recent news, scoops, and competitive landscape — framed by your GTM context and led with a TL;DR headline. Provide a company name, domain, ticker, or ZoomInfo company ID.
---

# Account Research

Produce a high-signal intelligence brief on a target company. Lead with a synthesized headline, suppress sections where data is thin, and tie next steps to specific people and topics surfaced during research.

## Input

The user will provide via `$ARGUMENTS`:
- A company name, domain, ticker, or ZoomInfo company ID (required)
- Optionally: topics of interest to focus the intent search (e.g., "AI/ML adoption")
- Optionally: a research context (e.g., "preparing for QBR", "competitive analysis")

## Workflow

1. **Get GTM context.** Call `get_gtm_context` first to retrieve your organization's offerings, ICP, personas, competitors, and strategic priorities. Use this to frame findings throughout. If empty, proceed without — and omit the GTM Fit section.

2. **Resolve the company.** Use `search_companies` (by `companyWebsite`, `companyName`, or `companyTicker`) or use the provided `companyId` directly. Extract the `companyId` from the top match.

3. **Fetch in parallel.** Steps that only need the `companyId` can run in parallel — `enrich_companies`, `account_research`, `enrich_news` (last 90 days, `pageSize: 20`), `enrich_scoops` (last 90 days, `pageSize: 15`), and `find_similar_companies`.

4. **Get intent signals.** Derive 10-15 candidate seed topics from the company's industry, your GTM offerings/strategic priorities, and any user-specified topics. **Validate every seed via `lookup` with `fieldNames: ["intent-topics"]` before calling `enrich_intent`** — only pass topic IDs that appear verbatim in the lookup response. If `enrich_intent` still returns a 400 with an "Invalid 'topics' requested: [X, Y]" message, parse the listed invalid topics from the error and retry without them. Call with `signalScoreMin: 60` and `sort: "-signalScore"`.

5. **Synthesize.** Cross-reference sources (a new CTO scoop + cloud migration intent = connect the dots). Apply these principles:
   - **News relevance**: prioritize PERSON / FUNDING / M&A / PRODUCT over GENERAL_PRESS_RELEASE over GENERAL_NEWS; dedupe items covering the same theme; trim to 5-7.
   - **Past-date flag**: if `account_research` surfaces dates in the past (renewal, contract end, last activity, scheduled meeting), flag them as needing verification — could be active negotiation, stale CRM sync, or a missed milestone.
   - **Cohort consistency**: if the `find_similar_companies` cohort spans inconsistent industries vs. the target, flag that the peer set is directional rather than exact.
   - **Section suppression**: skip the funding table for public mega-caps (just reference the ticker); skip GTM Fit if no GTM context; flatten scoops if only 1-3 returned; replace empty intent table with a one-line note.

6. **Write the headline last.** Re-read the body, then write the TL;DR at the top.

## Output Format

### TL;DR — [Company Name]

**Situation.** [2-4 sentences: who they are, the dominant story now, where the relationship stands.]

**Top 3 facts.** Three most consequential data points across all sources.

**Highest-leverage actions.** 1-3 concrete actions, each pointing at a specific person, pilot, topic, or moment.

---

### Company Snapshot

| Field | Value |
|-------|-------|
| Website | |
| Industry | |
| Employees | |
| Revenue | |
| HQ | |
| Type | (Public/Private) |
| Ticker | |
| Founded | |
| ZoomInfo ID | |

### GTM Fit

*Omit if no GTM context was returned.*

- **ICP Match**: industry, size, geography fit
- **Offering Relevance**: which products map to this account's signals
- **Competitive Presence**: any defined competitors in their news/scoops/stack
- **Persona Alignment**: do their org charts include your target personas

### Account Context

Summarize `account_research`: relationship status, engagement, deal context, named contacts. If any surfaced dates are in the past, note them with a verification prompt (could be active negotiation, stale CRM sync, missed milestone, or closed-deal lag — recommend confirming with the account team). If dates fall within the next 30 days, surface them in the TL;DR instead.

### Intent Signals

| Topic | Signal Score | Audience Strength | Category | Signal Date |
|-------|-------------|-------------------|----------|-------------|

Highlight the top 3 and tie them to your offerings or the user's stated context. Replace the table with a one-line note if zero signals returned.

### Recent News & Scoops

Group news by Financial / People / Product / General if 5+ items span categories; otherwise list flat. For each: headline, date, one-line summary, source URL. Then list scoops — group by Leadership Moves / Growth Signals / Strategic Moves / Risk Signals only if 4+ returned, otherwise flat. Call out timing opportunities (e.g., new CTO → vendor evaluation likely).

### Competitive Landscape

If the cohort's industries are inconsistent with the target, lead with a one-line caveat that peers are directional. Then show the top 10:

| # | Company | Industry | Employees | Revenue | Country | Similarity |
|---|---------|----------|-----------|---------|---------|------------|

Note patterns: direct competitors vs. adjacent players vs. peers; how the target compares on size and market position.

### Corporate Structure

- **Ultimate Parent / Parent**: if applicable
- **Funding**: total raised, most recent round + date + amount. For public mega-caps (revenue > $5B), replace with "Public — see ticker for capital structure."

### Key Takeaways & Next Steps

3-5 bullets connecting the dots across sources, framed by the user's context. Then suggest concrete next actions, each referencing a specific person, pilot, or topic surfaced above — not generic skill mentions. Examples:

- `/zoominfo:meeting-prep` for **[named contact]** — they own the [specific pilot/deal] flagged in Account Context
- `/zoominfo:buying-committee` against **[specific deal]** — gaps visible in current engagement
- Direct outreach: **[person]** about **[topic from intent or scoops]** — why now

Omit any line that doesn't have a concrete target.
