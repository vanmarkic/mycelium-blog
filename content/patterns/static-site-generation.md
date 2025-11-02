---
title: Static Site Generation Pattern
date: '2025-11-02'
status: published
privacy: public
tags:
  - architecture
  - performance
  - ssg
  - astro
  - jamstack
repos:
  - credit-castor
  - mycelium-blog
skills: []
patterns:
  - static-site-generation
  - jamstack
relatedTo:
  - 2025-11-02-credit-castor
  - 2025-11-02-loyer.brussels
description: >-
  Architectural pattern for building high-performance websites with pre-rendered
  static HTML
---

## Pattern Overview

Static Site Generation (SSG) is an architectural approach where pages are pre-rendered at build time rather than on each request. This pattern is foundational to the JAMstack architecture.

## Core Characteristics

### Build-time Rendering
Content and data are fetched and rendered during the build process:

```typescript
// Astro example
---
const posts = await fetchPosts();
const html = await renderPosts(posts);
---

<html>
  {html}
</html>
```

### Zero Runtime Processing
The server delivers pre-built HTML files with no server-side processing per request.

### Client Hydration (Optional)
Interactive components can be hydrated client-side:

```astro
---
import Counter from './Counter.jsx';
---

<!-- Only hydrate when visible -->
<Counter client:visible />
```

## When to Apply

SSG is ideal for:

1. **Content-heavy sites:** Blogs, documentation, portfolios
2. **E-commerce catalogs:** Product listings with occasional updates
3. **Marketing sites:** Landing pages, company websites
4. **Tools and calculators:** Input-driven applications

SSG is **not** ideal for:
- Real-time collaboration tools
- Social feeds with constant updates
- Personalized dashboards
- Chat applications

## Benefits

### Performance
- **Fast TTFB:** No server processing
- **CDN-friendly:** Static files cache perfectly
- **Predictable load times:** No database queries

### Security
- **Minimal attack surface:** No server-side code execution
- **No database exposure:** Pre-rendered content only

### Cost
- **Cheap hosting:** Static file hosting is inexpensive
- **Scalability:** CDN handles traffic spikes

### Developer Experience
- **Fast local development:** No database setup needed
- **Version control:** Content and code in git
- **Simple deployments:** Upload static files

## Trade-offs

**Build Times:**
Large sites (10,000+ pages) can have slow builds. Solutions:
- Incremental builds
- Distributed builds
- On-demand ISR (Incremental Static Regeneration)

**Stale Content:**
Static pages don't reflect real-time data. Solutions:
- Scheduled rebuilds (webhook triggers)
- Client-side data fetching for dynamic parts
- ISR for frequently changing pages

## Implementation with Astro

Astro is designed for SSG with optimal defaults:

```typescript
// astro.config.mjs
export default defineConfig({
  output: 'static', // SSG mode
  build: {
    inlineStylesheets: 'auto',
  },
});
```

Dynamic routes with static generation:

```astro
---
// src/pages/posts/[slug].astro
export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<article>
  <h1>{post.title}</h1>
  <div>{post.content}</div>
</article>
```

## Real-world Applications

### Credit Castor
Belgian real estate calculator using SSG:
- Pure function calculations
- No server needed
- Instant page loads

### Mycelium Blog
This very blog uses SSG:
- Build-time graph generation
- Markdown to HTML conversion
- Zero backend infrastructure

## Mycelium Links

Related patterns:
- JAMstack architecture
- Content-driven development
- Progressive enhancement
- Pure function architecture
