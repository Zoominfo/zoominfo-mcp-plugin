# score-accounts — Phase 1 Research

Best-practice synthesis for the `score-accounts` skill. Internal artifact only — not referenced from SKILL.md; everything load-bearing here gets lifted into the skill.

## Goal of the skill

Given a list of accounts (mixed IDs / names / domains), produce a ranked output with:

1. A composite **score (0–100)** per account.
2. **Tier** assignment (A / B / C) with concrete recommended actions per tier.
3. **Component breakdown** — fit, intent, trigger contributions made explicit, so the seller can see WHY the score is what it is.
4. A **"why now"** sentence per account anchored on a specific signal — not the composite number.
5. The **working filter set / weight set** as a first-class artifact the user can save and refine.

This skill is the prioritization counterpart to `tam-sizer` (which scopes the universe) and `personalize-email` (which acts on a single prospect). It is iterative — the user adjusts weights, swaps axes, or refilters until the ranking matches their judgment.

## The four-axis framework

Industry consensus (6sense, Demandbase, MadKudu, HubSpot Breeze, Salesforce Einstein, the dozens of how-to guides reviewed):

| Axis | Question it answers | Primary data sources for ZI MCP |
|---|---|---|
| **Fit** | Does this account match our ICP? | `enrich_companies` (firmographics, employee count, revenue, geo, business model) + `get_gtm_context.icp_definitions` |
| **Intent** | Are they actively researching the topic? | `enrich_intent` with curated topics from GTM themes |
| **Trigger** | Is there a fresh event creating a window? | `enrich_news` (90d, PERSON/M&A/FUNDING/PRODUCT/FINANCIAL_RESULTS) + `enrich_scoops` (90d, all types) |
| **Engagement** | Are they already interacting with us? | ⚠️ NOT directly available in MCP. Partial signal via `account_research` for known accounts only. V1 surfaces as a gap; V1.1 could integrate. |

Each axis is scored 0–100 independently. The composite is a weighted sum. **Don't collapse the axes into a single hidden number** — sellers reject black-box scores; transparency is what makes the skill trusted.

## Weight benchmarks

Convergent industry recommendation:

| Source | Firmographic | Technographic | Intent | Engagement | Trigger | Notes |
|---|---|---|---|---|---|---|
| Pintel.ai / Cleanlist consensus | 35% | 25% | 15% | 15% | 10% | Simple, defensible default |
| 6-dim alternative | 30% | 20% | 15% | 15% | 10% (+10% ACV/LTV) | Adds economic outcome dimension |
| RollWorks / Salesmotion | 25–35% | 20–30% | 10–20% | 10–20% | 10–20% | Range, not fixed |

**V1 default weights for this skill (with tech rolled into firmographic given the MCP limitation):**

```
Fit:        45%   (firmographic + light technographic where available)
Intent:     25%
Trigger:    25%
Engagement:  5%   (placeholder; weight is rebalanced if engagement is unavailable)
```

These are **defaults, not rules**. The skill must:
- Expose the weights in the output.
- Accept user overrides in input.
- Re-rank when weights change without recomputing the underlying axes (cache the per-axis scores).

If engagement is unavailable for a run, redistribute its 5% proportionally across the other three axes and surface the gap.

## Scoring each axis (0–100)

### Fit (0–100)

Compare `enrich_companies` output to `get_gtm_context.icp` along these dimensions. Each dimension is a binary or banded match; points are awarded by table:

| Dimension | Max points | Banded scoring |
|---|---|---|
| Industry / sub-industry | 25 | Exact primary industry match = 25; secondary match = 15; adjacent = 8; none = 0 |
| Employee count band | 20 | In ICP band = 20; one band off = 12; two off = 4; outside range = 0 |
| Revenue band | 20 | Same as employee |
| Geography | 15 | In ICP country list = 15; in continent = 8; outside = 0 |
| Business model | 10 | B2B / B2C match = 10; mixed = 5; mismatch = 0 |
| Technographic (optional) | 10 | Uses a named tech-stack vendor in `get_gtm_context.tech_signals` = 10; else 0 — verify via `search_contacts` + `techAttributeTagList` for the top 25 contacts |

Sum to 100. Cache per account; reuse across weight changes.

### Intent (0–100)

For each account, compute against curated intent topics derived from the user's GTM strategic priorities:

1. `lookup` intent-topics with fuzzyMatch per GTM theme (one call per theme — multi-field fuzzyMatch is unreliable, per WS1 finding).
2. `enrich_intent` (companyId, topics: curated list, signalScoreMin: 60, last 30 days).
3. Score = `max(signalScore in window) × audienceStrengthFactor`.
4. Audience strength factor: A=1.0, B=0.85, C=0.7, D=0.55, E=0.4.
5. Cap at 100.

If no curated topics map to GTM themes → return 0 with a "no relevant topics configured" flag, weight redistributed.

If `enrich_intent` returns empty → return 0 with a "no intent activity" flag (a real signal — not a gap).

### Trigger (0–100)

Compute from `enrich_news` (last 90d, categories: `PERSON,MERGER_OR_ACQUISITION,FUNDING,PRODUCT,FINANCIAL_RESULTS`) and `enrich_scoops` (last 90d, all types).

For each candidate event:

```
event_score = signal_type_weight × recency_factor × buyer_relevance_factor
```

Where (lifted from `personalize-email`'s signal → pain map):

| Signal type | signal_type_weight |
|---|---|
| M&A (acquirer or acquiree), Funding round, New CEO/C-suite hire | 95 |
| Product launch, Hiring plans/surge, Earnings beat-or-miss | 75 |
| Partnership announcement, New office/facility | 55 |
| Pain-point scoop, Other PERSON moves | 45 |
| Generic press release | 25 |

Recency factor: 0–14 days = 1.0; 14–30 = 0.7; 30–60 = 0.4; 60–90 = 0.2; >90 = 0.

Buyer-relevance factor: 1.0 by default. (Optionally calibrate against the user's typical buyer persona — but this is more relevant for `personalize-email`'s seat-level inference than for the account-level signal here, so V1 keeps it at 1.0.)

**Account trigger score** = max(event_score) for that account, capped at 100. Record the winning event so it can be cited in "why now."

### Engagement (0–100, V1 placeholder)

V1 limitation: no direct engagement-data primitive. For accounts where `account_research` returns rich CRM/relationship context, infer a coarse score (e.g., "open deal" = 80, "past meeting" = 60, "cold" = 0). For accounts with no `account_research` history, return null and redistribute weight.

V1.1: integrate `account_research` more deeply or wait for CRM-engagement primitive.

## Composite & tier

```
composite = (fit × w_fit + intent × w_intent + trigger × w_trigger + engagement × w_engagement) / 100
```

Rounded to integer, 0–100 scale.

**Tier thresholds (industry-standard mapping):**

| Tier | Threshold | Recommended action |
|---|---|---|
| **A — Top priority** | composite ≥ 75 | Route to AE for personalized 1:1 outreach within 24h. Run `personalize-email` per contact. |
| **B — Emerging** | 50 ≤ composite < 75 | SDR-led structured sequence; ABM retargeting; nurture-to-meeting motion. |
| **C — Watchlist** | composite < 50 | Low-cost broad channels; monitor for tier-promotion signals (intent spike, fresh trigger). |

User can override thresholds in input (e.g., `tier_thresholds: {A: 80, B: 55}`).

## The "why now" line

For each account, produce **one sentence** explaining the most actionable reason this account is on the list *right now*. This is NOT the composite score in prose — it's the specific signal driving the score:

- Strong trigger event → cite the event with date. "New CEO appointed 12 days ago." / "Closed $40M Series C three weeks ago."
- High intent → cite the topic + score. "Spiked on 'data integration' (score 92, audience A) over the last 14 days."
- Strong fit + no fresh signal → cite the strongest fit attribute. "Perfect-fit ICP match — software, 500–999 employees, US-based — no fresh trigger; pursue on fit alone."
- Engagement-driven → "Active deal in flight; renewal due in 47 days."

If no defensible "why now" can be constructed (low fit + no intent + no trigger), the account is in Tier C and the "why now" is "low signal — monitor only." This is honest and useful.

## Resolution UX — handling name / domain / mixed input

The skill accepts a list with any mix of:
- ZoomInfo company IDs (numeric)
- Company names (free text)
- Company domains (URLs)
- A CSV / JSON with mixed identifiers

For non-ID inputs, resolution follows the **deterministic-first, then probabilistic** pattern from the entity-resolution literature:

1. **Domain → ID**: `search_companies` with `companyWebsite`. Domain match is usually deterministic (one company per domain). High confidence; auto-accept.
2. **Name → ID**: `search_companies` with `companyName`. If single high-confidence match (top score >> next), auto-accept. If multiple plausible matches (e.g., "Seismic" → Seismic the enablement co + Pulse Seismic the energy co + crypto Seismic), **surface to user before scoring**. List candidates with attributes (industry, employee count, geo) and let user confirm.
3. **Ambiguous / no match**: surface explicitly. Never silently skip — that breaks the resolution-accuracy guarantee.

V1 resolution gates:
- **Auto-accept** when (a) input is a numeric ZI ID; OR (b) input is a domain with exactly one match; OR (c) input is a name with exactly one match AND match score ≥ threshold.
- **Surface for confirmation** when (a) multiple plausible matches; OR (b) match score is borderline.
- **Fail explicitly** when no match. The user should see the unresolved input separately.

Resolution accuracy is the rubric bar — 100% on the resolution path is non-negotiable.

## Anti-patterns to fail-fast against

Embedded in SKILL.md self-check:

1. **Black-box composite.** A single number with no component breakdown. Always show fit / intent / trigger / engagement contributions.
2. **"Why now" = composite restated.** Saying "this account scores 82 because of strong fit and intent" is not a "why now." Cite the specific event/topic.
3. **Silent identifier resolution.** Picking one company silently when "Seismic" matches multiple. Surface and confirm.
4. **Fixed weights not exposed.** The user must see what weights produced the ranking and be able to change them.
5. **Tier without action.** A tier letter that doesn't come with a recommended next step is incomplete.
6. **Stale signal pretending to be fresh.** Trigger events >90 days old contribute 0; surface the gap rather than padding the score with a stale event.
7. **Generic "why now"** — "they're a good fit" applies to every account in the list. The why-now must be specific to this account.
8. **Ignoring missing axes.** If engagement is unavailable for the run, redistribute weight AND surface the gap. Don't pretend the axis exists.
9. **Auto-accept ambiguous resolution.** "Seismic" silently resolving to whichever match scored highest, when multiple plausible candidates exist.
10. **No iteration path.** Ranked output without an explicit "adjust weights / swap axes / refilter" affordance violates the iterative-refinement skill discipline.

## Output structure (per generation pass)

```
TL;DR — Account scoring · N accounts · Pass M
- Tier A: X accounts, Tier B: Y, Tier C: Z, Unresolved: W
- Top 3 by composite score, each with "why now"
- Weights used / axes-missing flags / resolution summary

Resolution summary (table):
- Resolved (N): name → ZI ID + match confidence
- Ambiguous (M): list candidates for each — user to confirm
- Failed (K): list inputs with no match

Ranked table:
| Rank | Account | Tier | Composite | Fit | Intent | Trigger | Engagement | Why now | ZI ID |

Weights & axes:
- fit: 45% (default)
- intent: 25%
- trigger: 25%
- engagement: 5% (or 0% if unavailable, redistributed)
- Axes missing this run: [engagement (no CRM signal), ...]

Iteration options:
1. Adjust weights
2. Tighten tier thresholds
3. Swap to alternative ICP definition
4. Refilter the list (remove tier C, etc.)
5. Drill into one account → hand off to `personalize-email`
6. Save final filter+weight set
```

## Comparison to internal email patterns (alignment-check)

No internal account-scoring agent doc supplied for this workstream (user confirmed). When one becomes available, re-check:

- Weight defaults — internal Pulse-style scoring may already publish defaults.
- Tier thresholds — internal product (Pulse) may use different bands.
- "Why now" prose style — should match internal voice if a production agent exists.
- Resolution UX — should match how `lookup`-style flows work in production today.

Until then, this skill carries the same patterns as `personalize-email` (always pull GTM context, iterative refinement, lift canonical-reference vocabulary).

## Sources

- [Best Account Prioritization Tools 2026 (Landbase)](https://www.landbase.com/blog/best-account-prioritization-tools)
- [Doing B2B account scoring the right way (Demandbase)](https://www.demandbase.com/blog/account-scoring/)
- [Why black-box account scoring kills your pipeline (GTM Engineer)](https://thegtme.com/p/why-black-box-account-scoring-kills)
- [Pocus AI Scoring: Account Prioritization That Actually Works](https://www.pocus.com/blog/introducing-ai-scoring-account-prioritization-that-actually-works)
- [Black Box Secrecy is Martech's Biggest Scandal (Demandbase)](https://www.demandbase.com/blog/black-box-secrecy-martech-scandal/)
- [ICP Scoring for B2B SaaS: Definition, Criteria & Formula (Pintel)](https://pintel.ai/blogs/icp-scoring-rubric-b2b-saas/)
- [ICP Scoring: Plain-English Guide (Cleanlist)](https://www.cleanlist.ai/glossary/icp-scoring)
- [Account Scoring: How to Rank and Prioritize (Salesmotion)](https://salesmotion.io/blog/account-scoring-guide)
- [Signal-Based Account Prioritization (HG Insights)](https://hginsights.com/solutions-use-case/signal-based-account-prioritization/)
- [B2B Buying Signals (ZoomInfo Pipeline)](https://pipeline.zoominfo.com/sales/b2b-buying-signals)
- [Entity Resolution Best Practices (Rudderstack)](https://www.rudderstack.com/blog/what-is-entity-resolution/)
- [Company Name Normalization Rules (Openprise)](https://www.openprisetech.com/blog/company-name-normalization-rules-and-best-practices/)
