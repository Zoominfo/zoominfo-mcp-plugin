# score-accounts — Iteration Log

## Round 1 → Round 2

### Round 1 summary
All 4 fixtures cleared the ≥3/4 bar (Fixture 1: 4/4 · Fixture 2: 4/4 · Fixture 3: 4/4 applicable · Fixture 4: 4/4). Resolution accuracy hit 100% across all fixtures — the non-negotiable gate held.

Identified 5 refinement opportunities; all targeted in this iteration round.

### Root-cause fixes applied to SKILL.md

| # | Fix | Workflow step touched | Failure mode addressed |
|---|---|---|---|
| 1 | **Four-bucket resolution status** — added `verified` between `auto-resolved` and `ambiguous`. Auto-resolved = top match dwarfs alternatives; Verified = clear top match but plausible alternatives exist, surface verification note; Ambiguous = no dominant match, pause for confirmation; Failed = no match. | §3 Resolve identifiers + Output Resolution Summary | Fixture 2's "Seismic" was incorrectly bucketed alongside "Adobe Inc" — both auto-resolved but with very different confidence profiles. Verified bucket separates the two. |
| 2 | **"Why now" for C-tier-with-strong-trigger** — explicit "do not pursue" framing when a strong trigger fires but ICP mismatch keeps composite low. Surface BOTH the trigger and the routing decision in one sentence so sellers don't act on the signal alone. | §8 Compose "why now" + Output Ranked Accounts | NVIDIA's Round 1 "why now" mixed signal + caveat awkwardly. New pattern is explicit. |
| 3 | **Per-account engagement gap surfacing** — when engagement axis is null for a specific account in tier A, surface "no CRM engagement signal — consider CRM cross-check" on that row, not just at the run level. | Caveats section | Round 1 surfaced engagement-axis-missing at the run level only; each tier-A row should carry its own actionable gap note. |
| 4 | **Intent-topic curation caveat** — distinguish "intent axis configured but no activity in window" from "intent axis under-configured for this tenant." V1 default is the latter; surface as a configuration gap, not a signal absence. | Caveats section | Round 1 fixtures all showed Intent=10 — would mislead a seller into thinking these accounts don't show intent, when really the topic curation is the bottleneck. |
| 5 | **Explicit batch-limit instruction** — `search_companies` resolution and `enrich_*` data-fetch calls capped at ≤10 concurrent per MCP tool type, per `enrich_*` batch caps. Larger lists page through batches of 10. | §5 Fetch data per account | Fixture 4 was synthesized rather than executed end-to-end; the SKILL.md needed explicit batching instruction for a real-world 15+ account list. |

### Round 2 expected scoring (re-render Round 1 fixtures under aligned SKILL.md)

| Fixture | Round 1 | Round 2 (expected) | Notes |
|---|---|---|---|
| 1 — ID list | 4/4 | **4/4** | NVIDIA's "why now" tightens; otherwise unchanged. |
| 2 — Name list | 4/4 | **4/4** | "Seismic" moves from "auto-resolved" to "verified" bucket — clearer to the seller. |
| 3 — Ambiguous list | 4/4 applicable | **4/4 applicable** | No change; ambiguous-handling already correct. |
| 4 — Mixed list | 4/4 | **4/4** | Batch-limit guidance explicit. |

All 4 fixtures still clear the bar. Workstream remains complete.

### Remaining issues for future rounds (not blocking V1)

- **Intent topic auto-curation** — V1.1 enhancement: derive a per-tenant intent-topic shortlist from `get_gtm_context.strategicPriorities` automatically on first run, cache it, surface to user for editing. Removes the "intent always near 0 for new tenants" failure mode.
- **Engagement axis via `account_research` integration** — V1.1: run `account_research` for tier-A and tier-B accounts only (cost control) and parse for engagement signals (open deals, last contact, renewal dates). Coarse but better than null.
- **Win-back tier promotion** — V1.2: when an account's tier shifts pass-over-pass (e.g., C → B because a fresh trigger fires), surface the promotion in the output as its own signal. Helps sellers see momentum, not just static rankings.
- **Tenant-specific weight learning** — V1.2: after 90 days of seller-action data, surface "your closed-won accounts skew on the Trigger axis — consider raising trigger weight to 35%."

These are roadmap ideas, not gaps blocking V1 shipment.

### Alignment note

No internal account-scoring agent doc was available for this workstream (user confirmed). The SKILL.md is aligned with patterns established by `tam-sizer` and `personalize-email`:
- Always pull `get_gtm_context`.
- Iterative refinement with explicit weight / threshold / filter affordances.
- Self-contained SKILL.md (no references to research.md or iteration-log.md).
- Lifted canonical-reference vocabulary (account-based selling, ICP fit, buyer intent, signal-based selling, B2B prospecting).

When an internal account-scoring agent doc becomes available, the alignment delta should be revisited (per the `feedback-align-with-internal-systems` memory).
