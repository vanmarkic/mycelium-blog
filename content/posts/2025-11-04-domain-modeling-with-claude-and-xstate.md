---
title: "Capturing Business Domains with Claude: From Assertions to State Machines"
date: '2025-11-04'
status: published
privacy: public
tags:
  - domain-driven-design
  - xstate
  - state-machines
  - clean-architecture
  - domain-modeling
  - llm-assisted-development
  - belgian-real-estate
repos:
  - credit-castor
skills: []
patterns:
  - domain-driven-design
  - state-machines
  - clean-architecture
relatedTo: []
description: 'A methodology for using Claude and xstate to capture complex business domains through structured assertions, questions, and state machine generation - demonstrated with Belgian real estate cohousing law'
---

## Introduction

When building the Credit Castor calculator for Belgian real estate cohousing, I faced a challenge that many developers encounter: **understanding a complex business domain before writing any code**. The domain involved Belgian real estate law (PRECAD procedures, registration fees, quotité calculations), copropriété governance, portage pricing mechanisms, and multi-stage legal processes.

Rather than diving straight into React components and calculations, I developed a methodology with Claude that **separated domain understanding from implementation**. The approach: use structured assertions and questions to map the domain, then encode that understanding into an xstate state machine.

This post shares that methodology and why it aligns perfectly with clean architecture principles.

## The Story

### Context: Why Domain-First Matters

Credit Castor needed to handle:

1. **Belgian legal compliance**: PRECAD procedures, acte de base, registration fees (3% vs 12.5%), permit enactment deadlines
2. **Financial complexity**: Portage pricing (founders recovering costs + indexation + carrying costs), copropriété lot pricing, frais généraux calculations
3. **Governance rules**: Hybrid voting (democratic + quotité-weighted), ACP collective loans, buyer interview processes
4. **Lifecycle phases**: 11 distinct legal phases from initial purchase through copropriété creation to lot sales

The risk: building a calculator that **works technically but fails legally or financially**. The solution: **understand the domain deeply before writing UI code**.

### The Challenge: Domain Knowledge vs Code

The traditional approach would be:
1. Sketch some React components
2. Add state management
3. Implement calculations as you go
4. Discover edge cases through bugs
5. Refactor when business rules change

This couples domain logic to presentation, making it hard to:
- **Validate correctness**: Is the portage price calculation legally correct?
- **Reuse logic**: What if we want a CLI tool, mobile app, or API?
- **Maintain understanding**: Where is the "quotité" concept defined?
- **Test exhaustively**: How do we verify all state transitions are valid?

### How I Solved It: Assertions → Validation → State Machine

#### Phase 1: Domain Discovery Through Assertions

I asked Claude to generate structured assertions about the business domain—**purely conceptual, zero code**. Format:

```markdown
**Assertion X.Y**: [Statement about how the domain works]
- **Answer**: [yes/no/partially + corrections]
```

Example from [business-logic-assertions.md]:

```markdown
**Assertion 6.1**: When a founder sells a lot to a newcomer,
the resale price includes: base acquisition cost + indexation +
carrying cost recovery + renovations.

Answer: Yes, but it should also include recovery of registration
fees, frais communs, recurring costs, loan interest, etc.
Basically everything the founder paid when buying and owning
the lot. The same mechanism applies partially when a newcomer
buys from the copropriété (hidden lots), but in that case there
is no "founder", so the base acquisition cost is calculated
differently, because there were less taxes as it wasn't real
estate until "revealed" as real estate at resale.
```

This revealed **critical domain nuances** that I wouldn't have articulated upfront:
- Portage applies to BOTH founder→newcomer AND copropriété→newcomer sales
- Hidden lots have different tax treatment (weren't real estate initially)
- The pricing calculation is fundamentally about **cost recovery with fairness**

**Key insight**: Answering "no" or "partially" forces you to **articulate the correct model** explicitly. This becomes your domain specification.

#### Phase 2: Research Integration

For assertions I couldn't answer confidently, Claude researched Belgian real estate law:
- PRECAD procedures for copropriété creation
- Legal timelines (deed registration within 15 days, permit enactment within 3 years)
- Quotité calculation rules
- Registration fee rates for Wallonia (3% for reduced rate, 12.5% standard)

This wasn't just "asking an LLM questions"—it was **structured domain research** embedded in the assertion-answer workflow.

#### Phase 3: State Machine Generation

Once the domain was validated (100+ assertions answered), we had:
1. **Clear entity model**: Participants, Lots, Sales (portage/copro/classic), Loans, ACPLoans
2. **Domain events**: COMPROMIS_SIGNED, DEED_REGISTERED, PRECAD_APPROVED, SALE_INITIATED, etc.
3. **Business rules**: Guards (e.g., "can't sell until acte transcribed"), validations (e.g., "quotité must sum to 1.0")
4. **Lifecycle phases**: PRE_PURCHASE → COMPROMIS_PERIOD → DEED_REGISTRATION_PENDING → COPRO_CREATION → OPERATIONAL

From this, we generated an xstate state machine:

```typescript
export const creditCastorMachine = setup({
  types: {} as {
    context: ProjectContext;
    events: ProjectEvents;
  },

  guards: {
    isPortageSale: ({ context }) => {
      if (!context.currentSale) return false;
      return context.currentSale.saleType === 'portage';
    },
    allFinancingApproved: ({ context }) => {
      return context.approvedFinancing >= context.requiredFinancing;
    }
  },

  actions: {
    setBankDeadline: assign({
      bankDeadline: ({ context, event }) => {
        if (event.type !== 'COMPROMIS_SIGNED') return context.bankDeadline;
        const deadline = new Date(event.compromisDate);
        deadline.setMonth(deadline.getMonth() + 4); // 4-month deadline
        return deadline;
      }
    }),
    // ... more actions
  }
}).createMachine({
  // ... state definitions
});
```

**The machine encodes domain rules directly**:
- Guards prevent invalid transitions ("can't complete sale without buyer approval")
- Actions maintain domain invariants ("bank deadline is compromis date + 4 months")
- Events represent domain facts ("DEED_SIGNED", not "submitDeedForm")

### What I Learned: Clean Architecture Through State Machines

This methodology delivered **clean architecture by design**:

#### 1. **Domain Layer is Pure and Portable**

The state machine + types + events are the domain. They:
- Have **zero UI dependencies** (no React, no DOM, no CSS)
- Are **framework-agnostic** (works with React, Vue, Svelte, CLI, API)
- Encode **business rules explicitly** (guards = invariants, actions = state transitions)
- Are **testable in isolation** (send events, assert state transitions)

Example test:

```typescript
test('portage sale calculates founder cost recovery', () => {
  const machine = creditCastorMachine.provide({
    actors: {},
    guards: {},
    actions: {}
  });

  const state = machine.transition(
    'operational',
    {
      type: 'SALE_INITIATED',
      lotId: 'lot-1',
      sellerId: 'founder-1',
      buyerId: 'newcomer-1',
      saleType: 'portage'
    }
  );

  expect(state.context.currentSale?.pricing.totalPrice).toBeGreaterThan(
    state.context.currentSale?.pricing.baseAcquisitionCost
  );
});
```

No mocking React hooks, no DOM queries—just **domain logic verification**.

#### 2. **Presenters/Views Are Thin**

React components become **pure presenters**:

```tsx
function PortagePricing({ lotId }: { lotId: string }) {
  const actor = useActor(creditCastorMachine);
  const [state] = actor;

  // Query domain via selectors
  const pricing = queries.getPortagePricing(state.context, lotId);

  // Present data, trigger domain events
  return (
    <Card>
      <h3>Prix de Portage</h3>
      <Line label="Coût d'acquisition" value={pricing.baseAcquisitionCost} />
      <Line label="Indexation" value={pricing.indexation} />
      <Line label="Frais de portage" value={pricing.carryingCosts.total} />
      <Line label="Rénovations" value={pricing.renovations} />
      <Divider />
      <Total label="Prix total" value={pricing.totalPrice} />
    </Card>
  );
}
```

**Zero business logic** in the component. All logic is in:
- `state.context` (domain state)
- `queries.getPortagePricing()` (domain query)
- `creditCastorMachine` (domain rules)

#### 3. **Documentation is Executable**

The state machine diagram is the documentation:

```mermaid
PRE_PURCHASE
    │
    │ COMPROMIS_SIGNED
    ▼
COMPROMIS_PERIOD
    │
    │ ALL_CONDITIONS_MET
    ▼
READY_FOR_DEED
    │
    │ DEED_SIGNED
    ▼
DEED_REGISTRATION_PENDING
    │
    │ DEED_REGISTERED
    ▼
OWNERSHIP_TRANSFERRED
```

This is **generated from the xstate machine**, not manually drawn. It can't go out of sync with the code because **it IS the code**.

#### 4. **Changes Are Localized**

When business rules change (e.g., "bank deadline is now 6 months, not 4"), you update **one place**:

```typescript
actions: {
  setBankDeadline: assign({
    bankDeadline: ({ context, event }) => {
      if (event.type !== 'COMPROMIS_SIGNED') return context.bankDeadline;
      const deadline = new Date(event.compromisDate);
      deadline.setMonth(deadline.getMonth() + 6); // Changed: 6 months
      return deadline;
    }
  })
}
```

No hunting through React components, no "find all places where we calculate deadlines". The domain is **centralized and explicit**.

### Why This Methodology Works

1. **Forces Explicit Domain Model**: Assertions require you to articulate concepts you might otherwise leave implicit
2. **Separates Concerns Early**: Domain understanding happens BEFORE code, preventing coupling
3. **Enables Research Integration**: Claude can fetch Belgian law docs, PRECAD procedures, tax rates—enriching the domain model with authoritative sources
4. **Produces Verifiable Artifacts**: The assertion document becomes a **domain specification** that non-technical stakeholders can review
5. **Generates Clean Architecture**: State machines are naturally framework-agnostic, making them perfect domain models

### When to Use This Approach

This methodology is overkill for simple CRUD apps, but **essential** for:

- **Regulated domains**: Finance, healthcare, legal (where correctness matters)
- **Complex workflows**: Multi-stage processes with validations and deadlines
- **Collaborative projects**: Multiple people need to understand the domain
- **Long-term systems**: Domain will outlive UI frameworks

For Credit Castor, the domain (Belgian real estate law, copropriété rules) will be relevant for **decades**, while the UI framework (React, Astro) might change. Keeping them separate was critical.

## Technical Details

**Stack**: XState v5, TypeScript, React (as one possible presenter)

**Domain Artifacts**:
- [`types.ts`](src/stateMachine/types.ts) - Domain entities (Participant, Lot, Sale, Loan, ProjectContext)
- [`events.ts`](src/stateMachine/events.ts) - Domain events (PurchaseEvents, SalesEvents, FinancingEvents)
- [`creditCastorMachine.ts`](src/stateMachine/creditCastorMachine.ts) - State machine with guards and actions
- [`queries.ts`](src/stateMachine/queries.ts) - Domain query functions
- [`calculations.ts`](src/stateMachine/calculations.ts) - Pure calculation functions

**Process Artifacts**:
- [`business-logic-assertions.md`](docs/analysis/business-logic-assertions.md) - 100+ domain assertions with validated answers
- [`state-machine-design.md`](docs/plans/2025-11-03-state-machine-design.md) - State machine architecture

**Key Pattern**: Flat context + query functions (Pattern A in the design doc), with clear migration path to Actor model (Pattern B) when needed.

## Key Takeaways

1. **Domain understanding before code**: Spend time with assertions and questions BEFORE writing React/Vue/Svelte
2. **LLMs as domain research partners**: Claude can fetch legal docs, regulations, and industry practices to enrich the model
3. **State machines as domain models**: xstate machines are naturally framework-agnostic and testable
4. **Clean architecture emerges naturally**: When domain is separate, presenters become thin and reusable
5. **Documentation is code**: State machine diagrams, type definitions, and event lists ARE the domain documentation

## Future Directions

1. **Pattern B migration**: When lot count grows (20+ lots), migrate to Actor model with spawned LotMachines
2. **OpenAPI generation**: Generate API schema from domain types
3. **Property-based testing**: Use fast-check to verify state machine invariants
4. **Visual state machine editor**: Let non-technical users review/modify state diagrams

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
