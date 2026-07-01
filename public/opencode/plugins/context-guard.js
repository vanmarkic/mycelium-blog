/**
 * context-guard.js — keep verbose tool output from bloating the context window.
 *
 * The cheapest token is the one you never put in context. This plugin does two
 * things, both aimed at the "input tokens re-sent every turn" problem:
 *
 *   1. Caps the size of read-like tool results (bash, grep, glob, list, read,
 *      webfetch). Anything over the limit is truncated to a head + tail with a
 *      marker, so a stray `cat huge.log` or whole-repo grep can't silently drag
 *      tens of thousands of tokens into every subsequent request.
 *
 *   2. Nudges toward disciplined reads: warns when a whole large file is read
 *      without a line range (offset/limit). Set OPENCODE_BLOCK_FULL_READS=1 to
 *      turn the nudge into a hard block.
 *
 * Install: drop in ~/.config/opencode/plugins/ or .opencode/plugins/.
 *
 * Configure (all optional):
 *   OPENCODE_MAX_TOOL_OUTPUT_CHARS   default 20000 (~5k tokens). 0 disables trimming.
 *   OPENCODE_FULL_READ_LINES         file-size threshold for the read nudge, default 1500
 *   OPENCODE_BLOCK_FULL_READS        "1" to block (instead of warn) large unranged reads
 */

import { statSync, readFileSync } from "node:fs";

const MAX_CHARS = intEnv("OPENCODE_MAX_TOOL_OUTPUT_CHARS", 20000);
const FULL_READ_LINES = intEnv("OPENCODE_FULL_READ_LINES", 1500);
const BLOCK_FULL_READS = process.env.OPENCODE_BLOCK_FULL_READS === "1";

// Tools whose output is informational and safe to truncate. We deliberately do
// NOT touch edit/write/patch results, whose exact text may matter downstream.
const TRUNCATABLE = new Set([
  "bash", "grep", "glob", "list", "read", "webfetch", "ripgrep", "tree", "ls",
]);

export const ContextGuard = async ({ client }) => {
  const log = async (level, message, extra) => {
    try {
      await client?.app?.log?.({ service: "context-guard", level, message, extra });
    } catch {
      /* never break a session on logging */
    }
  };

  return {
    "tool.execute.before": async (input, output) => {
      try {
        if (input?.tool !== "read") return;
        const args = output?.args || {};
        const hasRange =
          num(args.offset) > 0 || num(args.limit) > 0 ||
          num(args.startLine) > 0 || num(args.endLine) > 0;
        if (hasRange) return;

        const fp = args.filePath || args.path;
        if (!fp) return;

        const lines = countLines(fp);
        if (lines <= FULL_READ_LINES) return;

        const msg =
          `read of ${fp} (~${lines} lines) with no line range. ` +
          `Prefer a ranged read (offset/limit) or grep first — full reads inflate ` +
          `every subsequent turn's context.`;
        if (BLOCK_FULL_READS) {
          await log("warn", `blocked large unranged ${msg}`);
          throw new Error(`[context-guard] Large unranged ${msg}`);
        }
        await log("warn", `large unranged ${msg}`);
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("[context-guard]")) throw err;
        await log("error", `context-guard before-hook failed: ${err?.message || err}`);
      }
    },

    "tool.execute.after": async (input, output) => {
      try {
        if (MAX_CHARS <= 0) return;
        if (!TRUNCATABLE.has(input?.tool)) return;
        const text = output?.output;
        if (typeof text !== "string" || text.length <= MAX_CHARS) return;

        const removed = text.length - MAX_CHARS;
        const headLen = Math.floor(MAX_CHARS * 0.7);
        const tailLen = MAX_CHARS - headLen;
        output.output =
          text.slice(0, headLen) +
          `\n\n… [context-guard: trimmed ${removed.toLocaleString("en-US")} chars ` +
          `(~${Math.round(removed / 4).toLocaleString("en-US")} tokens) from a ` +
          `${input.tool} result — narrow the query or use a line range] …\n\n` +
          text.slice(text.length - tailLen);

        await log("info", `trimmed ${input.tool} output`, {
          tool: input.tool,
          originalChars: text.length,
          keptChars: MAX_CHARS,
        });
      } catch (err) {
        await log("error", `context-guard after-hook failed: ${err?.message || err}`);
      }
    },
  };
};

function countLines(fp) {
  try {
    const st = statSync(fp);
    if (!st.isFile()) return 0;
    // Cheap guard: for very large files, estimate rather than reading it all.
    if (st.size > 2_000_000) return Math.round(st.size / 40);
    let count = 0;
    const buf = readFileSync(fp, "utf-8");
    for (let i = 0; i < buf.length; i++) if (buf.charCodeAt(i) === 10) count++;
    return count + 1;
  } catch {
    return 0;
  }
}

function num(v) {
  const n = typeof v === "number" ? v : parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

function intEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const v = parseInt(raw, 10);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}
