# Changelog

All notable changes to this plugin are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-09

### Added

- Gemini and Gemini Agent support via `.gemini-plugin/plugin.json`, sharing the root `skills/` and `.mcp.json` with the other clients.
- Validator check that the Gemini manifest's explicit `skills` list matches `skills/`.
- Publishing to the official MCP Registry (`server.json`).
- Cursor plugin (`.cursor-plugin/plugin.json`, `.cursor-plugin/marketplace.json`), connecting natively over HTTP.
- Codex plugin manifest (`.codex-plugin/plugin.json`) and brand assets (`assets/`).
- Conversation-intelligence and deal skills: `account-health`, `account-relationship-recap`, `ae-cs-handoff`, `call-coaching`, `call-recap`, `commitment-ledger`, `contact-relationship-recap`, `daily-brief`, `decision-process-mapper`, `draft-follow-up`, `email-thread-summarizer`, `engagement-timeline`, `exec-brief`, `mutual-action-plan`, `next-best-action`, `objection-blocker-tracker`, `qbr-prep`, `renewal-prep`.
- Signals skills: `why-now`, `company-intent-monitor`, `company-news-monitor`.
- Composite skills: `tam-sizer`, `score-accounts`, `score-leads`, `personalize-email`, `tech-stack-snapshot`, `competitor-analysis`.
- Research skills: `account-research`, `meeting-prep`, `buying-committee`.
- SKILL.md contract validator (`scripts/validate-skills.mjs`) and CI check.
- `CONTRIBUTING.md`.

### Changed

- Skills migrated from deprecated enrich tools to `enrich_company_signals`.
- `meeting-prep` adds a calendar meeting picker and prior-conversation context.
- All client manifests aligned to the same positioning and description.

### Fixed

- SKILL.md descriptions containing mid-sentence colons are now quoted, so their frontmatter parses.

## [1.0.1] - 2026-02-24

### Fixed

- Typos in the README and the `recommend-contacts` skill directory name.

## [1.0.0] - 2026-02-24

### Added

- Initial release: ZoomInfo hosted MCP server registration (`.mcp.json`), Claude plugin and marketplace manifests, and core skills (`build-list`, `enrich-company`, `enrich-contact`, `find-similar`, `recommend-contacts`) using a lookup-first workflow.
