---
name: blog-post-writer
description: Use when completing blog post drafts with narrative story sections - analyzes commit history to fill in Context, Challenge, Solution, and Learned sections with engaging first-person narratives that connect technical decisions into story arcs
scopes:
  - read
  - write
---

# Blog Post Writer

## Overview

Transforms technical blog post drafts into human-readable narratives by analyzing commit history and generating story-driven content for the four narrative sections: Context, Challenge, Solution, and Learned.

## When to Use

**Use this skill when:**
- You have a generated blog draft with empty story sections
- The draft includes commit history showing features, fixes, refactoring
- You need to explain **why** decisions were made, not just **what** was built
- The post should read like a developer sharing real experience

**Don't use when:**
- Writing original content from scratch (this completes structured drafts)
- The commits don't tell a clear story
- Post needs heavy technical detail without narrative arc

## Input Format

You will receive a markdown draft file with this structure:

```markdown
## Introduction
[Auto-generated context: X commits, Y% features, tech stack, patterns]

## The Story

<!-- Commit insights provided:
Notable features built: [list]
Challenges overcome: [list]
Evolution and refinement: [list]
-->

### Context: What I Was Building
[EMPTY - You fill this in]

### The Challenge
[EMPTY - You fill this in]

### How I Solved It
[EMPTY - You fill this in]

### What I Learned
[EMPTY - You fill this in]

## Technical Details
[Tech stack, patterns, skills listed]

## All Commits (N)
[Complete commit history]
```

## Your Task

Read the draft file and **fill in the four story sections** with compelling narrative content.

## Writing Guidelines

### 1. Context: What I Was Building
- **Start with the problem**, not the technology
- Explain **why** this project exists and what pain point it solves
- Set the scene: What was the situation? What was needed?
- Keep it **2-3 paragraphs**, human and relatable

**Example:**
```markdown
### Context: What I Was Building

Rent indexation calculations in Belgium are notoriously complex. Tenants and landlords
need to navigate base indexes, correction ratios, and regional variations - often getting
it wrong and creating disputes. I wanted to build a tool that handles this complexity
automatically while remaining transparent about the calculations.

The goal was simple: enter your lease details, get an accurate indexed rent amount,
and understand exactly how it was calculated.
```

### 2. The Challenge
- **Identify the hard problems** you encountered (use the commit history!)
- Show **trade-offs and decisions** that weren't obvious
- Include **surprises** - what didn't work as expected?
- This is where you show **expertise through struggle**
- Keep it **2-4 paragraphs**

**Example:**
```markdown
### The Challenge

The biggest challenge was handling backward compatibility when the calculation logic
changed. Users had saved scenarios from version 1.0.2, but I needed to refactor the
data model to support the new global CASCO pricing feature.

Simply migrating the data wasn't enough - I needed to ensure old calculations still
produced the same results. This meant building a migration system that could detect
schema versions and transform data without breaking existing workflows.

The fix for the password gate during Astro's build process was another surprise.
Client-side environment variables weren't available at build time, requiring a
rethink of the authentication strategy.
```

### 3. How I Solved It
- **Walk through your approach** using the commit history as a guide
- **Show code** - include 1-2 meaningful snippets that illustrate key decisions
- Explain **why** you chose this approach over alternatives
- Connect commits to form a **narrative arc** (not just a list)
- This should be **3-5 paragraphs** with code examples

**Example:**
```markdown
### How I Solved It

I implemented an event-sourced chronology system to track cash flow over time.
Instead of recalculating everything on each change, the system replays events
chronologically to build the timeline state:

\`\`\`typescript
interface TimelineEvent {
  date: Date;
  type: 'income' | 'expense' | 'milestone';
  amount: number;
  recurring?: boolean;
}

function projectCashFlow(events: TimelineEvent[]): CashFlowState[] {
  return events
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((timeline, event) => {
      const previousState = timeline[timeline.length - 1] || initialState;
      const newState = applyEvent(previousState, event);
      return [...timeline, newState];
    }, []);
}
\`\`\`

This approach solved multiple problems: it made the timeline visualization
performant, enabled time-travel debugging, and created a clear audit trail
of all financial changes.

For the migration system, I built a version detector that checked the schema
and applied transformations:

\`\`\`typescript
function migrateScenarioData(data: unknown): Scenario {
  const version = detectSchemaVersion(data);

  if (version === '1.0.2') {
    // Migrate per-participant CASCO to global CASCO
    return {
      ...data,
      globalCascoPerM2: calculateGlobalRate(data.participants),
      participants: data.participants.map(p => omit(p, 'cascoPerM2'))
    };
  }

  return data;
}
\`\`\`

This let me refactor the data model while maintaining complete backward
compatibility with saved scenarios.
```

### 4. What I Learned
- Share **2-3 key takeaways** or lessons
- What would you **do differently** next time?
- What **surprised** you about the solution?
- End with a **forward-looking insight** or recommendation
- Keep it **2-3 paragraphs**

**Example:**
```markdown
### What I Learned

**Migration systems are essential for production apps.** Building the version
detection and data transformation early would have saved refactoring pain.
Now I start projects with a schema versioning strategy from day one.

**Test-driven development caught edge cases I would have missed.** The 34 tests
for the event-sourced chronology revealed issues with recurring events and
date boundaries that would have caused subtle bugs in production.

**Documentation matters as much as code.** The timeline redesign architecture
doc helped me think through the problem before coding. Writing forces clarity,
and that clarity leads to better implementations.
```

## Style Guidelines

### Voice and Tone
- **First person** ("I built", "I discovered", not "we" or "the developer")
- **Conversational but technical** - explain like talking to a senior developer
- **Show expertise through experience**, not jargon
- **Be honest** about mistakes and surprises
- **No superlatives** - avoid "amazing", "incredible", etc.

### Structure
- **Short paragraphs** (2-4 sentences) for readability
- **Code snippets** should be self-explanatory with context
- **Connect commits** into a narrative, don't just list them
- **Use commit messages** as evidence of the journey

### Technical Depth
- **Show real code** with meaningful variable names and logic
- **Explain trade-offs** - why this approach over alternatives?
- **Reference patterns** by name when applicable (event sourcing, TDD, etc.)
- **Include metrics** when available (34 tests, 48% features, etc.)

## Anti-Patterns to Avoid

❌ **Don't list commits** - "First I did X, then Y, then Z"
✅ **Tell a story** - "The challenge required X, so I built Y which led to Z"

❌ **Don't use generic placeholders** - "This project is interesting"
✅ **Be specific** - "The backward compatibility requirement forced..."

❌ **Don't explain obvious code** - "This function takes parameters"
✅ **Explain decisions** - "I chose reduce over a for loop because..."

❌ **Don't use buzzwords without context** - "leveraging synergies"
✅ **Use precise technical terms** - "event-sourced state management"

## Process

1. **Read the entire draft** - understand context, commits, and patterns
2. **Identify the core story** - what's the main challenge/solution?
3. **Group related commits** - find narrative arcs in the commit history
4. **Write each section** following the guidelines above
5. **Add code snippets** that illuminate key decisions
6. **Review** - does this read like a human wrote it? Is it engaging?

## Output

Replace the placeholder sections in the draft with your narrative content. Keep all other sections (Introduction, Technical Details, All Commits, Mycelium Links) unchanged.

The final post should read like a technical blog post where someone is sharing their real development experience, complete with challenges, solutions, and lessons learned.
