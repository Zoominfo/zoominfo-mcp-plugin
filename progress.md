# Build Progress: Conversation Intelligence Skills

## Status: IN PROGRESS

**Started**: 2026-06-30
**Last session**: 2026-06-30
**Features completed**: 0 / 17

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

- **Action**: Harness setup.
- **Features completed**: None (setup only).
- **Next up**: Feature #1 — enhance meeting-prep (browse_engagements picker + CI synthesis).
- **Notes**: Skills are not registered in any manifest; adding a skill = new `skills/{name}/SKILL.md`.
