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

## Try Asking

- "Help me prepare for a meeting with Apple's VP of Marketing this afternoon."
- "Build me a list of SaaS companies in the UK with 200-500 employees using Salesforce."
- "Find companies showing high buyer intent on data observability in the last 30 days."

## Prerequisites

- An LLM client or agent environment that supports MCP and/or local plugin manifests
- A ZoomInfo account with the appropriate API access and product entitlements

## MCP Server

The plugin registers ZoomInfo's hosted MCP server (`https://mcp.zoominfo.com/mcp`). Authentication is handled through your ZoomInfo account via OAuth — no API keys are stored in this repo. Two registration styles are used depending on the client's MCP implementation:

**Direct HTTP** — for clients whose MCP runtime completes the OAuth handshake natively (Claude, Codex). Defined in `.mcp.json`:

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

**Local stdio bridge (`mcp-remote`)** — for Cursor, whose native client cannot complete this server's OAuth discovery directly. `mcp-remote` runs the OAuth flow locally (opening a browser on first use, then caching and refreshing tokens) and bridges to the client over stdio. Defined in `mcp.json`:

```json
{
  "mcpServers": {
    "zoominfo": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@0.1.16",
        "https://mcp.zoominfo.com/mcp",
        "--static-oauth-client-metadata",
        "{\"scope\":\"openid profile email offline_access zi_api zi_mcp api:data:mcp\"}"
      ]
    }
  }
}
```

> The `mcp-remote` bridge requires Node.js (`npx`) on the local machine. On first connection it opens a browser for ZoomInfo sign-in; subsequent launches reuse cached tokens.

## Client Support

This repository includes metadata for multiple plugin-capable client environments:

| Path | Purpose |
|---|---|
| `.mcp.json` | MCP server registration (Claude / Codex) |
| `mcp.json` | MCP server registration (Cursor) |
| `.codex-plugin/plugin.json` | Codex/OpenAI plugin metadata |
| `.claude-plugin/plugin.json` | Claude plugin metadata |
| `.claude-plugin/marketplace.json` | Claude marketplace metadata |
| `.cursor-plugin/plugin.json` | Cursor plugin metadata |
| `.cursor-plugin/marketplace.json` | Cursor marketplace metadata |
| `skills/` | Task-specific workflows usable by clients that support skills |

Install or register the plugin according to your client's plugin or MCP workflow. For local development, clone this repository and point your client at the repo root or relevant manifest path.

```bash
git clone https://github.com/Zoominfo/zoominfo-mcp-plugin.git
```

## Skills

Skills are task-focused playbooks the agent follows to return structured outputs (briefs, tables, scores, emails) instead of raw tool JSON. Trigger them with `/skill-name` or plain language ("prep me for a meeting with Acme"); the agent can also select the right skill automatically when your request matches.

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
.claude-plugin/
  plugin.json
  marketplace.json
.codex-plugin/
  plugin.json
.cursor-plugin/
  plugin.json
  marketplace.json
.mcp.json            # direct HTTP registration (Claude / Codex)
mcp.json             # mcp-remote bridge registration (Cursor)
assets/
  zoominfo-logo.svg
  zoominfo-logo-dark.svg
  zoominfo-logomark-red.svg
skills/
  */SKILL.md
LICENSE
```

## License

[MIT](LICENSE)
