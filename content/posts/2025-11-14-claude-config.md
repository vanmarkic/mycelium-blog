---
title: Building claude-config with React and test-driven-development
date: '2025-11-14'
status: published
privacy: public
tags:
  - test-driven-development
  - react
  - typescript
  - vitest
  - tailwind-css
repos:
  - claude-config
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
  - 2025-11-14-credit-castor
  - 2025-11-14-lagendwa
  - 2025-11-14-loyer.brussels
  - 2025-11-14-mycelium-blog
  - 2025-11-14-touchepas
description: Exploring test-driven-development in claude-config
---
## Introduction

Over the past month, **17 commits** shaped claude-config, with 47% focused on building new features. The project leverages **React, TypeScript, Vitest, Tailwind CSS**, applying patterns like **test-driven-development** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: Implement item management hook with preview and backup functionality (10/30/2025)
- feat: Add Phase 1 MVP for granular instruction management with UI components and preview functionality (10/30/2025)
- feat: Implement Item Management Features (10/30/2025)

Challenges overcome:
- Fix IconHardDrive to use IconServer instead (10/30/2025)
- Fix OBRA icon import names to match package exports (10/30/2025)

-->

### Context: What I Was Building

I needed a better way to manage Claude Code configuration files. The problem was visibility—Claude uses `.claude` directories with YAML files for instructions, skills, and commands. Scattered across projects, hard to compare, impossible to see inheritance hierarchies or detect conflicting overrides.

So I built a React app to visualize and manage these configurations. The vision was clear from the start: scan projects, analyze instruction files, detect overrides, show diffs, suggest optimizations. A control panel for Claude configurations. I went feature by feature, building out phases: project scanning, instruction analysis, skill imports, override detection, diff viewing, optimization suggestions, global inheritance views.

I committed to test-driven development upfront. Every feature started with tests. This wasn't academic—TDD catches integration issues early when you're building UI components that manipulate file systems and parse YAML.

### The Challenge

The feature set sprawled quickly. Item management, backup functionality, preview systems, sync tools, diff modals, quick actions. Each phase added complexity, and I had to keep the architecture clean enough that new features didn't break existing ones.

**State management** got tricky. The item management hook needed to handle previews and backups simultaneously. Users could modify items, see previews, revert to backups, all without losing context. React hooks made this manageable, but the logic required careful thought: when does state update? When do backups get created? What triggers previews?

**Icon consistency** became an unexpected time sink. I started with emojis (fast, works everywhere), but they lacked polish for a real tool. Switching to OBRA design icons meant fixing import names, replacing all references, ensuring the design system stayed coherent. The fix commits show the reality: `IconHardDrive` didn't exist in the package, had to use `IconServer` instead. Small fixes, but they add up.

**Parsing and analysis** had edge cases. Skill imports follow specific formats. Instructions can inherit from global configs. Detection logic needed to handle missing files, malformed YAML, circular dependencies. TDD helped here—write the test for the edge case, watch it fail, fix the parser.

### How I Solved It

I built the app in phases, each with clear deliverables:

**Phase 1: MVP** - Item management with preview and backup functionality. This established the core pattern: hooks manage state, components render UI, tests verify behavior. The item management hook became the foundation—other features extended it.

**Phase 2-3: Scanning and analysis** - Project scanning detects `.claude` directories. Instruction analysis parses YAML, detects patterns, identifies skill imports. These features layered on top of the item management foundation.

**Phase 4-6: Advanced features** - Diff modals with sync tools, override detection, optimization suggestions, global inheritance views. Each phase added a new lens for understanding configurations.

The test-driven approach paid off repeatedly. When I refactored the item management hook to add backup functionality, tests caught regressions immediately. When I replaced emojis with OBRA icons, tests verified UI components still rendered correctly.

I used Vitest and React Testing Library—fast feedback, minimal boilerplate. Tailwind CSS handled styling without the overhead of CSS-in-JS or separate stylesheets. TypeScript caught type errors at compile time, which was essential for file system operations and YAML parsing.

### What I Learned

**TDD is non-negotiable for complex state management.** The item management hook could have spiraled into spaghetti code. Writing tests first forced me to design clear interfaces: what inputs does this hook accept? What outputs does it return? What edge cases exist?

**Small fix commits are normal in UI work.** Icon imports, component tweaks, styling adjustments—these aren't signs of poor planning. They're the reality of integrating third-party libraries and design systems. The OBRA icon fixes taught me to check package exports before assuming names match.

**Phased delivery keeps momentum.** I could have tried to build everything at once. Instead, each phase delivered something usable. Phase 1 gave me basic item management. Phase 2 added scanning. By Phase 6, I had a full-featured tool—but each phase stood alone as a working feature.

If I were starting over, I'd invest more in the schema validation layer earlier. Parsing YAML is easy. Validating that YAML matches expected schemas is where the complexity lives. I handled this ad-hoc, but a proper schema validation library (like Zod) would have prevented edge case bugs.



## Technical Details

**Stack**: React, TypeScript, Vitest, Tailwind CSS
**Patterns**: test-driven-development


## All Commits (17)

- feat: Implement item management hook with preview and backup functionality (10/30/2025)
- feat: Add Phase 1 MVP for granular instruction management with UI components and preview functionality (10/30/2025)
- feat: Implement Item Management Features (10/30/2025)
- feat: Add skill import functionality and instruction analysis (10/30/2025)
- feat: Add IconSparkles to insights navigation item (10/30/2025)
- Merge branch 'feature/obra-icons' (10/30/2025)
- feat: Implement project scanning and analysis features (10/30/2025)
- Fix IconHardDrive to use IconServer instead (10/30/2025)
- Fix OBRA icon import names to match package exports (10/30/2025)
- Replace emojis with OBRA design icons throughout the app (10/30/2025)
- Complete Phase 6: Global inheritance view (10/30/2025)
- Complete Phase 5: Optimization suggestions panel (10/30/2025)
- Complete Phase 4: Enhanced diff modal with sync tools (10/30/2025)
- Add quick actions for config management (10/30/2025)
- Add override detection and diff viewer (10/30/2025)
- Replace Dashboard with ProjectOverview (10/30/2025)
- initial commit (10/30/2025)

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
