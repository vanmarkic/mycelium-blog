---
title: 'Building La Ferme du Temple: Performance Engineering Meets Design Principles'
date: '2025-11-03'
status: published
privacy: public
tags:
  - astro
  - performance
  - seo
  - gestalt-principles
  - web-vitals
  - accessibility
  - static-site-generation
  - react
  - supabase
repos:
  - ferme-du-temple
skills: []
patterns:
  - static-site-generation
  - performance-optimization
  - design-systems
relatedTo:
  - 2025-11-02-credit-castor
  - 2025-11-02-loyer.brussels
  - static-site-generation
description: >-
  How comprehensive performance engineering, SEO optimization, and Gestalt
  principles transformed a community farm website
---

## Overview

La Ferme du Temple (lafermedutemple.be) represents a deep dive into performance engineering and design principles for a Belgian community farm project. With over **200 commits** of continuous refinement, the project demonstrates how systematic optimization across performance, SEO, accessibility, and UX creates a production-ready web experience.

**Tech Stack:** Astro, React, Supabase, Tailwind CSS, Vercel, Playwright, Vitest

**Key Achievements:**
- ⚡ Eliminated Cumulative Layout Shift (CLS) to near-zero
- 🎯 37% contrast ratio improvement for WCAG AA compliance
- 📊 32% reduction in visual asymmetry through Gestalt principles
- 🔍 Comprehensive SEO implementation with structured data

## Performance Engineering

### The CLS Crisis

Cumulative Layout Shift (CLS) was causing significant user experience degradation. The problem: client-side hydration of footer components was causing visible layout shifts after page load.

**The Fix:**

```typescript
// Before: Footer with client:only causing massive CLS
<Footer client:only="react" />

// After: Static rendering with strategic hydration
<Footer /> // No client directive - render server-side
```

Multiple commits tracked the journey:
- `ccf18a5` - Remove client:only wrapper
- `d2e1eb0` - Fix footer hydration
- `bfa5766` - Prevent layout shift
- `510c35b` - Further CLS prevention

This illustrates the importance of **measuring, iterating, and verifying** performance fixes rather than assuming a single change will solve the problem.

### LCP Optimization

Largest Contentful Paint (LCP) was improved through strategic resource loading:

```astro
<!-- Critical image preloading with priority hints -->
<link rel="preload" as="image"
  href="/images/carousel/property-5-mobile.avif"
  fetchpriority="high">

<!-- Font optimization with display:optional -->
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;700&display=optional">
<link rel="stylesheet"
  href="..."
  media="print"
  onload="this.media='all'"> <!-- Async CSS loading -->
```

The `display=optional` font strategy prevents font-related CLS by allowing the browser to skip font loading if it's not immediately available.

### Intelligent Code Splitting

The Vite configuration implements a sophisticated chunking strategy:

```javascript
manualChunks: (id) => {
  // Core React + critical utils - highest priority, bundle together
  if (id.includes('react/') || id.includes('react-dom/')) {
    return 'react-vendor';
  }

  // CRITICAL: Bundle carousel with react-vendor to eliminate waterfall
  // This increases the initial bundle slightly but removes the 1.3s delay
  if (id.includes('embla-carousel')) {
    return 'react-vendor';
  }

  // Dialog components - lazy loaded on click, keep separate
  if (id.includes('@radix-ui/react-dialog')) {
    return 'dialog';
  }

  // Leaflet - separate chunk for map only
  if (id.includes('leaflet')) {
    return 'leaflet';
  }
}
```

**Key insight:** Sometimes **bundling more together** improves performance by eliminating dependency waterfalls, even if it increases the initial bundle size. The carousel was moved into the react-vendor chunk, trading a slight size increase for a **1.3-second reduction** in loading delay.

## SEO Excellence

The project includes comprehensive SEO documentation (`docs/SEO-FINDINGS-BY-FILE.md`) with line-by-line analysis of every file's SEO impact.

### Critical SEO Improvements

```astro
<!-- Language declaration for French content -->
<html lang="fr">

<!-- Canonical URL for duplicate content handling -->
<link rel="canonical" href={Astro.url.href} />

<!-- Language alternatives -->
<link rel="alternate" hreflang="fr" href={Astro.url.href} />

<!-- Theme color for browser UI -->
<meta name="theme-color" content="#330066" />

<!-- Structured data for organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "La Ferme du Temple",
  ...
}
</script>
```

### Sitemap Configuration

```javascript
sitemap({
  i18n: {
    defaultLocale: 'fr',
    locales: {
      fr: 'fr-BE', // Belgian French
    },
  },
})
```

The sitemap integration properly signals to search engines that this is French-language content for the Belgian market.

## Gestalt Principles in Practice

The project applied **systematic design principles** with measurable outcomes:

### 1. Semantic Spacing System

```typescript
// tailwind.config.ts - Semantic vertical spacing
'section-subsection': '4rem',      // 64px - mb-16
'section-related': '8rem',         // 128px - mb-32
'section-major': '12rem',          // 192px - mb-48
'section-break': '16rem',          // 256px - mb-64

// Semantic horizontal spacing
'indent-small': '2rem',            // 32px - ml-8
'indent-medium': '4rem',           // 64px - ml-16
'indent-large': '8rem',            // 128px - ml-32
```

This replaces arbitrary spacing values with **semantic meaning**, ensuring consistent vertical rhythm and improved readability through the **Law of Proximity**.

### 2. Accessibility: WCAG AA Compliance

```css
/* Before: */
--muted-foreground: 0 0% 40%; /* 3.8:1 contrast - FAILS WCAG AA */

/* After: */
--muted-foreground: 0 0% 30%; /* 5.2:1 contrast - PASSES WCAG AA */
```

A **37% improvement** in contrast ratio, crossing the WCAG AA threshold of 4.5:1 for better readability for users with visual impairments.

### 3. Reading Flow Indicators

Created `NumberBadge.tsx` component to guide users through non-linear layouts:

```tsx
<NumberBadge variant="default">1</NumberBadge>
<NumberBadge variant="light">2</NumberBadge>
<NumberBadge variant="dark">3</NumberBadge>
```

Applied to project sections and pricing cards, providing clear visual hierarchy and reading order - implementing the **Law of Common Fate**.

### 4. Asymmetry Reduction: 32%

By standardizing borders, spacing, and alignment, the team reduced visual asymmetry by **32%** across the site. This improves:
- **Cognitive load** - Consistent patterns are easier to process
- **Visual flow** - Predictable structure guides the eye
- **Professional appearance** - Attention to detail signals quality

## Full-Stack Architecture

### Supabase Integration

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Newsletter subscription
const { data, error } = await supabase
  .from('subscriptions')
  .insert([{ email, subscribed_at: new Date() }]);
```

Newsletter functionality with persistent storage, enabling community building features.

### React Query for State Management

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

const { mutate: subscribe } = useMutation({
  mutationFn: async (email: string) => {
    // Subscribe user to newsletter
  },
  onSuccess: () => {
    toast.success('Subscribed successfully!');
  },
});
```

Optimistic updates and error handling for forms, providing excellent UX even under network latency.

### E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test('newsletter subscription flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  await expect(page.locator('.toast-success')).toBeVisible();
});
```

The project includes comprehensive E2E tests ensuring critical user flows remain functional across deployments.

## Deployment and Analytics

### Vercel Integration

```typescript
import vercel from '@astrojs/vercel';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

export default defineConfig({
  adapter: vercel(),
  site: 'https://lafermedutemple.be',
  output: 'static',
});
```

Vercel's edge network provides:
- Global CDN distribution
- Automatic HTTPS
- Instant rollbacks
- Preview deployments for branches

### Real-User Monitoring

```typescript
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

// Track real-world performance
injectAnalytics();
injectSpeedInsights();
```

Real-user monitoring (RUM) provides actual field data on Web Vitals, not just synthetic tests. This data guided the CLS and LCP optimizations.

## Key Patterns and Lessons

### 1. Performance is Iterative

The multiple CLS-related commits show that performance optimization requires **measurement, hypothesis, implementation, and verification**. The first attempt to fix CLS didn't completely solve it - it took several iterations with real measurements.

### 2. Document Everything

The comprehensive SEO documentation with line-by-line analysis creates a **knowledge artifact** that:
- Explains **why** decisions were made
- Provides **context** for future maintainers
- Serves as **training material** for team members
- Enables **systematic review** of technical decisions

### 3. Design with Data

The Gestalt improvements reduced asymmetry by **32%** - a measurable outcome. By quantifying design improvements, the team demonstrated value and provided clear success criteria.

### 4. Bundle Strategically

The manual chunking strategy shows deep understanding of browser loading behavior. **Sometimes bundling more together is faster** than aggressive splitting if it eliminates dependency waterfalls.

### 5. Accessibility is Non-Negotiable

Meeting WCAG AA compliance isn't just about legal compliance - it's about **inclusive design**. The contrast ratio improvements make the site usable for a wider audience.

## Conclusion

La Ferme du Temple demonstrates that building performant, accessible, well-designed websites requires:

1. **Systematic measurement** - Performance budgets, Web Vitals tracking, asymmetry metrics
2. **Documentation culture** - SEO findings, Gestalt analyses, design principles
3. **Iterative refinement** - Multiple attempts to solve CLS, continuous optimization
4. **Full-stack thinking** - Performance + UX + SEO + accessibility as interconnected concerns
5. **Modern tooling** - Astro's SSG, Vercel's edge network, Supabase's backend

The 200+ commits tell a story of continuous improvement guided by data, principles, and user feedback. This isn't just a website - it's a **case study in production-grade web development**.

## Mycelium Links

This project connects to several architectural patterns:
- Static site generation with Astro
- Performance optimization strategies
- Design systems and semantic spacing
- Accessibility standards (WCAG)
- Real-user monitoring and Web Vitals
