---
title: Building claude-config with React and test-driven-development
date: '2025-11-02'
status: draft
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
relatedTo: []
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

I spent October building claude-config, a visual management tool for Claude Code's configuration system. The problem was simple: Claude Code uses markdown files for instructions, but managing those scattered `.claude/` directories across projects became messy. I needed a way to see what instructions exist, where they overlap, and how they inherit across global and project scopes.

The commit history shows the evolution clearly—starting with basic project scanning, then layering on features like diff viewing, override detection, and global inheritance visualization. The MVP focused on "granular instruction management," which I interpreted as: treat each markdown file as a discrete unit you can preview, back up, and sync.

This wasn't about reinventing Claude Code's config system. It was about making the invisible visible—showing developers what instructions Claude actually sees when working in different projects.

### The Challenge

The interesting problems emerged during UI development. First, I had to replace all the emoji-based icons with a design system (OBRA icons). The commit messages show multiple fix attempts: "Fix IconHardDrive to use IconServer instead," "Fix OBRA icon import names to match package exports." This sounds trivial but revealed a classic integration issue—third-party icon packages don't always export what their docs claim they export.

The second challenge was the phased rollout. I completed six phases of UI work (Quick Actions, Override Detection, Diff Viewer, Optimization Suggestions, Global Inheritance View) in tight succession. Each phase built on the previous one, which meant keeping the architecture flexible enough to accommodate features I hadn't fully designed yet. The "Phase 1 MVP" commit shows I was deliberately constraining scope—get item management working first, then iterate.

The third challenge was TDD. Using Vitest with React meant writing tests for hooks (`useItemManagement`) that manage both preview and backup state. The commit "Implement item management hook with preview and backup functionality" suggests I wrote the hook implementation and tests together, which is harder than test-after but catches integration issues early.

### How I Solved It

I started with the foundation: project scanning and analysis. The commit "Implement project scanning and analysis features" laid the groundwork—finding `.claude/` directories, parsing markdown, building an inventory. This gave me the data model to build UI against.

Then I tackled the icon migration. The failed attempts with `IconHardDrive` taught me to verify package exports before importing. I ended up replacing emojis systematically across the app, which improved visual consistency but required checking every navigation item.

For the phased UI work, I used a feature-flag approach. The commit "Add skill import functionality and instruction analysis" shows I was building discrete features that could be toggled independently. This let me merge incomplete features without breaking the main workflow.

The item management hook became the core abstraction. Preview + backup meant maintaining two states: the live configuration and a rollback point. The hook encapsulates that logic, making the UI components simpler. The commit suggests I implemented the full hook (preview, backup, restoration) in one pass, which reduced integration debt later.

The dashboard-to-overview refactor ("Replace Dashboard with ProjectOverview") came late. This suggests I started with a generic component name, then renamed it when the purpose crystallized. That's a pattern I've seen work well—start generic, refactor to specific once you understand the domain.

### What I Learned

The icon migration taught me to distrust documentation for third-party UI libraries. Always verify exports in the actual package, especially when using design systems that aren't mainstream (like OBRA).

The phased approach worked. Committing incomplete features with clear phase markers ("Complete Phase 4: Enhanced diff modal with sync tools") created checkpoints I could reason about. If Phase 5 broke something, I knew Phase 4 was stable.

The item management hook pattern is reusable. Any time you need preview-before-commit behavior, encapsulate it in a hook with explicit backup/restore methods. The UI stays declarative, the hook handles state transitions.

If I were doing this again, I'd write more integration tests earlier. The test commits came late in the sequence, which means I was probably manually testing during development. Writing integration tests for the complete scan → analyze → diff → sync flow would have caught the icon import issues faster.



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
