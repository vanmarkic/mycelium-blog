---
title: UI Testing Skill
date: '2025-12-18'
status: published
privacy: public
tags:
  - claude-code
  - testing
  - chrome-devtools
  - automation
  - quality-assurance
repos: []
skills:
  - ui-testing
patterns:
  - systematic-testing
relatedTo:
  - exhaustive-verification
description: >-
  Claude Code skill for autonomous UI testing with 6-phase workflow,
  element-type checklists, and integrated bug reporting
---

## Overview

Autonomous UI testing with 6-phase workflow, element-type checklists, and integrated bug reporting. Delegates to parallel agents when complexity exceeds thresholds.

## When to Use

- User asks to "test the UI" or "QA this feature"
- Need to verify UI components work correctly
- Want automated browser testing with reports
- Checking accessibility, responsiveness, or visual consistency

## 6-Phase Workflow

```
Phase 0: PREREQUISITES  → Verify chrome-devtools MCP available
Phase 1: REQUIREMENTS   → Assess complexity, gather targets
Phase 2: SETUP          → Auth, baseline screenshots
Phase 3: TESTING        → Execute with element-type checklists
Phase 4: BUG REPORTING  → Create GitHub issues for failures
Phase 5: ENHANCEMENTS   → Document UX/accessibility improvements
Phase 6: SUMMARY        → Generate final report
```

### Phase 0: Prerequisites

Before starting, verify:
- [ ] Chrome DevTools MCP tools available
- [ ] Application running and accessible
- [ ] Test credentials available (if auth required)

### Phase 3: Systematic Testing

Apply **element-type-specific checklists** for each component.

## Element-Type Checklists

### Form Testing
- [ ] Required field validation fires on empty submit
- [ ] Error messages display near invalid fields
- [ ] Success state shows after valid submission
- [ ] Tab order follows visual layout
- [ ] Labels associated with inputs
- [ ] Form preserves data on validation failure

### Table/List Testing
- [ ] Empty state displays when no data
- [ ] Loading state shows during fetch
- [ ] Data renders in correct columns/format
- [ ] Sorting/pagination works (if applicable)
- [ ] Long text truncates appropriately

### Modal/Dialog Testing
- [ ] Opens on trigger action
- [ ] Focus trapped inside modal
- [ ] ESC key closes modal
- [ ] Returns focus to trigger on close
- [ ] Accessible via screen reader

### Accessibility Testing
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicator visible on all focusable elements
- [ ] ARIA labels on icons/buttons without text
- [ ] Color contrast >= 4.5:1 (text), 3:1 (large)
- [ ] Headings in logical order (h1 → h2 → h3)

## Chrome DevTools Quick Reference

| Task | Tool |
|------|------|
| Navigate | `navigate_page({ url })` |
| Get elements | `take_snapshot()` |
| Click | `click({ uid })` |
| Type | `fill({ uid, value })` |
| Wait for text | `wait_for({ text })` |
| Screenshot | `take_screenshot({ filePath })` |
| Console logs | `list_console_messages({ types: ["error"] })` |
| Resize | `resize_page({ width, height })` |

## Summary Report Format

```json
{
  "summary": {
    "elements_tested": 15,
    "bugs_found": 3,
    "bugs_by_severity": { "critical": 0, "high": 1, "medium": 2 },
    "enhancements": 2,
    "github_issues_created": 5,
    "status": "COMPLETED"
  },
  "results": [
    {
      "id": "TC_001",
      "component": "EmailList",
      "status": "passed|failed|skipped",
      "screenshot": "screenshots/TC_001.png",
      "github_issue": null
    }
  ]
}
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Testing without snapshot | Always `take_snapshot()` first |
| Skipping Phase 0 | Verify MCP tools available before starting |
| Not using checklists | Apply element-type checklist for each component |
| No evidence capture | Screenshot on PASS and FAIL |
| Only happy path | Include edge cases |

## Mycelium Links

Related:
- **ui-debugger**: Debug specific UI interaction bugs
- **exhaustive-verification**: Verify testing is complete
- **test-driven-development**: Write tests before implementation
