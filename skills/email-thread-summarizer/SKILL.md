---
name: email-thread-summarizer
description: Summarize a long email thread into its current state, the decisions and key points, and the open questions. Finds the thread with browse_engagements (emails), then uses conversation_intelligence with includeContent to read the actual thread body. Name the account, contact, or subject if you know it, or let the skill list recent threads to pick from. Use when someone says "summarize this email thread", "what's the state of the Acme thread", "catch me up on this email chain", or faces a long back-and-forth before replying. Summarizes one thread at a time.
---

# Email Thread Summarizer

Collapse a long email chain into what matters: where it stands, what was decided, and what is still open.

## Prerequisites

`browse_engagements` (to find the thread) requires a connected email integration; `conversation_intelligence` (to read the body) requires at least one connected email source and consumes AI credits. If the thread's content is not available to read, say so rather than guessing at its contents.

## Input

Provided via `$ARGUMENTS`:

- **Which thread** (optional) — an account, contact, or subject. If omitted, the skill lists recent email threads to pick from.
- **Emphasis** (optional) — e.g. "what do they need from me", "just the decisions". Shapes the output.

## Workflow

1. **Find the thread.** Call `browse_engagements` with `engagementType: EMAILS` (scoped to the account/contact if known, `sort: -chronological`). If the target is ambiguous, present a short numbered shortlist (subject, participants, date) and let the user pick before spending credits. Keep the chosen engagement ID.
2. **Read the body.** Run `conversation_intelligence` scoped to that engagement ID with `includeContent: true` so it returns the actual email body/thread alongside its answer. Ask for the thread's current state, the decisions and commitments, and the open questions. Keep it to the one thread; CI cannot search across threads by topic.
3. **Summarize.** Distill the chain in reading order of importance, not message order. Attribute key points to who said them. Surface what needs a reply or a decision. Do not invent positions no one stated.

## Output Format

### Thread summary — [Subject]

*Participants: [names]. Spans [first date] to [last date], [N] messages.*

**Where it stands** — 2-3 sentences on the current state and what the thread is waiting on.

**Decisions & key points** — bullets, each attributed to who said it.

**Open questions / needs a reply** — what is unresolved, and specifically what is being asked of whom.

**Suggested reply focus** *(if the user is drafting a response)* — the one or two things their reply should address.

### When there is no data

If no matching thread is found, or its content cannot be read, tell the user and ask them to name the thread or paste the chain, rather than summarizing from assumption.
