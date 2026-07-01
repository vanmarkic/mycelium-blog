/**
 * daily-usage.js — continuously display OpenCode's total token usage for the day.
 *
 * This does NOT block anything. After every finished assistant message it shows
 * a toast (and logs) the running total of tokens used *today*, where "today" is
 * a calendar day in Brussels time (Europe/Brussels, CET/CEST-aware). The total
 * is accumulated across all sessions and models and persisted to disk, so it
 * survives restarts and reflects everything you've run today.
 *
 * Install: drop this file in ~/.config/opencode/plugins/ (global) or
 * .opencode/plugins/ (project). It auto-loads at startup. No config entry needed.
 *
 * Configure via environment variables (all optional):
 *   OPENCODE_USAGE_TZ            IANA timezone, default "Europe/Brussels"
 *   OPENCODE_DAILY_TOKEN_TARGET  informational reference shown as "X% of TARGET";
 *                                default 40000000 (40M). Set 0 to hide it.
 *                                It is display-only and NEVER blocks a request.
 *   OPENCODE_USAGE_TOAST         "0" to disable the toast (logs still emitted)
 *   OPENCODE_USAGE_COUNT_CACHE   "1" to also count cache read/write tokens
 *   OPENCODE_USAGE_FILE          override the state file path
 *
 * State (JSON, with a rolling 30-day history) is written to:
 *   $OPENCODE_USAGE_FILE
 *   $XDG_DATA_HOME/opencode/daily-usage.json
 *   ~/.local/share/opencode/daily-usage.json
 */

import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

const TZ = process.env.OPENCODE_USAGE_TZ || "Europe/Brussels";
const TARGET = intEnv("OPENCODE_DAILY_TOKEN_TARGET", 40_000_000); // display only, never blocks
const SHOW_TOAST = process.env.OPENCODE_USAGE_TOAST !== "0";
const COUNT_CACHE = process.env.OPENCODE_USAGE_COUNT_CACHE === "1";
const STATE_FILE = resolveStateFile();
const HISTORY_DAYS = 30;

export const DailyUsage = async ({ client }) => {
  // Messages this process already counted (dedup across repeated updates).
  const counted = new Set();

  const log = async (level, message, extra) => {
    try {
      await client?.app?.log?.({ service: "daily-usage", level, message, extra });
    } catch {
      /* logging must never break a session */
    }
  };
  const toast = async (message) => {
    try {
      await client?.tui?.showToast?.({ body: { message, variant: "info" } });
    } catch {
      /* toast is optional / version-dependent */
    }
  };

  await log(
    "info",
    `daily-usage active: timezone ${tzLabel()}` +
      (TARGET ? `, reference target ${compact(TARGET)}` : "") +
      " (display only — never blocks).",
  );

  return {
    // Accumulate + display as assistant messages finish. No enforcement anywhere.
    event: async ({ event }) => {
      try {
        if (!event || event.type !== "message.updated") return;
        const info = event.properties?.info;
        if (!info || info.role !== "assistant" || !info.time?.completed) return;
        if (info.id && counted.has(info.id)) return;

        const tok = info.tokens || {};
        const input = num(tok.input);
        const output = num(tok.output);
        const reasoning = num(tok.reasoning);
        const cache = COUNT_CACHE ? num(tok.cache?.read) + num(tok.cache?.write) : 0;
        const spent = input + output + reasoning + cache;
        if (spent <= 0) return;

        if (info.id) counted.add(info.id);

        const state = bump(
          { input, output: output + reasoning, spent },
          info.modelID || info.providerID,
        );
        const line = summarize(state);
        await log("info", line, { day: state.day, total: state.total });
        if (SHOW_TOAST) await toast(line);
      } catch (err) {
        await log("error", `daily-usage handler failed: ${err?.message || err}`);
      }
    },
  };
};

// ---------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------

function summarize(s) {
  const parts = [`Today ${s.day}: ${compact(s.total)} tokens`];
  parts.push(`(in ${compact(s.input)} · out ${compact(s.output)})`);
  if (TARGET > 0) parts.push(`· ${Math.round((s.total / TARGET) * 100)}% of ${compact(TARGET)}`);
  parts.push(`· ${clock()}`);
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// State (file is source of truth so concurrent sessions accumulate correctly).
// ---------------------------------------------------------------------------

function fresh(day, history) {
  return { tz: TZ, day, input: 0, output: 0, total: 0, byModel: {}, history: history || {} };
}

function loadReconciled() {
  const today = dayKey();
  let state;
  try {
    state = JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    state = null;
  }
  if (!state || typeof state !== "object") return fresh(today);

  if (state.day !== today) {
    // Roll over: archive the finished day's total, then start the new day clean.
    const history = state.history && typeof state.history === "object" ? { ...state.history } : {};
    if (state.day && num(state.total) > 0) history[state.day] = num(state.total);
    const trimmed = {};
    for (const k of Object.keys(history).sort().slice(-HISTORY_DAYS)) trimmed[k] = history[k];
    return fresh(today, trimmed);
  }

  state.tz = TZ;
  if (!state.history || typeof state.history !== "object") state.history = {};
  if (typeof state.output !== "number") state.output = 0;
  return state;
}

function persist(state) {
  try {
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    const tmp = `${STATE_FILE}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(state, null, 2));
    renameSync(tmp, STATE_FILE); // atomic replace
  } catch {
    /* best-effort persistence */
  }
}

function bump(delta, modelKey) {
  const state = loadReconciled();
  state.input = num(state.input) + delta.input;
  state.output = num(state.output) + delta.output;
  state.total = num(state.total) + delta.spent;
  if (modelKey) state.byModel[modelKey] = num(state.byModel[modelKey]) + delta.spent;
  persist(state);
  return state;
}

// ---------------------------------------------------------------------------
// Time (Brussels by default; CET/CEST handled automatically by Intl).
// ---------------------------------------------------------------------------

let TZ_OK = null;
function safeTz() {
  if (TZ_OK === null) {
    try {
      new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
      TZ_OK = true;
    } catch {
      TZ_OK = false;
    }
  }
  return TZ_OK ? TZ : undefined; // undefined => system local time fallback
}

function dayKey() {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: safeTz(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function clock() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: safeTz(),
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());
}

function tzLabel() {
  return safeTz() || "system-local";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveStateFile() {
  if (process.env.OPENCODE_USAGE_FILE) return process.env.OPENCODE_USAGE_FILE;
  const base = process.env.XDG_DATA_HOME || join(homedir(), ".local", "share");
  return join(base, "opencode", "daily-usage.json");
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
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const v = parseInt(raw, 10);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}
