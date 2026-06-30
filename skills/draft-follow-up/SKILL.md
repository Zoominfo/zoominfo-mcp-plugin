---
name: draft-follow-up
description: Draft a follow-up email after a call by extracting the commitments and next steps that were actually agreed, then writing a compact, friendly-professional message. Name the call if you know it, or let the skill pull recent calls to pick from. Uses conversation_intelligence to read what was said and committed. Use when someone says "draft a follow-up to that call", "send a recap email", "write the follow-up for my Acme meeting", or needs a post-call note. Drafts only what the conversation supports — it does not invent commitments.
---

# Draft Follow-Up

Turn what was said on a call into a tight follow-up email: thank, recap, and confirm next steps.

## Prerequisites

`browse_engagements` (to find the call) is free but requires an active calendar/email/meeting integration; `conversation_intelligence` (to read it) requires at least one connected meeting or email source and consumes AI credits. If no conversation data exists for the call, say so rather than drafting from assumption.

## Input

Provided via `$ARGUMENTS`:

- **Which call** (optional) — an account and/or date. If omitted, the skill lists recent calls to pick from.
- **Tone / recipient** (optional) — e.g. "warm", "more formal for the exec", "to the whole room". Defaults to friendly-professional, addressed to the primary external attendee.

## Workflow

1. **Identify the call.** `browse_engagements` filters by date and by company/contact ID, not by call name, so resolve any named account/contact first via `search_companies` / `search_contacts`, then call `browse_engagements` scoped to that ID and date window and pick the matching meeting. If nothing was named, present a numbered shortlist of recent calls and let the user pick before spending credits. Keep the engagement ID.
2. **Extract what was said.** Run `conversation_intelligence` scoped to that engagement ID for the agreed next steps, commitments on each side, decisions, and any open questions to address in the note. Keep the query scoped to this one engagement.
3. **Confirm direction if ambiguous.** If the recipient or tone is unclear, or the call surfaced sensitive points, pause and confirm with the user before drafting.
4. **Draft the email.** Write a concise message: a one-line thanks, a 2-3 sentence recap, a clear list of next steps with owners and any dates, and a single call to action. Include only commitments the conversation actually supports; never invent an owner, a date, or a promise. Keep it skimmable.

## Output Format

**Subject:** [specific, references the meeting or its outcome]

**Body:**
> [Greeting.]
>
> [One-line thanks + 2-3 sentence recap of what was discussed and where it landed.]
>
> Next steps:
> - [Owner — action — date, if stated]
>
> [One-line close with the call to action.]
>
> [Sign-off.]

Present the draft for review; this skill drafts only and does not send. After the draft, list the **commitments extracted** (us vs them) so the user can verify nothing was added or missed. Offer to adjust tone, length, or recipient.

### When there is no data

If the call cannot be found or has no transcript to read, tell the user and ask them to name the call or supply the key points to draft from, rather than fabricating a recap.
