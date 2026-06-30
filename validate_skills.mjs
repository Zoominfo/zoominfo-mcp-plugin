#!/usr/bin/env node
// validate_skills.mjs — fast structural lint for every skills/*/SKILL.md.
// Checks the SKILL.md frontmatter contract (name / description) and body length.
// Exits 1 if any skill fails so init.sh / CI can gate on it.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = "skills";
const NAME_RE = /^[a-z0-9-]{1,64}$/;
const RESERVED = ["anthropic", "claude"];
const MAX_DESC = 1024;
const MAX_BODY_LINES = 500;

function parseFrontmatter(text) {
  // Frontmatter is the block between the first two lines that are exactly '---'.
  const lines = text.split("\n");
  if (lines[0].trim() !== "---") return { fm: null, bodyLines: lines.length };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") { end = i; break; }
  }
  if (end === -1) return { fm: null, bodyLines: lines.length };
  const fm = {};
  let currentKey = null;
  for (const raw of lines.slice(1, end)) {
    const m = raw.match(/^([a-zA-Z0-9_-]+):\s?(.*)$/);
    if (m) { currentKey = m[1]; fm[currentKey] = m[2]; }
    else if (currentKey && raw.trim()) { fm[currentKey] += " " + raw.trim(); }
  }
  return { fm, bodyLines: lines.length - (end + 1) };
}

const dirs = existsSync(SKILLS_DIR)
  ? readdirSync(SKILLS_DIR).filter((d) => statSync(join(SKILLS_DIR, d)).isDirectory())
  : [];

let failures = 0;
let checked = 0;

for (const dir of dirs.sort()) {
  const path = join(SKILLS_DIR, dir, "SKILL.md");
  if (!existsSync(path)) { console.log(`FAIL ${dir}: no SKILL.md`); failures++; continue; }
  checked++;
  const text = readFileSync(path, "utf8");
  const { fm, bodyLines } = parseFrontmatter(text);
  const errs = [];

  if (!fm) errs.push("missing or unterminated YAML frontmatter");
  else {
    const name = (fm.name || "").trim();
    const desc = (fm.description || "").trim();
    if (!name) errs.push("missing name");
    else {
      if (!NAME_RE.test(name)) errs.push(`name '${name}' must match ${NAME_RE}`);
      if (name !== dir) errs.push(`name '${name}' does not match directory '${dir}'`);
      for (const w of RESERVED) if (name.includes(w)) errs.push(`name contains reserved word '${w}'`);
    }
    if (!desc) errs.push("missing description");
    else if (desc.length > MAX_DESC) errs.push(`description ${desc.length} chars > ${MAX_DESC}`);
  }
  if (bodyLines > MAX_BODY_LINES) errs.push(`body ${bodyLines} lines > ${MAX_BODY_LINES}`);

  if (errs.length) { failures++; console.log(`FAIL ${dir}: ${errs.join("; ")}`); }
  else console.log(`ok   ${dir}`);
}

console.log(`\n${checked} skills checked, ${failures} failed`);
process.exit(failures ? 1 : 0);
