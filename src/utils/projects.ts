import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface Project {
  slug: string;
  title: string;
  emoji: string;
  color: string;
  category: string;
  tagline: string;
  website: string;
  status: string;
  fundingGoal: number;
  fundingCurrency: string;
  fundingPeriod: string;
  screenshot?: string;
  illustration?: string;
  content: string;
  htmlContent: string;
}

const projectsDir = join(process.cwd(), 'content', 'projects');

export function getAllProjects(): Project[] {
  try {
    const files = readdirSync(projectsDir);
    const projects = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = join(projectsDir, file);
        const fileContents = readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          ...data,
          content,
          htmlContent: marked(content),
        } as Project;
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    return projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const filePath = join(projectsDir, `${slug}.md`);
    const fileContents = readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      content,
      htmlContent: marked(content),
    } as Project;
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}
