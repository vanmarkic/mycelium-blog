---
title: Exhaustive Verification Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - verification
  - quality-assurance
  - workflow
repos: []
skills:
  - exhaustive-verification
patterns:
  - verification-before-completion
relatedTo:
  - ui-testing
description: >-
  Claude Code skill for preventing premature task completion by requiring
  iterative self-questioning until no new issues found
---

## Overview

**Never declare a task complete without iterative verification.** Ask "did I miss anything?" repeatedly until no new issues surface. The simpler the task seems, the more likely you'll skip verification and miss something.

## The Iron Rule

```
Ask "did I miss anything?" → Find something → Fix it → Ask again
Ask "did I miss anything?" → Find nothing → Ask AGAIN
Ask "did I miss anything?" → Still nothing → NOW you're done
```

**Minimum: 3 verification rounds with no new findings before declaring complete.**

## When to Use

**Always.** Every single task. No exceptions.

- One-line changes
- "Obvious" fixes
- Tasks where tests pass on first try
- After user says "looks good"
- After exhausting multi-step work

## Common Rationalizations (All Invalid)

| Excuse | Reality |
|--------|---------|
| "It's just a one-line change" | One-line changes break things. Verify. |
| "Tests pass" | Tests don't cover everything. Check edge cases. |
| "It's too simple to need verification" | Simple = easy to skip steps. Verify MORE. |
| "User approved it" | User didn't see the code. You did. Verify. |
| "I'm exhausted after many fixes" | Exhaustion = more likely to miss things. Slow down. |
| "I already know it works" | You don't know until you verify. Check anyway. |
| "I verified mentally" | Mental verification doesn't count. Take ACTION. |

## Verification Checklist

Each round, ask:

1. **Does it actually work?** (Run it, don't assume)
2. **Are there similar patterns elsewhere?** (Grep for related code)
3. **Did I update all affected files?** (Check imports, tests, docs)
4. **Are there edge cases?** (Empty, null, error states)
5. **Does the fix match the original request?** (Re-read the requirement)
6. **Did I introduce new issues?** (TypeScript errors, lint, test failures)

## The "Trivial Task" Trap

**The simpler a task seems, the MORE verification it needs.**

Why? Because:
- Simple tasks create false confidence
- You skip steps you'd do for complex work
- Small changes can have large ripple effects
- "Quick fixes" are where bugs hide

**Red flag phrases that mean VERIFY MORE:**
- "This is just..."
- "It's only..."
- "Quick change..."
- "Obviously..."
- "Simply..."

## Stopping Condition

You may declare complete ONLY when:

1. You've asked "did I miss anything?" at least 3 times
2. Each round found ZERO new issues
3. You've verified the work actually functions (not just compiles/passes)

If any round finds something, the counter resets.

## Anti-Pattern: Batched Completion

**Wrong:** Complete 5 tasks, then verify all at once.
**Right:** Verify each task fully before starting the next.

Batching lets issues compound and makes root causes harder to trace.

## Mycelium Links

Related:
- **verification-before-completion**: Run verification commands before claiming success
- **test-driven-development**: Tests are part of verification, not a replacement
- **systematic-debugging**: Use when verification reveals issues
