---
title: Building stadium-check with Development and Project
date: '2025-11-02'
status: draft
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

I wanted to book stadium fitness classes without manually checking availability. Stadium-check automates that: it monitors class schedules, checks for open spots, and notifies when classes I want become available. The system runs on GitHub Actions with a cron schedule, checking every few minutes.

The commits show the evolution from basic scheduling to configuration-driven checks. Early work focused on getting the cron job running and updating class IDs when they changed. Later work added flexibility: fetching configuration from Notion (instead of hardcoding), checking multiple days ahead, and handling edge cases like missing lesson data.

The project uses a mix of JSON-based configuration and Notion API integration. The commit "disable json based scripts" suggests I migrated from local JSON config to Notion, probably to make configuration changes without redeploying.

### The Challenge

The configuration management problem emerged quickly. The commits show iteration: "add config file" → "fetch config from notion" → "make name and id optional" → "disable json based scripts." This suggests the initial JSON approach was too rigid. Changing which classes to monitor required code changes and redeploys. Notion as a config backend solved this—update a database, the next cron run picks up changes.

The Notion API integration had issues. The commits "fix notion api connection" and "fix notion scritp" (typo in original) show I was fighting authentication or API changes. Notion's API is versioned, and breaking changes between versions can break scripts silently.

The class ID volatility was annoying. The commits "Update STADIUM_URL to new LesId" (twice) and "Change cron schedule to every 10 minutes" show class IDs changed unexpectedly. This breaks hardcoded checks—suddenly you're monitoring a class that no longer exists. The fix was making IDs configurable, but that doesn't solve the root issue: external APIs change without warning.

The "found spots not found" bug suggests a logic error in availability detection. The commit "fix found spots not found bug" doesn't detail the issue, but it's likely a false negative: the script thought no spots were available when spots actually existed. This would cause missed booking opportunities.

### How I Solved It

I started with the basics: a cron job that checks a specific class URL and reports availability. The early commits show incremental changes to scheduling (every 10 minutes instead of longer intervals) and adapting to class ID changes.

The Notion integration came later. The commit "fetch config from notion" shows I moved configuration to a Notion database. This meant the script queries Notion for which classes to monitor, then checks those classes. The "make name and id optional" commit added flexibility—not every class needs both fields, probably to support different lesson types.

The gitignore commit ("add gitignore") came surprisingly late, suggesting I was committing sensitive data early (like Notion API keys in a config file). The "disable json based scripts" commit cleaned this up—moving to Notion means no local config files with secrets.

The time window expansion ("check for lessons in the next 3 days") made the system more useful. Instead of only checking today's classes, it looks ahead, catching availability further out. This increases the chance of finding open spots.

The bodyPump-specific commits ("disable bodypump" → "enable bodypump") suggest I was toggling individual class monitoring. This is a quick fix for noisy alerts—if a class consistently has spots, disable monitoring to reduce notifications.

### What I Learned

External APIs require defensive configuration. Hardcoding class IDs breaks when IDs change. Using Notion as a config backend solved this—IDs are data, not code. But it introduced a new dependency: the script now depends on Notion's API being available and stable.

Cron frequency is a trade-off. Every 10 minutes means faster alerts but higher API usage. For class booking, faster is better—popular classes fill quickly. But if the stadium's API rate-limits, you might get blocked. I didn't see rate limit commits, so 10 minutes seems safe.

The "found spots not found" bug reminded me to test detection logic thoroughly. Availability checks are boolean (spots exist or they don't), but the implementation can be fragile. Off-by-one errors, incorrect parsing, or API response changes can cause false negatives. Logging the raw API response would help debug these faster.

The gitignore commit came too late. Committing secrets (even temporarily) is risky—they live in git history forever unless you rewrite commits. Next time: add `.gitignore` in the first commit, before adding any config files.



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
