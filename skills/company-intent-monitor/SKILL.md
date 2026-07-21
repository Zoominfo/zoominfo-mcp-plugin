---
name: company-intent-monitor
description: Monitor a company's buyer-intent signals and assess fit against your GTM context. Uses company signals scoped to intent for a single account, returns the recent topics it is researching, and analyzes which ones align with your offerings and ICP. Identify the company by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone asks "what is Acme researching", "are they showing intent on anything we sell", "monitor intent for this account", or wants an intent read before prioritizing an account.
---

# Company Intent Monitor

What is this account actively researching, and does any of it line up with what we sell?

## Prerequisites

`enrich_company_signals` charges data credits — each intent signal returned counts as a record, but companies already under management (enriched within the last 12 months) are free. `get_gtm_context` is free. Intent availability depends on your ZoomInfo package; if no intent is on file, that is a real (and useful) answer, not an error.

## Input

Provided via `$ARGUMENTS`:

- **Company** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`. If none is supplied, ask which company.
- **Focus** (optional) — topics or themes you care about, to weight the alignment read.

## Workflow

1. **Set the lens.** Call `get_gtm_context` (free) for your offerings, ICP, and competitors — the basis for judging which topics matter.
2. **Resolve the company.** Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
3. **Pull intent.** Run `enrich_company_signals` with `signalTypes: ["INTENT"]` for the company. Read the topics, their signal scores, and recency.
4. **Analyze alignment.** Map each topic against your offerings and ICP: which topics indicate demand for something you sell, which point at a competitor's category, and which are noise. Call out the strongest aligned topics. Do not stretch a loosely related topic into a fit it does not have.

## Output Format

### Intent monitor — [Company]

**Recent intent topics**

| Topic | Signal score | Recency |
|-------|--------------|---------|

Strongest first.

**Alignment with your offerings** — the topics that map to what you sell (and which offering), with a one-line reason each. Note any competitor-category intent separately.

**Read** — 1-2 lines: what the pattern suggests and whether this account is worth prioritizing now.

**If there is no active intent** — say so plainly; absence of intent is a legitimate result, and it means this account is not currently showing research-based demand.
