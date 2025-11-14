---
title: Building touchepas with React and test-driven-development
date: '2025-11-14'
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

Over the past month, **44 commits** shaped touchepas, with 23% focused on building new features. The project leverages **React, TypeScript**, applying patterns like **test-driven-development** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: add WalloniaAfterDecreeCalculator for post-decree (11/3/2025)
- feat: add WalloniaDuringDecreeCalculator for freeze period (11/3/2025)
- feat: add WalloniaBeforeDecreeCalculator for D/E/F/G (11/3/2025)

Challenges overcome:
- fix: correct import paths in formula.test.ts (11/3/2025)
- fix: remove old monolithic RentCalculator.tsx file (11/3/2025)
- fix: move Explication button inside CalculationInputsStep (11/3/2025)

Evolution and refinement:
- refactor: enable feature flag for all new calculators (11/3/2025)
- refactor: final cleanup Phase 2 (11/3/2025)
- refactor: integrate useRentCalculation hook (11/3/2025)

-->

### Context: What I Was Building

[Describe the project goal and why you started this work. What problem does touchepas solve?]

### The Challenge

[What made this difficult? What trade-offs did you face? What surprised you?]

### How I Solved It

[Walk through your approach. Show key code, explain decisions, highlight insights.]

```typescript
// Show a meaningful code snippet that tells the story
// This could be a key function, an interesting pattern, or a clever solution
```

### What I Learned

[Key takeaways, lessons learned, what you'd do differently next time]



## Technical Details

**Stack**: React, TypeScript
**Patterns**: test-driven-development


## All Commits (44)

- fix: correct import paths in formula.test.ts (11/3/2025)
- fix: remove old monolithic RentCalculator.tsx file (11/3/2025)
- chore: remove unused RentResult component (11/3/2025)
- fix: move Explication button inside CalculationInputsStep (11/3/2025)
- fix: move Explication button to appear after Calculer button (11/3/2025)
- fix: properly separate result display from explanation button (11/3/2025)
- fix: restore original component order - Explication button below Calculer (11/3/2025)
- fix: correct RadioGroup.css import path in WrittenNotificationStep (11/3/2025)
- docs: add CLAUDE.md and Phase 2 implementation plan (11/3/2025)
- docs: add Phase 3 completion summary (11/3/2025)
- test: add unit tests for WalloniaPostDecreeStartCalculator (11/3/2025)
- refactor: enable feature flag for all new calculators (11/3/2025)
- feat: add WalloniaAfterDecreeCalculator for post-decree (11/3/2025)
- feat: add WalloniaDuringDecreeCalculator for freeze period (11/3/2025)
- feat: add WalloniaBeforeDecreeCalculator for D/E/F/G (11/3/2025)
- feat: add WalloniaSimpleCalculator for A/B/C ratings (11/3/2025)
- docs: add Phase 3 business logic design document (11/3/2025)
- refactor: final cleanup Phase 2 (11/3/2025)
- refactor: integrate useRentCalculation hook (11/3/2025)
- refactor: extract RentWizard coordinator component (11/3/2025)
- refactor: extract CalculationInputsStep component (11/3/2025)
- refactor: extract PEBStep component (11/3/2025)
- refactor: extract RegistrationStep component (11/3/2025)
- refactor: extract WrittenNotificationStep component (11/3/2025)
- refactor: extract RentResult component (11/3/2025)
- docs: add Phase 2 core components design document (11/3/2025)
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
