---
title: Building touchepas with React and test-driven-development
date: '2025-11-02'
status: draft
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
relatedTo: []
description: Exploring test-driven-development in touchepas
---
## Introduction

Over the past month, **18 commits** shaped touchepas, with 33% focused on building new features. The project leverages **React, TypeScript**, applying patterns like **test-driven-development** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: add hooks barrel export (11/2/2025)
- feat: implement useRentCalculation hook (GREEN) (11/2/2025)
- feat: integrate BrusselsCalculator with feature flag (11/2/2025)

Challenges overcome:
- fix: normalize void to null in BrusselsCalculator (11/2/2025)

-->

### Context: What I Was Building

The commits show touchepas implementing a calculator system with a strategy pattern. Development started with a design document and implementation plan, then moved into building the core architecture. I created a calculator interface, then implemented a BrusselsCalculator as the first concrete strategy, followed by a registry dispatcher to manage multiple calculator types.

The feature work focused on two layers: the calculation logic itself (strategy interface, Brussels implementation) and a React integration layer (useRentCalculation hook). The commit sequence suggests this was a refactoring effort—there's an early "maintainability refactor design document" commit, and later a "create folder structure for refactoring" commit, indicating I was restructuring existing code into a more maintainable architecture.

### The Challenge

The TDD commits reveal the core difficulty: getting the type system right while following RED-GREEN-REFACTOR. The commit "test: add BrusselsCalculator tests (RED)" came before "feat: implement BrusselsCalculator (GREEN)", showing I was writing tests first. But then there's a telling fix commit: "fix: normalize void to null in BrusselsCalculator". This suggests TypeScript caught an inconsistency—the calculator was returning void in some cases when it should return null.

This is the classic TDD tension: you write tests against an interface that doesn't exist yet, which means you're making assumptions about return types. When I implemented the calculator, the mismatch surfaced. The void vs null issue is particularly interesting because both represent "no value" in JavaScript, but TypeScript treats them differently. The fix commit shows I had to normalize to null, probably because the interface contract specified nullable return types.

The hook implementation followed the same pattern—"test: add useRentCalculation hook tests (RED)" before "feat: implement useRentCalculation hook (GREEN)". This consistency shows I was strictly following TDD, even when it meant dealing with interface mismatches during the GREEN phase.

### How I Solved It

I started with the foundation: "feat: add calculator strategy interface" defined the contract that all calculators would implement. This forced me to think about what a calculator's API should look like—what inputs it needs, what it returns, and how to handle edge cases where calculation isn't possible (hence the null return type issue that emerged later).

The RED-GREEN-REFACTOR cycle worked as designed. I wrote failing tests for BrusselsCalculator, then implemented the calculator to make them pass. The void-to-null fix came during this GREEN phase—TypeScript's strict type checking caught the mismatch between my interface definition and implementation. This is TDD working: the test compilation forced me to honor the contract.

After getting the calculator working, I added the registry dispatcher commit. This suggests I was building toward extensibility—the registry pattern means adding new region calculators wouldn't require touching existing code. The commit "feat: integrate BrusselsCalculator with feature flag" shows I was being cautious about rollout, using feature flags to gate the new implementation.

The React layer came last. I repeated the TDD cycle for the useRentCalculation hook: write tests, implement hook, export from barrel. The "feat: add hooks barrel export" commit shows attention to module structure—keeping the public API clean. The final documentation commits (calculator pattern README, hooks README, phase 1 completion report) wrapped up the feature with architectural documentation.

### What I Learned

The void-to-null fix taught me that TypeScript's type system catches contract violations during TDD's GREEN phase, not the RED phase. When you write tests against a non-existent interface, the tests compile if your mocks match your assumptions. But when you implement the real code, type mismatches surface. This is actually a strength—it forces you to reconcile your assumptions with reality.

The commit sequence also reinforced the value of documentation-driven development. Starting with "docs: add maintainability refactor design document" and ending with three README commits shows I was treating documentation as part of the implementation, not an afterthought. The phase 1 completion report commit suggests I was tracking progress against a plan, which probably helped maintain focus during the refactor.

If I were doing this again, I might batch the documentation commits differently. Having three separate doc commits at the end suggests I wrote the docs after the code was working. Writing them earlier—maybe one README per major commit—would have caught design issues sooner. The calculator pattern README, for instance, could have been written right after the strategy interface commit, forcing me to explain the design before building it.



## Technical Details

**Stack**: React, TypeScript
**Patterns**: test-driven-development


## All Commits (18)

- docs: add phase 1 completion report (11/3/2025)
- docs: add hooks README (11/3/2025)
- docs: add calculator pattern README (11/3/2025)
- chore: add test convenience scripts (11/3/2025)
- feat: add hooks barrel export (11/2/2025)
- feat: implement useRentCalculation hook (GREEN) (11/2/2025)
- test: add useRentCalculation hook tests (RED) (11/2/2025)
- feat: integrate BrusselsCalculator with feature flag (11/2/2025)
- feat: add calculator registry with dispatcher (11/2/2025)
- fix: normalize void to null in BrusselsCalculator (11/2/2025)
- feat: implement BrusselsCalculator (GREEN) (11/2/2025)
- test: add BrusselsCalculator tests (RED) (11/2/2025)
- feat: add calculator strategy interface (11/2/2025)
- chore: create folder structure for refactoring (11/2/2025)
- docs: add Phase 1 implementation plan (11/2/2025)
- chore: add .worktrees/ to .gitignore (11/2/2025)
- docs: add maintainability refactor design document (11/2/2025)
- test: add case for Wallonia 2025 rent indexation based on user submission refactor: update correction ratio calculation in rent indexation formula update: remove outdated health index data from indices.json (10/21/2025)

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
