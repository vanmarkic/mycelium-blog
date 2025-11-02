---
title: Building credit-castor with React and test-driven-development
date: '2025-11-02'
status: published
privacy: public
tags:
  - test-driven-development
  - static-site-generation
  - react
  - astro
  - vitest
  - tailwind-css
repos:
  - credit-castor
skills:
  - verify-business-logic.md
patterns:
  - test-driven-development
  - static-site-generation
relatedTo:
  - 2025-11-02-claude-config
  - 2025-11-02-loyer.brussels
  - 2025-11-02-touchepas
  - 2025-11-03-ferme-du-temple
  - static-site-generation
description: 'Exploring test-driven-development, static-site-generation in credit-castor'
---
## Overview

This post explores the work done on credit-castor over the last 46 commits.

**Tech Stack:** React, Astro, Vitest, Tailwind CSS

**Patterns:** test-driven-development, static-site-generation

## Recent Activity

- docs: add continuous timeline redesign architecture (11/2/2025)
- feat: implement remaining event handlers (TDD) (11/2/2025)
- docs: add timeline UI implementation reports (11/2/2025)
- feat: add timeline visualization UI components (11/2/2025)
- feat: implement cash flow calculations for timeline (11/2/2025)

## Key Learnings

**Test-Driven Development in Financial Calculations**

Credit Castor demonstrates TDD's value in financial calculation domains where accuracy is critical. Every cash flow calculation was implemented with tests first, ensuring business logic correctness before implementation.

**Continuous Timeline Visualization**

The project evolved from discrete event markers to a continuous timeline showing cash flow states over time. This required rethinking the data model to support state interpolation between events.

**Static Site Generation for Financial Tools**

Using Astro's SSG capabilities provides instant load times for financial calculators while maintaining React's interactivity where needed. The hybrid approach delivers both performance and rich UX.

## Technical Deep Dive

### Timeline Architecture

The continuous timeline redesign introduced several challenges:

```typescript
interface TimelineEvent {
  date: Date;
  type: 'income' | 'expense' | 'milestone';
  amount: number;
  recurring?: boolean;
}

interface CashFlowState {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
```

The system calculates cash flow state at any point in time by replaying events chronologically - a pattern similar to event sourcing.

### Event-Driven State Management

Recent commits show a shift to event-driven architecture for handling user interactions:

- Event handlers implemented with TDD
- State updates flow through a centralized reducer
- Time-travel debugging enabled by event replay

This architecture makes financial calculations auditable and testable.

## Conclusion

Credit Castor showcases how TDD, SSG, and event-driven patterns combine to create reliable financial tools. The continuous timeline visualization provides users with clear cash flow insights, while the test coverage ensures calculation accuracy - essential for financial planning tools.

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
