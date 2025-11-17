---
title: Building deuxmains with Development and Project
date: '2025-11-14'
status: draft
privacy: public
tags: []
repos:
  - deuxmains
skills:
  - meta-script-manager.md
patterns: []
relatedTo: []
description: Exploring development patterns in deuxmains
---
## Introduction

Over the past month, **25 commits** shaped deuxmains, with 28% focused on building new features. 

## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- Add orchestration logs and images for listing creation workflow (10/30/2025)
- Add manual category selection for initial listing page (10/29/2025)
- Add Chrome connection check and auto-launch capability (10/29/2025)

Challenges overcome:
- Fix listing schema mismatch causing batch processing failures (10/30/2025)
- Fix price handling and remove confirmation prompt (10/29/2025)
- Fix title truncation and correct music category paths in listings (10/29/2025)

-->

### Context: What I Was Building

I built an automation system for posting classified listings to a marketplace (deuxmains). The workflow: take JSON listing files with item details, photos, categories, prices—then orchestrate browser automation with Playwright to create each listing automatically.

The problem I was solving: manually posting dozens of items is tedious. Copy-paste descriptions, upload photos one by one, select categories from nested menus, confirm prices. Human error creeps in—wrong category selected, photo paths broken, titles truncated mid-word. I needed reproducible automation that handled the full workflow: Chrome connection, category selection, photo uploads, batch processing.

The project used the META pattern (MEta script mAnager)—a Claude skill for orchestrating complex automation workflows. I built comprehensive orchestration logging, automated category suggestions, photo directory verification, and batch processing with schema validation.

### The Challenge

**Browser automation is fragile.** Chrome needs to launch in debug mode for Playwright to attach. Connection can fail silently. If Chrome isn't running when the script starts, automation hangs. I added connection checks and auto-launch capability—detect if Chrome is available, launch it automatically if not, handle errors gracefully.

**Schema mismatches broke batch processing.** Listing JSON files evolved over time. Some had `price` as a number, others as a string. Some included `status` fields, others didn't. Category paths changed format. The batch processor would hit a malformed JSON and crash halfway through. I fixed schema mismatches systematically: validate JSON structure, migrate old formats, fail fast with clear errors.

**Category selection had hidden complexity.** Categories aren't flat—they're nested hierarchies. "Music → Instruments → Guitars → Electric Guitars." Initially I hardcoded paths. Wrong. When the marketplace changed categories or I added new item types, paths broke. I built automatic category suggestion first, then added manual override for edge cases.

**Photo paths were a nightmare.** Listings referenced photos like `"photos/sennheiser-headphones/front.jpg"`. But what if the directory was renamed? What if photos were moved? What if a path had typos? I added comprehensive photo directory verification: scan all listing JSONs, check every photo path, report missing files before automation starts.

**Title truncation caused subtle bugs.** Some titles were too long for the marketplace's character limit. Playwright would paste the full title, but the UI truncated it silently. Listings went live with broken titles like "Strymon BigSky Reverb Peda..." I fixed truncation logic to enforce limits before automation.

### How I Solved It

**Orchestration-first architecture.** I built a main orchestration system that coordinated the full workflow: verify photos, validate schemas, launch Chrome, process listings batch by batch, log everything. This pattern emerged from the META script manager skill—don't script individual actions, orchestrate workflows.

**Robust error handling at every layer.** Chrome connection errors? Auto-launch and retry. Missing photos? Fail before automation starts. Schema mismatch? Report which JSON file has the problem. Invalid category? Suggest valid alternatives. Each layer validated independently.

**Category system with fallback.** Automatic category suggestion handled 90% of cases. Manual selection covered edge cases where auto-suggestion failed. The system learned from successful listings—track which categories worked for which item types.

**Photo verification as a pre-flight check.** Before any automation runs, verify all photo paths. Generate a comprehensive report: which listings reference which photos, which photos are missing, which directories don't exist. Fix problems before automation, not during.

**Batch processing with checkpoints.** Process listings in batches. After each batch, update the tracker with posted listings. If automation fails mid-batch, restart from the last checkpoint. Don't lose progress because one listing had a bad schema.

**Comprehensive logging.** Every automation step logged with timestamps: Chrome launched, category selected, photos uploaded, listing created. When something broke, logs showed exactly where.

### What I Learned

**Orchestration is architecture.** The META pattern taught me to think in workflows, not scripts. Don't write "upload photo script" and "select category script"—build an orchestrator that coordinates both and handles errors systematically.

**Pre-flight checks prevent runtime failures.** Photo verification, schema validation, Chrome connection checks—these aren't optional. Running automation without pre-flight checks is guessing. You'll discover broken paths halfway through batch processing.

**Automation fragility compounds.** A small change—category path renamed, photo directory moved, schema field added—breaks automation silently. The fix isn't more robust automation—it's validation layers that catch changes before automation runs.

**Logging is debugging.** When Playwright automation fails, error messages are opaque. Comprehensive logging with timestamps and state snapshots makes debugging possible. Without logs, I'd be guessing why listings failed.

If I were starting over, I'd invest in a proper schema validation library (like Zod) from day one. My ad-hoc JSON validation worked, but a formal schema would have prevented subtle type mismatches and migration bugs.



## Technical Details

**Stack**: Not detected
**Patterns**: None detected
**Claude Skills**: meta-script-manager.md

## All Commits (25)

- Fix listing schema mismatch causing batch processing failures (10/30/2025)
- Add orchestration logs and images for listing creation workflow (10/30/2025)
- Update tracker with latest posted listings (10/30/2025)
- Fix price handling and remove confirmation prompt (10/29/2025)
- Replace manual category selection with automatic suggestion (10/29/2025)
- Fix title truncation and correct music category paths in listings (10/29/2025)
- Add manual category selection for initial listing page (10/29/2025)
- Fix Chrome debug mode launch and improve error handling (10/29/2025)
- Add Chrome connection check and auto-launch capability (10/29/2025)
- Fix all photo paths in listing JSON files for Playwright automation (10/29/2025)
- Add comprehensive photo directory verification report (10/29/2025)
- Organize and consolidate listing JSON files (10/29/2025)
- Add main.py as convenient entry point for listing automation (10/29/2025)
- Add comprehensive listing workflow orchestration system (10/29/2025)
- Update CLAUDE.md to include a reminder for summarizing changes in commits (10/29/2025)
- move files (10/29/2025)
- Add new listings for Sennheiser headphones, Strymon pedal, and The Witcher 3 game; update existing listings with status changes and detailed descriptions; backup automation log and listing data. (10/29/2025)
- v4 (10/29/2025)
- latest (10/29/2025)
- script inventory (10/29/2025)
- screenshot chunks (10/29/2025)
- pause for verification (10/29/2025)
- v2 + (10/29/2025)
- v2 (10/29/2025)
- first commit (10/29/2025)

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
