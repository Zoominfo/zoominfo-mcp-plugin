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
| `account-prioritization` | Rank accounts by ICP fit, intent, trigger signals, whitespace, and explainable next-best action. |
| `account-research` | Produce an account intelligence brief with firmographics, relationship context, intent, news, and next actions |
| `build-list` | Build targeted account or contact lists from natural-language criteria |
| `build-tam` | Build a market or territory TAM using ZoomInfo company search counts, reusable ICP filters, sample accounts, and assumption notes. |
| `business-case-builder` | Draft a buyer-specific business case using account scale, pain hypotheses, relevant signals, stakeholders, and measurable outcome assumptions. |
| `buying-committee` | Map decision-makers, influencers, champions, and coverage gaps at a target account |
| `campaign-builder` | Turn an ICP, trigger, or product motion into a segmented campaign audience with personas, proof points, messaging angles, and activation fields. |
| `champion-tracking` | Track champion movement, title changes, departures, influence, and replacement contacts across target or customer accounts. |
| `clay-migration` | Convert Clay-style enrichment tables and workflows into governed ZoomInfo MCP skill runs with equivalent outputs and fewer manual provider chains. |
| `competitive-battlecard` | Build an account- or competitor-specific battlecard from firmographics, news, scoops, intent, buying committee, and positioning evidence. |
| `competitor-analysis` | Create fact-led competitor briefs using ZoomInfo data plus public context |
| `crm-cleanup` | Audit and repair CRM account/contact data using ZoomInfo matching, confidence scoring, duplicate detection, and safe writeback recommendations. |
| `deal-qualification` | Qualify an account or opportunity using firmographics, buyer fit, urgency signals, stakeholder coverage, and data confidence. |
| `deal-risk-scorer` | Score deal risk using account context, stakeholder coverage, trigger evidence, competitor signals, and missing buying-committee roles. |
| `demo-scripting` | Create account-specific demo talk tracks using company context, persona priorities, trigger signals, and competitive angles. |
| `discovery-brief` | Prepare a discovery-call brief with account context, buyer hypotheses, recent signals, personas, questions, and talk tracks. |
| `enrich-company` | Look up company profiles, firmographics, financials, structure, and growth signals |
| `enrich-contact` | Look up professional contact profiles, title, department, contact data, and accuracy signals |
| `find-similar` | Find lookalike companies or contacts based on a reference account or person |
| `icp-definition` | Derive a reusable ICP from target accounts, winners, hypotheses, or market criteria using ZoomInfo firmographic and signal data. |
| `meeting-prep` | Prepare for upcoming calls with account, attendee, relationship, and talking-point context |
| `personalize-email` | Draft outreach grounded in account, contact, intent, and trigger signals |
| `pipeline-hygiene` | Inspect open pipeline for stale deals, bad data, missing stakeholders, weak timing signals, and account-risk indicators. |
| `procurement-prep` | Prepare for procurement by mapping stakeholders, account structure, risk signals, vendor/contract clues, and negotiation angles. |
| `recommend-contacts` | Get AI-ranked contact recommendations at a target company |
| `renewal-risk-brief` | Assess renewal or expansion risk using account signals, champion status, stakeholder gaps, growth/contraction clues, and next actions. |
| `score-accounts` | Prioritize accounts by ICP fit, intent, trigger signals, and explainable scoring |
| `score-leads` | Rank inbound leads by fit, urgency, verified contact data, and recommended action |
| `stakeholder-mapper` | Map stakeholders at a target account by role, seniority, likely influence, buying-committee coverage, and recommended outreach order. |
| `tam-sizer` | Size a market or territory and produce a reusable ICP filter set |
| `tech-stack-snapshot` | Summarize detected technologies, displacement angles, and integration plays |
| `territory-planning` | Design or rebalance territories using ZoomInfo account counts, fit, coverage, trigger density, and rep-actionable segments. |
| `trigger-based-list-build` | Build account or contact lists around buying triggers such as intent, scoops, news, funding, hiring, technology, and leadership changes. |
| `waterfall-enrich` | Enrich company and contact records with ZoomInfo-first matching, field-level confidence, provenance, unresolved rows, and activation-ready output. |

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
