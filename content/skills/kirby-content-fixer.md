---
title: Kirby CMS Content Fixer Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - kirby-cms
  - yaml
  - debugging
  - php
repos:
  - kirby-gen
skills:
  - kirby-content-fixer
patterns:
  - systematic-debugging
relatedTo:
  - ui-debugger
description: >-
  Claude Code skill for diagnosing and fixing malformed Kirby CMS content files
  - blocks not displaying, YAML errors, migration issues
---

## Overview

The Kirby CMS Content Fixer skill provides a systematic approach to diagnosing and fixing malformed content files. It addresses the most common issues: blocks not rendering, YAML parsing failures, and Panel/frontend disconnects.

## When To Use

Use when:
- Content blocks don't display on the frontend
- YAML parsing errors occur
- Migrated/imported content shows as empty
- The Panel shows content but the frontend doesn't render it

## Diagnostic Flow

### Step 1: Identify the Symptom

| Symptom | Likely Cause |
|---------|--------------|
| **All blocks empty** | Wrong field nesting level or field name mismatch |
| **Some blocks work** | Inconsistent structure between blocks |
| **YAML parse error** | Special characters need quoting (`**`, `*`, `:`) |
| **Panel OK, frontend empty** | Snippet doesn't handle field name variations |
| **Specific block type fails** | Blueprint/snippet field name mismatch |

### Step 2: Gather Information

**MANDATORY before proposing any fix:**

1. The content file (e.g., `episode.txt`)
2. The block blueprints in `site/blueprints/blocks/*.yml`
3. The block snippets in `site/snippets/blocks/*.php`
4. A known working content file for comparison

## Common Malformation Patterns

### Pattern 1: Missing `content:` Nesting

**WRONG:**
```yaml
-
  type: heading
  level: h2
  text: My Title
```

**CORRECT:**
```yaml
-
  type: heading
  content:
    level: h2
    text: My Title
```

### Pattern 2: Field Name Collision (text vs content)

The text block blueprint often uses `content` as field name, which collides with Kirby's `$block->content()` method.

**Robust snippet that handles both:**
```php
<?php
$textField = $block->text();
$contentField = $block->content()->get('content');

if ($textField && $textField->isNotEmpty()) {
    $textContent = $textField;
} elseif ($contentField && $contentField->isNotEmpty()) {
    $textContent = $contentField;
} else {
    $textContent = null;
}
?>
<?php if ($textContent): ?>
<div class="block-text prose">
  <?= $textContent->kt() ?>
</div>
<?php endif ?>
```

### Pattern 3: Unquoted Special Characters

YAML interprets certain characters specially:

**WRONG:**
```yaml
content: **Bold text starts here**
caption: Photo: John Doe
```

**CORRECT:**
```yaml
content: "**Bold text starts here**"
caption: "Photo: John Doe"
```

Or use block scalars:
```yaml
content: |
  **Bold text** with special chars: anywhere
```

### Pattern 4: YAML vs JSON Format (Kirby 5)

**Critical:** Kirby 5 blocks field uses JSON format, not YAML!

**YAML format may render as single text blob:**
```yaml
Layout:

-
  type: heading
  content:
    level: h2
    text: My Title
```

**JSON format (Kirby 5 native):**
```
Layout:

[
    {
        "content": {
            "level": "h2",
            "text": "My Title"
        },
        "id": "heading-1",
        "isHidden": false,
        "type": "heading"
    }
]
```

## Validation Script

```php
<?php
require 'kirby/vendor/autoload.php';
use Symfony\Component\Yaml\Yaml;

$files = shell_exec('find kirby/content -name "*.txt" -type f');
$files = array_filter(explode("\n", trim($files)));

foreach ($files as $file) {
    $content = file_get_contents($file);
    // Stop at next ---- separator (Kirby field boundary)
    if (preg_match('/Layout:\n\n(.*?)(?=\n\n----\n|$)/s', $content, $matches)) {
        $yamlContent = trim($matches[1]);
        if (empty($yamlContent) || $yamlContent[0] === '[') continue;

        try {
            Yaml::parse($yamlContent);
        } catch (Exception $e) {
            echo "ERROR in $file: " . $e->getMessage() . "\n";
        }
    }
}
```

## Verification Checklist

- [ ] Check if content is YAML or JSON format
- [ ] YAML validates without errors
- [ ] All blocks render on frontend
- [ ] Content structure matches blueprint field names
- [ ] Snippets handle all field name variations
- [ ] Page displays same content as source
- [ ] Panel can still edit the content
- [ ] Block count matches expected

## Mycelium Links

Related:
- **kirby-cms-specialist** skill: Broader Kirby development expertise
- **systematic-debugging** pattern: Four-phase debugging framework
