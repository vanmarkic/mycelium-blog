# Mycelium Blog

A file-based digital garden that showcases my technical work across GitHub repositories with AI-powered content generation and knowledge graph visualization.

## Overview

This blog automatically aggregates work from my git repositories, generates AI-drafted posts with Claude Code, and visualizes connections between posts, skills, and patterns through "mycelium links" - bidirectional relationships that show how knowledge grows and interconnects.

## Features

- **Semi-automated content** - AI drafts from git analysis, manual approval/editing
- **Knowledge graph** - Visualize connections between posts, skills, and technical patterns
- **Privacy-aware** - Automatic filtering for client work vs personal projects
- **File-based** - All content in git, reviewable with `git diff`
- **Claude Code integration** - Custom workflow skill for content orchestration

## Architecture

```
Repository Scanner → Content Store (Markdown) → Graph Builder → Astro Site → Deployed Blog
                         ↓
                   Privacy Filter
```

## Quick Start

### Install Dependencies

```bash
cd ~/Documents/mycelium-blog
npm install
```

### Workflow Commands

```bash
# Scan repositories and generate draft posts
/blog:scan

# Review pending drafts
/blog:review

# Rebuild knowledge graph
/blog:graph

# Commit and publish
/blog:publish
```

## Directory Structure

```
mycelium-blog/
├── content/
│   ├── drafts/          # AI-generated drafts awaiting review
│   ├── posts/           # Published blog posts
│   ├── skills/          # Claude skills documentation
│   └── patterns/        # Technical patterns library
├── scripts/
│   ├── scan-repos.ts    # Repository scanner
│   ├── build-graph.ts   # Knowledge graph builder
│   └── privacy-filter.ts # Privacy classification
├── src/
│   ├── pages/           # Astro page templates
│   ├── components/      # React components (graph viz, etc.)
│   └── utils/           # Graph loading utilities
├── public/
│   └── graph.json       # Generated knowledge graph
└── .claude/
    └── skills/
        └── blog-workflow/  # Workflow orchestration skill
```

## Content Schema

Posts use structured frontmatter:

```yaml
---
title: "Post Title"
date: 2025-11-02
status: published
privacy: public  # or 'internal' for client work
tags: [temporal, event-sourcing, typescript]
repos: [credit-castor]
skills: [work-visibility]
patterns: [event-sourcing, tdd]
relatedTo: []  # Auto-populated by graph builder
---
```

## Privacy Model

**Public posts** (personal repos):
- Full transparency, complete examples
- Real project names and domains
- Business context included

**Internal posts** (client work - dragancloudbizz/neo-* repos):
- Technical patterns only
- Generic titles and descriptions
- Sanitized code examples
- No business/client details

Privacy is auto-detected via git config during scanning.

## Knowledge Graph

The graph builder detects connections through:

1. **Tag overlap** - Shared tags between posts
2. **Explicit references** - Links in content
3. **Shared repos** - Posts from same repository
4. **Tech stack overlap** - Common technologies
5. **Temporal proximity** - Recent related work

Edge strength (0.0-1.0) determines visual weight in graph visualization.

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Astro** - Static site generator
- **React** - Interactive components
- **TypeScript** - Type-safe scripts
- **D3.js** - Graph visualization
- **Gray Matter** - Markdown frontmatter parsing
- **Simple Git** - Repository analysis

## Deployment

The site deploys automatically on push to `main` via GitHub Actions / Netlify.

## Claude Skills

This project includes a custom Claude skill (`blog-workflow`) that orchestrates the entire content workflow. See `.claude/skills/blog-workflow/SKILL.md` for details.

## Design Documentation

See `docs/plans/2025-11-02-mycelium-blog-design.md` for the complete design specification.

## License

MIT

---

Built with Claude Code 🤖
