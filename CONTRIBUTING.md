# Contributing to zoominfo-mcp-plugin

Thanks for your interest in contributing. This plugin connects Claude Cowork to ZoomInfo's B2B intelligence platform. Contributions of all kinds are welcome — new skills, skill improvements, bug fixes, and documentation.

## Prerequisites

- [Claude Cowork](https://claude.ai/cowork) account
- A ZoomInfo account with API access (required to test skill changes end-to-end)
- Git and a GitHub account

## Project structure

```
.claude-plugin/
  plugin.json          # Plugin metadata (name, version, description, keywords)
  marketplace.json     # Marketplace listing configuration
.mcp.json              # MCP server registration — points to https://mcp.zoominfo.com/mcp
skills/
  build-list/
  enrich-company/
  enrich-contact/
  find-similar/
  recommend-contacts/
  <your-new-skill>/    # Each skill is a directory containing a SKILL.md
```

Skills are the primary contribution surface. Each skill is a natural-language workflow that orchestrates one or more ZoomInfo MCP tools.

## Making changes

1. Fork this repository and create a branch off `main`:

   ```bash
   git checkout -b your-branch-name
   ```

2. Make your changes (see skill authoring guide below).

3. Test your changes in Claude Cowork:
   - Install your fork as a local plugin in Cowork
   - Run through the skill's full workflow with real inputs
   - Verify output formatting, error paths, and edge cases

4. Open a pull request against `main`. Fill out the PR template.

## Skill authoring guide

### Anatomy of a skill

Each skill directory contains one file: `SKILL.md`. The file has two sections:

```markdown
---
name: skill-name
description: One-sentence description shown in the Cowork UI and marketplace.
---

# Skill Title

[Natural language instructions for Claude]
```

The frontmatter `name` must match the directory name exactly. The `description` is user-facing — make it specific and action-oriented.

### Available MCP tools

Skills orchestrate the ZoomInfo MCP server tools exposed at `https://mcp.zoominfo.com/mcp`. The tools available to skills are:

| Tool | Description |
|------|-------------|
| `lookup` | Resolve valid enum values for filter fields before searching |
| `search_contacts` | Search contacts by persona, company, and firmographic filters |
| `search_companies` | Search companies by firmographics, industry, tech stack, and geography |
| `enrich_contacts` | Enrich up to 10 contacts by email, name+company, phone, LinkedIn, or person ID |
| `enrich_companies` | Enrich up to 10 companies by name, domain, ticker, or company ID |
| `search_intent` | Find companies showing intent signals on subscribed topics |
| `search_scoops` | Find companies with recent news signals (leadership changes, expansions, etc.) |
| `find_similar_companies` | ML-powered similar company discovery |
| `find_similar_contacts` | ML-powered similar contact discovery scoped to a target company |
| `get_recommended_contacts` | AI-ranked contact recommendations at a target account |

### The lookup-first pattern

Always call `lookup` before any search to resolve valid enum IDs for filters. Do not guess or hardcode display names — use the IDs returned by `lookup`. This prevents PFAPI0001/PFAPI0003 invalid field errors.

```markdown
1. **Lookup metadata first** — before calling any other MCP tool, use `lookup` to load
   reference data for any fields relevant to the request. Use the returned `id` values
   (not display names) in all subsequent API calls.
```

### Skill writing best practices

- **Be specific about input formats.** List every accepted input variant (email, name+company, domain, ID) and map each to its API parameter.
- **Include a fallback path.** If primary enrichment fails, what should Claude try next? Specify it.
- **Define the output format explicitly.** Use markdown tables with headers. Specify which fields to omit if unavailable vs. which to flag as missing.
- **Surface data quality signals.** ZoomInfo accuracy scores matter — tell Claude when to flag a low score and what threshold to use.
- **Handle the cold-start case.** Some tools (e.g., `get_recommended_contacts` with `DEAL_ACCELERATION`) require CRM integration and may return sparse results. Explain this to the user.
- **Suggest next steps.** End each skill with actionable follow-on commands (e.g., "use `/zoominfo:enrich-company` for full details on any result").

### Adding a new skill

1. Create a directory under `skills/` matching your skill's name (lowercase, hyphenated):

   ```bash
   mkdir skills/your-skill-name
   ```

2. Create `skills/your-skill-name/SKILL.md` following the structure above.

3. Test end-to-end in Cowork before opening a PR.

4. In your PR description, include:
   - Which ZoomInfo MCP tool(s) the skill uses
   - Example inputs you tested
   - Any ZoomInfo entitlements required (e.g., WebSights, Intent, Scaling API)

### Improving an existing skill

Common improvements that are welcome:

- Adding undocumented but valid filter parameters
- Improving output formatting
- Adding edge case handling
- Improving the lookup-first pattern coverage
- Fixing incorrect parameter names

When improving a skill, note in the PR what specifically changed and why — include a before/after comparison if the change affects behavior.

## Versioning

The plugin version lives in `.claude-plugin/plugin.json`. Increment the patch version (`1.0.x`) for bug fixes and skill improvements. Increment the minor version (`1.x.0`) for new skills. The maintainers will handle version bumps on merge.

## Code of conduct

Be constructive and respectful. This is a community plugin — contributions should improve the experience for all ZoomInfo + Cowork users.

## Questions

Open a GitHub Discussion or file an issue if you're unsure about scope or approach before spending time on a PR.
