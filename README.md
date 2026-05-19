# ZoomInfo MCP Plugin

Use [ZoomInfo](https://www.zoominfo.com) go-to-market intelligence from LLM clients that support MCP servers, plugin manifests, and/or skills.

This repo packages ZoomInfo's hosted MCP server with client-specific plugin metadata and task-focused skills for sales, marketing, and revenue workflows. It is intended to work across supported LLM clients rather than being tied to a single provider.

## What It Enables

- Find companies, contacts, and buying committee members
- Enrich account, lead, and contact records with business information
- Build targeted account and contact lists
- Identify similar companies, similar contacts, and recommended contacts
- Research accounts, competitors, markets, intent signals, and technology stacks
- Prepare for sales calls, prioritize inbound leads, and personalize outreach
- Size TAM and refine ICP or territory filters

## Prerequisites

- An LLM client or agent environment that supports MCP and/or local plugin manifests
- A ZoomInfo account with the appropriate API access and product entitlements

## MCP Server

The plugin registers ZoomInfo's hosted MCP server:

```json
{
  "mcpServers": {
    "zoominfo": {
      "type": "http",
      "url": "https://mcp.zoominfo.com/mcp"
    }
  }
}
```

Authentication is handled through the connected ZoomInfo account/session. No API keys are stored in this repo.

## Client Support

This repository includes metadata for multiple plugin-capable client environments:

| Path | Purpose |
|---|---|
| `.mcp.json` | MCP server registration |
| `.codex-plugin/plugin.json` | Codex/OpenAI plugin metadata |
| `.claude-plugin/plugin.json` | Claude plugin metadata |
| `.claude-plugin/marketplace.json` | Claude marketplace metadata |
| `skills/` | Task-specific workflows usable by clients that support skills |

Install or register the plugin according to your client's plugin or MCP workflow. For local development, clone this repository and point your client at the repo root or relevant manifest path.

```bash
git clone https://github.com/Zoominfo/zoominfo-mcp-plugin.git
```

## Skills

| Skill | Description |
|---|---|
| `account-research` | Produce an account intelligence brief with firmographics, relationship context, intent, news, and next actions |
| `build-list` | Build targeted account or contact lists from natural-language criteria |
| `buying-committee` | Map decision-makers, influencers, champions, and coverage gaps at a target account |
| `competitor-analysis` | Create fact-led competitor briefs using ZoomInfo data plus public context |
| `enrich-company` | Look up company profiles, firmographics, financials, structure, and growth signals |
| `enrich-contact` | Look up professional contact profiles, title, department, contact data, and accuracy signals |
| `find-similar` | Find lookalike companies or contacts based on a reference account or person |
| `meeting-prep` | Prepare for upcoming calls with account, attendee, relationship, and talking-point context |
| `personalize-email` | Draft outreach grounded in account, contact, intent, and trigger signals |
| `recommend-contacts` | Get AI-ranked contact recommendations at a target company |
| `score-accounts` | Prioritize accounts by ICP fit, intent, trigger signals, and explainable scoring |
| `score-leads` | Rank inbound leads by fit, urgency, verified contact data, and recommended action |
| `tam-sizer` | Size a market or territory and produce a reusable ICP filter set |
| `tech-stack-snapshot` | Summarize detected technologies, displacement angles, and integration plays |

## Project Structure

```text
.codex-plugin/
  plugin.json
.claude-plugin/
  plugin.json
  marketplace.json
.mcp.json
assets/
  zoominfo-logo.svg
  zoominfo-logo-dark.svg
  zoominfo-logomark-red.svg
skills/
  */SKILL.md
testing/
  test notes and assessments
```

## License

[MIT](LICENSE)
