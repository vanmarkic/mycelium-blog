---
title: "Work Visibility Skill"
date: "2025-11-02"
status: published
privacy: public
tags: [claude-code, productivity, git-analysis, workflow-automation]
repos: []
skills: [work-visibility]
patterns: [workflow-automation]
relatedTo: []
description: "Claude Code skill for analyzing git history to surface invisible work and generate status reports"
---

## Overview

The Work Visibility skill analyzes git repository history using lazy recursive scanning to surface patterns in your development work. It helps transform scattered commits into coherent narratives about what you've accomplished.

## Problem It Solves

Much of software engineering work is invisible:
- Refactoring that improves maintainability
- Bug fixes that prevent future issues
- Technical debt reduction
- Architecture improvements

Traditional status reports miss this work because git history is low-level and scattered.

## How It Works

### 1. Lazy Recursive Git Analysis

The skill uses a lazy evaluation approach to scan git history:

```typescript
async function* analyzeCommits(repoPath: string, daysBack: number) {
  for await (const commit of getCommits(repoPath, daysBack)) {
    const analysis = await analyzeCommit(commit);
    yield analysis;
  }
}
```

### 2. Pattern Detection

Identifies patterns in commits:
- **Refactoring patterns:** Moving functions, renaming variables
- **Testing patterns:** Added test coverage, fixed flaky tests
- **Architecture changes:** New abstractions, dependency updates
- **Bug fixes:** Error handling, edge cases

### 3. Narrative Generation

Transforms patterns into human-readable summaries:

```
Last 7 days in credit-castor:
- Implemented pure function architecture for calculations (8 commits)
- Added comprehensive test coverage with Vitest (12 commits)
- Refactored component structure for maintainability (5 commits)
```

## Usage in Claude Code

Invoke with:
```
/work-visibility
```

or natural language:
```
"Show me what I've been working on this week"
```

## Integration Points

This skill serves as the foundation for:
- **blog-workflow:** Scans repos to generate blog post ideas
- **Status reports:** Weekly summaries for stakeholders
- **Performance reviews:** Evidence of technical contributions

## Technical Implementation

Key technologies:
- `simple-git` for repository analysis
- Lazy evaluation with async generators
- Pattern matching with AST parsing
- Claude API for narrative generation

## Mycelium Links

Related:
- Repository scanner architecture
- Git analysis patterns
- Claude Code skill development
