# Mycelium Blog - Implementation Plan

**Created:** 2025-11-02
**Status:** Ready to implement
**Estimated Duration:** 5 weeks

## Overview

This plan breaks down the implementation of the mycelium blog into 5 phases, each taking approximately 1 week. Each phase delivers working functionality that can be tested and refined.

## Phase 1: Core Infrastructure (Week 1)

### Goals
- Set up Astro project with TypeScript
- Implement content schema validation
- Create basic page templates
- Establish build pipeline

### Tasks

1. **Project Setup** ✅ (Completed)
   - [x] Initialize git repository
   - [x] Create directory structure
   - [x] Add package.json with dependencies
   - [x] Configure TypeScript
   - [x] Configure Astro

2. **Content Schema**
   - [ ] Create TypeScript interfaces for frontmatter
   - [ ] Implement frontmatter validation function
   - [ ] Create example markdown files (draft, post, skill, pattern)
   - [ ] Test schema with gray-matter parsing

3. **Basic Pages**
   - [ ] Create `src/pages/index.astro` (blog home)
   - [ ] Create `src/pages/posts/[slug].astro` (post template)
   - [ ] Create `src/pages/skills/[slug].astro` (skill template)
   - [ ] Create `src/pages/patterns/[slug].astro` (pattern template)
   - [ ] Add basic styling with Tailwind

4. **Build Pipeline**
   - [ ] Test Astro dev server (`npm run dev`)
   - [ ] Test production build (`npm run build`)
   - [ ] Verify static output in `dist/`

### Deliverable
Working Astro site that renders markdown content with frontmatter, styled with Tailwind.

### Acceptance Criteria
- Can create a markdown post and see it rendered
- Frontmatter validation catches schema errors
- Dev server hot-reloads on changes
- Production build generates static HTML

---

## Phase 2: Scanner & Graph Builder (Week 2)

### Goals
- Implement repository scanner
- Create privacy filter logic
- Build knowledge graph generator
- Generate sample content

### Tasks

1. **Privacy Filter** (`scripts/privacy-filter.ts`)
   - [ ] Implement git config reader
   - [ ] Create privacy classification logic
   - [ ] Write tests for various repo types
   - [ ] Document privacy rules

2. **Repository Scanner** (`scripts/scan-repos.ts`)
   - [ ] Scan `~/Documents` for git repositories
   - [ ] Extract recent commits (last 30 days)
   - [ ] Detect patterns (tech stack, architectures)
   - [ ] Find Claude skills in repos
   - [ ] Generate draft markdown with AI summaries
   - [ ] Apply privacy filter
   - [ ] Write drafts to `content/drafts/`

3. **Graph Builder** (`scripts/build-graph.ts`)
   - [ ] Scan all markdown files (posts, skills, patterns)
   - [ ] Extract frontmatter and content
   - [ ] Implement edge detection algorithms:
     - [ ] Tag overlap calculator
     - [ ] Content reference parser
     - [ ] Shared repo detector
     - [ ] Tech stack matcher
     - [ ] Temporal proximity scorer
   - [ ] Generate `graph.json` structure
   - [ ] Update `relatedTo` frontmatter

4. **Testing**
   - [ ] Run scanner on actual repos (credit-castor, deuxmains, etc.)
   - [ ] Review generated drafts for quality
   - [ ] Verify privacy classification
   - [ ] Run graph builder and inspect connections

### Deliverable
Working CLI tools that scan repos, generate drafts, and build knowledge graph.

### Acceptance Criteria
- Scanner finds 10+ repos and generates quality drafts
- Privacy filter correctly classifies public vs internal
- Graph builder detects meaningful connections
- `graph.json` has valid structure

---

## Phase 3: Graph Visualization (Week 3)

### Goals
- Create interactive D3.js graph component
- Implement bidirectional link UI
- Add tag and timeline navigation
- Make responsive for mobile

### Tasks

1. **Graph Loader Utility** (`src/utils/graphLoader.ts`)
   - [ ] Load `graph.json` at build time
   - [ ] Implement graph query functions (getConnections, findPath, etc.)
   - [ ] Cache graph data for performance

2. **Graph Visualization Component** (`src/components/GraphVisualization.tsx`)
   - [ ] Set up D3.js force-directed layout
   - [ ] Render nodes (posts, skills, patterns)
   - [ ] Render edges with strength-based thickness
   - [ ] Add zoom and pan controls
   - [ ] Highlight connections on hover
   - [ ] Click node to navigate to content

3. **Backlink Component** (`src/components/BacklinkList.tsx`)
   - [ ] Query graph for bidirectional links
   - [ ] Render "Connected to" section on post pages
   - [ ] Show connection strength/type
   - [ ] Make links clickable

4. **Navigation Components**
   - [ ] Tag cloud component (`src/components/TagCloud.tsx`)
   - [ ] Timeline view component (`src/components/Timeline.tsx`)
   - [ ] Search/filter functionality

5. **Responsive Design**
   - [ ] Test on mobile viewports
   - [ ] Adjust graph controls for touch
   - [ ] Optimize performance for large graphs

### Deliverable
Interactive visualization showing knowledge graph with navigable connections.

### Acceptance Criteria
- Graph renders all nodes and edges correctly
- Hovering highlights connections
- Clicking nodes navigates to content
- Backlinks show on post pages
- Works on mobile devices

---

## Phase 4: Claude Skill Integration (Week 4)

### Goals
- Finalize blog-workflow skill
- Integrate with scanner and graph builder
- Test end-to-end workflow
- Create comprehensive documentation

### Tasks

1. **Skill Completion** (`.claude/skills/blog-workflow/SKILL.md`)
   - [ ] Complete example session documentation
   - [ ] Add troubleshooting guide
   - [ ] Document all commands
   - [ ] Add workflow diagrams

2. **Command Integration**
   - [ ] Implement `/blog:scan` command handler
   - [ ] Implement `/blog:review` command handler
   - [ ] Implement `/blog:graph` command handler
   - [ ] Implement `/blog:publish` command handler
   - [ ] Implement `/blog:status` command handler

3. **AI Draft Quality**
   - [ ] Integrate Claude API for draft generation
   - [ ] Create prompt templates for different post types
   - [ ] Implement quality checks (ai-slop-detector integration)
   - [ ] Test and refine AI outputs

4. **End-to-End Testing**
   - [ ] Test complete workflow: scan → review → edit → graph → publish
   - [ ] Verify git operations (add, commit, push)
   - [ ] Test error handling (conflicts, privacy violations)
   - [ ] Document edge cases

5. **Integration with Existing Skills**
   - [ ] Leverage work-visibility for repo analysis
   - [ ] Use divergent-ideation for post angle generation
   - [ ] Apply gestalt-information-architecture for layout

### Deliverable
Fully functional blog-workflow skill with complete automation.

### Acceptance Criteria
- All `/blog:*` commands work correctly
- AI drafts are high quality with minimal editing needed
- Workflow handles errors gracefully
- Documentation is complete and clear

---

## Phase 5: Polish & Launch (Week 5)

### Goals
- Apply design and styling
- Optimize performance
- Set up deployment
- Migrate initial content
- Public launch

### Tasks

1. **Design & Styling**
   - [ ] Create cohesive visual design
   - [ ] Implement responsive layouts
   - [ ] Add dark mode support
   - [ ] Design graph visualization aesthetics
   - [ ] Add micro-interactions and animations

2. **SEO Optimization**
   - [ ] Add meta tags (OpenGraph, Twitter Cards)
   - [ ] Generate sitemap.xml
   - [ ] Add robots.txt
   - [ ] Implement structured data (JSON-LD)
   - [ ] Optimize images and assets

3. **Performance Tuning**
   - [ ] Optimize bundle size
   - [ ] Implement lazy loading for graph
   - [ ] Add loading states
   - [ ] Compress images
   - [ ] Test Lighthouse scores (target 95+)

4. **Deployment Setup**
   - [ ] Choose hosting (GitHub Pages vs Netlify)
   - [ ] Create GitHub Actions workflow
   - [ ] Configure custom domain (if applicable)
   - [ ] Test deployment pipeline
   - [ ] Set up analytics (optional)

5. **Initial Content Migration**
   - [ ] Run scanner on all repos
   - [ ] Review and edit top 10 drafts
   - [ ] Write 2-3 manual feature posts
   - [ ] Import existing Claude skills documentation
   - [ ] Document technical patterns library

6. **Launch**
   - [ ] Final QA testing
   - [ ] Create launch announcement post
   - [ ] Share on social media / dev community
   - [ ] Gather feedback

### Deliverable
Fully deployed, polished blog with initial content portfolio.

### Acceptance Criteria
- Site is live and accessible
- Lighthouse score >95
- At least 10 published posts
- All Claude skills documented
- Graph visualization performs smoothly

---

## Post-Launch: Iteration & Maintenance

### Ongoing Tasks

1. **Weekly Content Generation**
   - Run `/blog:scan` every Monday
   - Review and publish 1-2 posts per week
   - Rebuild graph to show knowledge evolution

2. **Feature Enhancements**
   - Add RSS feed
   - Implement full-text search
   - Create topic clusters view
   - Add "garden statistics" page

3. **Community Engagement**
   - Respond to feedback
   - Share posts in relevant communities
   - Cross-post to dev.to or Medium
   - Track analytics and iterate

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Posts published | 10+ | Launch |
| Mycelium connections | 30+ edges | Launch |
| Weekly scan time | <5 min | Week 4 |
| AI draft edit time | <30% rewrite | Week 4 |
| Lighthouse score | 95+ | Week 5 |
| Weekly new posts | 1-2 | Post-launch |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI drafts low quality | High | Refine prompts, use ai-slop-detector |
| Privacy leaks | Critical | Automated tests, manual review |
| Graph performance issues | Medium | Lazy loading, optimization |
| Content generation fatigue | Medium | Fully automate scan, minimal editing |

---

## Next Steps

1. Run `npm install` to set up dependencies
2. Start Phase 1, Task 2: Content Schema
3. Create example markdown files to test schema
4. Build basic Astro page templates

---

**Ready to implement!** 🚀
