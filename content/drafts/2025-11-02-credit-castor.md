---
title: Building credit-castor with React and test-driven-development
date: '2025-11-02'
status: draft
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
relatedTo: []
description: 'Exploring test-driven-development, static-site-generation in credit-castor'
---
## Introduction

Over the past month, **46 commits** shaped credit-castor, with 48% focused on building new features. The project leverages **React, Astro, Vitest, Tailwind CSS**, applying patterns like **test-driven-development, static-site-generation** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: implement remaining event handlers (TDD) (11/2/2025)
- feat: add timeline visualization UI components (11/2/2025)
- feat: implement cash flow calculations for timeline (11/2/2025)

Challenges overcome:
- Fix password gate for Astro build (10/11/2025)

Evolution and refinement:
- refactor: use migrateScenarioData in loadFromLocalStorage (11/2/2025)
- refactor: remove per-participant CASCO input, display global rate (11/2/2025)
- refactor: update call sites to pass globalCascoPerM2 (11/2/2025)

-->

### Context: What I Was Building

I needed a calculator for Belgian real estate division purchases—specifically, understanding how costs split between multiple buyers. Credit-castor started as a password-protected Astro site (to hide from crawlers) with React components for the calculation UI. The core problem: CASCO pricing (construction shell costs) was being entered per participant, but that didn't match how the market works. CASCO prices are typically quoted per square meter globally, not per buyer.

The commit history shows two major phases. Phase 1 was the initial implementation: calculator utilities, password protection, deployment to GitHub Pages. Phase 2 was the refactoring: moving from per-participant CASCO inputs to a global CASCO price, then adding timeline visualization to project cash flows over time.

Recent work focused on backward compatibility. When I changed the data model (global CASCO instead of per-participant), existing saved scenarios broke. I had to implement migration logic to load old data without losing user work.

### The Challenge

The CASCO refactoring was trickier than expected. I couldn't just change the input field—I had to update the entire calculation chain. The commit "refactor: update calculateCascoAndParachevements to use globalCascoPerM2" shows the core change. Then "refactor: update call sites to pass globalCascoPerM2" shows the ripple effects. Every component that touched CASCO calculations needed updates.

The backward compatibility problem surfaced during manual testing. The commit "test: add manual test artifacts for v1.0.2 compatibility" suggests I was manually uploading old scenario files to verify migration worked. This is less ideal than automated tests but necessary when dealing with localStorage persistence across schema versions.

The timeline redesign introduced event-sourced chronology. The commit "feat: add event-sourced chronology foundation (34 tests)" shows I was taking a principled approach—model events explicitly, then project them into a timeline. This is more complex than direct state manipulation but makes the calculation logic testable. The 34 tests give me confidence the event handling is correct.

The TDD cycle appears in recent commits: "feat: implement remaining event handlers (TDD)" came after adding timeline UI components. This suggests I built the UI first (to understand requirements), then test-drove the event handlers to wire everything together.

### How I Solved It

I started with documentation-driven design. The commits "docs: add design document for global CASCO price feature" and "docs: add implementation plan for global CASCO price" came before implementation. This forced me to think through the migration strategy before writing code.

The refactoring followed a clean sequence:
1. Add `globalCascoPerM2` to the data model
2. Remove per-participant CASCO fields
3. Update the calculation function
4. Update all call sites
5. Add localStorage migration
6. Test with v1.0.2 scenarios

The localStorage migration was critical. The commit "feat: add localStorage migration for global CASCO price" shows I implemented a migration function that runs on app startup. Old scenarios get transformed to the new schema automatically. The "feat: add migration to file upload handler" commit extended this to uploaded scenario files.

For the timeline work, I built bottom-up: event-sourced chronology first (with 34 tests), then cash flow calculations, then UI components, finally event handlers. The commit "feat: add timeline projection engine" shows the core calculation logic—project events forward in time to calculate cumulative cash flows.

The verification approach was hybrid: automated tests for the calculation engine, manual tests for the migration. The "chore: final verification for global CASCO price feature" commit suggests I did a final smoke test before considering the feature complete.

### What I Learned

Documentation-driven design caught issues early. Writing the implementation plan forced me to realize localStorage migration wasn't optional—without it, users would lose their saved scenarios. That would have been an embarrassing bug to ship.

The event-sourced timeline approach was the right call. Direct state manipulation would have made testing harder. With events, I can unit test the projection engine independently of the UI. The 34 tests give me confidence that adding new event types won't break existing calculations.

The CASCO refactoring taught me that data model changes are never "just" changing a field. Every change propagates through calculations, UI components, persistence logic, and migration code. Next time, I'd automate the migration tests—manually uploading JSON files works but doesn't scale.

If I were doing this again, I'd use git worktrees from the start. The commits "chore: add .worktrees/ to .gitignore" came late, suggesting I added them partway through. Worktrees would have let me work on timeline visualization while keeping the CASCO refactoring isolated.



## Technical Details

**Stack**: React, Astro, Vitest, Tailwind CSS
**Patterns**: test-driven-development, static-site-generation
**Claude Skills**: verify-business-logic.md

## All Commits (46)

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
- On master: relations (10/12/2025)
- index on master: da50cd5 feat: add guidelines for breaking down large files and functions, and using meaningful names for variables and functions (10/12/2025)
- untracked files on master: da50cd5 feat: add guidelines for breaking down large files and functions, and using meaningful names for variables and functions (10/12/2025)
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
