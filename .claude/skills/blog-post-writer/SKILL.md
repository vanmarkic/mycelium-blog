---
name: blog-post-writer
description: Use when completing blog post drafts with story sections - systematically analyzes commit history to write Context, Challenge, Solution, and Learned sections without making unverified assumptions about business context
scopes:
  - read
  - write
---

# Blog Post Writer

## Overview

Completes technical blog drafts by analyzing commit history and writing engaging first-person narratives. Two styles supported:

1. **Retrospective**: Grounded in actual work (commit-based, evidence-driven)
2. **Exploratory**: Thought experiments and forward-looking ideas

Most drafts generated from repos use retrospective style.

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

## Narrative Techniques (from effective technical blogs)

### Conversational Hooks
**Bad Opening:**
> This post describes the implementation of a calculator system in touchepas.

**Good Opening:**
> I spent three days fighting TypeScript's type system. Turns out, it was trying to tell me something important.

**Pattern:** Start with a human moment, not technical summary

### Self-Aware Honesty
Acknowledge messiness, mistakes, uncertainty:
- "I'm still not sure this was the right approach"
- "This is obviously a mess, but it works"
- "I probably should have done X, but here's what I actually did"

**Why it works:** Builds trust, makes you relatable, prevents defensive reading

### Problem Escalation
Structure your narrative with escalating questions:
1. Open: Should I do X?
2. Middle: What's hard about X?
3. End: Given we're doing X, what's the best way?

By the end, reader presupposes agreement with your approach.

### Show the Thought Process
Don't just show the solution—show the **path to the solution**:
- "My first attempt was..."
- "That broke because..."
- "So I tried..."
- "Which revealed..."

**Example from Ben Anderson's "Should I Buy Claude a Mac Mini?"**:
> "I am buying Claude a Mac Mini. Or at least, I'm thinking about it."

Opens with uncertainty, invites reader into deliberation rather than presenting conclusion.

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
- **Start with a hook** - human moment, not technical summary
  - Bad: "This post describes the work on touchepas"
  - Good: "I needed a rent calculator that didn't lie to me"
- State what the project does based on feature commits
- Use conversational bridges: "Here's what happened...", "I started with..."
- **Avoid assuming business context** not evident in commits
- 2-3 paragraphs

**Example opening:**
> I spent October refactoring a calculator system. Not because I wanted to—because TypeScript forced my hand. That void-returning function? It was a type bomb waiting to explode.

**Challenge Section:**
- **Be honest about what was hard** - not just "here's what I did"
  - "This took longer than it should have"
  - "I went down the wrong path first"
  - "The real problem wasn't what I thought"
- Use fix commits as evidence of problems
- Use refactor commits as evidence of complexity
- Show the **path** to understanding, not just the understanding
- 2-4 paragraphs

**Example:**
> The first version worked. Sort of. It passed tests, but I knew it was fragile. The void return type was technically correct—there are cases where no result makes sense. But TypeScript was warning me: "Are you sure about this?" I ignored it. Mistake.

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
