/**
 * Repository Scanner
 *
 * Scans git repositories for recent activity and generates blog post drafts
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { simpleGit, type SimpleGit, type LogResult } from 'simple-git';
import matter from 'gray-matter';
import type { RepoMetadata, Commit, PostFrontmatter } from '../src/types/content.js';
import { determinePrivacy, suggestGenericTitle } from './privacy-filter.js';

interface ScanConfig {
  rootDir: string;
  outputDir: string;
  daysBack: number;
  minCommits: number;
  excludePatterns: string[];
}

const DEFAULT_CONFIG: ScanConfig = {
  rootDir: path.join(process.env.HOME || '~', 'Documents'),
  outputDir: path.join(process.cwd(), 'content', 'drafts'),
  daysBack: 120,
  minCommits: 3,
  excludePatterns: ['node_modules', '.git', 'dist', 'build'],
};

/**
 * Scans for git repositories in a directory
 */
async function findGitRepos(dir: string, exclude: string[]): Promise<string[]> {
  const repos: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (exclude.some((pattern) => entry.name.includes(pattern))) continue;

      const fullPath = path.join(dir, entry.name);
      const gitPath = path.join(fullPath, '.git');

      try {
        await fs.access(gitPath);
        repos.push(fullPath);
      } catch {
        // Not a git repo, continue
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }

  return repos;
}

/**
 * Analyzes a git repository for recent activity
 */
async function analyzeRepo(repoPath: string, daysBack: number): Promise<RepoMetadata | null> {
  const git: SimpleGit = simpleGit(repoPath);
  const repoName = path.basename(repoPath);

  try {
    // Get recent commits
    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    const log: LogResult = await git.log({
      '--since': since.toISOString(),
      '--all': null,
    });

    if (log.all.length === 0) {
      return null;
    }

    // Convert commits to our format
    const commits: Commit[] = log.all.map((commit) => ({
      hash: commit.hash,
      message: commit.message,
      author: commit.author_name,
      date: commit.date,
      files: [],
    }));

    // Detect patterns and tech stack
    const detectedPatterns = await detectPatterns(repoPath, git);
    const techStack = await detectTechStack(repoPath);
    const claudeSkills = await detectClaudeSkills(repoPath);

    // Determine privacy
    const privacyLevel = await determinePrivacy(repoPath);

    // Generate suggestions
    const suggestedTags = generateTags(detectedPatterns, techStack);
    const suggestedTitle = generateTitle(repoName, detectedPatterns, techStack, privacyLevel);

    return {
      repo: repoName,
      recentCommits: commits,
      detectedPatterns,
      claudeSkills,
      privacyLevel,
      suggestedTags,
      suggestedTitle,
      techStack,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error analyzing repo ${repoName}:`, error);
    return null;
  }
}

/**
 * Detects architectural and code patterns in the repository
 */
async function detectPatterns(repoPath: string, git: SimpleGit): Promise<string[]> {
  const patterns: string[] = [];

  try {
    // Check for common patterns
    const files = await git.raw(['ls-files']);
    const fileList = files.split('\n');

    // Test patterns
    if (fileList.some((f) => f.includes('.test.') || f.includes('.spec.'))) {
      patterns.push('test-driven-development');
    }

    // Static site generation
    if (fileList.some((f) => f.includes('astro.config') || f.includes('next.config'))) {
      patterns.push('static-site-generation');
    }

    // Event sourcing
    if (fileList.some((f) => f.toLowerCase().includes('event') && f.includes('store'))) {
      patterns.push('event-sourcing');
    }

    // Functional programming
    if (fileList.some((f) => f.includes('pure') || f.includes('functional'))) {
      patterns.push('functional-programming');
    }

    // Microservices
    if (fileList.some((f) => f.includes('docker-compose') || f.includes('kubernetes'))) {
      patterns.push('microservices');
    }
  } catch (error) {
    console.error('Error detecting patterns:', error);
  }

  return patterns;
}

/**
 * Detects technology stack from package.json and other config files
 */
async function detectTechStack(repoPath: string): Promise<string[]> {
  const techStack: string[] = [];

  try {
    // Check package.json
    const packageJsonPath = path.join(repoPath, 'package.json');
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Map common dependencies to tech names
      const techMap: Record<string, string> = {
        react: 'React',
        vue: 'Vue',
        astro: 'Astro',
        next: 'Next.js',
        typescript: 'TypeScript',
        '@temporal/client': 'Temporal',
        vitest: 'Vitest',
        playwright: 'Playwright',
        tailwindcss: 'Tailwind CSS',
        'd3': 'D3.js',
      };

      for (const [dep, tech] of Object.entries(techMap)) {
        if (deps[dep]) {
          techStack.push(tech);
        }
      }
    } catch {
      // No package.json
    }

    // Check for other tech indicators
    const files = await fs.readdir(repoPath);
    if (files.includes('Cargo.toml')) techStack.push('Rust');
    if (files.includes('go.mod')) techStack.push('Go');
    if (files.includes('requirements.txt')) techStack.push('Python');
    if (files.includes('Gemfile')) techStack.push('Ruby');
  } catch (error) {
    console.error('Error detecting tech stack:', error);
  }

  return [...new Set(techStack)];
}

/**
 * Finds Claude Code skills in the repository
 */
async function detectClaudeSkills(repoPath: string): Promise<string[]> {
  const skills: string[] = [];

  try {
    const claudeDir = path.join(repoPath, '.claude', 'skills');
    try {
      const skillDirs = await fs.readdir(claudeDir);
      skills.push(...skillDirs);
    } catch {
      // No .claude/skills directory
    }
  } catch (error) {
    console.error('Error detecting Claude skills:', error);
  }

  return skills;
}

/**
 * Generates tags from patterns and tech stack
 */
function generateTags(patterns: string[], techStack: string[]): string[] {
  const tags = [...patterns, ...techStack.map((t) => t.toLowerCase().replace(/\s+/g, '-'))];
  return [...new Set(tags)];
}

/**
 * Generates a title based on repo analysis
 */
function generateTitle(
  repoName: string,
  patterns: string[],
  techStack: string[],
  privacy: 'public' | 'internal'
): string {
  if (privacy === 'internal') {
    return suggestGenericTitle(repoName, patterns, techStack);
  }

  // For public repos, use descriptive title
  const tech = techStack[0] || 'Development';
  const pattern = patterns[0] || 'Project';

  return `Building ${repoName} with ${tech} and ${pattern}`;
}

/**
 * Analyzes commit messages to detect story patterns
 */
interface CommitStory {
  features: Commit[];
  fixes: Commit[];
  refactoring: Commit[];
  docs: Commit[];
  tests: Commit[];
  other: Commit[];
}

function analyzeCommitPatterns(commits: Commit[]): CommitStory {
  const story: CommitStory = {
    features: [],
    fixes: [],
    refactoring: [],
    docs: [],
    tests: [],
    other: [],
  };

  const featureWords = /^(feat|feature|add|implement|create|build)/i;
  const fixWords = /^(fix|bugfix|patch|resolve|correct)/i;
  const refactorWords = /^(refactor|refine|improve|optimize|enhance|clean)/i;
  const docsWords = /^(docs|documentation|readme|comment)/i;
  const testWords = /^(test|spec|coverage)/i;

  for (const commit of commits) {
    const msg = commit.message.toLowerCase();
    if (featureWords.test(msg)) story.features.push(commit);
    else if (fixWords.test(msg)) story.fixes.push(commit);
    else if (refactorWords.test(msg)) story.refactoring.push(commit);
    else if (docsWords.test(msg)) story.docs.push(commit);
    else if (testWords.test(msg)) story.tests.push(commit);
    else story.other.push(commit);
  }

  return story;
}

/**
 * Generates narrative text from commit patterns
 */
function generateNarrative(metadata: RepoMetadata): string {
  const story = analyzeCommitPatterns(metadata.recentCommits);
  const totalCommits = metadata.recentCommits.length;

  let narrative = '';

  // Opening: Set the context
  if (story.features.length > 0) {
    const featureCount = story.features.length;
    const percentage = Math.round((featureCount / totalCommits) * 100);
    narrative += `Over the past month, **${totalCommits} commits** shaped ${metadata.repo}, with ${percentage}% focused on building new features. `;
  } else {
    narrative += `Over the past month, **${totalCommits} commits** refined ${metadata.repo}. `;
  }

  // Tech context
  if (metadata.techStack.length > 0) {
    narrative += `The project leverages **${metadata.techStack.join(', ')}**`;
    if (metadata.detectedPatterns.length > 0) {
      narrative += `, applying patterns like **${metadata.detectedPatterns.join(', ')}** to solve real-world problems.\n\n`;
    } else {
      narrative += ` to tackle complex challenges.\n\n`;
    }
  }

  return narrative;
}

/**
 * Generates story-driven section prompts
 */
function generateStoryPrompts(metadata: RepoMetadata): string {
  const story = analyzeCommitPatterns(metadata.recentCommits);

  let prompts = '## The Story\n\n';
  prompts += '<!-- Review the commit history below and tell the story of this work:\n\n';
  prompts += '1. **Context**: What problem were you trying to solve? What was the goal?\n';
  prompts += '2. **Challenge**: What obstacles did you encounter? What made this interesting?\n';
  prompts += '3. **Solution**: How did you approach the problem? What decisions did you make?\n';
  prompts += '4. **Outcome**: What did you learn? What would you do differently?\n\n';

  // Provide specific commit insights to help tell the story
  if (story.features.length > 0) {
    prompts += `Notable features built:\n`;
    story.features.slice(0, 3).forEach(c => {
      prompts += `- ${c.message} (${new Date(c.date).toLocaleDateString()})\n`;
    });
    prompts += '\n';
  }

  if (story.fixes.length > 0) {
    prompts += `Challenges overcome:\n`;
    story.fixes.slice(0, 3).forEach(c => {
      prompts += `- ${c.message} (${new Date(c.date).toLocaleDateString()})\n`;
    });
    prompts += '\n';
  }

  if (story.refactoring.length > 0) {
    prompts += `Evolution and refinement:\n`;
    story.refactoring.slice(0, 3).forEach(c => {
      prompts += `- ${c.message} (${new Date(c.date).toLocaleDateString()})\n`;
    });
    prompts += '\n';
  }

  prompts += '-->\n\n';
  prompts += '### Context: What I Was Building\n\n';
  prompts += `[Describe the project goal and why you started this work. What problem does ${metadata.repo} solve?]\n\n`;

  prompts += '### The Challenge\n\n';
  prompts += '[What made this difficult? What trade-offs did you face? What surprised you?]\n\n';

  prompts += '### How I Solved It\n\n';
  prompts += '[Walk through your approach. Show key code, explain decisions, highlight insights.]\n\n';

  if (story.features.length > 0 || story.refactoring.length > 0) {
    prompts += '```typescript\n';
    prompts += '// Show a meaningful code snippet that tells the story\n';
    prompts += '// This could be a key function, an interesting pattern, or a clever solution\n';
    prompts += '```\n\n';
  }

  prompts += '### What I Learned\n\n';
  prompts += '[Key takeaways, lessons learned, what you\'d do differently next time]\n\n';

  return prompts;
}

/**
 * Generates a markdown draft from repository metadata
 */
function generateDraft(metadata: RepoMetadata): string {
  const today = new Date().toISOString().split('T')[0];

  const frontmatter: PostFrontmatter = {
    title: metadata.suggestedTitle,
    date: today,
    status: 'draft',
    privacy: metadata.privacyLevel,
    tags: metadata.suggestedTags,
    repos: [metadata.repo],
    skills: metadata.claudeSkills,
    patterns: metadata.detectedPatterns,
    relatedTo: [],
    description: `Exploring ${metadata.detectedPatterns.join(', ') || 'development patterns'} in ${metadata.repo}`,
  };

  const narrative = generateNarrative(metadata);
  const storyPrompts = generateStoryPrompts(metadata);

  const content = `## Introduction

${narrative}

${storyPrompts}

## Technical Details

**Stack**: ${metadata.techStack.join(', ') || 'Not detected'}
**Patterns**: ${metadata.detectedPatterns.join(', ') || 'None detected'}
${metadata.claudeSkills.length > 0 ? `**Claude Skills**: ${metadata.claudeSkills.join(', ')}` : ''}

## All Commits (${metadata.recentCommits.length})

${metadata.recentCommits
  .map(
    (commit) => `- ${commit.message} (${new Date(commit.date).toLocaleDateString()})`
  )
  .join('\n')}

## Mycelium Links

<!-- Will be auto-populated by the graph builder -->
`;

  return matter.stringify(content, frontmatter);
}

/**
 * Main scanner function
 */
async function scanRepositories(config: ScanConfig = DEFAULT_CONFIG): Promise<void> {
  console.log('🔍 Scanning repositories...\n');

  // Find all git repos
  const repos = await findGitRepos(config.rootDir, config.excludePatterns);
  console.log(`Found ${repos.length} repositories\n`);

  // Analyze each repo
  const analyses: RepoMetadata[] = [];
  for (const repo of repos) {
    const analysis = await analyzeRepo(repo, config.daysBack);
    if (analysis && analysis.recentCommits.length >= config.minCommits) {
      analyses.push(analysis);
      console.log(`✓ ${analysis.repo} (${analysis.recentCommits.length} commits)`);
    }
  }

  console.log(`\n📝 Generating ${analyses.length} draft posts...\n`);

  // Generate drafts
  await fs.mkdir(config.outputDir, { recursive: true });

  for (const analysis of analyses) {
    const filename = `${analysis.lastUpdated.split('T')[0]}-${analysis.repo}.md`;
    const filepath = path.join(config.outputDir, filename);

    // Check if draft already exists
    try {
      await fs.access(filepath);
      console.log(`⊘ Skipped ${filename} (already exists)`);
      continue;
    } catch {
      // File doesn't exist, create it
    }

    const draft = generateDraft(analysis);
    await fs.writeFile(filepath, draft, 'utf-8');
    console.log(`✓ Created ${filename}`);
  }

  console.log('\n✅ Scan complete!');
  console.log(`\nNext steps:`);
  console.log(`1. Review drafts in ${config.outputDir}`);
  console.log(`2. Edit and approve drafts`);
  console.log(`3. Move approved drafts to content/posts/`);
  console.log(`4. Run 'npm run graph' to build connections`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scanRepositories().catch(console.error);
}

export { scanRepositories, analyzeRepo, findGitRepos };
