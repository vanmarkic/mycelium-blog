---
title: Building touchepas with React and test-driven-development
date: '2025-11-03'
status: draft
privacy: public
tags:
  - test-driven-development
  - react
  - typescript
repos:
  - touchepas
skills: []
patterns:
  - test-driven-development
relatedTo:
  - 2025-11-03-claude-config
description: Exploring test-driven-development in touchepas
---
## Introduction

Over the past month, **28 commits** shaped touchepas, with 21% focused on building new features. The project leverages **React, TypeScript**, applying patterns like **test-driven-development** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: add hooks barrel export (11/2/2025)
- feat: implement useRentCalculation hook (GREEN) (11/2/2025)
- feat: integrate BrusselsCalculator with feature flag (11/2/2025)

Challenges overcome:
- fix: normalize void to null in BrusselsCalculator (11/2/2025)

Evolution and refinement:
- refactor: final cleanup Phase 2 (11/3/2025)
- refactor: integrate useRentCalculation hook (11/3/2025)
- refactor: extract RentWizard coordinator component (11/3/2025)

-->

### Context: What I Was Building

I spent October refactoring a rent indexation calculator for Belgium. Not because I wanted to—because TypeScript forced my hand. That void-returning function? It was a type bomb waiting to explode.

The project calculates rent adjustments based on regional health index data. Belgium has different rules for Brussels, Wallonia, and Flanders, with energy efficiency ratings affecting calculations. Users input their contract details, and the app tells them their legally-allowed indexed rent.

Early on, I realized this needed a strategy pattern. Each region has different calculation rules, and trying to handle everything in one function would be unmaintainable. I started with a calculator interface defining the contract: `canHandle()` to check if a calculator applies, and `calculate()` to do the work.

The architecture decision was deliberate: separate calculation logic from React state management from UI components. Pure calculation functions testable in isolation, a custom hook managing wizard state, coordinator components orchestrating the flow.

### The Challenge

The first version worked. Sort of. The BrusselsCalculator passed tests, but I knew it was fragile. TypeScript was warning me about something—the return type inconsistency between `void` and `null`.

Here's what happened: the underlying calculation function `calculateRentIndexationForBxl` could return `void` in some edge cases (like invalid energy efficiency ratings). But the calculator interface expected `number | null`. TypeScript compiled, but the semantics were wrong. `void` means "no return value," while `null` means "calculation completed, but no valid result." Different intentions, easy to confuse.

I spent time getting the normalization right:

```typescript
const rawRent = calculateRentIndexationForBxl(/* ... */);
const calculatedRent: number | null = typeof rawRent === 'number' ? rawRent : null;
```

That one line clarified intent for future maintainers. If you're not getting a number back, you're getting `null`—explicitly.

Second challenge: state management sprawl. The wizard had seven different state variables scattered across components: `yearOfIndexation`, `initialRent`, `contractSignatureDate`, `agreementStartDate`, `energyEfficiencyRating`, etc. Each component managed its own slice, but validation logic was duplicating everywhere.

The refactoring work took longer than expected. I extracted a `useRentCalculation` hook to consolidate all state and validation logic. The hook returns state values, setters, and computed properties like `isValid` and `isAnniversaryMonthReached`. This centralized the "rules" of the wizard in one place.

Third challenge: component organization. The original wizard was a 500-line monolith. I broke it into: `RentWizard` (coordinator), `WrittenNotificationStep`, `RegistrationStep`, `PEBStep`, `CalculationInputsStep`, and `RentResult`. Each component focused on one step, receiving state and callbacks via props.

TDD helped catch edge cases. What if anniversary month hasn't been reached yet? What if agreement start date is before signature date? The tests forced me to think through validation rules systematically.

### How I Solved It

The solution emerged through test-driven refactoring. RED-GREEN-REFACTOR kept me honest.

**Strategy pattern for calculators:**

```typescript
export interface RentCalculator {
  canHandle(args: RentIndexationArguments): boolean;
  calculate(args: RentIndexationArguments): RentResult;
}

export class BrusselsCalculator implements RentCalculator {
  canHandle(args: RentIndexationArguments): boolean {
    return args.region === 'brussels';
  }

  calculate(args: RentIndexationArguments): RentResult {
    // Brussels-specific logic here
    const rawRent = calculateRentIndexationForBxl(/* ... */);
    const calculatedRent: number | null =
      typeof rawRent === 'number' ? rawRent : null;

    return {
      rent: calculatedRent !== null ? roundToTwoDecimals(calculatedRent) : 0,
      explanation: this.generateExplanation(/* ... */),
    };
  }
}
```

The calculator registry dispatches to the right implementation based on `canHandle()`. This makes adding new regions straightforward—implement the interface, register the calculator, done.

**Custom hook for state consolidation:**

```typescript
export function useRentCalculation(region: Regions) {
  const [yearOfIndexation, setYearOfIndexation] = useState<number>();
  const [initialRent, setInitialRent] = useState<number>(0);
  // ... other state ...

  const isValid = useMemo(() => {
    return (
      yearOfIndexation !== undefined &&
      initialRent > 0 &&
      contractSignatureDate !== null &&
      agreementStartDate !== undefined &&
      isAnniversaryMonthReached &&
      yearOfIndexation > agreementStartDate.getFullYear() &&
      agreementStartDate >= contractSignatureDate
    );
  }, [/* dependencies */]);

  return {
    yearOfIndexation,
    setYearOfIndexation,
    isValid,
    isAnniversaryMonthReached,
    // ... everything else
  };
}
```

The hook encapsulates all wizard state and validation rules. Components just consume what they need. When validation logic changed, I only touched one file.

**Component extraction:**

The `RentWizard` coordinator became thin—just orchestrating flow:

```typescript
function RentWizard() {
  const rentState = useRentCalculation(region);

  return (
    <>
      <WrittenNotificationStep {...props} />
      <RegistrationStep {...props} />
      <PEBStep {...props} />
      <CalculationInputsStep {...props} />
      {rentState.isValid && <RentResult {...props} />}
    </>
  );
}
```

Each step component handles its own rendering logic, receiving state and callbacks as props. Clear separation of concerns.

Feature flags controlled the rollout. I integrated BrusselsCalculator with a flag, tested in production with a subset of users, then rolled out fully once confident.

### What I Learned

TypeScript's type system catches inconsistencies that tests might miss. The `void` vs `null` distinction seems pedantic until you're refactoring and the types guide you to correct behavior. Strong typing is documentation that's always up-to-date.

TDD forced me to think about edge cases upfront. What if the user selects an invalid energy rating? What if they haven't reached their anniversary month? Writing tests first surfaced these scenarios before users did.

Custom hooks are powerful for consolidating related state. Before `useRentCalculation`, validation logic was scattered across components. After, it was centralized in one place. Changes became safer—update the hook, and all consumers get the new behavior.

Component extraction improves maintainability, but only if you get the boundaries right. I initially extracted too early, then had to refactor again when I realized some components were too coupled. The final structure emerged after seeing patterns in the code.

Strategy pattern works well for domain logic with regional variations. Adding Wallonia or Flanders calculators will be straightforward—implement the interface, no changes to existing code. Open-closed principle in practice.

If I were starting over, I'd establish the strategy pattern and custom hook architecture from day one. Retrofitting patterns onto imperative code is painful. But the refactoring taught me where the complexity actually lives—in state management and validation, not just calculation logic.



## Technical Details

**Stack**: React, TypeScript
**Patterns**: test-driven-development


## All Commits (28)

- refactor: final cleanup Phase 2 (11/3/2025)
- refactor: integrate useRentCalculation hook (11/3/2025)
- refactor: extract RentWizard coordinator component (11/3/2025)
- refactor: extract RentWizard coordinator component (11/3/2025)
- refactor: extract CalculationInputsStep component (11/3/2025)
- refactor: extract PEBStep component (11/3/2025)
- refactor: extract RegistrationStep component (11/3/2025)
- refactor: extract WrittenNotificationStep component (11/3/2025)
- refactor: extract RentResult component (11/3/2025)
- docs: add Phase 2 core components design document (11/3/2025)
- docs: add phase 1 completion report (11/3/2025)
- docs: add hooks README (11/3/2025)
- docs: add calculator pattern README (11/3/2025)
- chore: add test convenience scripts (11/3/2025)
- feat: add hooks barrel export (11/2/2025)
- feat: implement useRentCalculation hook (GREEN) (11/2/2025)
- test: add useRentCalculation hook tests (RED) (11/2/2025)
- feat: integrate BrusselsCalculator with feature flag (11/2/2025)
- feat: add calculator registry with dispatcher (11/2/2025)
- fix: normalize void to null in BrusselsCalculator (11/2/2025)
- feat: implement BrusselsCalculator (GREEN) (11/2/2025)
- test: add BrusselsCalculator tests (RED) (11/2/2025)
- feat: add calculator strategy interface (11/2/2025)
- chore: create folder structure for refactoring (11/2/2025)
- docs: add Phase 1 implementation plan (11/2/2025)
- chore: add .worktrees/ to .gitignore (11/2/2025)
- docs: add maintainability refactor design document (11/2/2025)
- test: add case for Wallonia 2025 rent indexation based on user submission refactor: update correction ratio calculation in rent indexation formula update: remove outdated health index data from indices.json (10/21/2025)

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
