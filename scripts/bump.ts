#!/usr/bin/env bun
// Bump the version in a plugin's Claude and Codex manifests.
// Usage: bun scripts/bump.ts [patch|minor|major] [plugin]

type Level = "patch" | "minor" | "major";

const [levelArg = "patch", plugin = "weetwinkel"] = process.argv.slice(2);

if (!["patch", "minor", "major"].includes(levelArg)) {
  console.error("level must be patch, minor or major");
  process.exit(1);
}
const level = levelArg as Level;

const dir = `plugins/${plugin}`;
const files = [
  `${dir}/.claude-plugin/plugin.json`,
  `${dir}/.codex-plugin/plugin.json`,
];

async function readManifest(path: string) {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    console.error(`not found: ${path}`);
    process.exit(1);
  }
  const text = await file.text();
  // Keep the file's existing indentation (falls back to 2 spaces).
  const indent = text.match(/^[ \t]+(?=")/m)?.[0] ?? "  ";
  return { path, text, indent, json: JSON.parse(text) as Record<string, unknown> };
}

function parseVersion(v: unknown): [number, number, number] {
  const match = String(v ?? "0.0.0").match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    console.error(`cannot parse version "${v}"`);
    process.exit(1);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function bump([major, minor, patch]: [number, number, number], level: Level) {
  switch (level) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

const manifests = await Promise.all(files.map(readManifest));

const current = String(manifests[0].json.version ?? "0.0.0");
const other = String(manifests[1].json.version ?? "0.0.0");
if (current !== other) {
  console.warn(`warning: versions differ (${current} vs ${other}), bumping from ${current}`);
}

const next = bump(parseVersion(current), level);

for (const m of manifests) {
  m.json.version = next;
  const trailingNewline = m.text.endsWith("\n") ? "\n" : "";
  await Bun.write(m.path, JSON.stringify(m.json, null, m.indent) + trailingNewline);
}

console.log(`${plugin}: ${current} -> ${next}`);
