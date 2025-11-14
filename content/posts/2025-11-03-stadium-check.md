---
title: Building stadium-check with Development and Project
date: '2025-11-03'
status: published
privacy: public
tags: []
repos:
  - stadium-check
skills: []
patterns: []
relatedTo: []
description: Exploring development patterns in stadium-check
---
## Introduction

Over the past month, **19 commits** shaped stadium-check, with 11% focused on building new features. 

## The Story

<!-- Review the commit history below and tell the story of this work:

1. **Context**: What problem were you trying to solve? What was the goal?
2. **Challenge**: What obstacles did you encounter? What made this interesting?
3. **Solution**: How did you approach the problem? What decisions did you make?
4. **Outcome**: What did you learn? What would you do differently?

Notable features built:
- add gitignore (10/26/2025)
- add config file (10/26/2025)

Challenges overcome:
- fix notion scritp (10/26/2025)
- fix notion api connection (10/26/2025)
- fix found spots not found bug (10/26/2025)

-->

### Context: What I Was Building

I wanted gym class availability notifications. Specifically: check if BodyPump spots opened up at my local fitness center, notify me if they did. Stadium-check automates that check using GitHub Actions running every 10 minutes, pulling from the gym's scheduling API.

The problem is simple—popular classes fill up fast. Manual checking is tedious. The solution is equally simple—automated polling with notifications when spots appear. But simple problems accumulate complexity: cron scheduling, API integration, configuration management, notification delivery.

The 19 commits show iterative evolution. Early work focused on basic scheduling and URL configuration. Later commits added Notion integration for dynamic configuration, fixed bugs in the spot-checking logic, and toggled which classes to monitor (BodyPump on/off, based on my schedule).

### The Challenge

The first challenge was flaky configuration. Early versions hardcoded the stadium URL and lesson ID directly in the GitHub Actions workflow. That worked, but changing which class to monitor meant editing workflow YAML files. The commits "Update STADIUM_URL to new LesId" and "Update STADIUM_URL in stadium_curl.yml" show me manually updating configuration in code. That's fragile—prone to typos, hard to maintain, requires git commits for simple config changes.

The second challenge was Notion API integration. The commit "fetch config from notion" shows I tried to externalize configuration to a Notion database. That's cleaner—update Notion, the script pulls fresh config. But the commits "fix notion api connection" and "fix notion scritp" [sic] show it didn't work smoothly. API authentication, database querying, handling optional fields—each added failure modes.

The third challenge was the spot-checking logic itself. The commit "fix found spots not found bug" is telling. The script was supposed to detect when spots opened up. But it had a bug where spots existed but the script didn't report them. That's the worst kind of failure—silent. No notification means I miss the class, but I don't know the script failed. I just assume spots didn't open.

### How I Solved It

I started with the basics: cron scheduling and URL configuration. The commit "Change cron schedule to every 10 minutes" shows I tuned the polling frequency. Too frequent wastes API calls and GitHub Actions minutes. Too infrequent means missing spots that fill up quickly. 10 minutes seemed reasonable.

Configuration externalization came next. The commit "add config file" shows I moved configuration out of workflow YAML into a separate config file. That's better than hardcoding, but still requires code changes. The Notion integration attempt ("fetch config from notion", "enable notion") was the next evolution—configuration as data, not code. But the fix commits ("fix notion api connection", "fix notion scritp") show it was buggy.

I added dynamic class toggling. The commits "enable bodypump", "disable bodypump" show me turning monitoring on and off based on my schedule. This suggests the configuration supports enabling/disabling specific classes. When I'm traveling or injured, I don't need BodyPump notifications. Toggle it off. When I'm back, toggle it on.

The spot-checking bug required fixing the core logic. The commit "fix found spots not found bug" doesn't give details, but it likely involved parsing the API response correctly, handling edge cases (zero spots vs spots not reported), or fixing comparison logic (is spot count greater than threshold?).

I also disabled JSON-based scripts. The commit "disable json based scripts" suggests an earlier approach used JSON files to define which scripts to run. That approach got replaced—possibly by the Notion integration or by simpler direct configuration.

Finally, I added a `.gitignore` file. The commit "add gitignore" came relatively late, suggesting I was initially committing generated files, logs, or credentials that shouldn't be in version control. Classic oversight when prototyping quickly.

### What I Learned

Hardcoded configuration is technical debt. Every time I wanted to monitor a different class, I edited workflow files and committed to git. That's slow, error-prone, and clutters git history with config changes. Externalizing configuration to Notion was the right idea, even if the implementation had bugs.

Silent failures are worse than loud failures. The "found spots not found bug" meant I couldn't trust the script. No notification might mean no spots, or might mean the script broke. Monitoring the monitor would help—send a health check ping periodically to verify the script is running correctly.

Cron frequency matters. 10-minute polling is aggressive for GitHub Actions free tier. If I were running this long-term, I'd evaluate costs and optimize. Maybe 15 or 20 minutes is sufficient. Or maybe switch to a webhook-based approach if the gym's API supports it—get notified when data changes, rather than polling.

Notion as configuration backend is clever but fragile. The API integration introduced failure modes (authentication, query errors, schema changes). For a simple use case like this, a JSON file in a private repo might be simpler. Save Notion integration for when you actually need the rich editing experience and multi-user access.

If I were doing this again, I'd add automated tests for the spot-checking logic. The "found spots not found bug" could've been caught with test cases: mock API response with spots, verify script detects them. Mock API response with no spots, verify script doesn't false-alarm. Testing cron jobs and API integrations is annoying, but prevents silent failures.



## Technical Details

**Stack**: Not detected
**Patterns**: None detected


## All Commits (19)

- disable json based scripts (10/26/2025)
- fix notion scritp (10/26/2025)
- tests (10/26/2025)
- fix notion api connection (10/26/2025)
- add gitignore (10/26/2025)
- enable notion (10/26/2025)
- disable bodypump (10/26/2025)
- fix found spots not found bug (10/26/2025)
- enable bodypump (10/26/2025)
- make name and id optional (10/26/2025)
- fetch config from notion (10/26/2025)
- add config file (10/26/2025)
- check for lessons in the next 3 days with lessons (10/26/2025)
- On main: fdsfdsq (10/26/2025)
- index on main: e4c74c3 Change cron schedule to every 10 minutes (10/26/2025)
- untracked files on main: e4c74c3 Change cron schedule to every 10 minutes (10/26/2025)
- Change cron schedule to every 10 minutes (10/25/2025)
- Update STADIUM_URL in stadium_curl.yml (10/25/2025)
- Update STADIUM_URL to new LesId (10/25/2025)

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
