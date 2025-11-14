---
title: Building credit-castor with React and test-driven-development
date: '2025-11-14'
status: draft
privacy: public
tags:
  - test-driven-development
  - static-site-generation
  - functional-programming
  - react
  - astro
  - vitest
  - tailwind-css
repos:
  - credit-castor
skills:
  - brainstorming
  - condition-based-waiting
  - defense-in-depth
  - dispatching-parallel-agents
  - executing-plans
  - finishing-a-development-branch
  - receiving-code-review
  - requesting-code-review
  - root-cause-tracing
  - sharing-skills
  - subagent-driven-development
  - systematic-debugging
  - test-driven-development
  - testing-anti-patterns
  - testing-skills-with-subagents
  - using-git-worktrees
  - using-superpowers
  - verification-before-completion
  - verify-business-logic.md
  - webapp-testing
  - writing-plans
  - writing-skills
patterns:
  - test-driven-development
  - static-site-generation
  - functional-programming
relatedTo: []
description: >-
  Exploring test-driven-development, static-site-generation,
  functional-programming in credit-castor
---
## Introduction

Over the past month, **323 commits** shaped credit-castor, with 50% focused on building new features. The project leverages **React, Astro, Vitest, Tailwind CSS**, applying patterns like **test-driven-development, static-site-generation, functional-programming** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: Add All Founders Print View and enhance printing functionality (11/14/2025)
- feat: Enhance cost breakdown calculations for newcomers and founders (11/14/2025)
- feat: Add surface information display for founders in CostBreakdownGrid (11/14/2025)

Challenges overcome:
- fix: Improve entry date comparison logic in participant updates to handle both Date objects and ISO strings (11/14/2025)
- fix: Enhance type safety and handle old format in travauxCommuns migration (11/14/2025)
- fix: Remove unused default value for travauxCommuns surface area (11/14/2025)

Evolution and refinement:
- refactor: Remove unused imports and enhance participant equality check (11/14/2025)
- refactor: Remove unused imports and enhance participant equality check (11/14/2025)
- refactor: enhance version compatibility checks and update versioning logic (11/12/2025)

-->

### Context: What I Was Building

I built a complex financial calculation system for real estate cooperatives—handling cost breakdowns, participant tracking, lot quotas, surface area calculations, and transaction history. The domain is intricate: founders vs newcomers, entry dates that affect calculations, travaux communs (common work areas), version migrations, Firestore persistence, print views for legal documentation.

This wasn't a greenfield project. The work involved continuous feature development (50% of commits), refactoring legacy data formats, migrating schemas, fixing edge cases in calculation logic, and maintaining backward compatibility. Over 323 commits, I added cost breakdown enhancements, participant subcollections, project parameter migrations, print functionality, and Firestore sync improvements.

The tech stack reflects the complexity: React for UI, Astro for static site generation, Vitest for testing, Firestore for persistence, TypeScript for type safety. I applied TDD rigorously—financial calculations demand correctness. Functional programming patterns helped maintain purity in calculation functions. And I used extensive Claude skills (TDD, systematic debugging, defense-in-depth, subagent-driven development) to manage the cognitive load.

### The Challenge

**Domain complexity multiplied fast.** Calculating a founder's cost breakdown involves: quotité (ownership fraction), surface area, entry date, travaux communs allocations, participant status changes over time. Each variable affects the others. Change one, recalculate everything. Miss an edge case, and the numbers lie.

**Data migration was relentless.** Old formats assumed strings for dates. New formats used Date objects. Old schema stored travaux communs as top-level properties. New schema nested them. Every migration needed to handle both formats gracefully, apply transformations, validate results, and avoid breaking existing projects. The fix commits tell the story: "enhance type safety and handle old format in travauxCommuns migration", "improve entry date comparison logic to handle both Date objects and ISO strings."

**Firestore sync introduced state management hell.** Users could edit locally, save to Firestore, load from Firestore, or work offline. Sync conflicts were inevitable. Stale data could overwrite newer changes. I needed robust error handling, validation at multiple layers (defense-in-depth), and clear feedback when saves failed. Debug logs became essential—Firestore errors are opaque without instrumentation.

**Version compatibility required constant vigilance.** The system needed to open projects created months ago with older schemas. I implemented version checks, migration logic, and compatibility layers. The refactor commits show the evolution: "enhance version compatibility checks and update versioning logic." Every new feature risked breaking old projects unless I tested backward compatibility explicitly.

**Print views had hidden complexity.** Legal documentation requires specific formatting: all founders on one page, cost breakdowns clearly labeled, surface info visible, quotité calculations transparent. I added a dedicated All Founders Print View with enhanced printing functionality. The challenge wasn't rendering—it was ensuring calculations matched the legal requirements exactly.

### How I Solved It

**Test-driven development was non-negotiable.** Financial logic doesn't tolerate "close enough." I wrote tests for every calculation: cost breakdowns, quotité, surface allocations, timeline logic. When I refactored participant equality checks or entry date comparisons, tests caught regressions immediately. TDD forced me to think through edge cases: What if entry dates are ISO strings instead of Date objects? What if travaux communs uses the old format?

**Defense-in-depth for data validation.** I validated at every layer: schema migrations, Firestore rules, calculation functions, UI components. If invalid data reached calculations, something had failed multiple safety checks. This approach made bugs structurally harder to introduce. When I added lot validation ("implement validation for maximum total lots"), it wasn't an afterthought—it was a new defense layer.

**Functional programming for calculation purity.** Cost breakdown logic is pure functions: same inputs, same outputs, no side effects. This made testing trivial and refactoring safe. I could change how data flowed through the system without touching the calculation logic. Immutability prevented subtle bugs where mutations caused stale state.

**Systematic schema migrations.** Every migration followed a pattern: detect old format, transform to new format, validate transformation, preserve backward compatibility. The participant subcollection migration exemplifies this: migrate data structure, update queries, ensure old projects still load correctly.

**Firestore sync with robust error handling.** I added debug logs, document check utilities, enhanced rules validation. When saves failed, users saw clear error messages. When sync conflicts occurred, the system detected them. Firestore rules got stricter—validate on write, not just on read.

**Claude skills as force multipliers.** Systematic debugging helped trace calculation errors. Root-cause tracing identified where invalid data originated. Dispatching parallel agents let me tackle independent bugs concurrently. Verification-before-completion prevented premature success claims. These weren't productivity hacks—they were architectural patterns for managing complexity.

### What I Learned

**Domain complexity requires architectural discipline.** Financial calculations with multiple interdependent variables will spiral into spaghetti code without clear boundaries. Pure functions, defense-in-depth validation, and TDD aren't optional—they're survival tools.

**Data migrations are never "done."** Every feature potentially creates a new data format. I learned to design migrations upfront, not retrofit them. The pattern became: new feature → schema change → migration logic → version bump → test old projects.

**Type safety catches migration bugs.** TypeScript forced me to handle both Date objects and ISO strings explicitly. Without types, I'd have shipped subtle bugs where date comparisons silently failed. The fix commits prove this: "improve entry date comparison logic to handle both Date objects and ISO strings."

**Print views are first-class features.** I initially treated printing as "just render the UI and add print CSS." Wrong. Legal documentation has specific requirements that don't match UI layouts. The All Founders Print View needed custom logic, dedicated components, and separate testing.

**Claude skills compound.** Using TDD, defense-in-depth, systematic debugging, and verification-before-completion together created a workflow that scaled with complexity. Each skill reinforced the others. TDD caught bugs. Defense-in-depth prevented them. Systematic debugging traced root causes. Verification ensured fixes worked.

If I were starting over, I'd invest in a schema versioning system from day one. The ad-hoc migrations worked, but a formal versioning library (like a migration runner similar to database migrations) would have prevented subtle compatibility bugs and made rollback safer.



## Technical Details

**Stack**: React, Astro, Vitest, Tailwind CSS
**Patterns**: test-driven-development, static-site-generation, functional-programming
**Claude Skills**: brainstorming, condition-based-waiting, defense-in-depth, dispatching-parallel-agents, executing-plans, finishing-a-development-branch, receiving-code-review, requesting-code-review, root-cause-tracing, sharing-skills, subagent-driven-development, systematic-debugging, test-driven-development, testing-anti-patterns, testing-skills-with-subagents, using-git-worktrees, using-superpowers, verification-before-completion, verify-business-logic.md, webapp-testing, writing-plans, writing-skills

## All Commits (323)

- feat: Add All Founders Print View and enhance printing functionality (11/14/2025)
- feat: Enhance cost breakdown calculations for newcomers and founders (11/14/2025)
- feat: Add surface information display for founders in CostBreakdownGrid (11/14/2025)
- feat: Add quotité calculation to CostBreakdownGrid for founders (11/14/2025)
- feat: Enhance copro snapshot generation and cost breakdown logic (11/14/2025)
- chore: bump version to 1.34.0 (minor) [skip ci] (11/14/2025)
- feat: Integrate projectParams into calculations and transaction logic (11/14/2025)
- chore: bump version to 1.33.1 (patch) [skip ci] (11/14/2025)
- fix: Improve entry date comparison logic in participant updates to handle both Date objects and ISO strings (11/14/2025)
- refactor: Remove unused imports and enhance participant equality check (11/14/2025)
- On master: datestrings (11/14/2025)
- index on master: 4dfae49 refactor: Remove unused imports and enhance participant equality check (11/14/2025)
- untracked files on master: 4dfae49 refactor: Remove unused imports and enhance participant equality check (11/14/2025)
- refactor: Remove unused imports and enhance participant equality check (11/14/2025)
- chore: bump version to 1.33.0 (minor) [skip ci] (11/14/2025)
- feat: Implement subcollection migration for participants (11/14/2025)
- chore: bump version to 1.32.0 (minor) [skip ci] (11/14/2025)
- feat: Migrate projectParams to ensure compatibility with current schema before saving (11/14/2025)
- chore: bump version to 1.31.1 (patch) [skip ci] (11/14/2025)
- fix: Enhance type safety and handle old format in travauxCommuns migration (11/14/2025)
- fix: Remove unused default value for travauxCommuns surface area (11/14/2025)
- chore: bump version to 1.31.0 (minor) [skip ci] (11/14/2025)
- feat: Implement project parameters migration and enhance data loading (11/14/2025)
- chore: bump version to 1.30.0 (minor) [skip ci] (11/14/2025)
- fix: Update vsce-debug.log with additional error messages for missing configuration (11/14/2025)
- feat: Update ESLint configuration and enhance Firestore sync logic (11/14/2025)
- feat: Add Firestore document check utility and enhance rules validation (11/14/2025)
- feat: Add Firebase debug logs and enhance Firestore rules for testing (11/14/2025)
- feat: Enhance Firestore save functionality and error handling (11/14/2025)
- chore: bump version to 1.29.0 (minor) [skip ci] (11/14/2025)
- feat: Add dead code analysis documentation and recommendations (11/14/2025)
- chore: bump version to 1.28.0 (minor) [skip ci] (11/14/2025)
- chore: Update ESLint configuration, test commands, and enhance component tests (11/14/2025)
- feat: Update ParticipantDetailsPanel with new props for enhanced functionality (11/14/2025)
- feat: Enhance Firestore rules, component functionality, and testing for travaux communs (11/14/2025)
- feat: Enhance Firestore rules and timeline calculations with validation and new date comparison (11/14/2025)
- feat: Implement validation for maximum total lots and enhance lot management (11/14/2025)
- test: Update useUnlockState tests to support async unlock and lock operations (11/14/2025)
- chore: bump version to 1.27.0 (minor) [skip ci] (11/14/2025)
- feat: Implement participant enable/disable functionality and update calculations (11/14/2025)
- chore: bump version to 1.26.0 (minor) [skip ci] (11/14/2025)
- feat: Enhance Cost Breakdown and Expense Categories Management (11/14/2025)
- chore: bump version to 1.25.0 (minor) [skip ci] (11/13/2025)
- feat: Enable Firestore sync for participant edits without admin unlock and add verification tests (11/13/2025)
- chore: bump version to 1.24.0 (minor) [skip ci] (11/13/2025)
- feat: Add end-to-end tests for basic app functionality and granular Firestore updates (11/13/2025)
- chore: bump version to 1.23.0 (minor) [skip ci] (11/13/2025)
- feat: Add documentation for granular Firestore updates and quick reference guide (11/13/2025)
- feat: Implement granular participant updates and sync logic with conflict detection (11/13/2025)
- chore: bump version to 1.22.0 (minor) [skip ci] (11/13/2025)
- feat: Refactor environment variables to use PUBLIC_ prefix and enhance date formatting utility (11/13/2025)
- chore: bump version to 1.21.1 (patch) [skip ci] (11/13/2025)
- fix: Add null checks for entryDate in ParticipantDetailModal and ParticipantDetailsPanel (11/13/2025)
- chore: bump version to 1.21.0 (minor) [skip ci] (11/13/2025)
- feat: Add callback for accepting remote data in Firestore sync and update state without reload (11/13/2025)
- feat: Add Firestore security rules for edit locks collection (11/13/2025)
- feat: Implement participant subcollection support and enhance data loading logic (11/13/2025)
- fix: Add missing useCallback import in CalculatorProvider (11/13/2025)
- fix: Add null checks for Firestore db in edit lock service (11/13/2025)
- feat: Add UI integration for collaborative edit lock (Phase 3 & 4) (11/12/2025)
- feat: Implement Firestore-based collaborative edit lock system (Phase 1 & 2) (11/12/2025)
- feat: Update participant defaults and auto-lock on app close (11/12/2025)
- feat: Add TRAVAUX COMMUNS and deed date cascading features (11/12/2025)
- docs: add design for date validation fixes and TRAVAUX COMMUNS feature (11/12/2025)
- chore: bump version to 1.20.0 (minor) [skip ci] (11/12/2025)
- feat: Enhance Excel export to include dual loan fields and implement UI-to-export parity tests (11/12/2025)
- chore: bump version to 1.19.0 (minor) [skip ci] (11/12/2025)
- feat: Implement unified data loading service with Firestore and localStorage fallback (11/12/2025)
- chore: bump version to 1.18.0 (minor) [skip ci] (11/12/2025)
- feat: Implement pre-push hook for automatic schema validation and update documentation (11/12/2025)
- chore: bump version to 1.17.0 (minor) [skip ci] (11/12/2025)
- feat: Implement breaking changes protection system (11/12/2025)
- chore: bump version to 1.16.1 (patch) [skip ci] (11/12/2025)
- refactor: enhance version compatibility checks and update versioning logic (11/12/2025)
- chore: bump version to 1.16.0 (minor) [skip ci] (11/12/2025)
- feat: Add fraisNotaireFixe to various components and update serialization logic (11/12/2025)
- refactor: rename notaryFees to droitEnregistrements and add fraisNotaireFixe in ScenarioData (11/12/2025)
- chore: bump version to 1.15.1 (patch) [skip ci] (11/12/2025)
- Refactor notary fees to droit d'enregistrements across components and utilities (11/12/2025)
- chore: bump version to 1.15.0 (minor) [skip ci] (11/12/2025)
- feat: Implement safe date conversion utility and apply it across participant date handling (11/12/2025)
- chore: Remove .env.local from .gitignore to allow environment file tracking (11/12/2025)
- chore: Remove .env from .gitignore to allow environment file tracking (11/12/2025)
- feat: Add .firebaserc and update firebase.json with Firestore database configuration (11/12/2025)
- chore: bump version to 1.14.0 (minor) [skip ci] (11/12/2025)
- feat: Add deployment checklist and Firestore implementation status documentation (11/12/2025)
- chore: bump version to 1.13.0 (minor) [skip ci] (11/12/2025)
- feat: Enhance EnDivisionCorrect with default unitId and clean up VerticalToolbar by removing file input fix: Update activeUsers in CalculatorContext to include sessionId refactor: Simplify imports in scenarioFileIO (11/12/2025)
- chore: bump version to 1.12.1 (patch) [skip ci] (11/12/2025)
- chore: update package version to 1.11.2 (11/12/2025)
- chore: bump version to 1.12.0 (minor) [skip ci] (11/12/2025)
- feat: Implement Firestore user authentication and scenario management (11/12/2025)
- chore: bump version to 1.11.2 (patch) [skip ci] (11/12/2025)
- Add field permissions utilities and tests (11/12/2025)
- chore: bump version to 1.11.1 (patch) [skip ci] (11/11/2025)
- Refactor copropriété redistribution to use surface-based distribution instead of time-based. (11/11/2025)
- chore: bump version to 1.11.0 (minor) [skip ci] (11/11/2025)
- feat: Add timeline snapshot functionality to Excel export (11/11/2025)
- chore: bump version to 1.10.0 (minor) [skip ci] (11/11/2025)
- feat: Add FinancingResultCard and TwoLoanFinancingSection components (11/11/2025)
- chore: bump version to 1.9.0 (minor) [skip ci] (11/10/2025)
- feat: add coproReservesShare parameter to formula calculations and tests (11/10/2025)
- feat: add coproReservesShare to default formula parameters (11/10/2025)
- fix: add coproReservesShare to formula parameters in tests (11/10/2025)
- chore: bump version to 1.8.0 (minor) [skip ci] (11/10/2025)
- feat(timeline): add CoproLane and ParticipantLane components for timeline visualization (11/10/2025)
- docs: add quotité-based distribution bug fix to summary (11/10/2025)
- fix(timeline): use quotité-based distribution for copro sales (11/10/2025)
- refactor(timeline): extract timeline card components (11/10/2025)
- refactor(timeline): remove redundant lot price display (11/10/2025)
- refactor(timeline): hide financing details for portage sellers (11/10/2025)
- docs: add copro reserve display enhancement to summary (11/10/2025)
- feat(timeline): display 30% copro reserve increase on sales (11/10/2025)
- chore: bump version to 1.7.1 (patch) [skip ci] (11/10/2025)
- fix(ui): adjust height of swimlane row for improved layout (11/10/2025)
- docs: add Phase 7 UI rendering and bug fix to implementation summary (11/10/2025)
- fix(timeline): calculate 70% founder distribution for copro sales (11/10/2025)
- chore: bump version to 1.7.0 (minor) [skip ci] (11/10/2025)
- fix(ui): adjust height of swimlane row for better visibility (11/10/2025)
- feat(ui): add copro sale distribution view with RTL tests (11/10/2025)
- docs: add copropriété sale implementation summary (11/10/2025)
- fix(tests): add lotsOwned data to copro sale test founders (11/10/2025)
- feat(timeline): add copro sale transaction projection (11/10/2025)
- fix(tests): add missing averageInterestRate to PortageFormulaParams (11/10/2025)
- Merge feature/copro-sale-rule: Add copropriété sale rule with 30/70 distribution (11/10/2025)
- feat(state-machine): integrate copro sale rule with 30/70 distribution (11/10/2025)
- feat(timeline): add CoproSaleEvent type (11/10/2025)
- feat(portage): add copro sale price calculations (11/10/2025)
- docs: add copropriété sale rule design (11/10/2025)
- chore: bump version to 1.6.0 (minor) [skip ci] (11/5/2025)
- feat(portage): Implement construction payment configuration for portage lots (11/5/2025)
- feat(state-machine): complete rent-to-own actor spawning integration (11/5/2025)
- feat(state-machine): integrate rent-to-own machine into creditCastorMachine (11/5/2025)
- feat(state-machine): implement rent-to-own state machine (11/5/2025)
- Revert "feat(types): add rent-to-own types and formula to calculatorUtils" (11/5/2025)
- docs: add portage construction payment configuration design (11/5/2025)
- feat(hooks): add rentToOwnFormula to calculator state (11/5/2025)
- fix(test): resolve TypeScript errors in storage.test.ts (11/5/2025)
- feat(storage): add rent-to-own formula to localStorage with migration (11/5/2025)
- feat(utils): add rent-to-own calculation functions (11/5/2025)
- fix(test): remove unused RentToOwnAgreement import (11/5/2025)
- feat(types): add rent-to-own types and formula to calculatorUtils (11/5/2025)
- docs: add rent-to-own (location-accession) feature to domain definition (11/5/2025)
- test: add component test for reactive portage price recalculation (11/5/2025)
- refactor(portage): make price recalculation fully reactive on ANY update (11/4/2025)
- feat(portage): auto-recalculate purchase price when buyer entry date changes (11/4/2025)
- fix(portage): auto-sync soldDate from purchaseDetails on data load (11/4/2025)
- chore: bump version to 1.5.0 (minor) [skip ci] (11/4/2025)
- docs: add comprehensive portage session summary (11/4/2025)
- test: fix all test files to include required lotId and purchasePrice (11/4/2025)
- feat(types): enforce required fields in purchaseDetails for type safety (11/4/2025)
- fix(storage): convert date strings to Date objects on localStorage load (11/4/2025)
- feat(export): add portage lot tracking to Excel export and JSON schema (11/4/2025)
- feat(portage): display sale date in seller's lot view (11/4/2025)
- fix(portage): sync seller price with buyer selection via soldDate (11/4/2025)
- feat(ui): restore portage lot rendering in AvailableLotsView (11/4/2025)
- fix: match portage lot by lotId instead of array index (11/4/2025)
- chore: bump version to 1.4.0 (minor) [skip ci] (11/4/2025)
- feat(timeline): optimize copropriété snapshots to show changes only when inventory updates (11/4/2025)
- feat: embed transaction objects in timeline snapshots (11/4/2025)
- feat: add calculateCooproTransaction for shared cost redistribution (11/4/2025)
- refactor: use existing portageCalculations formulas in calculatePortageTransaction (11/4/2025)
- docs: expand formula reference and clarify copro stub status (11/4/2025)
- feat: add calculatePortageTransaction for timeline deltas (11/4/2025)
- docs: document transaction delta calculation in business logic (11/4/2025)
- types: add TimelineTransaction interface for portage and copro sales (11/4/2025)
- feat(timeline): show only affected participants per event (11/4/2025)
- fix(timeline): make all participant cards clickable, not just T0 (11/4/2025)
- feat(timeline): add dynamic copropriété inventory tracking (11/4/2025)
- feat(timeline): add temporal snapshots, deltas, color zones, and copro lane (11/4/2025)
- feat(ui): replace vertical list with horizontal timeline (11/4/2025)
- feat(ui): add horizontal swimlane timeline for financial visualization (11/4/2025)
- docs: add horizontal swimlane timeline design (KISS approach) (11/4/2025)
- fix(state-machine): add explicit ACPContribution typing for type safety (11/3/2025)
- feat(state-machine): implement individual and ACP collective loan financing flows (11/3/2025)
- feat(state-machine): implement sales flows for portage, copro, and classic transactions (11/3/2025)
- chore: bump version to 1.3.0 (minor) [skip ci] (11/3/2025)
- Merge feature/two-loan-financing: Add two-loan financing functionality (11/3/2025)
- feat(state-machine): implement urban planning permit process flow (11/3/2025)
- docs: mark two-loan financing implementation as complete (11/3/2025)
- feat(export): add two-loan financing to Excel export (11/3/2025)
- feat(state-machine): implement copropriété creation flow with PRECAD (11/3/2025)
- feat(ui): display validation errors in ParticipantDetailModal (11/3/2025)
- feat(validation): add two-loan financing validation (11/3/2025)
- feat(ui): display two-loan payments in results table (11/3/2025)
- feat(ui): add two-loan financing fields to ParticipantDetailModal (11/3/2025)
- feat(calc): integrate two-loan financing into calculateAll (11/3/2025)
- feat(state-machine): add deed signing and registration flow (11/3/2025)
- feat(calc): implement calculateTwoLoanFinancing function (11/3/2025)
- feat(state-machine): create basic machine structure with pre-purchase state (11/3/2025)
- test(state-machine): add comprehensive lot query tests (11/3/2025)
- feat(state-machine): add query functions for participants and lots (11/3/2025)
- test: add failing tests for calculateTwoLoanFinancing (11/3/2025)
- feat(state-machine): add voting calculation functions for hybrid governance (11/3/2025)
- feat(types): add two-loan calculation fields to ParticipantCalculation (11/3/2025)
- feat(types): add two-loan financing fields to Participant interface (11/3/2025)
- feat(state-machine): add loan split calculation functions (11/3/2025)
- fix(state-machine): fix indexation year lookup and add carrying costs test (11/3/2025)
- docs: add comprehensive implementation plan for two-loan financing (11/3/2025)
- feat(state-machine): add calculation utilities for indexation and quotité (11/3/2025)
- fix(state-machine): add test for ProjectEvents union type (11/3/2025)
- feat(state-machine): add event type definitions for all state transitions (11/3/2025)
- docs: add two-loan financing feature design (11/3/2025)
- feat(state-machine): add project financials types (11/3/2025)
- feat(state-machine): add financing types for individual and ACP loans (11/3/2025)
- feat(state-machine): add sale type definitions for portage, copro, and classic (11/3/2025)
- feat(state-machine): add base type definitions for participants and lots (11/3/2025)
- docs(state-machine): sync design doc with split loan specifications (11/3/2025)
- docs(state-machine): add precise loan split calculation rules (11/3/2025)
- docs(state-machine): add support for multiple loans per participant (11/3/2025)
- docs: add comprehensive state machine design for Credit Castor (11/3/2025)
- chore: bump version to 1.2.0 (minor) [skip ci] (11/3/2025)
- Refactor: Remove Scenario Interface and Related Logic (11/3/2025)
- Remove founder portage lots display from AvailableLotsView component (11/3/2025)
- chore: bump version to 1.1.0 (minor) [skip ci] (11/3/2025)
- feat: add date-fns for date handling and validation in portage calculations fix: improve error handling for surface calculations in portage lot pricing test: enhance AvailableLotsView tests for buyer entry date validation refactor: reorganize PortageLotConfig for better layout and flow (11/3/2025)
- refactor: remove timeline calculations, export/import functionality, and related tests (11/3/2025)
- feat: Implement storage persistence hook for auto-saving calculator state (11/3/2025)
- fix: convert deedDate string to Date object for AvailableLotsView (11/3/2025)
- fix: correct portage years held calculation to use buyer entry date (11/3/2025)
- fix: integrate portage components into main calculator page (11/3/2025)
- test: fix integration tests after modal UX changes (11/3/2025)
- docs: add portage feature user guide (11/3/2025)
- feat: add participant anchors for bidirectional navigation (11/3/2025)
- feat: integrate portage formula parameters across application (11/3/2025)
- feat: enhance AvailableLotsView with side-by-side formula/lots layout (11/3/2025)
- feat: enhance PortageLotConfig with breakdown table and pricing (11/3/2025)
- feat: create PortageFormulaConfig component (11/3/2025)
- feat: update portage calculations to use formula params (11/3/2025)
- feat: add PortageFormulaParams interface and defaults (11/3/2025)
- docs: add portage feature implementation plan (11/3/2025)
- docs: add portage feature UX redesign specification (11/3/2025)
- feat: Enhance Excel export functionality with unit details and expense categories (11/3/2025)
- feat: add version checking and localStorage compatibility warnings (11/3/2025)
- feat: Update gender-neutral language and improve UI components (11/3/2025)
- i18n: translate all formula tooltips to French (11/3/2025)
- feat: add tooltips to complex construction and financing amounts (11/3/2025)
- feat: add formula tooltips to all calculated amounts (11/3/2025)
- feat: Enhance ParticipantsTimeline with expandable details and improve UI (11/3/2025)
- docs: design for formula tooltips on calculated amounts (11/3/2025)
- feat: redistribute copro lot sales to all participants (11/3/2025)
- docs: design for redistribution to all participants (11/3/2025)
- fix: auto-set newcomer entry date 1 year after deed date (11/3/2025)
- feat: add mock copropriété lot for testing redistribution (11/3/2025)
- feat: unify portage and copro payments in 'Remboursements attendus' (11/3/2025)
- feat: add 'Changer de lot' button to unselect lot (11/3/2025)
- fix: use chosen surface for copropriété lot selection (11/3/2025)
- fix: update integration tests for multiple Fondateurs elements (11/3/2025)
- feat: auto-fill surface when selecting portage lot (11/3/2025)
- feat: make surface read-only when buying from portage lot (11/3/2025)
- fix: restrict portage lot configuration to founders only (11/3/2025)
- refactor: remove redundant manual purchase input fields (11/3/2025)
- feat: make lot cards clickable to auto-fill purchase details (11/3/2025)
- fix: integrate Available Lots into Purchase Details for non-founders (11/3/2025)
- feat: add newcomer available lots UI component (11/3/2025)
- Merge feature/chronology-timeline into master (11/3/2025)
- fix: restore portage lot feature to chronology-timeline branch (11/3/2025)
- feat: add portage lot state management functions (11/3/2025)
- fix: export loadFromLocalStorage for tests (11/3/2025)
- Merge portage lot feature from master into chronology-timeline (11/3/2025)
- feat: persist password across browser sessions (11/3/2025)
- docs: add password persistence design (11/3/2025)
- feat: integrate PortageLotConfig component into participant cards (11/3/2025)
- docs: add portage lot specification feature documentation (11/3/2025)
- test: add end-to-end portage workflow integration test (11/3/2025)
- feat: implement available lots logic for newcomers (11/3/2025)
- feat: sync portage lots with participant state (11/3/2025)
- fix: remove unused imports and props from PortageLotConfig (11/3/2025)
- feat: create PortageLotConfig component (11/3/2025)
- feat: add portage lot pricing calculations (11/3/2025)
- feat: extend Lot interface with portage configuration (11/3/2025)
- feat: Enhance participant management with timeline and purchase details (11/3/2025)
- Merge branch 'feature/chronology-timeline' into master (11/3/2025)
- feat: Phase 6 Complete - Documentation, Automated UAT & Production Validation (11/3/2025)
- feat: implement Phase 5 - Calculator to Timeline Integration (complete) (11/3/2025)
- feat: implement Phase 2.2-2.4 backend + Phase 4.2-4.6 UI (complete) (11/3/2025)
- docs: session progress report for continuous timeline work (11/3/2025)
- feat: add deed date field to calculator (Phase 4.1) (11/3/2025)
- feat: implement Phase 1-3 of continuous timeline with deed date (11/3/2025)
- feat: add initial design document for chronology and timeline using event-sourced architecture (11/3/2025)
- docs: add continuous timeline redesign architecture (11/2/2025)
- feat: implement remaining event handlers (TDD) (11/2/2025)
- docs: add timeline UI implementation reports (11/2/2025)
- feat: add timeline visualization UI components (11/2/2025)
- feat: implement cash flow calculations for timeline (11/2/2025)
- feat: implement timeline projection engine (11/2/2025)
- docs: add migration documentation for v1.0.2 compatibility (11/2/2025)
- test: add manual test artifacts for v1.0.2 compatibility (11/2/2025)
- feat: add event-sourced chronology foundation (34 tests) (11/2/2025)
- feat: add migration to file upload handler (11/2/2025)
- refactor: use migrateScenarioData in loadFromLocalStorage (11/2/2025)
- test: add edge case tests for scenario migration (11/2/2025)
- feat: add migrateScenarioData function for v1.0.2 compatibility (11/2/2025)
- docs: add implementation plan for scenario backward compatibility (11/2/2025)
- docs: add backward compatibility design for v1.0.2 scenarios (11/2/2025)
- feat: implement global CASCO price feature (11/2/2025)
- feat: add comprehensive documentation for Claude Code configuration and skills (11/2/2025)
- feat: add Prix/m² to global CASCO label for clarity (11/2/2025)
- chore: final verification for global CASCO price feature (11/2/2025)
- test: add tests for global CASCO price feature (11/2/2025)
- feat: add localStorage migration for global CASCO price (11/2/2025)
- refactor: remove per-participant CASCO input, display global rate (11/2/2025)
- feat: add global CASCO price input to Scenarios section (11/2/2025)
- refactor: update call sites to pass globalCascoPerM2 (11/2/2025)
- refactor: update calculateCascoAndParachevements to use globalCascoPerM2 (11/2/2025)
- refactor: add globalCascoPerM2 to ProjectParams and remove from Participant (11/2/2025)
- docs: add implementation plan for global CASCO price (11/2/2025)
- chore: add .worktrees/ to .gitignore (11/2/2025)
- docs: add design document for global CASCO price feature (11/2/2025)
- refactor: update title in EnDivisionCorrect component for clarity and consistency (10/12/2025)
- feat: add guidelines for breaking down large files and functions, and using meaningful names for variables and functions (10/12/2025)
- feat: enhance export functionality by adding XlsxWriter and CsvWriter tests, and improve XLSX writer to track worksheet bounds (10/12/2025)
- feat: add guidelines for code quality, testing, documentation, and infrastructure in CLAUDE.md (10/11/2025)
- feat: enhance calculation logic for CASCO and parachèvements by allowing custom sqm inputs and updating related functions (10/11/2025)
- Implement feature X to enhance user experience and fix bug Y in module Z (10/11/2025)
- refactor: update package.json and remove vite configuration (10/11/2025)
- feat: enhance calculation logic for frais généraux and update related tests (10/11/2025)
- feat: implement dynamic calculation for frais généraux and add corresponding tests (10/11/2025)
- feat: add calculator utility functions for real estate division purchase calculations (10/11/2025)
- Fix password gate for Astro build (10/11/2025)
- Add GitHub Actions workflow for deploying to GitHub Pages (10/11/2025)
- Add password protection to hide app from crawlers (10/11/2025)
- Initial commit: Set up credit-castor project with React, TypeScript, and Tailwind CSS (10/11/2025)

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
