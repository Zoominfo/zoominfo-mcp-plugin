---
name: meeting-prep
description: Prepare a brief for an upcoming meeting with a prospect or customer. Provide the company and optionally the person you're meeting. Gets company intel, attendee profiles, and talking points.
---

# Meeting Prep

Build a pre-meeting brief combining company intelligence and attendee profiles.

## Input

The user will provide via `$ARGUMENTS`:
- Company name or domain (required)
- One or more attendee names (optional but recommended)
- Meeting context (e.g., "discovery call", "demo", "renewal") if provided

## Workflow

1. **Enrich the company** using `enrich_companies`. Extract the ZoomInfo company ID.
2. **Enrich attendees** if names are provided, using `enrich_contacts` with firstName, lastName, and companyName. If the user provides email addresses, use those instead. Extract each attendee's ZoomInfo person ID from the results.
3. **Find similar contacts** for each attendee using `find_similar_contacts` with `referencePersonId` set to the attendee's ZoomInfo person ID (no `targetCompanyId` filter) to understand their persona type and what kinds of people they resemble. Limit to `pageSize: 5`.
4. **Get recommended contacts** at the company using `get_recommended_contacts` with `useCaseType: "PROSPECTING"` and `ziCompanyId` set to the company's ZoomInfo ID to identify other stakeholders who should be in the conversation. Request `pageSize: 10`.

## Output Format

### Company Snapshot
- What they do, size, industry, location (2-3 sentences)
- Key business signals: growth, funding, rankings
- Recent news or changes if visible in the data

### Attendee Profiles
For each meeting attendee:
- **Name and Title**: Full name, current title, department
- **Background**: Time in role, career trajectory if visible
- **Persona Match**: Based on similar contacts analysis, what type of buyer/stakeholder are they? (e.g., "Matches profiles of technical evaluators in mid-market SaaS")
- **Talking Points**: 2-3 specific things to reference or ask about based on their profile

### Stakeholder Gap Analysis
Based on recommended contacts, identify who is NOT in the meeting but probably should be. For each:
- Name and title
- Why they matter to the deal
- Suggested ask: how to get them involved

### Conversation Guide
Based on the meeting type (if specified) and attendee profiles:
- 3 discovery questions tailored to the attendees
- Key value props most relevant to this company's profile
- Potential landmines to avoid (e.g., competitor presence in tech stack)

Keep the entire brief scannable. A rep should be able to read this in 3 minutes before walking into the meeting.
