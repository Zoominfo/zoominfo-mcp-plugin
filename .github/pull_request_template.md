## What does this PR do?

<!-- One sentence summary. -->

## Type of change

- [ ] New skill
- [ ] Skill improvement (existing skill)
- [ ] Bug fix
- [ ] Documentation
- [ ] Other

## Skills affected

<!-- List the skill directory names this PR touches. -->

## ZoomInfo tools used

<!-- Which MCP tools does this skill/change use? (e.g., search_contacts, enrich_companies, get_recommended_contacts) -->

## Testing

<!-- Describe how you tested this in Claude Cowork. Include example inputs you used. -->

- [ ] Tested end-to-end in Claude Cowork with a real ZoomInfo account
- [ ] Tested edge cases (no results, ambiguous input, missing fields)
- [ ] Verified output formatting matches the skill spec

## Entitlements required

<!-- Does this change require a specific ZoomInfo entitlement to use? (Intent, WebSights, Scaling API, etc.) If yes, note it here so users know. -->

## Checklist

- [ ] Skill directory name matches the `name` field in `SKILL.md` frontmatter
- [ ] `description` in frontmatter is clear and action-oriented (shown in Cowork UI)
- [ ] Skill uses the lookup-first pattern before any search call
- [ ] Output format is explicitly defined with markdown table headers
- [ ] Fallback paths are specified for no-match cases
