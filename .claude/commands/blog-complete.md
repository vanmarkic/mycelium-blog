---
description: Complete blog post drafts using blog-post-writer skill to write story sections
---

# Complete Blog Post Drafts

You are completing blog post drafts by using the **blog-post-writer skill** to write engaging story sections.

## Your Task

1. **Find all draft files:**
   - Look in `content/drafts/` directory
   - Identify drafts that have empty or placeholder sections

2. **For each draft file:**
   - Read the complete draft (frontmatter + commit history)
   - Invoke the `blog-post-writer` skill to complete the four story sections:
     - Context: What I Was Building
     - Challenge: What made it difficult
     - Solution: How I approached it
     - Learned: Key takeaways

3. **Use evidence-based narrative:**
   - Analyze commit patterns (features, fixes, refactoring)
   - Stay grounded in what commits actually show
   - Don't make unverified assumptions about business context
   - Use first-person voice: "I built", "I discovered", "I learned"
   - **CRITICAL: Do NOT mention "commits", "git history", or meta-analysis in the blog output**

4. **Apply narrative techniques:**
   - Conversational hooks (start with human moments)
   - Self-aware honesty (acknowledge messiness)
   - Show the thought process (not just solutions)
   - Progressive revelation (build understanding through comparison)
   - Write naturally as if recounting from memory

5. **Report completion:**
   ```
   ✅ Completed [N] draft posts:
      - content/drafts/[filename1].md
      - content/drafts/[filename2].md
      ...

   🤖 NEXT: Run /blog:review to review completed drafts
   ```

## Important Guidelines

- **Privacy:** For internal repos (dragancloudbizz/neo-*), use generic descriptions only
- **Evidence-based:** Only describe what's visible in commits
- **First-person:** Write as "I", not "we" or "the developer"
- **Engaging:** Use conversational, pedagogical, or contextual styles
- **No invention:** Don't create fake code examples if you don't have repo access
- **No meta-references:** Never write "the commits show", "git history", "looking at the log", etc.

## Example

A draft with placeholder sections:
```markdown
### Context: What I Was Building

[Describe the project goal...]

### The Challenge

[What made this difficult?...]
```

Should become:
```markdown
### Context: What I Was Building

I spent October refactoring a calculator system. Not because I wanted to—because TypeScript forced my hand. That void-returning function? It was a type bomb waiting to explode.

The project implements calculation logic with a strategy pattern. Looking at the commits, I added a BrusselsCalculator first, then built a registry dispatcher. The progression suggests I was building for multiple calculation approaches from the start.

### The Challenge

The first version worked. Sort of. It passed tests, but I knew it was fragile...
```

## Invoke the blog-post-writer Skill

Use the blog-post-writer skill for each draft file that needs completion.
