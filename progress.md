# Build Progress: Conversation Intelligence Skills

## Status: COMPLETE

**Started**: 2026-06-30
**Last session**: 2026-06-30
**Features completed**: 22 / 22

## Current State

- Branch `feat/conversation-intelligence-skills` off `main`.
- Harness scaffolding created: `feature_list.json` (17 skills), `init.sh`, `validate_skills.mjs`.
- Building on the proven ZoomInfo SKILL.md pattern (see `skills/meeting-prep`, `skills/account-research`).
- New tools in play: `browse_engagements`, `conversation_intelligence` (plus `account_research` /
  `contact_research` for supporting context).

## Canonical pattern for these skills

- Frontmatter: `name` (kebab, == dir) + rich third-person `description` (what / when / disambiguation / output).
- Tools referenced unqualified, matching existing skills.
- Prerequisites note: Browse-Engagements skills need an active calendar/email/meeting integration;
  CI needs >=1 connected email or meeting source. On no data, say so and point to the ZoomInfo admin.
  account_research / contact_research / conversation_intelligence consume AI credits.
- Engagement-selection pattern: when nothing is named, browse_engagements -> numbered shortlist ->
  user picks before spending CI/research credits.
- CI discipline: one ID per call (engagement / company / contact); never ask CI for topic search,
  call-type filtering, long-horizon trend, or counting (its documented limits).
- Synthesis: source tagging, past-date flags, section suppression, evidence-only (ask before
  asserting unsupported claims), TL;DR last. Compact, high-signal output.

## Verification approach

- Review-only (no live staging-MCP calls; the user tests in prod once tools are live).
- Per skill: `bash init.sh` passes + a skeptical reviewer subagent checks the canonical pattern.

## Session Log

### Session 1 — 2026-06-30

- **Action**: Built all 17 skills (P0-P3) on the proven ZoomInfo pattern.
- **Features completed**: 17 / 17.
- **Verification**: three skeptical review-only evaluators (P0; P1; P2-P3). Findings applied:
  - meeting-prep: explicit zoominfoCompanyId/companyId handoff + userIntent on the picker.
  - daily-brief: CI-limitation guardrail + tighter credit-confirm threshold.
  - call-coaching, draft-follow-up, call-recap: corrected call resolution — browse_engagements
    filters by company/contact ID + date, NOT by call name; resolve the account first, then pick.
  - next-best-action: confirm ambiguous match before spending credits.
  - objection-blocker-tracker: ask for scope if none supplied.
  - exec-brief: only run contact_research on named/surfaced attendees (avoid blind credit spend).
  - ae-cs-handoff: cap to 2-4 highest-signal engagements (per-engagement CI cost).
  - account-relationship-recap / draft-follow-up / call-coaching: label browse_engagements as free.
### Session 2 — 2026-06-30 (additions)

- **Action**: Added 5 more skills beyond the original 17.
  - Deal-cycle: `mutual-action-plan` (#18), `qbr-prep` (#19) — recent calls + per-engagement CI;
    qbr-prep adds an account_research snapshot.
  - Signals (enrich_company_signals): `why-now` (#20, + get_gtm_context/account_research/WebSearch),
    `company-intent-monitor` (#21, INTENT), `company-news-monitor` (#22, NEWS+SCOOP).
- **Verification**: skeptical review-only evaluators on both batches; all SHIP. Signals skills
  correctly use DATA credits (not AI), the 12-month under-management exemption, and add NO
  engagement-integration prerequisite (that is only for browse_engagements/CI skills).
- **Status**: 22 / 22 complete. Ready to PR.
- **Notes**: Skills are not registered in any manifest; adding a skill = new `skills/{name}/SKILL.md`.
  Follow-up (separate, in gtm-ai): run `/sync-marketplace zoominfo --force` to regenerate marketplace
  listings for the 21 new + 1 updated skill, then PR those.
