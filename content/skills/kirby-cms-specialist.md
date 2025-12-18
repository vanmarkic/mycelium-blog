---
title: Kirby CMS Specialist Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - kirby-cms
  - php
  - yaml
  - file-based-cms
repos:
  - kirby-gen
skills:
  - kirby-cms-specialist
patterns: []
relatedTo:
  - kirby-content-fixer
description: >-
  Claude Code skill for Kirby CMS development - blueprints, templates, snippets,
  blocks, plugins, Panel customization, and PHP development
---

## Overview

Expert guidance for Kirby CMS development. Kirby is a file-based PHP CMS where content lives in text files, structure is defined via YAML blueprints, and rendering happens through PHP templates and snippets.

**Core principle:** Understand Kirby's file-based philosophy - no database, content as files, blueprints define structure, templates render output.

## When to Use

**Use when:**
- Creating or modifying blueprints (pages, blocks, fields)
- Building templates or snippets
- Adding custom blocks to the block editor
- Working with Kirby's PHP API ($page, $site, $kirby)
- Migrating content from WordPress or other CMS
- Customizing the Panel (admin interface)
- Debugging Kirby-specific issues

## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| **Blueprints** | `site/blueprints/` | Define content structure (YAML) |
| **Templates** | `site/templates/` | Page rendering (PHP) |
| **Snippets** | `site/snippets/` | Reusable components (PHP) |
| **Controllers** | `site/controllers/` | Template logic (PHP) |
| **Content** | `content/` | Actual content (text files) |

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                     Panel (Admin UI)                     │
├─────────────────────────────────────────────────────────┤
│  Blueprints (YAML)     │  Define fields, sections, tabs │
├─────────────────────────────────────────────────────────┤
│  Controllers (PHP)     │  Prepare data for templates    │
├─────────────────────────────────────────────────────────┤
│  Templates (PHP)       │  Main page rendering           │
├─────────────────────────────────────────────────────────┤
│  Snippets (PHP)        │  Reusable components           │
├─────────────────────────────────────────────────────────┤
│  Content (Text Files)  │  Actual data (YAML + content)  │
└─────────────────────────────────────────────────────────┘
```

## Essential Patterns

### Blueprint Structure

```yaml
# site/blueprints/pages/article.yml
title: Article
icon: 📄

tabs:
  content:
    label: Content
    sections:
      content:
        type: fields
        fields:
          title:
            type: text
            required: true
          body:
            type: blocks
            fieldsets:
              - heading
              - text
              - image
```

### Block Blueprint + Snippet

```yaml
# site/blueprints/blocks/callout.yml
name: Callout
icon: alert
fields:
  type:
    type: select
    options:
      info: Info
      warning: Warning
  content:
    type: writer
```

```php
<!-- site/snippets/blocks/callout.php -->
<?php /** @var \Kirby\Cms\Block $block */ ?>
<div class="callout callout--<?= $block->type() ?>">
  <?= $block->content()->kt() ?>
</div>
```

### Template with Blocks

```php
<!-- site/templates/article.php -->
<?php snippet('header') ?>

<article>
  <h1><?= $page->title()->html() ?></h1>
  <?php foreach ($page->body()->toBlocks() as $block): ?>
    <?php snippet('blocks/' . $block->type(), ['block' => $block]) ?>
  <?php endforeach ?>
</article>

<?php snippet('footer') ?>
```

## Kirby API Cheat Sheet

```php
// Global helpers
$kirby     // Kirby instance
$site      // Site object
$page      // Current page

// Page methods
$page->title()
$page->children()
$page->siblings()
$page->parent()

// Field methods
$page->title()->html()           // Escaped HTML
$page->body()->toBlocks()        // Convert to blocks
$page->date()->toDate('Y-m-d')   // Format date
$page->cover()->toFile()         // Get file object

// Collection methods
->filterBy('template', 'article')
->sortBy('date', 'desc')
->limit(10)
```

## Common Pitfalls

| Mistake | Fix |
|---------|-----|
| Editing `kirby/` core files | Create plugin or use hooks |
| Hardcoding URLs | Use `$page->url()`, `url()` helpers |
| Not escaping output | Use `->html()`, `->esc()` |
| Cache not clearing | Delete `media/` and `site/cache/` |

## Mycelium Links

Related:
- **kirby-content-fixer**: Diagnose and fix malformed Kirby content files
- **frontend-design**: Style Kirby templates
- **systematic-debugging**: Debug Kirby-specific issues
