---
name: contact-relationship-recap
description: Recap where things stand with a specific person across recent conversations, with emphasis on how the relationship is evolving. Identify the contact by ZoomInfo contact ID (preferred) or by name plus company (triggers a lookup). Blends contact-scoped conversation_intelligence for what this person has actually said recently with contact_research for their role and background. Use when someone asks "where are we with Jane", "is this person still our champion", "recap my conversations with this contact", or wants a read on an individual relationship before reaching out. Reasons over the last few engagements only.
---

# Contact Relationship Recap

Where we stand with one person, read from recent conversations: their posture toward us, and how it is changing.

## Prerequisites

Contact-scoped `conversation_intelligence` requires at least one connected email or meeting source; `conversation_intelligence` and `contact_research` consume AI credits. If no conversation data exists for the person, give the `contact_research`-based read and note that conversation context was unavailable, pointing the user to their ZoomInfo admin.

## Input

Provided via `$ARGUMENTS`:

- **Contact** (required) — ZoomInfo contact ID (preferred), or a name plus company to resolve via `search_contacts`.
- **Lens** (optional) — e.g. "is the champion still engaged", "did sentiment cool after the demo". Frames the recap.

## Workflow

1. **Resolve the contact.** Use the ZoomInfo contact ID directly; otherwise resolve via `search_contacts` (name + company) and confirm an ambiguous match before spending credits.
2. **Read the relationship.** Run contact-scoped `conversation_intelligence` and `contact_research` in parallel. Ask CI what this person has raised across recent conversations, how engaged and positive they have been, what they have committed to, and whether their stance has shifted. Keep CI scoped to this one contact; it cannot search by topic or count mentions, and sees only the last few engagements.
3. **Synthesize posture and trajectory.** Classify the person's current posture (engaged champion, supportive, neutral, skeptical, gone quiet) and whether it is strengthening or weakening, with evidence. Do not infer a champion or a risk the conversations do not support.

## Output Format

### Where we stand with [Name] — [Title, Company]

**Posture** — one line: engaged champion / supportive / neutral / skeptical / gone quiet, with the evidence.

**Recent from them** — 3-5 bullets on what this person has actually said or asked for lately (from CI, with source meetings).

**What's changed** — shifts in engagement, tone, or influence; e.g. went quiet after a reorg, warmed up after a successful pilot. Tied to evidence.

**Commitments / open asks** — what they promised or are waiting on from us.

**Suggested next step** — one evidence-based move to re-engage or advance the relationship.

### When there is no data

If conversation data is unavailable, give the `contact_research` view and state that the relationship read is limited without connected conversation history.
