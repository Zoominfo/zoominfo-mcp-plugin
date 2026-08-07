#!/usr/bin/env node
// Validates every skills/*/SKILL.md against the SKILL.md contract.
// No dependencies — run from the repo root with: node scripts/validate-skills.mjs
//
// Contract:
//   frontmatter  - opens with `---` on line 1, closes with `---`; simple
//                  single-line `key: value` pairs only. Values may be plain,
//                  single-quoted, or double-quoted. Plain values must not
//                  contain `: ` (YAML reads it as a nested mapping and the
//                  whole block fails to parse, so the skill loads with empty
//                  metadata at runtime) — quote the value instead.
//   name         - kebab-case (^[a-z0-9]+(-[a-z0-9]+)*$), at most 64 chars,
//                  must equal the skill's directory name, and must not
//                  contain the reserved words "anthropic" or "claude".
//   description  - present, non-empty, at most 1024 chars.
//   body         - under 500 lines (progressive-disclosure budget).

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SKILLS_DIR = 'skills';
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED = ['anthropic', 'claude'];
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;
const MAX_BODY_LINES = 500;

// YAML indicator characters that change the meaning of an unquoted scalar.
const PLAIN_UNSAFE_START = /^[!&*\-?|>%@`"'#{}[\],]/;

function parseValue(raw, errors, key) {
  const value = raw.trim();
  if (value === '') {
    errors.push(`\`${key}\`: value is empty`);
    return null;
  }
  if (value.startsWith("'")) {
    // Single-quoted: '' is the only escape; must close at end of line.
    const body = value.slice(1);
    const m = body.match(/^((?:[^']|'')*)'$/);
    if (!m) {
      errors.push(`\`${key}\`: single-quoted value does not close cleanly at end of line`);
      return null;
    }
    return m[1].replace(/''/g, "'");
  }
  if (value.startsWith('"')) {
    // Double-quoted: backslash escapes; must close at end of line.
    const body = value.slice(1);
    const m = body.match(/^((?:[^"\\]|\\.)*)"$/);
    if (!m) {
      errors.push(`\`${key}\`: double-quoted value does not close cleanly at end of line`);
      return null;
    }
    return m[1].replace(/\\(.)/g, '$1');
  }
  // Plain scalar: reject anything a YAML parser would reinterpret.
  if (PLAIN_UNSAFE_START.test(value)) {
    errors.push(`\`${key}\`: unquoted value starts with a YAML indicator character (\`${value[0]}\`) — quote the value`);
    return null;
  }
  if (/: /.test(value) || value.endsWith(':')) {
    errors.push(`\`${key}\`: unquoted value contains a mid-sentence \`: \` — YAML reads this as a nested mapping and the frontmatter fails to parse; quote the value`);
    return null;
  }
  if (/ #/.test(value)) {
    errors.push(`\`${key}\`: unquoted value contains \` #\`, which YAML reads as a comment — quote the value`);
    return null;
  }
  return value;
}

function parseFrontmatter(text, errors) {
  const lines = text.split('\n');
  if (lines[0] !== '---') {
    errors.push('file must start with a `---` frontmatter delimiter on line 1');
    return null;
  }
  const close = lines.indexOf('---', 1);
  if (close === -1) {
    errors.push('frontmatter opening `---` is never closed');
    return null;
  }
  const fields = {};
  const seen = new Set();
  for (let i = 1; i < close; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const m = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?: (.*))?$/);
    if (!m) {
      errors.push(`frontmatter line ${i + 1} is not a simple \`key: value\` pair: ${JSON.stringify(line.slice(0, 60))}`);
      continue;
    }
    const [, key, rawValue] = m;
    if (seen.has(key)) {
      errors.push(`duplicate frontmatter key \`${key}\``);
      continue;
    }
    seen.add(key);
    const value = parseValue(rawValue ?? '', errors, key);
    if (value !== null) fields[key] = value;
  }
  return { fields, seen, bodyLines: lines.length - (close + 1) };
}

function validateSkill(dir) {
  const errors = [];
  const path = join(SKILLS_DIR, dir, 'SKILL.md');
  if (!existsSync(path)) {
    return [`missing ${path}`];
  }
  const parsed = parseFrontmatter(readFileSync(path, 'utf8'), errors);
  if (!parsed) return errors;

  const { fields, seen, bodyLines } = parsed;
  const { name, description } = fields;

  if (name === undefined) {
    if (!seen.has('name')) errors.push('`name`: missing');
  } else {
    if (!NAME_RE.test(name)) errors.push(`\`name\`: must be kebab-case (got ${JSON.stringify(name)})`);
    if (name.length > MAX_NAME) errors.push(`\`name\`: longer than ${MAX_NAME} chars`);
    if (name !== dir) errors.push(`\`name\`: ${JSON.stringify(name)} does not match directory name ${JSON.stringify(dir)}`);
    for (const word of RESERVED) {
      if (name.toLowerCase().includes(word)) errors.push(`\`name\`: contains reserved word "${word}"`);
    }
  }

  if (description === undefined) {
    if (!seen.has('description')) errors.push('`description`: missing');
  } else if (description.length > MAX_DESCRIPTION) {
    errors.push(`\`description\`: ${description.length} chars exceeds the ${MAX_DESCRIPTION}-char limit`);
  }

  if (bodyLines >= MAX_BODY_LINES) {
    errors.push(`body: ${bodyLines} lines exceeds the ${MAX_BODY_LINES}-line budget`);
  }

  return errors;
}

const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

let failed = 0;
for (const dir of dirs) {
  const errors = validateSkill(dir);
  if (errors.length === 0) {
    console.log(`ok   ${dir}`);
  } else {
    failed++;
    console.error(`FAIL ${dir}`);
    for (const err of errors) console.error(`     - ${err}`);
  }
}

console.log(`\n${dirs.length} skills checked, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
