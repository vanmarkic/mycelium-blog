/**
 * token-budget.js — a hard daily token budget for OpenCode.
 *
 * Caps total tokens per day (default 40,000,000) across ALL sessions and models.
 * Tracks input + output + reasoning tokens reported on each finished assistant
 * message, persists a running total to disk, warns as you approach the cap, and
 * (in the default "block" mode) refuses further model calls once the cap is hit.
 *
 * Why this exists: in an agent loop the full conversation is re-sent every turn,
 * so input tokens dominate and grow roughly quadratically with session length.
 * A daily ceiling is the backstop that turns "I burned 40M before lunch" into
 * "OpenCode stopped me at 40M and told me why."
 *
 * Install: drop this file in ~/.config/opencode/plugins/ (global) or
 * .opencode/plugins/ (project). It auto-loads at startup. No config entry needed.
 *
 * Configure via environment variables (all optional):
 *   OPENCODE_DAILY_TOKEN_BUDGET   integer, default 40000000 (40M)
 *   OPENCODE_BUDGET_MODE          "block" (default) | "warn"
 *   OPENCODE_BUDGET_WINDOW        "HH:MM-HH:MM" local time, e.g. "08:00-18:00".
 *                                 If set, the counter only tracks/enforces inside
 *                                 this window; outside it the plugin is a no-op.
 *   OPENCODE_BUDGET_COUNT_CACHE   "1" to also count cache read/write tokens
 *   OPENCODE_BUDGET_FILE          override the state file path
 *
 * State is written to (in order of preference):
 *   $OPENCODE_BUDGET_FILE
 *   $XDG_DATA_HOME/opencode/token-budget.json
 *   ~/.local/share/opencode/token-budget.json
 */

import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

const BUDGET = intEnv("OPENCODE_DAILY_TOKEN_BUDGET", 40_000_000);
const MODE = (process.env.OPENCODE_BUDGET_MODE || "block").toLowerCase();
const COUNT_CACHE = process.env.OPENCODE_BUDGET_COUNT_CACHE === "1";
const WINDOW = parseWindow(process.env.OPENCODE_BUDGET_WINDOW);
const STATE_FILE = resolveStateFile();

// Warn once per threshold per day so the toasts don't spam.
const THRESHOLDS = [0.5, 0.75, 0.9, 1.0];

export const TokenBudget = async ({ client }) => {
  // Messages this process has already counted (dedup across repeated updates).
  const counted = new Set();

  const log = async (level, message, extra) => {
    try {
      await client?.app?.log?.({ service: "token-budget", level, message, extra });
    } catch {
      /* logging must never break a session */
    }
  };

  // Best-effort toast; the SDK surface varies by version, so guard everything.
  const toast = async (message, variant) => {
    try {
      await client?.tui?.showToast?.({ body: { message, variant: variant || "info" } });
    } catch {
      /* toast is optional */
    }
  };

  const announceCrossings = async (before, after) => {
    for (const t of THRESHOLDS) {
      const mark = BUDGET * t;
      if (before < mark && after >= mark) {
        const pct = Math.round(t * 100);
        const msg =
          t >= 1
            ? `Daily token budget REACHED: ${fmt(after)} / ${fmt(BUDGET)} (${pct}%).` +
              (MODE === "block" ? " Further model calls are blocked until reset." : "")
            : `Token budget at ${pct}%: ${fmt(after)} / ${fmt(BUDGET)} today.`;
        await log(t >= 1 ? "warn" : "info", msg, { used: after, budget: BUDGET });
        await toast(msg, t >= 0.9 ? "warning" : "info");
      }
    }
  };

  await log("info", `token-budget active: ${fmt(BUDGET)}/day, mode=${MODE}` +
    (WINDOW ? `, window=${process.env.OPENCODE_BUDGET_WINDOW}` : ""));

  return {
    // Accumulate usage as assistant messages finish.
    event: async ({ event }) => {
      try {
        if (!event || event.type !== "message.updated") return;
        if (WINDOW && !inWindow(new Date(), WINDOW)) return;

        const info = event.properties?.info;
        if (!info || info.role !== "assistant") return;
        // Only count a finished message, exactly once.
        if (!info.time?.completed) return;
        if (info.id && counted.has(info.id)) return;

        const tok = info.tokens || {};
        const spent =
          num(tok.input) +
          num(tok.output) +
          num(tok.reasoning) +
          (COUNT_CACHE ? num(tok.cache?.read) + num(tok.cache?.write) : 0);
        if (spent <= 0) return;

        if (info.id) counted.add(info.id);

        const { before, after } = bump(spent, info.modelID || info.providerID);
        await announceCrossings(before, after);
      } catch (err) {
        await log("error", `token-budget event handler failed: ${err?.message || err}`);
      }
    },

    // Enforce the ceiling before every model call.
    "chat.params": async (_input, _output) => {
      if (MODE !== "block") return;
      if (WINDOW && !inWindow(new Date(), WINDOW)) return;
      try {
        const used = readTotal();
        if (used >= BUDGET) {
          const msg =
            `Daily token budget exhausted: ${fmt(used)} / ${fmt(BUDGET)} used today. ` +
            `Blocking further model calls until the next day` +
            (WINDOW ? ` (or outside the ${process.env.OPENCODE_BUDGET_WINDOW} window)` : "") +
            `. Raise OPENCODE_DAILY_TOKEN_BUDGET or set OPENCODE_BUDGET_MODE=warn to override.`;
          await log("warn", msg, { used, budget: BUDGET });
          await toast("Daily token budget reached — model calls blocked.", "error");
          throw new Error(`[token-budget] ${msg}`);
        }
      } catch (err) {
        // Re-throw our own guard; swallow anything else so we never wedge a session.
        if (err instanceof Error && err.message.startsWith("[token-budget]")) throw err;
        await log("error", `token-budget chat.params check failed: ${err?.message || err}`);
      }
    },
  };
};

// ---------------------------------------------------------------------------
// State (file is source of truth so concurrent sessions accumulate correctly).
// ---------------------------------------------------------------------------

function emptyState(day) {
  return { day, input: 0, output: 0, reasoning: 0, total: 0, byModel: {} };
}

function loadReconciled() {
  const today = dayKey(new Date());
  let state;
  try {
    state = JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    state = null;
  }
  if (!state || typeof state !== "object" || state.day !== today) {
    return emptyState(today);
  }
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

function bump(spent, modelKey) {
  const state = loadReconciled();
  const before = num(state.total);
  state.total = before + spent;
  // We only have a combined delta broken out per finished message; store the sum.
  state.input = num(state.input); // preserved for external readers
  if (modelKey) state.byModel[modelKey] = num(state.byModel[modelKey]) + spent;
  persist(state);
  return { before, after: state.total };
}

function readTotal() {
  return num(loadReconciled().total);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveStateFile() {
  if (process.env.OPENCODE_BUDGET_FILE) return process.env.OPENCODE_BUDGET_FILE;
  const base =
    process.env.XDG_DATA_HOME || join(homedir(), ".local", "share");
  return join(base, "opencode", "token-budget.json");
}

function dayKey(d) {
  // Local calendar day, YYYY-MM-DD.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseWindow(spec) {
  if (!spec) return null;
  const m = /^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/.exec(spec.trim());
  if (!m) return null;
  const start = Number(m[1]) * 60 + Number(m[2]);
  const end = Number(m[3]) * 60 + Number(m[4]);
  return { start, end };
}

function inWindow(d, w) {
  const mins = d.getHours() * 60 + d.getMinutes();
  // Handles normal windows (08:00-18:00) and overnight ones (22:00-06:00).
  return w.start <= w.end
    ? mins >= w.start && mins < w.end
    : mins >= w.start || mins < w.end;
}

function num(v) {
  return typeof v === "number" && isFinite(v) ? v : 0;
}

function intEnv(name, fallback) {
  const v = parseInt(process.env[name] || "", 10);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function fmt(n) {
  return n.toLocaleString("en-US");
}
