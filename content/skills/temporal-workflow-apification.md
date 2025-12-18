---
title: Temporal Workflow Apification Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - temporal
  - typescript
  - api-design
  - zod
  - openapi
repos: []
skills:
  - temporal-workflow-apification
patterns:
  - single-source-of-truth
  - defense-in-depth
relatedTo:
  - 2025-11-14-3DSoundViz
description: >-
  Claude Code skill for adding type-safe REST API endpoints to Temporal
  workflows with auto-generated Zod schemas and OpenAPI documentation
---

## Overview

Automates the creation of type-safe REST API endpoints for Temporal workflows following the single source of truth pattern. Uses TypeScript interfaces as the canonical source, auto-generates Zod schemas for runtime validation, and produces OpenAPI documentation.

**Single Source of Truth Flow:**
```
TypeScript Interface (workflow input)
    ↓ ts-to-zod
Zod Schema (runtime validation)
    ↓ zod-to-openapi
OpenAPI Spec (auto-generated docs)
```

## When to Use

Use this skill when:
- Adding a new REST API endpoint for an existing Temporal workflow
- Exposing a workflow to external systems via HTTP
- Need type-safe API with auto-generated documentation
- Following architecture-first API design patterns

## Prerequisites

Check that these exist before starting:
1. Temporal workflow with TypeScript input interface
2. Workflow registered in worker
3. `temporal-client` package exists
4. Workflow runs successfully via Temporal CLI

## The Process

### Phase 1: Setup (One-time per project)

**Install dependencies:**
```bash
yarn add -D ts-to-zod
yarn add @asteasolutions/zod-to-openapi swagger-ui-express
```

**Create ts-to-zod config:**
```javascript
// ts-to-zod.config.js
module.exports = {
  input: './src/workflows/**/*.ts',
  output: './src/generated/schemas.ts',
};
```

### Phase 2: Annotate Workflow Interface

```typescript
/**
 * @zod
 */
export interface DeployVMInput {
  name: string;
  cpuCores: number;
  ramGb: number;
}
```

### Phase 3: Generate Schemas

```bash
yarn generate:schemas
```

### Phase 4: Create API Endpoint

```typescript
import { Router } from 'express';
import { deployVMInputSchema } from '../generated/schemas';
import { registry } from '../openapi';

const router = Router();

// Register OpenAPI endpoint
registry.registerPath({
  method: 'post',
  path: '/api/workflows/deploy-vm',
  request: {
    body: {
      content: {
        'application/json': { schema: deployVMInputSchema }
      }
    }
  },
  responses: { 201: { description: 'Workflow started' } }
});

router.post('/', validateBody(deployVMInputSchema), async (req, res) => {
  const result = await temporalClient.startWorkflow({
    workflowType: 'deployVMWorkflow',
    taskQueue: 'workflows',
    input: req.body,
  });
  res.status(201).json(result);
});
```

## Key Principles

**Single Source of Truth:**
- TypeScript interface is canonical
- Never duplicate type definitions
- Auto-generate everything downstream

**Defense in Depth:**
- API validates with Zod (fast-fail, better UX)
- Workflow validates at runtime (safety net)
- TypeScript catches compile-time errors

## Common Pitfalls

| Mistake | Fix |
|---------|-----|
| Workflow name mismatch | Use exact function name |
| Wrong task queue | Match worker task queue |
| Missing runtime validation | Always validate in workflow too |
| Schema drift | Use ts-to-zod auto-generation |

## Output

After running this skill, you should have:
- ✅ Type-safe API endpoint
- ✅ Auto-generated Zod validation
- ✅ Auto-generated OpenAPI docs
- ✅ Interactive Swagger UI
- ✅ Single source of truth maintained

## Mycelium Links

Related:
- **property-based-regression-testing**: Validate API transformations
- **test-driven-development**: Write API tests first
