---
title: Building a Belgian Real Estate Calculator with Astro and Pure Functions
date: '2025-11-02'
status: draft
privacy: public
tags:
  - astro
  - real-estate
  - pure-functions
  - tdd
  - vitest
repos:
  - credit-castor
skills: []
patterns:
  - static-site-generation
  - functional-programming
relatedTo:
  - static-site-generation
description: >-
  A pure functional approach to building a real estate calculator for Belgian
  property transactions using Astro SSG and TDD
---

### Context: What I Was Building

I needed a calculator for Belgian real estate division purchases. Not a simple mortgage calculator—something that could handle multiple participants splitting a property purchase, each with different surfaces, notary fee rates, and financing terms. Plus construction costs: CASCO (shell construction), parachèvements (finishing works), and travaux communs (common building works).

The project started with a React + TypeScript foundation using Tailwind CSS. I built it as a static site with Astro SSG, which meant zero server-side state and all calculations happening client-side. The technical constraint was clear: pure functions that could be tested in isolation.

Early on, I added password protection—not for security, but to hide the app from crawlers during development. GitHub Actions handled deployment to GitHub Pages. The architecture decision was deliberate: separate calculation logic from UI components entirely.

What made this interesting was the domain complexity. Belgian real estate has regional variations in notary fees, dynamic professional fees based on total CASCO costs (15% × 30%), and recurring expenses over 3 years. Most calculator apps I'd seen hardcoded these rules into UI components. I wanted something maintainable.

### The Challenge

The complexity revealed itself in layers. First challenge: the frais généraux (general fees) calculation. The Excel formula showed `='PRIX TRAVAUX'!E14*0.15*0.3`, which meant professional fees depended on total CASCO costs. But total CASCO costs depended on participant inputs. Circular dependency.

I spent time getting the calculation order right. Had to compute all participant CASCO costs first, add common building works CASCO, then derive professional fees. The refactoring work shows several iterations on `calculateFraisGeneraux3ans`—it started simple, then evolved to handle the dynamic dependency on construction costs.

Second challenge: global vs per-participant rates. Initially, each participant could specify their own CASCO per m² rate. This created maintenance burden—participants would forget to update rates, leading to inconsistencies. The refactor to `globalCascoPerM2` simplified this: one global rate for CASCO, but participants could still customize parachevements if needed.

The migration logic was tricky. When I introduced `globalCascoPerM2`, existing scenarios stored in localStorage broke. I added `migrateScenarioData` to handle backward compatibility with v1.0.2 scenarios. Edge case tests revealed more: what if `globalCascoPerM2` is undefined? What if legacy data has per-participant rates?

Third challenge: event-sourced architecture. Later in development, I added a timeline feature showing cash flow projections over time. This required modeling the domain with events: deed date, construction milestones, loan disbursements. The chronology foundation needed to be event-sourced to support "what-if" scenarios and temporal queries.

TypeScript helped catch type mismatches, but TDD was essential. Vitest tests forced me to think about edge cases: zero loan amounts, participants with different interest rates, scenario changes affecting multiple calculations.

### Solution: Pure Functions + Event Sourcing

The solution emerged through test-driven refactoring. Every calculation became a pure function:

```typescript
export function calculatePricePerM2(
  totalPurchase: number,
  totalSurface: number,
  purchasePriceReduction: number = 0
): number {
  const adjustedPurchase = totalPurchase * (1 - purchasePriceReduction / 100);
  return adjustedPurchase / totalSurface;
}
```

Small, testable, predictable. No side effects.

The frais généraux calculation became a multi-step pure function:

```typescript
export function calculateFraisGeneraux3ans(
  participants: Participant[],
  projectParams: ProjectParams,
  unitDetails: UnitDetails
): number {
  // Step 1: Calculate total CASCO from participants
  let totalCasco = 0;
  for (const participant of participants) {
    const { casco } = calculateCascoAndParachevements(
      participant.unitId,
      participant.surface,
      unitDetails,
      projectParams.globalCascoPerM2,
      participant.parachevementsPerM2,
      participant.cascoSqm,
      participant.parachevementsSqm
    );
    totalCasco += casco * participant.quantity;
  }

  // Step 2: Add common building works CASCO
  totalCasco += calculateTotalTravauxCommuns(projectParams);

  // Step 3: Calculate professional fees (15% × 30% of total CASCO)
  const honoraires = totalCasco * 0.15 * 0.30;

  // Step 4: Add recurring and one-time costs over 3 years
  const recurringYearly = 388.38 + 1000 + 600 + 2000 + 2000 + 2000;
  const recurringTotal = recurringYearly * 3;
  const oneTimeCosts = 500 + 45;

  return honoraires + recurringTotal + oneTimeCosts;
}
```

The key insight: pass dependencies explicitly, return values predictably. This made testing straightforward and revealed the calculation order clearly.

For the global CASCO refactor, I removed `cascoPerM2` from the `Participant` interface and added `globalCascoPerM2` to `ProjectParams`. The migration function handled legacy data:

```typescript
export function migrateScenarioData(data: any): ScenarioData {
  // Handle missing globalCascoPerM2 by deriving from first participant
  if (data.projectParams && !data.projectParams.globalCascoPerM2) {
    const firstParticipant = data.participants?.[0];
    data.projectParams.globalCascoPerM2 = firstParticipant?.cascoPerM2 || 1400;
  }
  return data;
}
```

The event-sourced architecture for the timeline feature used a chronology foundation with 34 tests. Events captured key moments: deed signing, construction start, loan disbursement. The projection engine rebuilt state from events, enabling temporal queries like "What's the cash flow in month 12?"

Export functionality added XLSX and CSV writers. The XLSX writer tracked worksheet bounds to auto-size columns properly. Small detail, but it improved usability.

### Learned: Testability Comes From Structure

Pure functions aren't just academic—they made complex domain logic approachable. Every calculation could be tested in isolation. When I added scenario variations (construction cost changes, infrastructure reductions), the tests caught breaking changes immediately.

TDD forced me to think about edge cases upfront. What if loan amount is zero? What if surface is zero? The tests revealed these scenarios before users did.

Astro SSG was perfect for this use case. No server needed, no database, just static files. The password gate worked client-side, which was fine for hiding from crawlers. Performance was instant—pre-rendered pages with minimal JavaScript.

The refactor from per-participant CASCO rates to a global rate showed me how premature flexibility creates maintenance burden. I thought participants would want custom rates. They didn't. The global rate simplified both code and UI.

Event sourcing for the timeline feature was harder than expected. The chronology foundation took longer to implement than the basic calculator. But it paid off: adding new event types (like construction milestones) became straightforward once the foundation was solid.

TypeScript caught type mismatches that would've been runtime errors. The migration from `cascoPerM2` to `globalCascoPerM2` would've broken silently without strong typing. TypeScript forced me to update all call sites.

Most importantly: separation of concerns matters. Calculation logic in pure functions, UI in React components, state management in Astro. When I needed to change how frais généraux were calculated, I only touched `calculatorUtils.ts`. The UI didn't care.

If I were starting over, I'd establish the event-sourced architecture earlier. Retrofitting events onto imperative code is painful. But the pure functional approach from day one? No regrets. It made everything else easier.

## Mycelium Links

This project connects to concepts explored in:
- Static site generation patterns with Astro
- Functional programming principles in TypeScript
- Domain modeling for financial calculations
- Event sourcing for temporal data
- TDD methodology for complex business logic
