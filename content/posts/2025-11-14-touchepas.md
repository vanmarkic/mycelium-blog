---
title: Building touchepas with React and test-driven-development
date: '2025-11-14'
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
  - 2025-11-03-claude-config
  - 2025-11-03-credit-castor
  - 2025-11-03-loyer.brussels
  - 2025-11-03-mycelium-blog
  - 2025-11-03-touchepas
  - 2025-11-14-3DSoundViz
  - 2025-11-14-claude-config
  - 2025-11-14-credit-castor
  - 2025-11-14-lagendwa
  - 2025-11-14-loyer.brussels
  - 2025-11-14-mycelium-blog
  - 2025-11-17-kirby-gen
  - 2025-12-18-how-not-to-diet-en
  - 2025-12-18-obsidian-mcp-tools-nl
  - property-based-regression-testing
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

I refactored a rent indexation calculator into a maintainable system that could handle Belgian housing law's growing complexity without collapsing under its own weight.

The calculator helps tenants and landlords determine legal rent increases in Wallonia, Belgium. Belgian rent indexation isn't simple arithmetic—it's conditional logic based on energy ratings (A/B/C vs D/E/F/G), decree timing (before, during, or after a rent freeze), registration status, and written notification requirements. Each combination requires different calculation formulas.

The original implementation was a monolithic `RentCalculator.tsx` component: 500+ lines handling all scenarios with nested conditionals. It worked, but adding new scenarios (like the 2025 decree changes) meant wading through spaghetti logic, risking regressions on existing calculations. Every change was high-risk surgery.

I needed an architecture that could:
- Support multiple calculation strategies without coupling them
- Allow gradual rollout of new calculators via feature flags
- Extract reusable UI components from the monolith
- Maintain test coverage throughout refactoring

The goal wasn't just "cleaner code"—it was enabling future changes without fear.

### The Challenge

**Test-driven refactoring is a tightrope walk.** I couldn't just rewrite everything and hope it worked. The existing calculator had users relying on correct calculations for legal disputes. Breaking indexation formulas wasn't an option. I needed to refactor incrementally: write tests for current behavior (RED), implement new structure (GREEN), verify equivalence (REFACTOR), repeat.

The challenge was maintaining working software at every step. Tests defined the contract: "given these inputs, produce this rent increase." As long as tests stayed green, I could restructure internals freely.

**The calculator strategy needed runtime flexibility.** Each Wallonia scenario required a different calculator: `WalloniaSimpleCalculator` for A/B/C energy ratings, `WalloniaBeforeDecreeCalculator` for D/E/F/G ratings before the decree, `WalloniaDuringDecreeCalculator` for the freeze period, `WalloniaAfterDecreeCalculator` for post-decree calculations.

TypeScript pushed me toward a strategy pattern: define a `Calculator` interface, implement variants, dispatch at runtime based on inputs. But I needed more than just strategy selection—I needed feature flags to gradually roll out new calculators. Users couldn't see unfinished calculators. The registry dispatcher had to check flags before routing to strategies.

**The void vs null return type debate surfaced during refactoring.** The old calculator returned `void` for "no result"—TypeScript's way of saying "this function completes but produces nothing." The new calculators returned `null` for "no result calculated." This seemed like a minor type inconsistency, but it forced a decision: what does "no result" mean semantically? Is it absence of output, or a calculated determination that no indexation applies?

I chose `null` because it's explicit. A function returning `null` communicates "I calculated and determined: no increase applies." This made test assertions clearer and prevented ambiguous states in the UI.

**Component extraction revealed hidden dependencies.** Pulling `CalculationInputsStep`, `PEBStep`, `RegistrationStep`, and `WrittenNotificationStep` out of the monolith exposed coupling I hadn't noticed. The "Explication" button placement, for example—was it part of the calculation inputs or the result display? The original code didn't distinguish. Extraction forced clarity: inputs handle data collection, results handle display, explanation is metadata separate from both.

### How I Solved It

**Phase 1: Calculator strategy pattern with registry**
I defined a `Calculator` interface with a standard contract: given inputs (energy rating, dates, rent amounts), return a calculation result or `null`. Then I implemented four Wallonia calculators:

- `WalloniaSimpleCalculator`: A/B/C energy ratings (simple indexation)
- `WalloniaBeforeDecreeCalculator`: D/E/F/G before decree (restricted increases)
- `WalloniaDuringDecreeCalculator`: Freeze period (no increases)
- `WalloniaAfterDecreeCalculator`: Post-decree (new rules)

A `CalculatorRegistry` maps scenarios to implementations. The `CalculatorDispatcher` selects the right calculator based on feature flags and input criteria. This separation meant I could develop new calculators behind flags, test them in isolation, then enable them for users when ready.

**Phase 2: Custom hook for calculation orchestration**
I extracted state management into a `useRentCalculation` hook. This hook:
- Manages calculator inputs (rent, dates, energy rating)
- Dispatches to the appropriate calculator strategy
- Handles loading states and errors
- Provides a clean API for UI components

The hook pattern separated business logic (calculation rules) from presentation logic (form rendering). Components became thin wrappers around the hook's state.

**Phase 3: Component extraction and coordinator pattern**
I broke the monolith into focused components:
- **RentWizard**: Coordinator managing wizard flow
- **CalculationInputsStep**: Rent amounts and dates
- **PEBStep**: Energy rating selection
- **RegistrationStep**: Registration status
- **WrittenNotificationStep**: Notification compliance

Each component handled one concern. The wizard coordinated flow without knowing calculation details. This made testing easier—mock the hook, verify component behavior independently.

The "Explication" button placement revealed the challenge: it needed to appear after "Calculer" but was originally embedded in inputs. I moved it into `CalculationInputsStep` where it belonged logically, keeping related UI together.

**Phase 4: Feature flags for gradual rollout**
I wrapped calculator registration in feature flags. New calculators started disabled in production, enabled in development for testing. Once validated, I flipped the flag. This eliminated "big bang" deployments—each calculator could launch independently.

### What I Learned

**TDD is refactoring insurance.** Writing tests first for the monolith's behavior gave me confidence to restructure. Every green test suite meant "this refactoring preserves existing functionality." Without tests, I would have been guessing whether each change broke something subtle.

**Type inconsistencies are design questions in disguise.** The void/null debate wasn't pedantic—it was fundamental. Choosing `null` forced me to clarify what "no result" means. TypeScript's type system surfaces these questions early, preventing runtime ambiguity later.

**Extraction reveals accidental complexity.** The monolith hid design decisions in implementation details. Pulling components apart exposed choices I'd made implicitly (button placement, state coupling). Extraction forces explicit design, which improves maintainability.

**Feature flags enable fearless development.** Building new calculators behind flags meant I could commit incomplete work without risking production. Flags create safety—develop in main branch, deploy often, enable when ready.

**The strategy pattern handles regional complexity elegantly.** Belgian rent law will keep changing. New decrees, new rules, new edge cases. The strategy pattern makes this manageable: add a new calculator, register it, route to it. The core architecture stays stable while calculation logic evolves.

If I were starting over, I'd design the calculator interface before implementing any calculators. I discovered the interface through refactoring, but starting with a clear contract (inputs, outputs, edge cases) would have made the initial implementation cleaner. Sometimes the abstraction is clearer after you've written the code twice.



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
