---
title: Building claude-config with React and test-driven-development
date: '2025-11-02'
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
  - 2025-11-02-credit-castor
  - 2025-11-02-loyer.brussels
  - 2025-11-02-touchepas
description: Exploring test-driven-development in claude-config
---
## Overview

This post explores the work done on claude-config over the last 17 commits.

**Tech Stack:** React, TypeScript, Vitest, Tailwind CSS

**Patterns:** test-driven-development

## Recent Activity

- feat: Implement item management hook with preview and backup functionality (10/30/2025)
- feat: Add Phase 1 MVP for granular instruction management with UI components and preview functionality (10/30/2025)
- feat: Implement Item Management Features (10/30/2025)
- feat: Add skill import functionality and instruction analysis (10/30/2025)
- feat: Add IconSparkles to insights navigation item (10/30/2025)

## Key Learnings

**Granular Instruction Management**

Claude Config evolved from simple global instructions to a sophisticated system supporting granular, per-project instruction management. This required building preview functionality to see how instructions compose before applying them.

**Hook-Based State Management**

The project demonstrates effective use of React hooks for complex state:

- `useItemManagement` - handles CRUD operations with backup/restore
- Preview state management with optimistic updates
- Instruction analysis and validation hooks

**Component-Driven Development with TDD**

Every UI component was built test-first using Vitest. This caught edge cases early and ensured the preview functionality correctly merged instruction hierarchies.

## Technical Deep Dive

### Item Management Architecture

Phase 1 MVP introduced a flexible item management system:

```typescript
interface Item {
  id: string;
  type: 'global' | 'project' | 'skill';
  content: string;
  priority: number;
  enabled: boolean;
}

interface ItemManagementHook {
  items: Item[];
  preview: string;
  addItem: (item: Partial<Item>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  generatePreview: () => string;
}
```

The hook manages complex state transitions while maintaining immutability and enabling undo/redo functionality through backups.

### Skill Import and Analysis

The skill import feature parses Claude Code skill files and extracts their instruction patterns:

- Markdown parsing with frontmatter extraction
- Instruction block detection and categorization
- Automatic tagging based on content analysis

This enables users to import existing skills and understand their structure before integrating them into their configuration.

## Conclusion

Claude Config demonstrates how TDD enables building complex configuration UIs with confidence. The granular instruction system with preview functionality solves real pain points in managing Claude's behavior across different contexts, making AI configuration more maintainable and debuggable.

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
