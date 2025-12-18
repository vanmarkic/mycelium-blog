---
title: Knowledge Converter Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - data-extraction
  - knowledge-management
  - astro
  - typescript
repos:
  - how-not-to-diet
skills:
  - knowledge-converter
patterns:
  - progressive-discovery
  - extraction-before-features
relatedTo:
  - 2025-11-14-3DSoundViz
  - 2025-12-18-how-not-to-diet-en
description: >-
  Claude Code skill for converting dense documents into browsable apps using
  progressive discovery and systematic extraction
---

## Overview

The Knowledge Converter skill transforms dense reference documents (nutrition books, design pattern catalogs, drug interaction guides) into browsable web applications. It enforces a strict **extraction-before-features** approach to prevent building UIs for wrong data models.

## The Iron Law

```
NO UI BEFORE 50+ ITEMS EXTRACTED
NO EXTRACTION BEFORE DISCOVERY
NO DISCOVERY WITHOUT SOURCE TRACKING
```

This applies even under time pressure. 50 items with basic info beats 10 items with fancy UI.

## Problem It Solves

When building apps from dense documents, developers typically:
- Build UI first, figure out data later (wrong model)
- Extract biased samples (known items only)
- Skip source attribution (unverifiable claims)
- Never go back to complete extraction

The skill forces the correct order: Discover → Extract → Build.

## How It Works

### Phase 1: Progressive Discovery (30% time)

Sample 5-10 random sections to understand structure without reading everything:

```typescript
// Pseudo-code for random sampling
const sampleSize = 10;
for (let i = 0; i < sampleSize; i++) {
  const page = random(1, totalPages);
  readSection(page);
  documentPatternsFound(page);
}
```

**Discover:**
- Item types (foods, patterns, drugs)
- Relationship types (synergies, conflicts, dependencies)
- Property types (categories, timings, amounts)
- Evidence types (studies, mechanisms, dosages)

### Phase 2: Systematic Extraction (50% time)

Extract 50+ items with complete source attribution:

```typescript
interface Item {
  id: string;
  name: string;
  properties: string[];
  relationships: Relationship[];
  sources: {
    main: string;        // "p. 45"
    properties?: string; // "p. 47-48"
    relationships?: string;
  };
}
```

**Critical:** Every fact needs a page number. If you didn't track the source, delete the fact and re-extract.

### Phase 3: App Building (20% time)

With comprehensive data, the app becomes straightforward:

- Item browser with properties and sources
- Relationship explorer (combinations, conflicts)
- Search and filter
- Source verification links

## When To Use

Use when:
- Dense source document (100+ pages) with item relationships
- Need browsable app for combinations/planning
- Domain has rich interdependencies
- Want to minimize user input during development

Examples:
- Food synergies → meal planner
- Wine pairings → pairing suggester
- Drug interactions → safety checker
- Design patterns → pattern explorer

## Emergency Timeline Protocol

**"Need it tomorrow"? Extract rapidly, not partially.**

6-hour emergency allocation:
- 1 hour: Discovery (rapid sampling)
- 4 hours: Extraction (50+ items, minimal detail each)
- 1 hour: Simple browser (just list + detail pages)

An impressive UI with 10 items is more misleading than 50 items with plain list.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Quality over quantity" | Need both. 50+ proves process works. |
| "Can add more later" | You won't. Extract systematically now. |
| "Build on existing work" | If <50 items, DELETE. Start fresh. |
| "MVP principles" | MVP = minimum VIABLE, not minimum effort. |

## Mycelium Links

Related:
- **how-not-to-diet** project: Applied this skill to build nutrition synergy app
- **property-based-regression-testing**: Validates extraction algorithms
- **brainstorming**: Progressive discovery uses similar sampling techniques
