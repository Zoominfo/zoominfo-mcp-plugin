---
name: account-health
description: 'Assess the health of an account from its recent conversations — sentiment trajectory and risk signals — backed by an engagement timeline and an account_research snapshot. Identify the account by ZoomInfo company ID (preferred) or name/domain (triggers a lookup). Use when someone asks "how healthy is Acme", "are we at risk of churn here", "what''s the sentiment trend", or wants a risk read before a QBR or renewal. Strictly evidence-based: it does not invent risk or generic advice, and it asks the user for input where the conversations do not settle the question.'
---

# Account Health

A grounded read on where an account's health is heading: the sentiment trend, the real risk signals, and what to do about them — only what the evidence supports.

## Prerequisites

`browse_engagements` (timeline) requires an active calendar/email/meeting integration; `conversation_intelligence` (sentiment/risk) requires at least one connected source; `conversation_intelligence` and `account_research` consume AI credits. If no conversation data exists, the health read is limited to CRM/firmographic signal — say so explicitly rather than implying a confident verdict.

## Input

Provided via `$ARGUMENTS`:

- **Account** (required) — ZoomInfo company ID (preferred), or a name/domain to resolve via `search_companies`.
- **Context** (optional but valuable) — anything the user knows that conversations won't show: renewal timing, recent escalations, exec sponsor changes, usage/adoption data. Ask for this if a health call hinges on it.

## Workflow

1. **Resolve the account.** Use the ZoomInfo ID directly, or resolve a name/domain via `search_companies`.
2. **Gather evidence.** Build a recent timeline with `browse_engagements` (cadence and any drop-off in contact), run `conversation_intelligence` for sentiment trajectory and risk signals across recent conversations, and pull an `account_research` snapshot for deal/relationship context. Keep CI scoped to the account; it sees only the last few engagements and cannot count or topic-search, so treat its read as recent signal, not a full trend line.
3. **Check before concluding.** If the evidence is thin or mixed, or a verdict depends on something the data does not show (renewal date, usage, an off-platform escalation), ask the user for that input before writing the assessment. Do not fill gaps with generic churn-risk boilerplate.
4. **Assess.** Give a health read with a clear direction and a confidence level, every claim tied to specific evidence. Separate what the data shows from what is inferred or assumed.

## Output Format

### Account health — [Company]

**Read** — one line: healthy / watch / at-risk, with a confidence level (and why confidence is what it is).

**Sentiment trajectory** — how tone and engagement have moved across recent conversations, with source moments.

**Risk signals** — specific, evidence-backed signals (a gone-quiet champion, an unresolved escalation, slipping cadence). Omit anything you cannot support; do not pad.

**Strengths** — what is genuinely going well, if anything, with evidence.

**Recommended actions** — one to three concrete, evidence-tied moves. If the evidence does not support a confident recommendation, say what to confirm first instead.

### Evidence discipline

Lead with what the conversations and data actually show. Mark inferences as inferences. Where you asked the user for input, fold their answer in and attribute it. A short, honest read beats a padded one.

### When there is no data

If conversation data is unavailable, give the CRM/firmographic view only, state that sentiment and conversational risk could not be assessed, and point the user to their ZoomInfo admin.
