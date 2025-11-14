---
title: Building mycelium-blog with React and static-site-generation
date: '2025-11-03'
status: published
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
  - blog-post-writer
  - blog-workflow
patterns:
  - static-site-generation
relatedTo: []
description: Exploring static-site-generation in mycelium-blog
---
## Introduction

Over the past month, **17 commits** shaped mycelium-blog, with 59% focused on building new features. The project leverages **React, Astro, TypeScript, Tailwind CSS, D3.js**, applying patterns like **static-site-generation** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: add contextual storytelling framework from Behind Genius Ventures (11/3/2025)
- feat: add pedagogical writing patterns from Mark Seemann (11/3/2025)
- feat: create blog-post-writer skill using TDD methodology (11/3/2025)

Challenges overcome:
- fix: add markdown to HTML conversion with marked (11/2/2025)
- fix: correct all internal links to use base path (11/2/2025)

Evolution and refinement:
- Enhance blog workflow integration with blog-post-writer skill (11/3/2025)
- refactor: add conversational narrative techniques to blog-post-writer (11/3/2025)
- refactor: improve blog-post-writer skill following superpowers patterns (11/3/2025)

-->

### Context: What I Was Building

I wanted a blog that writes itself. Not AI-generated content from nothing—but narratives generated from actual work. My repositories hold the evidence: commits, features built, bugs fixed, refactorings. The mycelium-blog project turns that evidence into interconnected blog posts with a force-directed graph showing how projects relate.

Think of it as archaeology meets storytelling. Scan repos, extract commit patterns, generate draft posts, visualize connections. The "mycelium" metaphor fits: underground networks connecting discrete nodes (projects) into a larger ecosystem (my development work).

The technical stack is Astro with React for the graph visualization (using D3.js). Static site generation means fast loads and simple deployment to GitHub Pages. The 17 commits show the evolution: initial setup, comprehensive implementation across five phases, then iterative improvements to the blog-post-writer skill that generates the narrative content.

### The Challenge

The first challenge was narrative generation. I didn't want generic "Project X does Y" summaries. I wanted engaging first-person stories that show challenges, solutions, and learning. But how do you extract story from commit messages? The early approach was straightforward: scan repos, categorize commits (features, fixes, refactoring), generate markdown. That produced factual content but lacked narrative voice.

The second challenge was avoiding AI-generated slop. You know the signs: overly verbose comments, generic phrasing, lack of specific detail. The commit "feat: create blog-post-writer skill using TDD methodology" shows I formalized the narrative generation into a Claude skill with specific techniques. But early versions still had problems—mentioning "the commits show" or "looking at the git history" in the output. That's meta-analysis, not storytelling. I needed the skill to write naturally, as if recounting from memory.

The third challenge was narrative techniques. I studied effective technical bloggers: Ben Anderson's conversational style, Mark Seemann's pedagogical approach, Behind Genius Ventures' contextual storytelling. The commits show iterative refinement:
- "refactor: add conversational narrative techniques to blog-post-writer"
- "feat: add pedagogical writing patterns from Mark Seemann"
- "feat: add contextual storytelling framework from Behind Genius Ventures"

Each commit added specific patterns—conversational hooks, progressive revelation, four-layer context (implementation, process, purpose, ecosystem). But integrating these patterns meant the skill grew complex. How do you balance multiple styles without creating inconsistent voice?

### How I Solved It

I started with the infrastructure: repository scanning, draft generation, graph building. The commit "feat: implement complete mycelium blog system (phases 1-5)" shows I built the full pipeline first, then refined the narrative generation afterward.

Phase 1-5 implementation included:
- Repository scanner that extracts commit history
- Draft generator that creates post templates with frontmatter
- Graph builder using D3.js force-directed layout
- Static site generation with Astro
- GitHub Pages deployment

Once the infrastructure worked, I focused on improving narrative quality. The blog-post-writer skill became the core tool. I used TDD methodology—not for code, but for process documentation. The commit "feat: create blog-post-writer skill using TDD methodology" shows I formalized the narrative generation rules:

1. **Evidence-based narrative**: Stay grounded in commit patterns, don't invent business context
2. **First-person voice**: Write as "I built" not "we" or "the developer"
3. **Natural storytelling**: Never mention "commits" or "git history" in output
4. **Multiple styles**: Support conversational, pedagogical, and contextual approaches

The skill refinement happened through iteration. I added conversational techniques (start with human moments, show thought process, be self-aware about mistakes). Then pedagogical patterns (declarative thesis, progressive revelation, anticipate objections). Finally contextual storytelling (four layers of context, show the invisible, reveal hidden tradeoffs).

The integration challenge got solved by making styles composable. The skill doesn't force one style—it teaches techniques that can be mixed. A retrospective post might blend all three: conversational opening, pedagogical middle section showing progressive revelation, contextual ending that connects to broader ecosystem.

The "show the invisible" pattern became particularly valuable. Code shows what you built. Commits show when you built it. But neither shows why you chose approach X over Y, or what constraints influenced your decisions. That's where narrative adds value—making reasoning visible.

### What I Learned

Narrative generation is harder than code generation. Code has clear success criteria: does it compile, do tests pass? Narrative has fuzzy criteria: is it engaging, does it avoid AI slop, does it teach something useful? The blog-post-writer skill needed multiple refinement passes before producing consistently good output.

Studying effective technical writers was essential. I couldn't have designed good narrative techniques from scratch. Ben Anderson taught me conversational hooks. Mark Seemann taught me progressive revelation. Behind Genius Ventures taught me four-layer context. Standing on shoulders of giants works for writing, not just code.

The "never mention commits" rule was critical. Early drafts had phrases like "the commits show" or "looking at the git history." That's meta-analysis that breaks immersion. Readers don't care about your git log—they care about your thought process. Writing naturally as if recounting from memory produces better narratives.

The mycelium metaphor works. Projects aren't isolated—they share patterns, techniques, learnings. Visualizing those connections reveals larger themes. The force-directed graph isn't just decoration—it's insight into how my development practice evolves across projects.

If I were doing this again, I'd invest more in automated testing for narrative quality. The TDD approach for the skill helped, but I still relied on manual review to catch AI slop. Some heuristics could be automated: flag mentions of "commits", detect overly generic phrasing, check for first-person voice consistency. That would make the skill more robust.



## Technical Details

**Stack**: React, Astro, TypeScript, Tailwind CSS, D3.js
**Patterns**: static-site-generation
**Claude Skills**: blog-post-writer, blog-workflow

## All Commits (17)

- Enhance blog workflow integration with blog-post-writer skill (11/3/2025)
- feat: add contextual storytelling framework from Behind Genius Ventures (11/3/2025)
- feat: add pedagogical writing patterns from Mark Seemann (11/3/2025)
- refactor: add conversational narrative techniques to blog-post-writer (11/3/2025)
- feat: create blog-post-writer skill using TDD methodology (11/3/2025)
- refactor: improve blog-post-writer skill following superpowers patterns (11/3/2025)
- feat: add blog-post-writer skill for narrative generation (11/3/2025)
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
