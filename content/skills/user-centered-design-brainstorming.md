---
title: "User-Centered Design Brainstorming Skill"
date: "2025-12-18"
status: published
privacy: public
tags:
  - claude-code
  - ux
  - user-experience
  - design
  - personas
  - user-journeys
repos: []
skills:
  - user-centered-design-brainstorming
patterns:
  - user-first-design
relatedTo: []
description: "Claude Code skill for refining ideas into user-validated designs through mandatory user understanding gates, approach selection, and flexible UCD methods"
---

## Overview

Turn ideas into user-validated designs through collaborative dialogue with mandatory user understanding before solutions.

**Core principle:** Understand users before designing solutions. No wireframe without validated user needs.

## When to Use

**Use when:** User explicitly mentions "UX", "user-centered", "UI design", "user experience", or asks to design/improve an interface.

**Don't use when:**
- Pure backend/API work with no user-facing component
- General brainstorming without UCD focus → use `brainstorming` skill instead

## Process Flow

```
1. Context Check (project state, files, docs)
   ↓
2. Choose UCD Approach (ask user)
   ↓
3. User Understanding Phase (MANDATORY GATE)
   ↓
4. Solution Exploration
   ↓
5. Design Presentation (sections, validate each)
   ↓
6. Output Document
```

## Step 1: UCD Approach Selection

Present these options - let user choose:

| Approach | When to use | Methods |
|----------|-------------|---------|
| **A. User Research** | New product/feature, unknown users | Personas, user journeys, empathy maps, JTBD |
| **B. Usability** | Existing UI with friction | Heuristic evaluation, cognitive walkthrough |
| **C. Interaction Design** | Known users, need structure | Information architecture, task flows |
| **D. Comprehensive** | High-stakes, time available | All methods combined |
| **E. Lightweight** | Time-constrained | Key questions + quick validation |

## Step 2: Mandatory User Validation Gate

**STOP before any solution work. Answer these:**

1. **Who** is the user? (role, context, constraints)
2. **What** are they trying to accomplish? (goal, not feature)
3. **Why** does this matter to them? (motivation, pain point)
4. **When/Where** do they encounter this? (context of use)

```
Can you answer all 4?
  ├─ Yes → Proceed to solutions
  └─ No → Gather more information first
```

## Step 3: Solution Exploration

**Generate 2-3 approaches** covering:
- Interaction pattern (how user accomplishes goal)
- Information hierarchy (prominent vs. secondary)
- Key screens/states (happy path + edge cases)

**Validate each solution:**
- Does this solve user's actual goal?
- What could go wrong for the user?
- How would we know if this succeeds?

## Output Format

```markdown
# [Feature Name] - User-Centered Design

## User Understanding
- **Who:** [user description]
- **Goal:** [what they're accomplishing]
- **Motivation:** [why it matters]
- **Context:** [when/where]

## Approach Used
[A/B/C/D/E + rationale]

## Proposed Solution
[Recommended approach]

## Trade-offs Considered
[Alternatives and why not chosen]

## Success Criteria
[How we know this works]
```

## Quick Reference

| Method | One-liner |
|--------|-----------|
| Persona | Fictional user representing a segment |
| User Journey | Steps user takes to achieve goal |
| JTBD | "When [situation], I want to [motivation], so I can [outcome]" |
| Heuristics | Nielsen's 10 usability principles |
| WCAG | Accessibility guidelines (A/AA/AAA) |

## Red Flags - You're Skipping UCD

- Jumping to wireframes without Who/What/Why/When
- "Users want X" without validation
- Designing edge cases before happy path
- Skipping validation because "we know the users"

→ All mean: STOP. Return to validation gate.

## Mycelium Links

Related:
- **brainstorming**: General idea refinement without UCD focus
- **gestalt-information-architecture**: Structure information for users
- **frontend-design**: Visual implementation after UCD validation
