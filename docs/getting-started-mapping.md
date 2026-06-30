# Getting-Started "What are you building?" → Skill Mapping

Source of truth for the use-case selector on the ZoomInfo MCP getting-started page.
The page itself lives on the website (not in this repo); this file is the spec to build against.

## Design principle: active, not passive

The selector features **active** use cases only — instant, pull-based, zero setup. The user
asks and gets value on the first click.

**Passive** use cases (monitoring/scoring that must be *configured first* and pay off over time)
are deliberately **not** front-door tabs, because the setup cost makes them a weak first
experience. They live under "Just Exploring" (or a later "set up monitoring" step):

- **Intent monitoring** — requires intent topics to be configured before it returns anything.
- **ICP targeting / account scoring** — requires ICP criteria and an account list.

Both were dropped from the front door for this reason.

## Tabs

| Tab | Suggested first prompt | Maps to skills |
|---|---|---|
| **Build a prospecting list** | "Build me a list of SaaS companies in the UK with 200–500 employees using Salesforce." | `build-list`, `find-similar` |
| **Enrich records** | "Enrich this contact: jane@acme.com" / "Enrich Acme Corp with firmographics." | `enrich-contact`, `enrich-company` |
| **Research accounts** | "Research Acme Corp — firmographics, structure, news, and next actions." | `account-research`, `competitor-analysis`, `buying-committee`, `tech-stack-snapshot` |
| **Prepare for meetings** | "Help me prepare for a meeting with Apple's VP of Marketing this afternoon." | `meeting-prep`, `personalize-email` |
| **Just Exploring** | (showcase breadth) | lead with `account-research`, `meeting-prep`, `build-list`; plus `recommend-contacts`, `score-leads`, `score-accounts`, `tam-sizer`, and the passive intent/scoops use cases |

## Notes

- Order is funnel-shaped: find → enrich → research → act → explore.
- "Just Exploring" is the catch-all (renamed from "not sure" / "Other") and the home for every
  skill not surfaced by an active tab, including the passive/setup-gated ones.
- All 14 skills have a home: `account-research`, `build-list`, `buying-committee`,
  `competitor-analysis`, `enrich-company`, `enrich-contact`, `find-similar`, `meeting-prep`,
  `personalize-email`, `recommend-contacts`, `score-accounts`, `score-leads`, `tam-sizer`,
  `tech-stack-snapshot`.
