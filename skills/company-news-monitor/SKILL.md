---
name: company-news-monitor
description: Monitor recent news and business events for a company and deliver a quick digest. Uses company signals scoped to news and scoops for a single account, grouped by type and recency, with a "so what" for each. Identify the company by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone asks "what's the latest news on Acme", "any recent developments at this account", "catch me up on what's happening there", or wants a news digest before a touchpoint.
---

# Company News Monitor

A fast read on what has happened at an account lately, and which of it is worth acting on.

## Prerequisites

`enrich_company_signals` charges data credits — each news article or scoop returned counts as a record, but companies already under management (enriched within the last 12 months) are free. `get_gtm_context` (optional, for relevance flagging) is free. News and scoop availability depends on your ZoomInfo package.

## Input

Provided via `$ARGUMENTS`:

- **Company** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`. If none is supplied, ask which company.
- **Lens** (optional) — e.g. "anything about expansion", "leadership changes only". Filters the digest.

## Workflow

1. **Resolve the company.** Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
2. **Pull news and events.** Run `enrich_company_signals` with `signalTypes: ["NEWS", "SCOOP"]` for the company.
3. **Add a relevance lens (optional).** If useful, call `get_gtm_context` (free) so you can flag items that touch your offerings, a competitor, or a known priority.
4. **Build the digest.** Group items by type (funding, M&A, product, leadership/executive moves, expansion, financial results, partnerships, and general news), most recent first. For each, give the date, the headline, a one-line "so what", and the source. Do not editorialize beyond what the item supports.

## Output Format

### News & developments — [Company]

Grouped, most recent first:

**[Category]**
- **[date]** — [headline]. *So what:* [one line]. [source]

**Worth acting on** — the one or two items that create a timely outreach opening, if any, with the angle. Omit if nothing rises to that bar.

**If nothing recent** — say there is no notable recent news or scoop activity on file rather than padding the digest with stale or trivial items.
