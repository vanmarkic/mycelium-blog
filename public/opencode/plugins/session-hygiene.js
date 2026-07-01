/**
 * session-hygiene.js — "one task, one session."
 *
 * The highest-value habit for token-frugal agentic coding is starting a fresh
 * session per task. A long-running session re-sends an ever-growing history on
 * every turn, so cost climbs roughly quadratically with length. This plugin
 * watches each session's turn count and cumulative input tokens and nudges you
 * to run /new (or `opencode` afresh) once a session gets expensive.
 *
 * It never blocks anything — it just warns, once per threshold per session.
 *
 * Install: drop in ~/.config/opencode/plugins/ or .opencode/plugins/.
 *
 * Configure (all optional):
 *   OPENCODE_HYGIENE_MAX_TURNS   assistant turns before nudging, default 50
 *   OPENCODE_HYGIENE_MAX_INPUT   cumulative session input tokens, default 5000000 (5M)
 */

const MAX_TURNS = intEnv("OPENCODE_HYGIENE_MAX_TURNS", 50);
const MAX_INPUT = intEnv("OPENCODE_HYGIENE_MAX_INPUT", 5_000_000);

export const SessionHygiene = async ({ client }) => {
  // sessionID -> { turns, input, counted:Set, warnedTurns, warnedInput }
  const sessions = new Map();

  const log = async (level, message, extra) => {
    try {
      await client?.app?.log?.({ service: "session-hygiene", level, message, extra });
    } catch {
      /* never break a session on logging */
    }
  };
  const toast = async (message) => {
    try {
      await client?.tui?.showToast?.({ body: { message, variant: "info" } });
    } catch {
      /* optional */
    }
  };

  return {
    event: async ({ event }) => {
      try {
        if (!event) return;

        // Reset our tracking when a brand-new session starts.
        if (event.type === "session.created") {
          const id = event.properties?.info?.id;
          if (id) sessions.delete(id);
          return;
        }

        if (event.type !== "message.updated") return;
        const info = event.properties?.info;
        if (!info || info.role !== "assistant" || !info.time?.completed) return;

        const sid = info.sessionID || "unknown";
        let s = sessions.get(sid);
        if (!s) {
          s = { turns: 0, input: 0, counted: new Set(), warnedTurns: false, warnedInput: false };
          sessions.set(sid, s);
        }
        if (info.id && s.counted.has(info.id)) return;
        if (info.id) s.counted.add(info.id);

        s.turns += 1;
        s.input += num(info.tokens?.input);

        if (!s.warnedTurns && s.turns >= MAX_TURNS) {
          s.warnedTurns = true;
          const msg =
            `This session has ${s.turns} turns. Long sessions re-send a growing ` +
            `history every turn — consider /new for a fresh, cheaper context.`;
          await log("warn", msg, { sessionID: sid, turns: s.turns });
          await toast(`${s.turns} turns — consider /new for a fresh session.`);
        }
        if (!s.warnedInput && s.input >= MAX_INPUT) {
          s.warnedInput = true;
          const msg =
            `This session has consumed ${fmt(s.input)} input tokens. That's a lot of ` +
            `re-sent context — start a fresh session (/new) to reset the baseline.`;
          await log("warn", msg, { sessionID: sid, input: s.input });
          await toast(`${fmt(s.input)} input tokens this session — consider /new.`);
        }
      } catch (err) {
        await log("error", `session-hygiene handler failed: ${err?.message || err}`);
      }
    },
  };
};

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
