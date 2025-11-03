---
title: Building credit-castor with React and test-driven-development
date: '2025-11-03'
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

Over the past month, **53 commits** shaped credit-castor, with 53% focused on building new features. The project leverages **React, Astro, Vitest, Tailwind CSS**, applying patterns like **test-driven-development, static-site-generation** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: Phase 6 Complete - Documentation, Automated UAT & Production Validation (11/3/2025)
- feat: implement Phase 5 - Calculator to Timeline Integration (complete) (11/3/2025)
- feat: implement Phase 2.2-2.4 backend + Phase 4.2-4.6 UI (complete) (11/3/2025)

Challenges overcome:
- Fix password gate for Astro build (10/11/2025)

Evolution and refinement:
- refactor: use migrateScenarioData in loadFromLocalStorage (11/2/2025)
- refactor: remove per-participant CASCO input, display global rate (11/2/2025)
- refactor: update call sites to pass globalCascoPerM2 (11/2/2025)

-->

### Context: What I Was Building

[Describe the project goal and why you started this work. What problem does credit-castor solve?]

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

**Stack**: React, Astro, Vitest, Tailwind CSS
**Patterns**: test-driven-development, static-site-generation
**Claude Skills**: verify-business-logic.md

## All Commits (53)

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
