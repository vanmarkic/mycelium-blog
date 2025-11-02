---
title: "Building a Belgian Real Estate Calculator with Astro and Pure Functions"
date: "2025-11-02"
status: draft
privacy: public
tags: [astro, real-estate, pure-functions, tdd, vitest]
repos: [credit-castor]
skills: []
patterns: [static-site-generation, functional-programming]
relatedTo: []
description: "A pure functional approach to building a real estate calculator for Belgian property transactions using Astro SSG and TDD"
---

## Overview

This post explores the architecture and development process of Credit Castor, a Belgian real estate calculator built with Astro's static site generation capabilities and a pure functional programming approach.

## The Problem

Belgian real estate transactions involve complex calculations including notary fees, registration taxes, and regional variations. The traditional approach of embedding business logic in UI components makes testing difficult and maintenance costly.

## Solution: Pure Functions + SSG

By separating calculation logic into pure functions and leveraging Astro's static site generation, we achieved:

1. **Testability:** Every calculation is a pure function with predictable inputs/outputs
2. **Performance:** Pre-rendered pages with zero JavaScript for the core calculator
3. **Maintainability:** Clear separation between UI and business logic

## Technical Implementation

```typescript
// Example: Pure function for notary fee calculation
export function calculateNotaryFees(
  propertyPrice: number,
  region: 'flanders' | 'wallonia' | 'brussels'
): number {
  const baseRate = region === 'flanders' ? 0.03 : 0.035;
  return propertyPrice * baseRate;
}
```

## Testing Strategy

Using Vitest for comprehensive unit testing:

```typescript
describe('calculateNotaryFees', () => {
  it('calculates fees for Flanders properties', () => {
    expect(calculateNotaryFees(300000, 'flanders')).toBe(9000);
  });
});
```

## Lessons Learned

1. Pure functions make complex domain logic approachable
2. SSG is perfect for calculators that don't need server-side state
3. TDD pays off when dealing with regional business rules

## Mycelium Links

This project connects to concepts explored in:
- Static site generation patterns
- Functional programming in TypeScript
- Domain modeling for financial calculations
