---
name: cold-email
description: Write a hyper-personalized cold outbound email for a specific contact. Uses ZoomInfo enrichment, work history, and web research to find a genuine connection between the prospect and what the user sells. Outputs a short, F-shaped "show me you know me" email.
user-invocable: true
argument-hint: [contact name + company, and what you sell]
---

# Cold Email

Write one sharp, personalized cold email that makes the recipient feel seen — not targeted.

## Input

The user will provide via `$ARGUMENTS`:
- A contact: name + company, email, or LinkedIn URL
- What they sell: product, solution, or value prop (even a one-liner is fine)

If either is missing, ask before proceeding. You need both.

## Step 1 — Enrich the Contact

Use `enrich_contacts` with whatever identifier the user provided. Extract:
- Full name, title, department, management level
- Company name and ZoomInfo company ID
- Time in current role (from position start date)
- Location

If the match fails, fall back to `search_contacts` with loose filters and ask the user to confirm.

## Step 2 — Enrich the Company

Use `enrich_companies` with the company ID from Step 1. Extract:
- What the company does (description)
- Industry, employee count, revenue range
- Growth signals: employee growth rate, recent funding
- Business model (B2B/B2C)

## Step 3 — Research the Person

Use web search to find recent, public signal about this specific person:
- LinkedIn posts or activity
- Podcast appearances, conference talks, or webinars
- Published articles, blog posts, or quotes in press
- Job change (if they started in the last 6 months, that's gold)
- Company announcements they were involved in

Search for: "[Full Name]" "[Company Name]" — try 2-3 query variations. Also search for "[Full Name]" and their area of expertise.

You need ONE specific, verifiable thing about this person. Not their company. Them.

## Step 4 — Find the Connection

This is the hard part. Find the single strongest thread between:
- **The person's world**: their role, their recent activity, their company's situation, a problem someone in their position almost certainly has
- **What the user sells**: the product, the outcome it delivers, the pain it removes

The connection must be:
- **Specific** — not "you're a VP of Sales so you probably care about pipeline." That's lazy.
- **Observational** — reference something you actually found, not something you assumed.
- **Relevant** — it should make the reader think "okay, this person actually understands my situation."

Good connections:
- They posted about a challenge your product solves
- Their company just hit a growth milestone that creates the exact pain you address
- They moved into a new role and your product helps people ramping in that role
- Their company uses a competitor or adjacent tool and yours is a natural next step
- They spoke about a topic at a conference and your product is in that space

Bad connections:
- Generic industry trends
- Complimenting their LinkedIn headline
- "I see you work at [Company]" — that's not a connection, that's a mail merge

## Step 5 — Write the Email

Write a 3-part, F-shaped email. The entire email should be **40-70 words**. Not a word more.

### Structure

**Line 1 — The Hook (observation)**
One sentence that proves you did your homework. Reference the specific thing you found in Step 3. No flattery. No "I love your work." Just a sharp observation or reference that signals "I see you."

**Line 2-3 — The Point (connection → value)**
One to two sentences that connect their situation to what the user sells. Don't pitch features. Name the outcome. Tie it to something real about their world.

**Line 4 — The Close (low-friction CTA)**
One short sentence. Make it easy to say yes to. Not "Can I get 30 minutes?" — that's a big ask for a stranger. Instead: "Worth a look?" / "Want me to send over how [similar company] handled this?" / "Open to a quick take on this?"

### Rules

- **No subject line** — the user can write their own. Just the body.
- **No "Hi [Name],"** opener — start directly with the hook. The salutation is assumed.
- **No "I" in the first sentence.** Start with them, not you.
- **No buzzwords.** No "leverage", "synergy", "cutting-edge", "revolutionize."
- **No bullet points or formatting.** Plain text, like a real email from a real person.
- **No "I noticed that..." or "I came across..."** — these are cold email clichés. Just state the observation directly.
- **No company boilerplate.** No "We're a leading provider of..." — nobody cares.
- **Read it back.** If it sounds like it could be sent to 100 people with a name swap, rewrite it.

## Output Format

Present the email in a clean block:

---

**To:** [Full Name], [Title] at [Company]

[Email body — 40-70 words, plain text]

---

**Why this email works:**
- **Hook:** [1 sentence — what signal you used and why it's relevant]
- **Connection:** [1 sentence — how you bridged their world to the product]
- **CTA:** [1 sentence — why this ask is low-friction]

**Sources used:**
- ZoomInfo: [what you learned from enrichment]
- Web: [the specific article/post/event you referenced]

Then ask: "Want me to adjust the angle, try a different hook, or write a follow-up?"
