/**
 * Markdown Loading and Parsing Utilities
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { PostFrontmatter, ParsedContent } from '../types/content';
import { validateFrontmatter } from './validation';

/**
 * Loads and parses a markdown file
 */
export async function loadMarkdownFile(filePath: string): Promise<ParsedContent> {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);

  // Validate frontmatter
  const validation = validateFrontmatter(data);
  if (!validation.valid) {
    throw new Error(
      `Invalid frontmatter in ${filePath}:\n${validation.errors.map((e) => `  - ${e.field}: ${e.message}`).join('\n')}`
    );
  }

  const slug = path.basename(filePath, '.md');

  // Convert markdown to HTML
  const htmlContent = await marked(markdownContent);

  return {
    frontmatter: data as PostFrontmatter,
    content: htmlContent,
    slug,
    filePath,
  };
}

/**
 * Loads all markdown files from a directory
 */
export async function loadMarkdownFiles(dirPath: string): Promise<ParsedContent[]> {
  try {
    const files = await fs.readdir(dirPath);
    const markdownFiles = files.filter((file) => file.endsWith('.md'));

    const contents = await Promise.all(
      markdownFiles.map((file) => loadMarkdownFile(path.join(dirPath, file)))
    );

    // Sort by date descending
    return contents.sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Gets all published posts
 */
export async function getPublishedPosts(contentDir: string): Promise<ParsedContent[]> {
  const posts = await loadMarkdownFiles(path.join(contentDir, 'posts'));
  return posts.filter((post) => post.frontmatter.status === 'published');
}

/**
 * Gets all draft posts
 */
export async function getDraftPosts(contentDir: string): Promise<ParsedContent[]> {
  const posts = await loadMarkdownFiles(path.join(contentDir, 'drafts'));
  return posts;
}

/**
 * Gets all skills
 */
export async function getSkills(contentDir: string): Promise<ParsedContent[]> {
  return loadMarkdownFiles(path.join(contentDir, 'skills'));
}

/**
 * Gets all patterns
 */
export async function getPatterns(contentDir: string): Promise<ParsedContent[]> {
  return loadMarkdownFiles(path.join(contentDir, 'patterns'));
}

/**
 * Gets a single post by slug
 */
export async function getPostBySlug(
  contentDir: string,
  slug: string
): Promise<ParsedContent | null> {
  const postsDir = path.join(contentDir, 'posts');
  const filePath = path.join(postsDir, `${slug}.md`);

  try {
    return await loadMarkdownFile(filePath);
  } catch {
    return null;
  }
}
