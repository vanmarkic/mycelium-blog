---
title: Building a Nutrition Synergy App with TDD and Astro
date: '2025-12-18'
status: published
privacy: public
lang: en
tags:
  - test-driven-development
  - static-site-generation
  - functional-programming
  - react
  - astro
  - typescript
  - vitest
  - nutrition
repos:
  - how-not-to-diet
skills:
  - nutrition-synergy-app-builder
  - knowledge-converter
patterns:
  - test-driven-development
  - static-site-generation
  - functional-programming
relatedTo:
  - 2025-11-02-example-draft
  - 2025-11-03-claude-config
  - 2025-11-03-credit-castor
  - 2025-11-03-loyer.brussels
  - 2025-11-03-mycelium-blog
  - 2025-11-03-touchepas
  - 2025-11-14-3DSoundViz
  - 2025-11-14-claude-config
  - 2025-11-14-credit-castor
  - 2025-11-14-lagendwa
  - 2025-11-14-loyer.brussels
  - 2025-11-14-mycelium-blog
  - 2025-11-14-touchepas
  - 2025-11-14-womb
  - 2025-12-18-loyer-brussels-fr
  - 2025-12-18-obsidian-mcp-tools-nl
  - knowledge-converter
  - property-based-regression-testing
description: >-
  How I built a meal planning application that suggests food synergies based on
  nutritional science, using TDD, Astro, and a knowledge extraction approach.
---

## Introduction

What if your meal planner could tell you that eating turmeric with black pepper increases curcumin absorption by 2000%? Or that vitamin C enhances iron absorption from plant sources? I built **How Not To Diet** — a web application that transforms dense nutritional research into actionable meal planning.

Over the past month, **55 commits** shaped this project, applying **test-driven development**, **static site generation**, and **functional programming** to solve a real-world knowledge conversion challenge.

## The Story

### Context: What I Was Building

I wanted to build an app that helps people plan meals based on food synergies — combinations where nutrients work together for enhanced absorption or health benefits. The source material? Dense nutritional science books with hundreds of pages of research.

The challenge wasn't just technical — it was about **knowledge extraction**. How do you take 600 pages of scientific research and turn it into a browsable, useful application?

### The Challenge

Three obstacles stood in the way:

1. **Information density**: Nutritional synergies are scattered across chapters, with relationships like "eat X with Y for Z benefit" buried in prose.

2. **Data modeling**: Foods have categories, properties, synergies, and timing considerations. Building the right schema required understanding the domain first.

3. **Accessibility**: The target audience isn't developers — they need clear, accessible interfaces that work on mobile while cooking.

The temptation was to build the UI first and figure out the data later. That would have been a mistake.

### How I Solved It

I followed a strict **extraction-before-features** approach:

```typescript
// The data model emerged from progressive discovery
interface Food {
  id: string;
  name: string;
  category: string;
  properties: string[];
  synergies: Synergy[];
  timing: TimingInfo;
  sources: SourceCitation;
}

interface Synergy {
  with: string;           // Food ID
  type: 'absorption' | 'enhancement' | 'protection';
  description: string;
  mechanism?: string;
  source: string;         // Page number
}
```

**Phase 1: Progressive Discovery**
I sampled 8 random chapters to understand the structure before extracting anything. This revealed 4 relationship types I hadn't anticipated: synergies, conflicts, timing dependencies, and category considerations.

**Phase 2: Systematic Extraction with TDD**
Using Vitest, I wrote tests for the synergy scoring algorithm before implementing it:

```typescript
describe('synergy scoring', () => {
  it('prioritizes direct synergies over category matches', () => {
    const score = calculateSynergyScore(turmeric, blackPepper);
    expect(score).toBeGreaterThan(0.9);
  });

  it('avoids redundant suggestions from same category', () => {
    const suggestions = getSuggestions([broccoli, kale, spinach]);
    expect(suggestions).not.toContainDuplicateCategories();
  });
});
```

**Phase 3: Astro Static Site**
I chose Astro for zero-JS by default and excellent SEO capabilities:

```typescript
// API endpoints serve both the app and external integrations
export const GET: APIRoute = async ({ params }) => {
  const foods = await loadFoodDatabase();
  return new Response(
    JSON.stringify({
      data: foods,
      meta: { total: foods.length, page: 1 }
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
```

### What I Learned

1. **Extraction is 80% of the work**. The UI took 20% of the time but would have been impossible without comprehensive data.

2. **Source tracking is non-negotiable**. Every synergy claim links back to a page number. Without this, the app would be just another nutrition opinion.

3. **TDD works for data-heavy apps**. Writing tests for the synergy algorithm before implementation caught edge cases I would have missed.

4. **Accessibility requires early planning**. Adding WCAG-compliant color contrast and mobile menus retroactively took significant refactoring.

## Technical Details

**Stack**: Astro, React, TypeScript, Vitest, Tailwind CSS

**Key Features**:
- 75+ foods with verified synergies
- Meal-time relevance filtering
- Category diversity to avoid redundant suggestions
- Swagger API documentation
- SEO optimization with structured data
- WCAG AA compliant color scheme

**Patterns Applied**:
- Test-driven development for business logic
- Static site generation for performance
- Functional programming for pure transformation functions

## Mycelium Links

This project connects to:
- **knowledge-converter** skill: The methodology for extracting structured data from dense documents
- **property-based-regression-testing**: Used for validating synergy calculations across random inputs
