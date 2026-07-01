#!/usr/bin/env node
/**
 * opencode-daily-usage — print today's OpenCode token total and recent history.
 *
 * Reads the state file written by the plugin. Respects the same env vars:
 *   OPENCODE_USAGE_FILE, XDG_DATA_HOME, OPENCODE_DAILY_TOKEN_TARGET, OPENCODE_USAGE_TZ
 *
 * Usage:
 *   opencode-daily-usage           # today + last 14 days
 *   opencode-daily-usage --json    # raw state as JSON
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const TARGET = intEnv("OPENCODE_DAILY_TOKEN_TARGET", 40_000_000);
const TZ = process.env.OPENCODE_USAGE_TZ || "Europe/Brussels";

function stateFile() {
  if (process.env.OPENCODE_USAGE_FILE) return process.env.OPENCODE_USAGE_FILE;
  const base = process.env.XDG_DATA_HOME || join(homedir(), ".local", "share");
  return join(base, "opencode", "daily-usage.json");
}

function load() {
  try {
    return JSON.parse(readFileSync(stateFile(), "utf-8"));
  } catch {
    return null;
  }
}

function compact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "k";
  return String(n);
}
function num(v) {
  return typeof v === "number" && isFinite(v) ? v : 0;
}
function intEnv(name, fallback) {
  const v = parseInt(process.env[name] || "", 10);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}

const s = load();
if (!s) {
  console.log(`No usage recorded yet (looked in ${stateFile()}).`);
  console.log("Run OpenCode with the opencode-daily-usage plugin loaded first.");
  process.exit(0);
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(s, null, 2));
  process.exit(0);
}

const pct = TARGET > 0 ? ` (${Math.round((num(s.total) / TARGET) * 100)}% of ${compact(TARGET)})` : "";
console.log(`OpenCode token usage — timezone ${s.tz || TZ}`);
console.log("");
console.log(`  Today (${s.day}):  ${compact(num(s.total))} tokens${pct}`);
console.log(`     input:  ${compact(num(s.input))}`);
console.log(`     output: ${compact(num(s.output))}`);

const models = Object.entries(s.byModel || {}).sort((a, b) => b[1] - a[1]);
if (models.length) {
  console.log("  By model:");
  for (const [m, t] of models) console.log(`     ${compact(num(t))}  ${m}`);
}

const history = Object.entries(s.history || {}).sort().slice(-14);
if (history.length) {
  console.log("");
  console.log("  Recent days:");
  for (const [day, t] of history.reverse()) console.log(`     ${day}   ${compact(num(t))}`);
}
