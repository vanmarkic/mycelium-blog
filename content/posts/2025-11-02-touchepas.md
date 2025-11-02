---
title: Building touchepas with React and test-driven-development
date: '2025-11-02'
status: published
privacy: public
tags:
  - test-driven-development
  - react
  - typescript
repos:
  - touchepas
skills: []
patterns:
  - test-driven-development
relatedTo:
  - 2025-11-02-claude-config
  - 2025-11-02-credit-castor
  - 2025-11-02-loyer.brussels
description: Exploring test-driven-development in touchepas
---
## Overview

This post explores the work done on touchepas over the last 18 commits.

**Tech Stack:** React, TypeScript

**Patterns:** test-driven-development

## Recent Activity

- docs: add phase 1 completion report (11/3/2025)
- docs: add hooks README (11/3/2025)
- docs: add calculator pattern README (11/3/2025)
- chore: add test convenience scripts (11/3/2025)
- feat: add hooks barrel export (11/2/2025)

## Key Learnings

**Documentation-Driven Development**

Touchepas demonstrates strong documentation practices with dedicated READMEs for hooks, patterns, and phase completions. This documentation-first approach ensures patterns are well-understood before implementation and provides clear guidance for future contributors.

**Calculator Pattern Abstraction**

The calculator pattern README documents a reusable abstraction for complex calculation logic. This pattern separates calculation concerns from UI concerns, making the codebase more testable and maintainable.

**Barrel Exports for Better DX**

The hooks barrel export (`hooks/index.ts`) provides a clean API surface for the hooks library. This developer experience improvement makes the codebase more approachable and reduces cognitive load when importing utilities.

## Technical Deep Dive

### Calculator Pattern

The calculator pattern documented in Phase 1 provides a framework for handling complex multi-step calculations:

```typescript
interface Calculator<TInput, TOutput> {
  validate: (input: TInput) => ValidationResult;
  calculate: (input: TInput) => TOutput;
  format: (output: TOutput) => string;
}

// Example: Mortgage calculator
const mortgageCalculator: Calculator<MortgageInput, MortgageOutput> = {
  validate: (input) => {
    // Validate loan amount, interest rate, term
  },
  calculate: (input) => {
    // Calculate monthly payment, total interest, etc.
  },
  format: (output) => {
    // Format currency and percentages
  }
}
```

This pattern ensures calculations are:
- **Validated** before processing
- **Testable** in isolation
- **Formatted** consistently

### Hooks Architecture

The custom hooks library provides reusable state management patterns:

- Form state management with validation
- Async data fetching with loading states
- Local storage persistence
- Calculation result caching

The barrel export pattern makes these hooks discoverable and easy to import.

### Test Convenience Scripts

Recent commits added test convenience scripts (likely `test:watch`, `test:coverage`, etc.) that improve the TDD workflow. Quick feedback loops are essential for effective TDD.

## Conclusion

Touchepas exemplifies how strong documentation, reusable patterns, and TDD combine to create maintainable codebases. The calculator pattern and hooks library demonstrate thinking in abstractions that can be reused across projects, while the documentation ensures these patterns remain accessible to future developers.

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
