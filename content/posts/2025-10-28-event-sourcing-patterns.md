---
title: Event Sourcing Patterns for State Management
date: '2025-10-28'
status: published
privacy: public
tags:
  - event-sourcing
  - architecture
  - state-management
  - domain-driven-design
repos: []
skills: []
patterns:
  - event-sourcing
  - cqrs
  - event-driven-architecture
relatedTo:
  - 2025-11-14-lagendwa
description: >-
  Exploring event sourcing patterns and when to apply them in modern application
  architecture
---

## Introduction

Event sourcing is a powerful architectural pattern that treats state changes as a sequence of events rather than mutable state updates. This post explores practical patterns and real-world applications.

## Core Concepts

### Event Store
Instead of storing current state, we store the sequence of events that led to that state:

```typescript
interface Event {
  id: string;
  type: string;
  timestamp: Date;
  data: unknown;
  aggregateId: string;
}

class EventStore {
  private events: Event[] = [];

  append(event: Event): void {
    this.events.push(event);
  }

  getEvents(aggregateId: string): Event[] {
    return this.events.filter(e => e.aggregateId === aggregateId);
  }
}
```

### State Reconstruction
Current state is derived by replaying events:

```typescript
function replayEvents(events: Event[]): State {
  return events.reduce((state, event) => {
    return applyEvent(state, event);
  }, initialState);
}
```

## When to Use Event Sourcing

Event sourcing shines when you need:

1. **Audit trails:** Complete history of all changes
2. **Temporal queries:** "What was the state at time T?"
3. **Event replay:** Debug by replaying production events
4. **CQRS:** Separate read and write models

## Practical Patterns

### 1. Snapshotting
Avoid replaying thousands of events by periodically saving state snapshots:

```typescript
interface Snapshot {
  aggregateId: string;
  version: number;
  state: State;
  timestamp: Date;
}
```

### 2. Event Versioning
Handle schema evolution with event versioning:

```typescript
interface UserCreatedV1 {
  version: 1;
  userId: string;
  email: string;
}

interface UserCreatedV2 extends UserCreatedV1 {
  version: 2;
  username: string;
}
```

### 3. Projection Builder
Build read models from events:

```typescript
class ProjectionBuilder {
  buildUserList(events: Event[]): User[] {
    const users = new Map<string, User>();

    for (const event of events) {
      if (event.type === 'UserCreated') {
        users.set(event.aggregateId, createUser(event));
      } else if (event.type === 'UserUpdated') {
        updateUser(users.get(event.aggregateId), event);
      }
    }

    return Array.from(users.values());
  }
}
```

## Trade-offs

**Advantages:**
- Complete audit history
- Time travel debugging
- Event-driven architecture enabler

**Challenges:**
- Increased complexity
- Storage requirements
- Event schema evolution
- Learning curve for team

## Conclusion

Event sourcing is not a silver bullet, but when applied to appropriate problems (especially those requiring audit trails or complex state management), it provides powerful capabilities.

## Mycelium Links

Related concepts:
- CQRS architecture
- Domain-driven design
- State machines
