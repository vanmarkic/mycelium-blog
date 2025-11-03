# Blog Workflow Integration Guide

## Overview

The blog-post-writer skill is now integrated into the blog-workflow, creating an automated pipeline from repository scanning to completed blog posts.

## Updated Workflow

### Before Integration

```
1. /blog:scan
   → Generate drafts with commit lists
   → Manual section writing required

2. /blog:review
   → Review incomplete drafts
   → More manual editing needed

3. /blog:graph → /blog:publish
```

### After Integration

```
1. /blog:scan
   → Generate drafts with commit lists
   → Add story prompts in comments

2. /blog:complete (NEW!)
   → Invoke blog-post-writer skill
   → Auto-complete story sections
   → Evidence-based narratives

3. /blog:review
   → Review completed, polished drafts
   → Minor edits only

4. /blog:graph → /blog:publish
```

## How It Works

### Phase 1: Scan Repos

The `scan-repos.ts` script:
- Analyzes git repositories
- Detects patterns, tech stack, Claude skills
- Generates draft files with:
  - Frontmatter (metadata)
  - Introduction paragraph
  - Story prompts (in comments)
  - Complete commit history

**Example output:**
```markdown
### Context: What I Was Building

[Describe the project goal and why you started this work...]

### The Challenge

[What made this difficult?...]
```

### Phase 2: Complete Drafts (NEW)

The `/blog:complete` command:
- Reads each draft file completely
- Analyzes commit patterns (features, fixes, refactoring)
- Invokes blog-post-writer skill for each draft
- Writes engaging story sections

**blog-post-writer applies:**
- **Evidence-based narrative** - stays grounded in commits
- **Conversational hooks** - starts with human moments
- **Progressive revelation** - builds understanding through comparison
- **First-person voice** - "I built", "I discovered", "I learned"

**Example output:**
```markdown
### Context: What I Was Building

I spent October refactoring a calculator system. Not because I wanted to—because TypeScript forced my hand. That void-returning function? It was a type bomb waiting to explode.

The commits show touchepas implementing a calculator system with a strategy pattern...
```

## Usage Examples

### Complete All Drafts

```bash
# After scanning repos
/blog:complete

# Or ask naturally
"Complete the draft posts"
```

### Complete Specific Draft

When invoking the blog-post-writer skill directly:

```
Read content/drafts/2025-11-02-claude-config.md

[Blog-post-writer skill analyzes the draft and writes story sections]
```

## Key Benefits

1. **Time savings**: Auto-generates 70% of blog content from commits
2. **Consistency**: Every post follows the same narrative structure
3. **Quality**: Evidence-based approach prevents unverified assumptions
4. **Privacy**: Respects internal/public classification automatically
5. **Engagement**: Uses proven narrative techniques from effective technical blogs

## Narrative Techniques Applied

The blog-post-writer integrates three effective styles:

### 1. Conversational (Ben Anderson)
- Personal, exploratory, thinks out loud
- Self-aware honesty about messiness
- Shows thought process, not just solutions

### 2. Pedagogical (Mark Seemann)
- Principled, builds arguments through evidence
- Progressive revelation through comparisons
- Anticipates and addresses objections

### 3. Contextual (Behind Genius Ventures)
- Multi-layered storytelling (implementation, purpose, ecosystem)
- Shows the "invisible" - hidden tradeoffs and reasoning
- Reveals alternative paths considered

## Privacy Compliance

**Public repos:**
- Full project details and context
- Real domain names
- Complete code examples

**Internal repos (dragancloudbizz/neo-*):**
- Generic titles: "Temporal Workflow Patterns" ✅
- Abstract descriptions: "orchestration platform" ✅
- Sanitized examples
- Focus on technical patterns only

The blog-post-writer skill enforces these rules automatically based on the `privacy` field in frontmatter.

## File Locations

**Skills:**
- `.claude/skills/blog-workflow/SKILL.md` - Main orchestrator
- `.claude/skills/blog-post-writer/SKILL.md` - Story section writer

**Commands:**
- `.claude/commands/blog-complete.md` - `/blog:complete` command

**Scripts:**
- `scripts/scan-repos.ts` - Repository scanner
- `scripts/build-graph.ts` - Knowledge graph builder

## Example Session

```
User: Scan my repos for new blog content

Claude: 🔍 Running repository scanner...
        ✅ Found 7 repositories with recent activity
        📝 Generated 5 draft posts in content/drafts/

User: Complete the drafts

Claude: 🤖 Invoking blog-post-writer skill for each draft...

        [Reads claude-config draft]
        [Analyzes 17 commits - 8 features, 2 fixes, 7 other]
        [Writes Context section with conversational hook]
        [Writes Challenge section showing TDD difficulties]
        [Writes Solution section with progressive revelation]
        [Writes Learned section with key takeaways]

        ✅ Completed 5 draft posts:
           - claude-config.md
           - credit-castor.md
           - deuxmains.md
           - loyer.brussels.md
           - stadium-check.md

User: Review the drafts

Claude: 📄 Showing completed drafts...
        [User reviews and approves]

User: Publish

Claude: 📦 Committing and pushing changes...
        🚀 Deployed!
```

## Next Steps

1. Try the new workflow:
   ```bash
   /blog:scan
   /blog:complete
   /blog:review
   ```

2. Review completed drafts to see the blog-post-writer output

3. Provide feedback to refine narrative style preferences

4. Build your mycelium knowledge graph with polished content!

## Troubleshooting

**Draft sections still have placeholders:**
- Ensure you ran `/blog:complete` after scanning
- Check that commit history is present in the draft

**Narrative style doesn't match expectations:**
- Review the blog-post-writer skill documentation
- Consider which style (conversational/pedagogical/contextual) fits best
- Provide examples of preferred style for refinement

**Privacy violations in internal posts:**
- Double-check the `privacy` field in frontmatter
- Review git remote detection in `privacy-filter.ts`
- Manually sanitize if needed before approving
