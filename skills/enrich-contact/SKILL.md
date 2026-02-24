---
name: enrich-contact
description: Look up a person's full professional profile. Provide a name and company, email address, phone number, or ZoomInfo person ID. Returns title, department, contact details, accuracy score, and company info.
---

# Enrich Contact

Look up a single contact's full profile in ZoomInfo.

## Input

The user will provide via `$ARGUMENTS` one of:
- An email address (e.g., `jane@acme.com`)
- A name and company (e.g., `Jane Smith at Acme Corp`)
- A phone number
- A LinkedIn URL
- A ZoomInfo person ID

## Workflow

1. **Identify the best match key** from the user's input:
   - Email → use `email` parameter
   - Name + company → use `firstName`, `lastName`, `companyName`
   - Full name + company → use `fullName`, `companyName`
   - Phone → use `phone`
   - LinkedIn URL → use `externalURL`
   - Person ID → use `personId`

2. **Enrich the contact** using `enrich_contacts` with the identified parameters.

3. **If no match**, try a fallback:
   - If name + company failed, try `search_contacts` with `jobTitle` or `companyName` variations
   - Suggest alternative spellings or company names

## Output Format

**[Full Name]** — [Title] at [Company]

| Field | Value |
|-------|-------|
| Department | |
| Management Level | |
| Email | |
| Direct Phone | |
| Mobile Phone | |
| Accuracy Score | |
| Location | |
| Company | |
| Company Industry | |
| Company Size | |
| LinkedIn | |
| Last Updated | |
| ZoomInfo Person ID | |

If any fields are unavailable, omit them rather than showing blanks. Note the accuracy score prominently — anything below 80 deserves a flag.
