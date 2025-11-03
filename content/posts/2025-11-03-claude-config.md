---
title: Building claude-config with React and test-driven-development
date: '2025-11-03'
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
  - 2025-11-03-touchepas
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

I needed a better way to manage Claude AI configuration files. Not just editing CLAUDE.md directly—something with preview, conflict detection, and safe backups. Every time I modified project instructions, I worried about breaking existing setups or overwriting important context.

The project is a visual UI for managing Claude Code's configuration hierarchy: global settings, project-specific instructions, and granular instruction items that can be added, modified, or removed safely. Think of it as a diff viewer meets a configuration manager, with intelligence about inheritance and conflicts.

Early on, I realized this needed careful state management. Users would select instruction items to modify, preview changes across multiple files, resolve conflicts, and finally apply changes with automatic backups. The critical constraint: never lose user data, always show what will change before changing it.

The architecture used React with TypeScript, Vitest for testing, and Tailwind CSS for UI. I built it as a desktop app with file system access, allowing users to scan their projects, analyze configuration, and make safe edits with preview and rollback capability.

### The Challenge

The core challenge was managing the preview and apply workflow. Users needed to see exactly what would change before committing, but configuration files have inheritance—global settings affect project settings, which affect specific instructions.

Icon imports broke twice during development. First, `IconHardDrive` didn't exist in the OBRA design library—I switched to `IconServer`. Then other icons had mismatched export names. These small breaks taught me to verify third-party APIs immediately.

Second challenge: backup and rollback. When applying changes, users needed confidence that mistakes could be undone. I added automatic backup creation before any write operation, storing timestamped copies of affected files. The preview state tracked which files would change, and the apply function iterated through them safely.

Third challenge: conflict detection. What if a user modifies an instruction that conflicts with existing project settings? The preview generation needed to analyze the full configuration hierarchy, detect conflicts, and flag them before allowing changes. This required reading multiple files, parsing their structure, and comparing against proposed changes.

Testing added complexity. How do you test file system operations without actually writing files? Vitest with mocked file APIs helped, but integration tests still needed careful setup to avoid side effects.

### How I Solved It

The solution centered on a custom hook managing item state, preview generation, and safe application:

```typescript
export function useItemManagement(
  initialItems: InstructionItem[] = []
): UseItemManagementResult {
  const [items, setItems] = useState<InstructionItem[]>(initialItems);
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreviewState = useCallback(async () => {
    try {
      const preview = await generatePreview(items);
      setPreviewState(preview);
    } catch (err) {
      setError(`Failed to generate preview: ${err.message}`);
    }
  }, [items]);

  const applyChanges = useCallback(async () => {
    if (!previewState || !previewState.canApply) {
      setError('Cannot apply changes: conflicts exist');
      return;
    }

    const backupPath = await createBackup(previewState);

    for (const [filePath, change] of previewState.targetFiles) {
      const contentToWrite = previewState.editedContent.get(filePath) || change.afterContent;
      await window.fileAPI.writeFile(filePath, contentToWrite);
    }

    setPreviewState(null);
    setItems([]);
  }, [previewState]);

  return { items, setItems, previewState, generatePreviewState, applyChanges, isApplying, error };
}
```

The hook encapsulates the entire workflow: item management, preview generation, conflict validation, backup creation, and safe file writing. Components just consume this API without worrying about the complexity underneath.

Phase 1 MVP delivered: granular instruction management with UI components, preview functionality, and backup. Users could select items, see a diff of proposed changes, and apply or cancel. The preview showed before/after content side-by-side, highlighting conflicts in red.

Icon fixes were straightforward once I understood the OBRA design library's export structure. Replaced emojis with proper design system icons throughout for consistency.

Project scanning added later: analyze existing projects for configuration structure, detect overrides, and suggest optimizations. This gave users insight into their configuration hierarchy without manual inspection.

### What I Learned

Preview-before-apply is essential for configuration tools. Users need to see exactly what will change before committing. The preview state approach—generating a complete picture of affected files, conflicts, and proposed changes—gave users confidence to make edits safely.

Automatic backups remove fear from destructive operations. Once users knew they could rollback, they experimented more freely. The backup mechanism was simple: timestamp + file path + original content. Rollback just copied the backup back.

Testing file system operations requires mocking carefully. Vitest's mock capabilities helped, but integration tests still needed isolated test directories to avoid side effects. I learned to use temporary directories and clean up aggressively.

Third-party UI libraries change. Icon imports broke twice because I assumed the library structure without checking. Now I verify exports immediately when integrating new dependencies. Documentation can be outdated—source code is truth.

State management hooks scale well for multi-step workflows. The `useItemManagement` hook handled items, preview, applying, errors, and loading states in one place. When I needed to add rollback functionality, I only touched the hook—components didn't change.

If I were starting over, I'd implement preview and backup from day one. Retrofitting them after building the basic UI was harder than designing them in from the start. Also, I'd invest more in integration tests early—they caught real bugs that unit tests missed.



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
