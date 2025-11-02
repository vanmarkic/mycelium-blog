---
name: blog-post-writer
description: Use when completing blog post drafts with story sections - systematically analyzes commit history to write Context, Challenge, Solution, and Learned sections without making unverified assumptions about business context
scopes:
  - read
  - write
---

# Blog Post Writer

## Overview

Completes technical blog drafts by analyzing commit history and writing first-person narratives for the four story sections, staying grounded in actual commit evidence.

## When to Use

**Use when:**
- Draft file has empty Context/Challenge/Solution/Learned sections
- Commit history provided shows development work
- You need story-driven content without making unverified assumptions

**Don't use when:**
- Writing original blog posts from scratch
- No commit history available
- Draft doesn't follow the four-section structure

## Core Pattern: Evidence-Based Narrative

**Before (Baseline Behavior):**
```markdown
### Context
touchepas is a rent indexation calculator for Belgium...
[Makes assumptions about business domain from commit messages]
```

**After (With Skill):**
```markdown
### Context
touchepas implements calculation logic for different regional scenarios.
The commits show a pattern of building calculator strategies...
[Stays grounded in what commits actually show]
```

## Quick Reference: The 4 Sections

| Section | Focus | Evidence Source |
|---------|-------|----------------|
| **Context** | What you were building | Feature commits, docs commits |
| **Challenge** | What made it difficult | Fix commits, refactor commits |
| **Solution** | How you approached it | Implementation patterns in commits |
| **Learned** | Takeaways | Reflections on commit patterns |

## Implementation

### Step 1: Read the Draft Completely

```bash
# Read the entire draft first
Read content/drafts/2025-11-02-example.md
```

Note:
- The introduction (auto-generated context)
- Notable features/challenges/evolution listed in comments
- All commit messages at the bottom

### Step 2: Analyze Commit Patterns

Group commits by type:
- **Features**: `feat:`, `add`, `implement`, `create`
- **Fixes**: `fix:`, `bugfix`, `resolve`
- **Refactoring**: `refactor:`, `improve`, `optimize`
- **Docs**: `docs:`, `README`, `documentation`
- **Tests**: `test:`, `spec`, `coverage`

### Step 3: Write Sections Using Evidence

**Context Section:**
- State what the project does based on feature commits
- Use phrases like "The commits show...", "Development focused on..."
- **Avoid assuming business context** not evident in commits
- 2-3 paragraphs

**Challenge Section:**
- Use fix commits as evidence of problems
- Use refactor commits as evidence of complexity
- Mention trade-offs visible in commit sequence
- 2-4 paragraphs

**Solution Section:**
- Walk through the approach using commit chronology
- Include 1-2 code snippets **if you have repo access** (otherwise describe patterns from commits)
- Connect commits into a narrative arc
- 3-5 paragraphs (with code if available)

**Learned Section:**
- Extract lessons from the commit patterns
- Reference specific commits as evidence
- Mention what you'd do differently
- 2-3 paragraphs

### Step 4: Use First-Person Voice

Write as "I built", "I discovered", "I learned" - not "we" or "the developer".

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| **Making unverified assumptions** | Stay grounded in commits. Use obvious context (project name, tech stack) but don't invent user needs or business requirements not shown in commits |
| **Ignoring draft's commit insights** | Use the "Notable features/challenges" section as starting points |
| **Listing commits instead of telling story** | Connect commits with "This led to...", "Which revealed...", "After that..." |
| **Generic code snippets** | Show actual patterns from the codebase, not contrived examples |
| **Third-person narration** | Always use first person: "I implemented" not "The code implements" |

## Example: Before & After

**Before (Ungrounded Assumption):**
> touchepas is a rent indexation calculator for Belgium. The project needed to calculate rent adjustments based on regional health index data.

**After (Evidence-Based):**
> touchepas implements calculation logic with a strategy pattern. The commits show adding a BrusselsCalculator, then a registry dispatcher, suggesting support for multiple calculation approaches.

**Before (Listing):**
> First I added the calculator interface. Then I implemented BrusselsCalculator. Then I added tests.

**After (Story Arc):**
> I started with a calculator interface to define the contract. This forced me to think about return types—which surfaced a void vs null inconsistency that TypeScript caught. The test-first commits show the RED-GREEN-REFACTOR cycle working.

## Red Flags - STOP and Revise

If you find yourself:
- Inventing user needs or business requirements not shown in commits
- Writing "Users need..." without evidence
- Copying commit messages without synthesis
- Creating fake code examples when you don't have repo access
- Writing in third person

**Stop. Re-read the commits. Stay grounded in evidence.**

## Code Snippet Guidelines

**If you have repo access:**
- Include 1-2 real code snippets showing key patterns
- Add context explaining why this code matters

**If you DON'T have repo access:**
- Describe patterns inferred from commit messages
- Example: "The commits suggest a strategy pattern with a registry dispatcher..."
- Don't invent code—describe the approach instead
