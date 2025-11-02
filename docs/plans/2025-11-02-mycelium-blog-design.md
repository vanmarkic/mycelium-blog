# Mycelium Blog - Design Document

**Date:** 2025-11-02
**Status:** Approved
**Author:** Claude + Dragan

## Overview

A file-based digital garden blog that automatically aggregates work across GitHub repositories, showcases technical solutions and Claude skills/agents, while maintaining privacy boundaries. The system emphasizes interconnected knowledge through "mycelium links" - bidirectional connections between posts, skills, and patterns.

## Goals

1. **Semi-automated content generation:** AI drafts posts from git analysis, user approves/edits
2. **Multi-purpose platform:** Portfolio + knowledge sharing + personal archive + Claude Code evangelism
3. **Privacy-aware:** Technical patterns only for client work (dragancloudbizz/neo-*), full details for personal projects
4. **Knowledge graph visualization:** Posts interconnected by shared concepts, tools, and patterns
5. **Editorial control:** User retains final approval on all published content

## Architecture

### System Components

```
┌─────────────────┐
│ Repository      │
│ Scanner         │──→ Analyzes git repos
└────────┬────────┘   Extracts metadata
         │            Generates drafts
         ↓
┌─────────────────┐
│ Content Store   │
│ (Markdown+      │──→ File-based content
│  Frontmatter)   │   Rich metadata schema
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Graph Builder   │──→ Scans all content
│                 │   Detects connections
└────────┬────────┘   Generates graph.json
         │
         ↓
┌─────────────────┐
│ Astro Static    │──→ Renders pages
│ Site Generator  │   Interactive graph UI
└────────┬────────┘   Bidirectional links
         │
         ↓
┌─────────────────┐
│ Deployed Site   │
└─────────────────┘
```

### Privacy Filter Integration

Built into the scanner layer:

```typescript
async function determinePrivacy(repoPath: string): Promise<'public' | 'internal'> {
  const config = await execCommand('git config --get remote.origin.url', { cwd: repoPath });

  if (config.includes('dragancloudbizz') && repoPath.includes('neo')) {
    // Business client work - technical patterns only, no business details
    return 'internal';
  }

  return 'public'; // Personal repos - full transparency
}
```

**Internal posts characteristics:**
- Generic titles (no client/business names)
- Sanitized code examples
- Focus on technical patterns and solutions
- Still indexed in graph by technology/patterns

## Content Schema

### Markdown Frontmatter

```yaml
---
title: "Building a Belgian Real Estate Calculator"
date: 2025-11-02
status: draft  # draft | published
privacy: public  # public | internal
tags: [real-estate, astro, tdd, pure-functions]
repos: [credit-castor]
skills: []  # Claude skills featured in this post
patterns: [static-site-generation, test-driven-development]
relatedTo: []  # Auto-populated by graph builder
---

[Content here...]
```

### Repository Metadata (Scanner Output)

```typescript
interface RepoMetadata {
  repo: string;
  recentCommits: Commit[];
  detectedPatterns: string[];  // "Astro SSG", "TDD with Vitest", etc.
  claudeSkills: string[];      // ["work-visibility", "meta-script-manager"]
  privacyLevel: 'public' | 'internal';
  suggestedTags: string[];
  suggestedTitle: string;
  techStack: string[];         // ["TypeScript", "React", "Playwright"]
}
```

### Graph Structure

```typescript
interface Graph {
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string;
  type: 'post' | 'skill' | 'pattern' | 'repo';
  title: string;
  tags: string[];
  path: string;  // URL path
}

interface Edge {
  from: string;  // node id
  to: string;    // node id
  type: 'related' | 'uses' | 'implements' | 'extends';
  strength: number;  // 0.0 - 1.0 (for visualization weight)
}
```

**Edge Detection Algorithms:**

1. **Tag overlap:** `strength = sharedTags.length / min(tags1.length, tags2.length)`
2. **Explicit references:** Links in content = strength 1.0
3. **Shared repos:** Posts from same repo = strength 0.7
4. **Tech stack overlap:** Shared technologies = strength 0.6
5. **Temporal proximity:** Recent posts = strength 0.3 (decay over time)

## Directory Structure

```
mycelium-blog/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Garden overview with graph viz
│   │   ├── posts/[slug].astro       # Post template with backlinks
│   │   ├── skills/[slug].astro      # Skill showcase pages
│   │   └── patterns/[slug].astro    # Pattern library pages
│   ├── components/
│   │   ├── GraphVisualization.tsx   # D3.js interactive mycelium links
│   │   ├── BacklinkList.tsx         # "Connected to" section
│   │   ├── TagCloud.tsx             # Tag navigation
│   │   └── Timeline.tsx             # Chronological view
│   └── utils/
│       ├── graphLoader.ts           # Loads graph.json
│       └── pathfinding.ts           # Computes connection paths
├── content/
│   ├── drafts/                      # AI-generated, awaiting review
│   ├── posts/                       # Published blog posts
│   ├── skills/                      # Claude skills documentation
│   └── patterns/                    # Technical patterns library
├── scripts/
│   ├── scan-repos.ts                # Repository scanner
│   ├── build-graph.ts               # Graph builder
│   └── privacy-filter.ts            # Git config checker
├── public/
│   └── graph.json                   # Generated connection graph
├── docs/
│   └── plans/                       # Design documentation
└── .claude/
    └── skills/
        └── blog-workflow/
            └── SKILL.md             # Workflow orchestration skill
```

## Workflow

### Weekly Content Generation Loop

```
1. Run scanner
   ↓
2. AI generates drafts in content/drafts/
   ↓
3. User reviews with git diff
   ↓
4. Edit/approve drafts
   ↓
5. Move to content/posts/
   ↓
6. Rebuild graph (detects new connections)
   ↓
7. Commit changes
   ↓
8. Deploy (auto-trigger via GitHub Actions)
```

### Claude Skill Integration

The `blog-workflow` skill orchestrates the entire process:

**Commands:**
- `/blog:scan` - Scan repos and generate drafts
- `/blog:review` - Show pending drafts with diffs
- `/blog:graph` - Rebuild connection graph
- `/blog:publish` - Commit and deploy

**Skill responsibilities:**
1. Execute scanner with proper parameters
2. Present drafts for review
3. Assist with editing (suggest improvements)
4. Rebuild graph after changes
5. Create descriptive commit messages
6. Verify deployment

## Technical Stack

### Core Technologies

- **Astro** - Static site generator (already used in credit-castor)
- **React** - Interactive UI components (graph visualization)
- **TypeScript** - Type-safe scripts and components
- **D3.js** - Graph visualization
- **Gray Matter** - Markdown frontmatter parsing
- **Simple Git** - Repository analysis
- **Claude API** - AI draft generation

### Infrastructure

- **GitHub Pages / Netlify** - Static hosting
- **GitHub Actions** - CI/CD pipeline
- **Git** - Version control for content

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- Set up Astro project structure
- Implement content schema (frontmatter validation)
- Create basic page templates
- Set up TypeScript build pipeline

### Phase 2: Scanner & Graph Builder (Week 2)
- Implement repository scanner
- Privacy filter logic
- Graph builder with edge detection
- Test with existing repos (credit-castor, deuxmains, etc.)

### Phase 3: Graph Visualization (Week 3)
- D3.js graph component
- Bidirectional link UI
- Tag navigation
- Timeline view

### Phase 4: Claude Skill (Week 4)
- Create blog-workflow skill
- Integrate with existing superpowers skills
- Test end-to-end workflow
- Documentation

### Phase 5: Polish & Launch (Week 5)
- Design/styling
- SEO optimization
- Performance tuning
- Initial content migration
- Public launch

## Success Criteria

1. **Automation:** Weekly scans generate drafts with <5min manual review time
2. **Connectivity:** 80%+ of posts have at least 2 mycelium connections
3. **Privacy:** Zero business-sensitive data in public posts
4. **Usability:** Graph visualization loads in <2s, navigable on mobile
5. **Content Quality:** AI drafts require <30% editing before publish

## Open Questions

1. Should skills be auto-imported from existing `.claude/skills/` or manually curated?
2. Graph visualization: Force-directed layout or hierarchical tree?
3. Deployment: GitHub Pages (simple) or Netlify (more features)?
4. Should internal posts be published at all, or just indexed privately?

## Related Documents

- Repository scanner implementation: TBD
- Graph builder algorithm details: TBD
- blog-workflow skill specification: TBD
