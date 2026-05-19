---
name: score-leads
description: Score and prioritize leads or cold contacts (mixed ZoomInfo person IDs, emails, or name+company rows). Returns Hot / Warm / Cold tier per lead with a response-time SLA tuned to the use case (live inbound routing, MQL triage, event follow-up, PQL triage, content follow-up, SDR queue ordering), per-axis breakdown (person fit · account fit · source signal · trigger), a "why now" reasoning snippet per lead, and recommended next action with verified contact data. Resolution by email is deterministic; name+company surfaces verification when needed; typo'd emails fail explicitly rather than fall back. Iteratively refinable. Triggers on phrases like "score these leads", "which lead/contact should I call first", "prioritize my MQLs", "rank inbound", "who should I prioritize?", "tier this list".
---

# Score Leads

Tier leads as Hot / Warm / Cold with a response-time SLA tuned to the use case. Calls `get_gtm_context(detailed: true)` unconditionally, resolves leads by email (deterministic) or name+company (surface ambiguity), scores on four axes, and presents a **scannable** per-lead output with a specific "why now" reasoning snippet so the rep can trust the tier.

## The bar

1. **Tier and SLA are the first thing the rep sees** — not buried under TL;DR or component breakdown.
2. **Resolution accuracy 100%** — every input bucketed; email typos fail loudly, never silent fallback to name search.
3. **Every Hot lead carries verified contact data** — phone + accuracy score visible. Bad data on a Hot lead = dial-the-wrong-number failure.
4. **Every tier comes with a concrete next action** — "Direct dial 555-1234. Lead with [signal]." Not "engage promptly."
5. **Every lead carries a "why now" reasoning snippet** — citing the specific axis driver (person seat × source × fresh trigger / intent / prior engagement). Never the composite restated; never generic ("strong fit"). Same trust discipline as `score-accounts`.
6. **Output scannable in <30 seconds per row.** Component breakdown below the fold.

## Scope

Scores **individual leads**, not accounts. Use `score-accounts` for company-level prioritization. For Hot leads, chain to `personalize-email`.

## Input

- **Leads (required)** — list of ZI person IDs / emails / name+company rows / mixed CSV.
- **Source (recommended)** — `demo_request`, `pricing_inquiry`, `free_trial`, `product_signup`, `content_download_high_intent`, `content_download_low_intent`, `webinar_attended`, `webinar_registered`, `newsletter_subscribe`, `cold_inbound`, `unknown`. If missing, ask once then default to `unknown` (source = 50, flagged).
- **Use case (default `inbound_routing`)** — `inbound_routing`, `event_followup`, `pql_triage`, `content_follow_up`. Drives SLA tuning.
- **Weight overrides (optional)** — `{person, account, source, trigger}` summing to 100.
- **Tier thresholds (optional)** — `{Hot, Warm}`. Cold is the remainder.

## Four-axis framework

| Axis | Question | Source | Default weight |
|---|---|---|---|
| **Person fit** | Is this individual a buyer persona? | `enrich_contacts` | **35%** |
| **Account fit** | Does their employer match ICP? | `enrich_companies` vs `get_gtm_context.icp` | **25%** |
| **Source signal** | What action got us this lead? | User-supplied | **25%** |
| **Trigger / intent** | Fresh event or intent at the employer? | `enrich_news` + `enrich_scoops` + `enrich_intent` | **15%** |

Weights overridable. Each axis 0–100; composite is the weighted sum.

## Tier + SLA (varies by use case)

SLA defaults below. `inbound_routing` is the live-triage motion where speed-to-lead dominates; other motions relax accordingly. Pick what fits — don't manufacture urgency the motion doesn't need.

| Tier | Composite | `inbound_routing` | `event_followup` / `pql_triage` | `content_follow_up` | Recommended action |
|---|---|---|---|---|---|
| **Hot 🔥** | ≥ 75 | < 5 min | < 1 hr | < 4 hr | Direct dial / personal outreach. Chain to `personalize-email`. |
| **Warm 🌤** | 50–74 | < 1 hr | same day | < 24 hr | SDR sequence with personalized opener. Multi-touch cadence. |
| **Cold ❄️** | < 50 | < 24 hr | < 48 hr | weekly nurture | Nurture cadence; tag for content drip; do not call. |

For high-intent sources (`demo_request`, `pricing_inquiry`, `free_trial`) in live-triage mode, fast response materially lifts qualification rate. Outside live-triage, the right SLA is longer.

## Resolution (four-bucket, lead-specific)

- **Auto-resolved** — high confidence; score immediately.
- **Verified** — match found with caveats (common name at large co); surface verification note.
- **Ambiguous** — multiple plausible matches, no clear winner; pause scoring.
- **Failed** — no match. **Never silently fall back to alternate identifier paths.**

Routing by type:
- **Numeric person ID** → auto-resolved.
- **Email** → `enrich_contacts(email)`. Email is a unique identifier. Match → auto-resolved. No match → failed. **Do NOT auto-route to name search** — a typo'd email (e.g., `firstname@compny.com`) must not silently resolve to a different real person.
- **Name + company** → `enrich_contacts(firstName/lastName/companyName)`. Single high-accuracy match → auto-resolved. Multiple plausible → verified with note. No match → failed.
- **Free-text "John Smith at Acme"** → parse and route to name+company path.

100% resolution accuracy is the gate.

## Workflow

### 1. Pull GTM context (always)
`get_gtm_context(detailed: true)`. Capture personas, ICP, strategic priorities (for intent-topic curation).

### 2. Honor input data first
Use user-supplied source / weights / thresholds / use case. If `source` is missing on a multi-row list, ask once then default to `unknown` (50, flagged).

### 3. Resolve identifiers
Per the four-bucket rules. Batch in groups of ≤10 concurrent.

### 3.5. Relationship-context pre-flight (mandatory)

Tag each lead's **company** against GTM context:
- **`competitor`** ⚔️ — in `get_gtm_context.competitors`. Hard-warn — most inbound from competitors is talent or competitive intel.
- **`customer`** 🤝 — in `get_gtm_context.customers` / `proof_bank`. Reroute to `expansion` / `discovery_follow_up`.
- **`partner`** 🔗 — in `get_gtm_context.partners`. Co-sell framing.
- **`prospect`** — default.

The relationship tag appears in the headline before the tier emoji.

For Hot leads at `customer` or `competitor` companies: pause before pushing to cold-outbound AE; surface the routing question first.

### 4. Curate intent topics (only if trigger weight > 0)
From `get_gtm_context.strategicPriorities`, derive 5–10 topics via `lookup intent-topics fuzzyMatch=<theme>` — one call per theme. If no topics resolve, trigger weight = 0; redistribute.

### 5. Fetch data per lead (parallel, batched ≤10; chunked for large lists)
- `enrich_contacts(personId, fields: jobTitle, managementLevel, department, contactAccuracyScore, hasDirectPhone, hasMobilePhone, hasEmail, directPhone, mobilePhone, email)`.
- `enrich_companies(zoominfoCompanyId, fit-scoring fields)`.
- `enrich_news` + `enrich_scoops` for the employer — only if trigger weight > 0.
- `enrich_intent` with curated topics — only if trigger weight > 0.

**Batch + context-window discipline.** Process in **chunks of ~25 leads** end-to-end (resolve → fetch → score → compose row → write chunk → discard raw payloads) before moving to the next chunk. Don't accumulate full raw enrichment payloads for hundreds of leads in working context — once per-axis scores + the winning signal/topic strings are captured per lead, drop the rest. For >50-lead lists, summarize completed chunks into running totals (tier distribution, top-Hot list, missing-axes counts) and discard their per-lead breakdowns from context.

### 6. Score each axis

**Person fit (0–100)** — compare `enrich_contacts` to `get_gtm_context.buyerPersonas`:

| Dimension | Max | Banded |
|---|---|---|
| Management level | 30 | C = 30 · VP = 25 · Director = 18 · Manager = 10 · Non-Manager = 3 |
| Department | 25 | Primary persona dept = 25 · adjacent = 15 · unrelated = 0 |
| Job-title keyword | 20 | Exact = 20 · partial = 10 · none = 0 |
| Contact accuracy | 15 | ≥95 = 15 · 85–94 = 10 · 75–84 = 5 · <75 = 0 |
| Contact data completeness | 10 | email + direct + mobile = 10 · email + one phone = 7 · email only = 4 · none = 0 |

**Account fit (0–100)** — industry 30 · employee band 25 · revenue band 20 · geo 15 · business model 10.

**Source signal (0–100):**

| Source | Score |
|---|---|
| `demo_request` / `pricing_inquiry` | 100 |
| `free_trial` / `product_signup` | 90 |
| `content_download_high_intent` (comparison, RFP, pricing guide) | 75 |
| `webinar_attended` | 60 |
| `webinar_registered` | 50 |
| `content_download_low_intent` / `cold_inbound` | 35 |
| `newsletter_subscribe` | 25 |
| `unknown` | 50 (default; flag) |

**Trigger / intent (0–100)** — same logic as `score-accounts`, with **seat-fit modifier**:
- `event_score = signal_type_weight × recency_factor × seat_fit`.
- Signal weights: 95 (M&A, funding, C-suite hire) · 75 (product launch, hiring surge, earnings) · 55 (partnership, new facility) · 45 (pain-point scoop, other PERSON moves) · 25 (generic press).
- Recency: 0-14d = 1.0 · 14-30d = 0.7 · 30-60d = 0.4 · 60-90d = 0.2 · >90d = 0.
- **Seat fit:** if event maps to the lead's seat (new CFO → CFO seat; product launch → CRO/CMO seat; hiring surge in dept X → leader of dept X) → 1.0. Otherwise 0.5. Prevents company-level triggers from inflating irrelevant leads.
- Intent: `max(signalScore × audienceStrengthFactor)`. A=1.0 · B=0.85 · C=0.7 · D=0.55 · E=0.4.
- Take max(trigger event, intent). Cap 100.

### 7. Compute composite + assign tier
```
composite = round((person × w_p + account × w_a + source × w_s + trigger × w_t) / 100)
```
Per Hot/Warm/Cold thresholds.

### 8. Compose the per-lead row

First 30 seconds of read must contain, in order:

1. **Relationship tag** (if non-default): ⚔️ / 🤝 / 🔗.
2. **Tier emoji + label.**
3. **SLA** — tuned to the use case (see Tier + SLA table).
4. **Quality flags inline with SLA:**
   - `⚠️ verify title (record Xmo old)` — when `lastUpdatedDate` >6mo.
   - `📱 mobile only` vs `☎️ direct line`.
   - `⚠️ acc <85` — low contact-accuracy.
5. **"Why now" reasoning snippet** — one line, anchored on the strongest specific signal:
   - **Strong person + source + trigger** → "VP-Sales seat × demo request 3h ago × Series B closed 8d ago."
   - **High-source-only** → "Pricing inquiry from VP at perfect-ICP company; no fresh trigger."
   - **Trigger-anchored** → "Fresh CFO appointment 5d ago × CFO-seat lead — trigger × seat = direct match."
   - **Intent-driven** → "Spiked on '[topic]' (score 92, audience A) over 14d."
   - **Engagement-driven** (from `account_research`) → "Open opp at this account; named champion engaged 6d ago."
   - **Low signal across axes** → "Low signal — monitor only."
   Never restate the composite. Never use generic phrasing ("strong fit and engagement") — that applies to every Hot lead and tells the rep nothing.
6. **Recommended next action** — concrete, with phone number / channel.
7. **Contact data line** — email · phone · accuracy.

Example (stale-but-high-accuracy Hot lead, mobile only, `inbound_routing`):

```
🤝 🔥 Hot · Call within 5 min ⚠️ verify title (record 11mo old) · 📱 mobile only · acc 95
[First Last] · [Title] · [Company]
Why now: [Trigger event] X days ago × [seat] = direct match. (Source: [demo_request].)
Recommended: Direct dial 555-XXXX (mobile, verify title before dialing). Lead with [angle].
```

Component breakdown shown BELOW THE FOLD.

### 9. Self-check before output

- ☑ Tier + SLA (use-case-appropriate) visible in the first row of every output.
- ☑ Hot leads have verified phone + accuracy ≥85, or flag fires.
- ☑ **"Why now" snippet** on every lead — specific axis driver, never composite restated, never generic.
- ☑ Recommended next action is concrete with channel + signal.
- ☑ Component breakdown below the fold.
- ☑ Every input bucketed (auto-resolved / verified / ambiguous / failed) — none silently dropped.
- ☑ Failed emails NOT silently routed to name search.
- ☑ Source missing → flagged in caveats, not silently defaulted.
- ☑ Each row readable in <30s.
- ☑ Batch chunked when N > 25; intermediate payloads dropped from context.
- ☑ Iteration options offered.

### 10. Present + offer iteration

1. **Accept** — chain to `personalize-email` per Hot.
2. **Adjust weights.**
3. **Tighten / loosen thresholds.**
4. **Refilter** — show only Hot, exclude seats.
5. **Drill into a lead.**
6. **Add leads.**
7. **Backfill source** for unknowns.

Re-execute step 5 only when lead list changes; otherwise recompute from cached axis scores.

## Anti-patterns — fail-fast checklist

1. **Long preamble before the tier label.**
2. **Silent email→name fallback** on typo'd email.
3. **Source defaulted without flagging.**
4. **Generic "why now"** — "strong fit and engagement" applies to every Hot lead. Each row must cite the specific driver.
5. **Composite-as-rationale.** Re-stating the score number instead of the axis driver.
6. **Tier without SLA.**
7. **Hot lead with low-accuracy unflagged.**
8. **Component breakdown above the fold.**
9. **No drill-down to `personalize-email`** for Hot.
10. **Auto-accepting ambiguous matches** (e.g., 8 same-named contacts at a large enterprise).
11. **Forcing the live-triage SLA onto a non-live-triage use case.** Event follow-up, PQL triage, and content nurture motions have their own SLA bands; using the inbound-routing 5-min framing on them burns rep capacity on the wrong leads.

## Fallback rules

- **`get_gtm_context` empty** → use user-supplied personas/ICP if any; flag.
- **Source missing** → ask once; else 50 with flag.
- **Email no match** → failed; do NOT fall back to name search. If domain edit-distance ≤2 from a known-company domain (from GTM context or batch's resolved set), suggest the closest (e.g., `firstname@compny.com` → "did you mean `firstname@company.com`?").
- **Name + company multi-match** → verified with note OR ambiguous.
- **Intent topics unconfigured** → trigger weight = 0; redistribute.
- **`enrich_news` + `enrich_scoops` empty** → trigger = 0; don't pad.
- **Contact accuracy <75** → flag on the row; recommend verification before dialing.

Never block tiering on a single missing axis. Never invent contact data or source.

## Output Format

### TL;DR — Lead Scoring · N leads · Pass [M]

*Use case: [restate]. SLA band: [restate]. Weights · Thresholds Hot≥[X] · Warm[Y–Z].*

**Tier distribution:** 🔥 Hot: X · 🌤 Warm: Y · ❄️ Cold: Z · ❌ Unresolved: W.

**🔥 Hot leads** (SLA per use case):

🔥 **Jordan Smith** · VP Sales at Acme Corp · **[SLA]** · *Why now: demo request × VP-Sales seat × fresh CEO hire 8d ago* · 📞 555-123-4567 · ✉ jordan@acme.com · acc 98
🔥 [next Hot lead...]

Hot listed first.

---

### Resolution Summary

| Input | Resolved To | ZI ID | Status |
|---|---|---|---|

`Status` legend: ✅ Auto-resolved · 🔍 Verified · ⚠️ Ambiguous · ❌ Failed.

### Ranked Lead List

*Hot first → Warm → Cold. Each row <30s read.*

| Tier | Name | Title | Company | SLA | Why now | Contact | Acc | Composite |
|---|---|---|---|---|---|---|---|---|

### Component Breakdown (below the fold)

| Lead | Person | Account | Source | Trigger | Composite | Tier |
|---|---|---|---|---|---|---|

### Weights & Axes Used

```
person:  [%]
account: [%]
source:  [%]
trigger: [%]
```

### Recommended Actions per Tier

SLAs adapt to the use case (see Tier + SLA table).

- **🔥 Hot — SLA per use case.** Direct dial / personal outreach. Chain to `personalize-email`. Verify phone if acc <85.
- **🌤 Warm.** SDR sequence; multi-touch cadence sized to use case.
- **❄️ Cold.** Nurture; content drip; do not call.

### Iteration Options

1. Accept → chain to `personalize-email`.
2. Adjust weights.
3. Tighten thresholds.
4. Backfill source for unknowns.
5. Drill into a lead.
6. Add leads.

### Caveats (when relevant)

- **Source missing on N leads** — defaulted to 50; backfill for precision.
- **Failed resolutions** — N unresolved; review.
- **Low contact accuracy on Hot leads** — N have acc <85; verify phone before dialing.
- **Trigger axis configured-low** — per-tenant intent-topic curation needed.
- **GTM-context gap** — personas sparse; person-fit reduced.
- **Stale records** — N leads' records >12mo old; current title may have changed.

### Final Filter + Weight Set (on accept)

```json
{
  "weights": {"person": 35, "account": 25, "source": 25, "trigger": 15},
  "tier_thresholds": {"Hot": 75, "Warm": 50},
  "buyer_personas": [...],
  "intent_topics": ["..."],
  "use_case": "inbound_routing",
  "_meta": {"lead_count": ..., "tier_distribution": {...}, "axes_missing": [...], "pass_count": ...}
}
```

### Chain Targets

- `personalize-email` per Hot lead → drafts grounded in the same axis driver that tiered the lead.
- `score-accounts` on the leads' companies → company-level prioritization alignment.
- `find-similar` on a Hot lead → lookalike prospects at same / similar companies.
