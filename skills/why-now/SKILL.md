---
name: why-now
description: Build a "why now" case for reaching out to a company — the timing thesis and the specific hooks to lead with — by combining company signals (intent, news, scoops), account_research, your GTM context, and web research. Identify the company by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone asks "why should I reach out to Acme now", "what's our angle into this account", "give me a reason to call", or is planning outbound and needs timely, evidence-based hooks. Each hook ties a real signal to one of your offerings.
---

# Why Now

Answer the question a seller actually has before reaching out: why this account, why now, and what to lead with.

## Prerequisites

`enrich_company_signals` charges data credits — each signal returned counts as a record, but companies already under management (enriched within the last 12 months by your organization) are free. `account_research` consumes AI credits. `get_gtm_context` and `WebSearch` are free. Intent, news, and scoop availability depends on your ZoomInfo package; if a signal type is empty, work with what is available rather than treating it as "nothing happening".

## Input

Provided via `$ARGUMENTS`:

- **Company** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`. If none is supplied, ask which company.
- **Your angle** (optional) — what you sell into them, or the play you are running. Sharpens the hooks.

## Workflow

1. **Anchor on your side.** Call `get_gtm_context` (free) for offerings, ICP, competitors, and priorities. The "why now" only matters relative to what you sell.
2. **Resolve the company.** Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
3. **Pull the signals and context.** Run `enrich_company_signals` for the company with `signalTypes: ["INTENT", "NEWS", "SCOOP"]` (or omit `signalTypes` entirely, which returns all three) and `account_research` for deal/relationship and firmographic context, in parallel.
4. **Corroborate and extend with web research.** Use `WebSearch` for recent public developments that ZoomInfo may not carry (announcements, initiatives, leadership statements, funding) and to confirm anything time-sensitive. Capture URLs. Cross-check anything that looks stale.
5. **Synthesize the case.** Identify the strongest timing reasons — a signal that maps to one of your offerings or to a named risk/initiative. Build the thesis, then derive specific hooks. Ground every hook in a real signal with a date and source. If the signals are thin, say the timing case is weak rather than manufacturing urgency.

## Output Format

### Why now — [Company]

**Timing thesis** — 2-3 sentences on why this account is worth reaching out to now, framed by what you sell.

**Signals behind it** — the specific intent topics, news, and scoops driving the thesis, most compelling first, each with a date and source (URL for web items).

**Hooks** (2-4) — each:
- **Angle** — the opening idea.
- **Built on** — the signal it rests on (with source).
- **Maps to** — the offering or value it connects to.
- **Opener** — one line you could actually send or say.

**If the case is weak** — if signals are thin or stale, say so plainly and note what would change it (a trigger to watch for), rather than inventing a reason to reach out.
