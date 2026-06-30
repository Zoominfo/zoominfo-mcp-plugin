#!/bin/bash
# init.sh — environment check for the Conversation Intelligence Skills build.
# These skills are markdown (SKILL.md) files, so there is no app server to start.
# This script just validates that every skill still meets the frontmatter + length
# contract. Run it at the start of every session and after editing any SKILL.md.

set -e

echo "=== Validating skills/*/SKILL.md ==="
node validate_skills.mjs

echo "=== Ready ==="
