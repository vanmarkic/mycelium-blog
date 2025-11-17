---
title: Building mycelium-blog with React and static-site-generation
date: '2025-11-14'
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
relatedTo:
  - 2025-11-02-example-draft
  - 2025-11-03-claude-config
  - 2025-11-03-credit-castor
  - 2025-11-03-loyer.brussels
  - 2025-11-03-mycelium-blog
  - 2025-11-03-touchepas
  - 2025-11-14-3DSoundViz
  - 2025-11-14-claude-config
  - 2025-11-14-credit-castor
  - 2025-11-14-lagendwa
  - 2025-11-14-loyer.brussels
  - 2025-11-14-touchepas
  - 2025-11-14-womb
  - static-site-generation
description: Exploring static-site-generation in mycelium-blog
---
## Introduction

Over the past month, **34 commits** shaped mycelium-blog, with 62% focused on building new features. The project leverages **React, Astro, TypeScript, Tailwind CSS, D3.js**, applying patterns like **static-site-generation** to solve real-world problems.



## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- feat: add PayPal and IBAN donation links (11/14/2025)
- feat: add Open Collective donation link (11/14/2025)
- feat: implement trilingual support (FR/NL/EN) and add 3DS project (11/14/2025)

Challenges overcome:
- fix: correct getLangFromUrl to handle base URL (11/15/2025)
- fix: correct language switching path resolution (11/15/2025)
- fix: update Credit Castor description and add perks modal (11/14/2025)

Evolution and refinement:
- Enhance blog workflow integration with blog-post-writer skill (11/3/2025)
- refactor: add conversational narrative techniques to blog-post-writer (11/3/2025)
- refactor: improve blog-post-writer skill following superpowers patterns (11/3/2025)

-->

### Context: What I Was Building

I wanted a blog that could write itself.

Not literally—but close. I was building multiple projects simultaneously, and keeping a manual blog felt impossible. Each project had a story hidden in its git history: features built, bugs fixed, refactorings that revealed deeper patterns. The problem was extraction. How do you turn commits into coherent narratives without spending hours reconstructing what you already knew while coding?

So I built mycelium-blog: a system that scans repositories, analyzes commit patterns, generates draft posts with narrative scaffolding, and visualizes connections between projects as a knowledge graph. The vision was automation without losing authenticity—tooling that helps me tell better stories, not generic ones.

The meta twist? This blog would write about itself. The blog-post-writer skill was developed AS PART of this project, which meant I was simultaneously building the tool and using it to document its own creation. Recursion in the wild.

The technical stack emerged from requirements: Astro for static generation (fast builds, minimal JavaScript), React for interactive components (the graph visualization), D3.js for force-directed layouts, TypeScript for type safety across the tooling. The project needed to support multiple languages (French, Dutch, English) because my work spans communities, and it needed to handle both public and internal content with privacy controls.

### The Challenge

The hardest part wasn't the automation—it was preserving human voice while automating structure.

**Language routing broke in subtle ways.** Adding trilingual support seemed straightforward: detect language from URL, switch content, done. Reality was messier. The `getLangFromUrl` function didn't account for base paths initially. When deployed to GitHub Pages (which adds `/mycelium-blog/` as a base), language detection failed. URLs like `/mycelium-blog/en/projects` didn't match the pattern I'd designed for. Small oversight, big impact.

**The graph builder had to be smart, not just connected.** I could have created edges between every post with shared tags. But that would produce noise—a fully connected graph is useless. The real challenge was calculating meaningful connection strength. I weighted five factors: tag overlap (40%), shared repos (30%), shared skills (20%), shared patterns (25%), and temporal proximity (10%). The weights emerged through experimentation. Too much weight on tags created tag-spam incentives. Too much on repos made the graph too sparse.

```typescript
// Weighted connection strength calculation
function calculateConnection(nodeA: Node, nodeB: Node, allContent: Map<string, PostFrontmatter>): ConnectionScore | null {
  let totalStrength = 0;

  // Tag overlap (40% weight)
  const sharedTags = [...tagsA].filter((tag) => tagsB.has(tag));
  if (sharedTags.length > 0) {
    const tagStrength = sharedTags.length / Math.min(tagsA.size, tagsB.size);
    totalStrength += tagStrength * 0.4;
  }

  // Shared repos (30% weight)
  if (sharedRepos.length > 0) {
    totalStrength += 0.7 * 0.3;
  }

  // Temporal proximity (10% weight) - decay over 30 days
  const daysDiff = Math.abs(dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 30) {
    totalStrength += (1 - daysDiff / 30) * 0.1;
  }

  return totalStrength > minStrength ? { strength: totalStrength, ... } : null;
}
```

**Narrative generation walked a tightrope.** The repo scanner had to generate story prompts that were helpful without being prescriptive. If prompts were too vague ("write about your project"), they didn't save time. Too specific ("you built feature X because Y"), they made assumptions about intent I couldn't verify. I settled on showing commit categories (features, fixes, refactoring) with dates, then asking open questions: "What problem were you solving? What made it difficult?" The scaffolding guides without dictating.

### How I Solved It

I built three interconnected systems, each solving one piece of the puzzle:

**1. Repository Scanner** - Automation that preserves context
The scanner walks a directory tree, finds git repos, analyzes recent activity, detects tech stacks and patterns, then generates Markdown drafts. The key insight was separating detection from generation. Pattern detection looks for files (`.test.` files mean TDD, `astro.config` means static generation). Tech detection reads `package.json` dependencies. Both produce metadata that feeds draft generation.

This separation meant I could improve detection logic without touching narrative generation. When I added Claude skill detection, it was one function:

```typescript
async function detectClaudeSkills(repoPath: string): Promise<string[]> {
  const skills: string[] = [];
  const claudeDir = path.join(repoPath, '.claude', 'skills');
  try {
    const skillDirs = await fs.readdir(claudeDir);
    skills.push(...skillDirs);
  } catch {
    // No .claude/skills directory
  }
  return skills;
}
```

**2. Knowledge Graph Builder** - Connections that actually mean something
The graph builder reads all content, creates nodes (posts, skills, patterns), calculates weighted connections, and updates frontmatter with `relatedTo` fields. The connection scoring was where I spent the most time. I needed an algorithm that could:
- Identify strong connections without manual curation
- Avoid creating noise from weak coincidences
- Balance multiple signal types (tags, repos, skills, patterns, time)

The weighted approach worked because it mirrors how I actually think about relatedness. Two posts sharing a repo are clearly related. Two posts with overlapping tags might be. Two posts written the same week probably influenced each other.

**3. D3.js Force Graph** - Making connections visible
The visualization uses D3's force simulation with custom parameters. Link distance scales inversely with connection strength (stronger connections = closer nodes). I added zoom/pan for navigation and click-through to navigate from graph to post. The challenge was balancing forces: too much charge and nodes fly apart, too little and they collapse into a blob.

### What I Learned

**Automation works best when it augments human judgment, not replaces it.** The scanner generates drafts with narrative scaffolding, but I still write the stories. The graph calculates connections, but I curate which ones matter by adjusting minimum strength thresholds. The tools save time by handling the tedious parts (extracting commits, calculating overlaps), leaving me to focus on the creative parts (telling the story, drawing insights).

**Multilingual support is never "just add a language parameter."** The base path issue taught me that URL routing assumptions break when deployment contexts change. Local development had no base path. GitHub Pages added one. The fix required rethinking how language detection worked, accounting for optional base paths in the pattern matching. Edge cases in routing multiply when you add languages.

**Meta projects reveal tool limitations quickly.** Using blog-post-writer to write about building blog-post-writer created a tight feedback loop. Every awkward phrase or assumption in the generated prompts became immediately obvious because I was both tool creator and tool user. This accelerated iteration—I could see what worked and what didn't within minutes.

**Graph connection algorithms are more art than science.** The weight distribution (40% tags, 30% repos, etc.) came from experimentation, not theory. I tried equal weights first (everything was connected to everything). Then I tried tag-only (sparse, missed obvious connections). The current weights feel right because they produce a graph that matches my intuition about project relationships. But there's no "correct" answer—just different useful perspectives.

If I were starting over, I'd invest more in the privacy filter earlier. I added it midway through, which meant retrofitting. Detecting sensitive information (API keys in commit messages, internal project names) is easier when baked into the scanning pipeline from the start, not patched in later.



## Technical Details

**Stack**: React, Astro, TypeScript, Tailwind CSS, D3.js
**Patterns**: static-site-generation
**Claude Skills**: blog-post-writer, blog-workflow

## All Commits (34)

- Merge pull request #1 from vanmarkic/claude/add-function-01RfbArma5eawZkNh4KVKkUg (11/15/2025)
- fix: correct getLangFromUrl to handle base URL (11/15/2025)
- fix: correct language switching path resolution (11/15/2025)
- feat: add PayPal and IBAN donation links (11/14/2025)
- feat: add Open Collective donation link (11/14/2025)
- feat: implement trilingual support (FR/NL/EN) and add 3DS project (11/14/2025)
- feat: add Claude Config project with dev tools focus (11/14/2025)
- fix: update Credit Castor description and add perks modal (11/14/2025)
- feat: add 4 new projects with detailed perks and benefits modals (11/14/2025)
- feat: complete design overhaul of support page with modern marketplace aesthetic (11/14/2025)
- feat: add pro bono marketplace section for Belgian associations (11/14/2025)
- feat: add donation/support page with multiple payment options (11/14/2025)
- fix: add missing skills field to domain modeling post frontmatter (11/4/2025)
- feat: publish blog post on domain modeling with Claude and xstate (11/4/2025)
- fix: change post status from draft to published (11/3/2025)
- feat: add draft files for credit-castor, deuxmains, loyer.brussels, mycelium-blog, and stadium-check projects (11/3/2025)
- feat: publish 3 new blog posts with evidence-based narratives (11/3/2025)
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
