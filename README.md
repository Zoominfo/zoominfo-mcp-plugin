# ZoomInfo Plugin for Claude Cowork

Search companies and contacts, enrich leads, find lookalikes, and get AI-ranked prospect recommendations — all from inside [Claude Cowork](https://claude.ai/cowork).

This plugin connects Claude to the [ZoomInfo](https://www.zoominfo.com) MCP server, giving it access to ZoomInfo's B2B intelligence platform through a set of purpose-built skills.

## Prerequisites

- [Claude Cowork](https://claude.ai/cowork)
- A ZoomInfo account with API access

## Installation

Install from the Cowork plugin marketplace, or clone this repo and point Cowork at it:

```bash
git clone https://github.com/zoominfo/zi-mcp-plugin.git
```

## Skills

| Skill | Description |
|---|---|
| **enrich-company** | Look up a company's full ZoomInfo profile — firmographics, growth signals, corporate structure |
| **enrich-contact** | Look up a person's professional profile — title, department, email, phone, accuracy score |
| **lead-enrichment** | Bulk enrich up to 10 contacts or companies at a time from any format of input |
| **build-list** | Build a targeted contact or company list from natural language criteria |
| **find-buyers** | Identify and prioritize the best contacts to engage at a target account |
| **find-lookalikes** | Find companies similar to a reference company using ZoomInfo's ML similarity model |
| **prospect-research** | Build a concise prospect brief with company overview, key signals, and outreach angles |
| **account-plan** | Build a strategic account plan with buying committee mapping and engagement strategy |
| **competitive-intel** | Build a competitive intelligence brief — leadership, org structure, growth signals, peer set |
| **meeting-prep** | Build a pre-meeting brief with attendee profiles, stakeholder gaps, and a conversation guide |
| **cold-email** | Write a hyper-personalized cold email using ZoomInfo enrichment and web research |

## How it works

The plugin registers ZoomInfo's hosted MCP server (`https://mcp.zoominfo.com/mcp`) and exposes the skills above as natural-language workflows. Each skill orchestrates multiple ZoomInfo API calls — lookups, searches, enrichment, similarity — and formats the results into actionable output.

No API keys are configured in this repo. Authentication is handled through your ZoomInfo session.

## Project structure

```
.claude-plugin/
  plugin.json          # Plugin metadata (name, version, description, keywords)
  marketplace.json     # Marketplace listing configuration
.mcp.json              # MCP server registration
skills/
  account-plan/        # Each skill is a directory with a SKILL.md
  build-list/
  cold-email/
  competitive-intel/
  enrich-company/
  enrich-contact/
  find-buyers/
  find-lookalikes/
  lead-enrichment/
  meeting-prep/
  prospect-research/
```

## License

[MIT](LICENSE)
