---
title: Building credit-castor with React and test-driven-development
date: '2025-11-03'
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
  - 2025-11-02-example-draft
  - 2025-11-03-claude-config
  - 2025-11-03-loyer.brussels
  - 2025-11-03-mycelium-blog
  - 2025-11-03-touchepas
  - 2025-11-04-domain-modeling-with-claude-and-xstate
  - 2025-11-14-claude-config
  - 2025-11-14-credit-castor
  - 2025-11-14-lagendwa
  - 2025-11-14-loyer.brussels
  - 2025-11-14-mycelium-blog
  - 2025-11-14-touchepas
  - 2025-11-14-womb
  - static-site-generation
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

I needed a timeline. Not just any timeline—one that shows when money moves in a Belgian real estate division purchase. You know: deed date, CASCO payments, parachèvement payments, the whole cascade of transactions that buyers need to plan for.

Credit-castor already had the calculator working. Enter parameters, get costs per participant. But that's a snapshot, not a forecast. I wanted to project those costs forward in time: "When do I actually pay?" This meant redesigning around chronology—moving from static calculation to event-sourced timeline projection.

The work spanned 53 commits across multiple phases. Early on, I built the calculator utilities, password protection, GitHub Pages deployment. Then came the global CASCO price refactor (more on that below). The timeline work represents the latest evolution: Phase 1-6 implementation using event-sourced architecture with automated UAT and production validation.

### The Challenge

The first challenge was backward compatibility. I'd changed the data model from per-participant CASCO pricing to global CASCO per square meter. Existing saved scenarios broke. Users would lose their work unless I implemented migration. The commit "feat: add migrateScenarioData function for v1.0.2 compatibility" shows I built a migration function, but testing it meant manually creating v1.0.2 scenario files and verifying they loaded correctly. That's tedious, error-prone work.

The second challenge was event modeling. A timeline isn't just a list of dates—it's a projection of events with dependencies. "CASCO payment happens 6 months after deed date." "Parachèvement payment happens after CASCO." I needed an architecture that could express these relationships without hardcoding sequences. The commit "feat: add event-sourced chronology foundation (34 tests)" shows I chose event sourcing. 34 tests gave me confidence the event handling was correct, but writing those tests meant thinking through every edge case: What if deed date is missing? What if multiple events happen on the same day?

The third challenge was integrating calculator and timeline. The calculator operates on totals—"You owe €X for CASCO." The timeline operates on events—"€X is due on date Y." The commit "feat: implement Phase 5 - Calculator to Timeline Integration (complete)" shows I bridged these layers, but it required careful orchestration. Calculator outputs became timeline event inputs. Any mismatch between calculation logic and event handlers would produce wrong projections.

### How I Solved It

I started with documentation-driven design. Before writing code, I created design documents and implementation plans. The commits show this pattern: "docs: add backward compatibility design for v1.0.2 scenarios" came before "feat: add migrateScenarioData function." This forced me to think through the migration strategy first—what data needs to transform, where to hook the migration (app startup vs file upload), how to test it.

For the CASCO refactor, I followed a disciplined sequence:
1. Add `globalCascoPerM2` to data model
2. Update calculation functions
3. Update all call sites
4. Add localStorage migration
5. Extend migration to file uploads
6. Test with v1.0.2 scenarios

The localStorage migration runs on app startup, transforming old scenarios automatically. The file upload handler migration means uploaded scenarios also get transformed. This two-pronged approach covers both persistence mechanisms.

For the timeline work, I built bottom-up across six phases:

**Phase 1-3: Foundation**
- Add deed date field to calculator (Phase 1)
- Design event-sourced chronology architecture (Phase 2)
- Implement chronology foundation with 34 tests (Phase 3)

**Phase 4: UI Components**
- Add deed date to calculator UI (Phase 4.1)
- Build timeline visualization components (Phase 4.2-4.6)

**Phase 5: Integration**
- Wire calculator outputs to timeline event handlers (Phase 5)
- Implement cash flow calculations
- Add timeline projection engine

**Phase 6: Validation**
- Write comprehensive documentation
- Implement automated UAT
- Production validation

The event-sourced approach means the timeline is derived, not stored. Events like "DeedDateSet" and "CascoPaymentScheduled" get projected forward to calculate cumulative cash flows. The projection engine is pure—same events, same timeline, every time.

### What I Learned

Documentation-driven design caught migration issues before they shipped. Writing the backward compatibility design forced me to realize localStorage migration wasn't optional—without it, users would lose saved scenarios. That would've been a critical bug discovered only after release.

Event sourcing was the right architectural choice for timeline projection. Direct state manipulation would've made testing harder. With events, I can unit test the projection engine independently of the UI. The 34 tests give me confidence that adding new event types won't break existing calculations.

The phased approach worked. Each phase had clear deliverables and completion criteria. Phase 6's automated UAT means I can verify the entire workflow programmatically, not just manually. Next time, I'd write those automated tests earlier—they would've caught integration issues during Phase 5.

The migration testing was manual and tedious. Creating v1.0.2 scenario files, uploading them, verifying transformation—all by hand. I should've automated this with test fixtures. Future data model changes will need automated migration tests, not manual verification.

If I were doing this again, I'd use git worktrees from the start. The commit "chore: add .worktrees/ to .gitignore" came late, suggesting I added them partway through. Worktrees would've let me work on timeline visualization while keeping the CASCO refactor isolated, reducing context switching costs.



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
