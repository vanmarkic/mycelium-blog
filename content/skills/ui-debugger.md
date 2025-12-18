---
title: UI Debugger Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - debugging
  - playwright
  - chrome-devtools
  - keyboard-events
repos: []
skills:
  - ui-debugger
patterns:
  - systematic-debugging
relatedTo:
  - kirby-content-fixer
description: >-
  Claude Code skill for debugging UI bugs involving keyboard events, mouse
  events, focus, selection, and DOM mutations
---

## Overview

The UI Debugger skill provides a systematic approach to diagnosing UI interaction bugs — especially when "something disappears" or "doesn't work with keyboard but works with mouse". It uses Chrome DevTools MCP and Playwright utilities to capture event flows and DOM changes.

## When To Use

Invoke this skill when:
- User reports UI bug with keyboard/mouse interaction differences
- Selection or focus behaves unexpectedly
- Content "disappears" or gets "replaced" unexpectedly
- Event handlers seem to fire in wrong order
- Rich text editors (TipTap, ProseMirror, Slate) have input issues

## Prerequisites

### Chrome DevTools MCP

For full debugging capabilities, enable the official Chrome DevTools MCP server:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

With Chrome DevTools MCP you can:
- List event listeners on elements
- Set breakpoints before events
- Monitor DOM mutations with stack traces
- Inspect selection state

## Diagnostic Questions (Ask First)

Before writing any fix:

1. **What exactly appears on screen after the action?** (not "it disappears" but "it shows X instead of Y")
2. **Does the same action work with mouse? With keyboard?** (isolates event handling)
3. **What replaces the content?** (newline, empty, different text)

## Playwright Debug Utilities

### DOM Diff Tool

Captures before/after state on key events:

```typescript
async function injectDOMDiff(page: Page, selector: string) {
  await page.evaluate((sel) => {
    window._domDebug = { before: null, after: null };

    document.addEventListener('keydown', (e) => {
      window._domDebug.before = {
        html: document.querySelector(sel)?.innerHTML,
        selection: window.getSelection()?.toString(),
        key: e.key
      };
    }, true);

    document.addEventListener('keyup', (e) => {
      window._domDebug.after = {
        html: document.querySelector(sel)?.innerHTML,
        selection: window.getSelection()?.toString()
      };
      if (window._domDebug.before?.html !== window._domDebug.after?.html) {
        console.log('[DOM-DIFF] Content changed by', e.key);
      }
    });
  }, selector);
}
```

### Event Flow Tracer

Shows handler execution order:

```typescript
async function injectEventTracer(page: Page, eventTypes: string[]) {
  await page.evaluate((types) => {
    window._eventTrace = [];
    types.forEach(type => {
      document.addEventListener(type, (e) => {
        console.log(`[EVT] ${type} CAPTURE (prevented: ${e.defaultPrevented})`);
      }, true);
      document.addEventListener(type, (e) => {
        console.log(`[EVT] ${type} BUBBLE (prevented: ${e.defaultPrevented})`);
      }, false);
    });
  }, eventTypes);
}
```

### Selection Monitor

Tracks focus and selection changes:

```typescript
document.addEventListener('selectionchange', () => {
  const sel = window.getSelection();
  console.log(`[SEL] Changed: "${sel?.toString()}" (ranges: ${sel?.rangeCount})`);
});

document.addEventListener('focusout', (e) => {
  const sel = window.getSelection();
  console.log(`[FOCUS] OUT, selection: "${sel?.toString()}"`);
}, true);
```

## Common Root Causes

| Symptom in logs | Root cause | Fix |
|-----------------|------------|-----|
| `keydown BUBBLE` but no `CAPTURE` | Handler not in capture phase | Add `true` as 3rd arg |
| `characterData` mutation with newline | Editor processed Enter first | Use capture phase |
| `selection: ""` after keydown | Selection cleared by focus change | Preserve in state |
| `FOCUS OUT` before handler | Focus moved to button | `preventDefault()` on mousedown |

## Checklist Before Proposing Fix

- [ ] Identified what EXACTLY changes (DOM diff shows before/after)
- [ ] Identified WHICH handler fires first (event trace shows order)
- [ ] Confirmed mouse vs keyboard behavior difference
- [ ] Found the mutation that causes the problem
- [ ] Verified selection state at each step

## Session Retrospective Template

After fixing a UI interaction bug:

```markdown
## Bug: [one-line description]

### Symptom
[What user sees]

### Root Cause
[Event order, DOM changes - be specific]

### Key Diagnostic
[Which tool revealed the cause]

### Fix
[Code change with explanation]
```

## Mycelium Links

Related:
- **systematic-debugging** pattern: Four-phase debugging framework
- **ui-testing** skill: Systematic UI test generation
- **test-driven-development**: Write failing test before fix
