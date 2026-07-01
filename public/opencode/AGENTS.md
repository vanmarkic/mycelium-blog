# AGENTS.md — lean by design

> This file is re-sent to the model on **every turn**. Every line here is a
> per-turn tax, exactly like a skill description. Keep it short and specific;
> move anything long-lived or reference-y into files the agent reads on demand.
> A 2,000-word AGENTS.md across a 300-turn session is ~600k tokens of pure overhead.

## Project
- One sentence: what this repo is and the stack.

## Conventions
- Language/formatter/linter and the single command to run each.
- Test command. Run it before claiming a change works.

## Context discipline (for the agent)
- Search before reading: `grep`/`glob` to locate, then read with a **line range**, not whole files.
- Prefer targeted edits over pasting large files into the conversation.
- One task per session. Start fresh (`/new`) between unrelated tasks.
- Don't dump build/test logs back verbatim — summarize failures.

## Don't
- List the few things that are genuinely off-limits (paths, commands, secrets).

<!--
Trim this to what's true for your repo. If a section isn't earning its tokens
on most turns, delete it — the model can always read a file when it needs detail.
-->
