---
title: Building mycelium-blog with React and static-site-generation
date: '2025-11-02'
status: draft
privacy: public
tags:
  - static-site-generation
  - react
  - astro
  - typescript
  - tailwind-css
  - d3.js
repos:
  - mycelium-blog
skills:
  - blog-workflow
patterns:
  - static-site-generation
relatedTo: []
description: Exploring static-site-generation in mycelium-blog
---
## Introduction

Over the past month, **10 commits** shaped mycelium-blog, with 60% focused on building new features. The project leverages **React, Astro, TypeScript, Tailwind CSS, D3.js**, applying patterns like **static-site-generation** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: enhance repository scanner with narrative-driven post generation (11/3/2025)
- feat: add La Ferme du Temple comprehensive case study (11/3/2025)
- feat: add 4 new blog posts from repository analysis (11/3/2025)

Challenges overcome:
- fix: add markdown to HTML conversion with marked (11/2/2025)
- fix: correct all internal links to use base path (11/2/2025)

-->

### Context: What I Was Building

I wanted a blog that writes itself. Not fully autonomous—but close. The idea: scan my git repositories, extract commit patterns, generate draft posts, then visualize connections between posts as a knowledge graph (the "mycelium" metaphor). Traditional blogs require manual writing. Mycelium-blog generates content from work I've already done.

The commit history is remarkably compact—10 commits total, 60% features. I initialized the project structure, implemented the five-phase workflow (scan repos, draft posts, review, build graph, publish), deployed to GitHub Pages, then added narrative-driven post generation. The recent work enhanced the scanner to produce better stories and added a comprehensive case study.

This is a static site using Astro, React, TypeScript, Tailwind CSS, and D3.js. The graph visualization uses D3 to show mycelium connections—which posts share tags, repos, or tech stacks. The blog-workflow skill orchestrates the entire system.

### The Challenge

The GitHub Pages deployment had path issues. The commits "fix: correct all internal links to use base path" and "chore: update GitHub Pages config for vanmarkic account" show I was fighting URL routing. GitHub Pages serves repos at `/repo-name/`, not root. Every internal link needed the base path prefix, which broke during local development if hardcoded.

The markdown-to-HTML conversion wasn't built in. The commit "fix: add markdown to HTML conversion with marked" shows I had to add a parser. Astro handles markdown natively for static pages, but dynamic content (like graph node descriptions) needed runtime parsing.

The narrative enhancement was the biggest lift. The commit "feat: enhance repository scanner with narrative-driven post generation" shows I refactored the scanner to produce better story skeletons. Initially, drafts were just commit lists. The enhancement added structure: Context/Challenge/Solution/Learned sections with prompts based on commit patterns.

The post generation workflow revealed a data quality issue. The commit "feat: add 4 new blog posts from repository analysis" suggests the scanner worked, but were the posts good? The follow-up commit "feat: add La Ferme du Temple comprehensive case study" shows I added a manual case study—probably because auto-generated posts needed a quality baseline to compare against.

### How I Solved It

I started with the foundation: "feat: initialize mycelium blog project structure" set up Astro, React, TypeScript, and the content directories. Then "feat: implement complete mycelium blog system (phases 1-5)" built the scanner, graph builder, and workflow orchestration in one large commit. This suggests I prototyped the full system before committing, which is risky (big commits hide incremental decisions) but fast.

The GitHub Pages deployment came next. The config commit ("chore: configure GitHub Pages deployment") set up the action, but the base path fix came later. This is the classic deployment pattern: ship first, fix path issues in production. The markdown conversion fix followed the same pattern—missing functionality discovered post-deployment.

The narrative-driven enhancement came after the system was working. The commit "feat: enhance repository scanner with narrative-driven post generation" shows I iterated on output quality. The scanner now analyzes commit types (feat/fix/refactor), groups them into patterns, and generates section prompts. This transforms raw commit lists into story scaffolding.

The case study commit ("feat: add La Ferme du Temple comprehensive case study") added a manual post as a quality anchor. This gives readers a reference point: here's a hand-written post, here are auto-generated posts, compare them.

The graph generation commit ("feat: add generated graph data and update .gitignore") shows I ran the graph builder and committed the output. This is intentional—the graph is generated content, but committing it makes builds deterministic. Rebuild the graph when content changes, not on every deploy.

### What I Learned

The big initial commit ("implement complete mycelium blog system") was a mistake. It bundled phases 1-5 into one commit, which makes it impossible to understand decision points. Next time: commit after each phase, even during prototyping. The incremental history is more valuable than a clean log.

The GitHub Pages base path issue is predictable. Every static site deployed to a subdirectory hits this. Solving it upfront (with environment-aware base paths) would have saved a fix commit. Astro supports this with `base` config—I should have used it from day one.

The narrative-driven scanner enhancement was the right call. Commit lists are data, not stories. Adding the Context/Challenge/Solution/Learned structure transforms dry logs into readable posts. The blog-post-writer skill integration completes this—scanner generates scaffolding, skill fills in narrative.

Committing generated graph data is pragmatic. It makes builds fast (no graph regeneration on every deploy) and diffs show how connections change over time. The trade-off: graph commits are noisy. But the git history becomes a log of how my knowledge graph evolved, which is actually interesting.



## Technical Details

**Stack**: React, Astro, TypeScript, Tailwind CSS, D3.js
**Patterns**: static-site-generation
**Claude Skills**: blog-workflow

## All Commits (10)

- feat: enhance repository scanner with narrative-driven post generation (11/3/2025)
- feat: add La Ferme du Temple comprehensive case study (11/3/2025)
- feat: add 4 new blog posts from repository analysis (11/3/2025)
- feat: add generated graph data and update .gitignore (11/3/2025)
- fix: add markdown to HTML conversion with marked (11/2/2025)
- fix: correct all internal links to use base path (11/2/2025)
- chore: update GitHub Pages config for vanmarkic account (11/2/2025)
- chore: configure GitHub Pages deployment (11/2/2025)
- feat: implement complete mycelium blog system (phases 1-5) (11/2/2025)
- feat: initialize mycelium blog project structure (11/2/2025)

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
