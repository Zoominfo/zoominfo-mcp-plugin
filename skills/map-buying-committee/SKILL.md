---
name: map-buying-committee
description: Map the full buying committee at a target account. Identifies contacts for each role in the deal — Economic Buyer, Champion, Technical Evaluator, Procurement, and more — with coverage gaps, engagement priority, and a suggested outreach sequence.
---

# Map Buying Committee

Identify and map every buying committee role at a target account using ZoomInfo contact data.

## Background

ZoomInfo's Buying Groups feature (in SalesOS) lets revenue teams define custom buying committee personas and track engagement across them. This skill replicates that logic in Cowork: you define the committee structure (or use the defaults), and the skill finds, enriches, and maps the best-fit contacts to each role.

## Input

The user will provide via `$ARGUMENTS`:
- A target company (name, domain, or ZoomInfo company ID) — **required**
- Optionally: a deal stage — "prospecting", "active deal", or "renewal/expansion" (affects which roles to prioritize)
- Optionally: a custom committee definition — e.g., "I need an IT Buyer, a Finance Approver, and a Security Reviewer"
- Optionally: known contacts already engaged — "we already know the CTO"

## Default Buying Committee Personas

If the user does not specify a custom structure, use these six standard personas:

| Role | Description | Target Titles | Target Management Levels |
|------|-------------|---------------|--------------------------|
| **Economic Buyer** | Controls budget, signs the contract | CFO, VP Finance, COO, CEO (SMB), Chief Procurement Officer | C-Level, VP |
| **Champion** | Internal advocate who drives the deal forward | Director/VP in the primary business unit benefiting from the solution | Director, VP |
| **Technical Evaluator** | Evaluates fit, owns the implementation | IT Director, VP Engineering, CTO (SMB), Solutions Architect, IT Manager | Manager, Director |
| **End User / Practitioner** | Day-to-day user of the product | Individual contributor or Manager in the primary business unit | Individual Contributor, Manager |
| **Procurement / Legal** | Contract, legal, and vendor management | VP Procurement, Contracts Manager, General Counsel, VP Legal | Manager, Director, VP |
| **Coach / Mobilizer** | Internal ally who shares intel and facilitates access | Chief of Staff, Business Analyst, Operations Manager | Manager, Director |

Adjust titles based on the target company's size:
- **Enterprise (1,000+ employees)**: roles are likely distinct people; search each separately
- **Mid-market (100-999 employees)**: one person may cover multiple roles; note overlaps
- **SMB (<100 employees)**: C-suite often covers Economic Buyer + Champion + Technical Evaluator; search broadly

## Workflow

1. **Lookup metadata first** — before calling any other MCP tool, use `lookup` to load valid `id` values for management levels, departments, and job functions. Use these `id` values in every subsequent search call — never use display names directly.

2. **Resolve and enrich the target company**:
   - Use `companyWebsite`, `companyName`, or `companyId` to identify the company
   - Call `enrich_companies` to get: industry, employee count, revenue, HQ location
   - Use employee count to select the right persona title mappings (Enterprise / Mid-market / SMB)
   - If the user mentioned known contacts already engaged, note them — skip those roles in the search or mark them as "covered"

3. **Search for each persona** using `search_contacts` with `companyId` plus the role's title and management level filters:
   - Run one search per persona (or batch personas with overlapping filters)
   - Sort by `-contactAccuracyScore`
   - Request up to 10 results per persona
   - For custom committee definitions, map each user-defined role to equivalent title/department/management-level filters

4. **Enrich the top candidate per persona** using `enrich_contacts` (batch all top candidates together, up to 10):
   - Fields: `firstName`, `lastName`, `jobTitle`, `department`, `managementLevel`, `email`, `directPhone`, `mobilePhone`, `contactAccuracyScore`, `lastUpdatedDate`, `linkedInUrl`

5. **Identify coverage gaps**: personas where no contact was found or the best match has accuracy score < 70.

6. **Score engagement priority** across the mapped committee (see Output Format).

---

## Output Format

### Target Account
**[Company Name]** — [Industry] | [Employee Count] employees | [Revenue] | [HQ]
*Account tier: Enterprise / Mid-market / SMB*

---

### Buying Committee Map

For each persona, show the best-fit contact found:

---

#### Economic Buyer
> *Controls budget and final sign-off*

| Field | Value |
|-------|-------|
| Name | |
| Title | |
| Department | |
| Management Level | |
| Email | |
| Direct Phone | |
| Accuracy Score | |
| Last Updated | |

**Confidence**: High / Medium / Low — based on accuracy score and title-to-persona match quality
**Note**: [Flag if title doesn't perfectly match the persona, or if record is stale]

*(Repeat this block for each persona: Champion, Technical Evaluator, End User / Practitioner, Procurement / Legal, Coach / Mobilizer)*

---

### Coverage Summary

| Persona | Contact Found | Name | Title | Accuracy | Confidence | Gap? |
|---------|--------------|------|-------|----------|------------|------|
| Economic Buyer | Yes/No | | | | High/Med/Low | |
| Champion | Yes/No | | | | | |
| Technical Evaluator | Yes/No | | | | | |
| End User / Practitioner | Yes/No | | | | | |
| Procurement / Legal | Yes/No | | | | | |
| Coach / Mobilizer | Yes/No | | | | | |

**Coverage score**: X of 6 roles mapped (X%)
**Critical gaps**: [list any Economic Buyer or Champion gaps — these block deals]

---

### Engagement Priority

Rank the committee for outreach sequencing based on deal stage:

**Prospecting**: Champion first (build internal support) → Technical Evaluator (validate fit) → Economic Buyer (unlock budget)

**Active deal**: Economic Buyer (accelerate sign-off) → Procurement/Legal (unblock contract) → Champion (maintain momentum)

**Renewal/Expansion**: End User/Practitioner (satisfaction signal) → Champion (expansion advocate) → Economic Buyer (budget approval)

Suggested first outreach:
1. **[Name]** ([Role]) — [one-sentence rationale for why to start here]
2. **[Name]** ([Role]) — [rationale]
3. **[Name]** ([Role]) — [rationale]

---

### Gap Actions

For each persona with no contact found or low confidence:
- **Try broader title search**: suggest alternative titles to search manually
- **Use `/zoominfo:recommend-contacts`** at this company — AI recommendations may surface the right persona
- **Use `/zoominfo:find-similar`** scoped to this company — finds contacts similar to your champion at other accounts, mapped to this account

---

## Important Notes

- This skill constructs buying committee maps using ZoomInfo's contact search and enrichment. It approximates ZoomInfo's native Buying Groups feature using the same underlying data.
- One person may legitimately cover multiple roles at smaller companies — flag this rather than searching for separate contacts when employee count suggests overlap is likely.
- Accuracy scores below 70 should be treated as unverified. Recommend the user confirm through LinkedIn or direct outreach before adding to a CRM sequence.
- If the user has a custom ICP or product-specific committee structure (e.g., for a security product: CISO, IT Security Manager, GRC Lead), accept their definition and map titles/departments accordingly.
