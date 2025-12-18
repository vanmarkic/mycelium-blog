---
title: Property-Based Regression Testing Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - testing
  - fast-check
  - refactoring
  - typescript
repos: []
skills:
  - property-based-regression-testing
patterns:
  - test-driven-development
relatedTo:
  - 2025-11-03-touchepas
  - 2025-11-14-3DSoundViz
  - 2025-11-14-touchepas
  - 2025-12-18-how-not-to-diet-en
  - 2025-12-18-obsidian-mcp-tools-nl
description: >-
  Claude Code skill for mandatory oracle testing when refactoring - comparing
  old vs new implementations across 1000 random inputs
---

## Overview

**Every refactoring gets an oracle test: `old(x) === new(x)` for 1000 random inputs.**

Not just "hard" refactorings. ALL refactorings. No exceptions.

The Property-Based Regression Testing skill ensures that refactored code produces identical outputs to the original implementation across a wide range of automatically generated inputs.

## The Iron Rule

When refactoring ANY function:

1. **Keep old implementation** (rename to `oldImpl` or copy to test)
2. **Write oracle test** comparing old vs new
3. **Run with 1000 inputs**
4. **Fix failures** (shrunk output shows minimal breaking case)
5. **Only then commit**

## The Oracle Test

```typescript
import fc from 'fast-check';

test('new implementation matches old', () => {
  fc.assert(
    fc.property(inputGenerator, (input) => {
      const oldResult = oldImpl(input);
      const newResult = newImpl(input);
      return JSON.stringify(oldResult) === JSON.stringify(newResult);
    }),
    { numRuns: 1000 }
  );
});
```

## Building Generators

```typescript
// Objects
fc.record({ id: fc.integer(), name: fc.string() })

// Arrays
fc.array(fc.integer())

// Any JSON
fc.jsonValue()

// Domain-specific
const emailGen = fc.record({
  id: fc.integer({ min: 1 }),
  subject: fc.string(),
  date: fc.date(),
});

// Complex nested structures
const userGen = fc.record({
  id: fc.uuid(),
  profile: fc.record({
    name: fc.string(),
    age: fc.integer({ min: 0, max: 150 }),
    tags: fc.array(fc.string())
  })
});
```

## When Types Change

If old returns `{ tags: string[] }` and new returns `{ folder: string }`:

```typescript
// Create equivalence mapper
const tagsToFolder = (tags: string[]): string => {
  /* mapping logic */
};

test('new matches old semantically', () => {
  fc.assert(
    fc.property(inputGen, (input) => {
      const oldResult = oldImpl(input);
      const newResult = newImpl(input);
      return tagsToFolder(oldResult.tags) === newResult.folder;
    }),
    { numRuns: 1000 }
  );
});
```

## Red Flags - STOP

If you're thinking:

| Thought | Response |
|---------|----------|
| "It's a simple change" | Oracle test takes 2 minutes. Do it. |
| "I wrote 47 example tests" | Examples miss edge cases. Add oracle. |
| "Types guarantee correctness" | Types don't catch logic bugs. Add oracle. |
| "Algorithm is well-understood" | Your implementation might not be. Add oracle. |
| "I manually tested it" | Manual tests don't run on every commit. Add oracle. |

**All of these mean: Write the oracle test.**

## Why This Matters

Example tests cover cases you thought of. Property-based tests cover cases you didn't think of.

When fast-check finds a failure, it **shrinks** the input to the minimal failing case:

```
Error: Property failed after 42 tests
Shrunk 3 time(s)
Counterexample: [{ id: -1, name: "" }]
```

This minimal counterexample reveals the exact edge case your refactoring broke.

## Installation

```bash
npm install -D fast-check
```

## Real Example

Refactoring a synergy scoring function:

```typescript
// Old implementation (keep for comparison)
function oldSynergyScore(food1: Food, food2: Food): number {
  // ... original complex logic
}

// New implementation (being tested)
function newSynergyScore(food1: Food, food2: Food): number {
  // ... refactored logic
}

// Oracle test
const foodGen = fc.record({
  id: fc.string(),
  category: fc.constantFrom('vegetable', 'fruit', 'protein'),
  properties: fc.array(fc.string())
});

test('refactored synergy score matches original', () => {
  fc.assert(
    fc.property(foodGen, foodGen, (food1, food2) => {
      const old = oldSynergyScore(food1, food2);
      const new_ = newSynergyScore(food1, food2);
      return Math.abs(old - new_) < 0.0001; // floating point tolerance
    }),
    { numRuns: 1000 }
  );
});
```

## Mycelium Links

Related:
- **test-driven-development** skill: Write tests first, including oracle tests
- **knowledge-converter** skill: Used oracle tests to validate extraction algorithms
- **systematic-debugging** pattern: Oracle tests reveal exact failure cases
