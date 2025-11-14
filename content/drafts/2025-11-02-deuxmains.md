---
title: Building deuxmains with Development and Project
date: '2025-11-02'
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

I had a pile of used music gear and games to sell on a Belgian marketplace. Listing items manually meant: take photos, write descriptions, select categories, set prices, fill forms. Repeat 20+ times. Deuxmains automates that workflow using Playwright for browser automation.

The commits show a classic automation evolution. Early commits are vague ("first commit," "v2," "latest"), suggesting rapid prototyping. Then comes structure: organizing listing JSON files, verifying photo paths, building a comprehensive orchestration system. The META pattern (from the meta-script-manager skill) appears—a framework for managing browser automation scripts systematically.

The goal was end-to-end automation: from a JSON file describing an item to a live marketplace listing, without manual form-filling. The workflow includes category selection, price handling, photo uploads, and handling the site's navigation quirks.

### The Challenge

The photo path verification problem emerged early. The commit "Add comprehensive photo directory verification report" followed by "Fix all photo paths in listing JSON files" shows I had a data quality issue. JSON files referenced photos that didn't exist or used wrong paths. Browser automation fails hard on missing files—Playwright can't upload what isn't there.

Category handling was messier than expected. The commits show iteration: "Add manual category selection for initial listing page" → "Replace manual category selection with automatic suggestion" → "Fix title truncation and correct music category paths." This suggests the site's category system was inconsistent—paths changed, titles got truncated, automated suggestions didn't always match manual navigation.

Chrome connection stability was another issue. The commits "Add Chrome connection check and auto-launch capability" and "Fix Chrome debug mode launch and improve error handling" show I was fighting browser lifecycle management. Playwright needs Chrome running in debug mode, which means launching with specific flags and maintaining the connection.

Price handling had a confirmation prompt that broke automation. The commit "Fix price handling and remove confirmation prompt" suggests I initially added a manual verification step, then realized it defeated the automation purpose. Removing it required trusting the JSON data was correct—which circles back to the photo path verification problem.

### How I Solved It

I started with the data layer: organizing and consolidating listing JSON files. The commit "Organize and consolidate listing JSON files" suggests I had scattered data that needed centralization. Then "Add comprehensive photo directory verification report" let me audit what was broken before fixing paths in bulk.

The orchestration system came next. The commit "Add comprehensive listing workflow orchestration system" shows I built a coordinator—not just scripts for individual steps, but a higher-level system that sequences: data validation → Chrome launch → category selection → form filling → photo upload → submission. The "Add orchestration logs and images for listing creation workflow" commit added observability—I could see what succeeded and what failed.

For Chrome management, I implemented connection checks before attempting automation. The "Add Chrome connection check and auto-launch capability" commit shows defensive programming—verify Chrome is running in debug mode, auto-launch if needed, fail fast with clear errors if connection is impossible.

The category selection problem got solved through iteration. Manual selection proved the workflow, automatic suggestion improved speed, path corrections fixed edge cases. The commit "Fix title truncation and correct music category paths" shows I had to handle site-specific quirks (like title length limits in category paths).

The `main.py` entry point ("Add main.py as convenient entry point for listing automation") wrapped everything in a simple interface. This suggests I wanted a single command to run the full workflow, not manual step execution.

### What I Learned

Photo path verification should have been first, not mid-project. The orchestration system couldn't work reliably without data quality guarantees. Next time: validate data before building automation around it.

The Chrome debug mode connection is fragile. Playwright's reliance on debug mode means you're fighting browser lifecycle issues constantly. Auto-launch helps but doesn't eliminate the problem. For production automation, headless mode with explicit lifecycle management would be more robust.

The manual-to-automatic category selection progression taught me to validate assumptions with manual steps first. I thought automatic suggestions would work perfectly. They didn't—site quirks (truncation, path changes) broke them. Manual testing revealed those edge cases before they crashed the automation loop.

The commit message discipline broke down early, then improved. "v2+" and "latest" tell me nothing. "Add comprehensive listing workflow orchestration system" tells me exactly what changed. Maintaining that discipline from commit one would have made debugging easier when things inevitably broke.



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
