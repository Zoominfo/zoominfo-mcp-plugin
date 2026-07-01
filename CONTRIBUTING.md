# Contributing to the ZoomInfo MCP Plugin

Thanks for your interest in contributing. This repo packages ZoomInfo's go-to-market intelligence for MCP-capable clients, along with task-focused skills for sales, marketing, and revenue workflows. Contributions that make those workflows sharper, clearer, or more reliable are genuinely welcome.

These are guidelines rather than hard rules. Use your judgment, and when in doubt, open an issue to talk it through before you build.

## Code of conduct

Be respectful, constructive, and professional. We want this to be a friendly place for GTM engineers, RevOps folks, and developers to collaborate. Harassment or dismissive behavior toward other contributors isn't welcome.

## Ways to contribute

- **Report a bug** — a skill that misbehaves, a broken manifest, or a tool call that returns the wrong shape.
- **Suggest an improvement** — a clearer skill, a better output format, or a GTM workflow we're missing.
- **Improve a skill** — tighten instructions, fix an inaccurate tool reference, or improve the output.
- **Improve the docs** — the README, setup steps, or these guidelines.

For anything beyond a small fix, please open an issue first so we can align before you invest time.

## Reporting bugs

Open an issue and include:

- What you did — the skill or tool involved, and the prompt or inputs.
- What you expected versus what actually happened.
- Your client and environment (for example Claude Code, Codex, or Cursor), plus any error output.

## Suggesting enhancements

Open an issue describing the workflow or gap, who it helps, and roughly what a good result looks like. Concrete GTM use cases ("as an AE prepping a renewal, I want…") make it much easier for us to evaluate fit.

## Working with skills

Skills live in `skills/<name>/SKILL.md` and are the task-focused playbooks the agent follows. If you're adding or editing one:

- **Follow the existing format.** Frontmatter needs a `name` (lowercase letters, numbers, and hyphens, matching the directory) and a clear, third-person `description` that says what the skill does and when to use it. Keep the body focused (under roughly 500 lines) and mirror the structure of the skills already in the repo.
- **Ground it in real tools.** Reference actual ZoomInfo MCP tools and their real parameters. Don't invent tools, fields, or capabilities the server doesn't have.
- **Stay provider-neutral.** Skills should work across MCP-capable clients. Don't hard-code one client's specifics.
- **Keep it useful and honest.** Favor clear, evidence-based outputs, and don't instruct the agent to fabricate data or overstate what the tools return.
- **Test it.** Run the skill against a real prompt and confirm it behaves. If the repo includes the skill validator, run `node scripts/validate-skills.mjs` from the repo root before opening your PR.

## Pull request process

1. Fork the repo and create a branch from `main` (for example `fix/build-list-typo`).
2. Keep PRs small and focused. One change per PR is easiest to review and fastest to merge.
3. For anything substantial, open an issue first and link it in the PR.
4. Describe **what** changed and **why**, from the user's perspective.
5. Make sure any CI checks pass.

A maintainer will review as soon as we can. Thanks in advance for your patience.

## What we don't accept

To keep the plugin trustworthy and focused, we don't accept:

- **Promotional, marketing, or sales contributions.** PRs whose main purpose is to advertise a product, service, company, or person — including third-party product mentions, branding, "reviewed with" or "optimized with" callouts, backlinks, or @-mentions that promote a vendor. This applies whether or not the commercial interest is disclosed. Every contribution is evaluated purely on whether it makes the plugin better for ZoomInfo users, and product pitches don't meet that bar.
- Changes that inject third-party links, tracking, or lead generation into skills or docs.
- Changes that break provider-neutrality or hard-code a single client.
- Secrets, credentials, or API keys of any kind.
- Large unsolicited rewrites with no prior issue or discussion.

If a PR falls into one of these, we'll close it with a pointer back to this file. And if there's a genuine improvement buried inside a promotional PR, we'd still like it — just resubmit it on its own merits, without the pitch.

## Questions

Not sure whether an idea fits? Open an issue and ask. We'd much rather talk early than have you spend time on something we can't merge.
