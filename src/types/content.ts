/**
 * Content Schema Types
 *
 * Type definitions for blog post frontmatter, graph structures, and content validation
 */

export type ContentStatus = 'draft' | 'published';
export type PrivacyLevel = 'public' | 'internal';
export type NodeType = 'post' | 'skill' | 'pattern' | 'repo';
export type EdgeType = 'related' | 'uses' | 'implements' | 'extends';

/**
 * Frontmatter schema for blog posts
 */
export interface PostFrontmatter {
  title: string;
  date: string; // ISO date string
  status: ContentStatus;
  privacy: PrivacyLevel;
  tags: string[];
  repos: string[];
  skills: string[];
  patterns: string[];
  relatedTo: string[]; // Auto-populated by graph builder
  description?: string; // Optional SEO description
}

/**
 * Repository metadata extracted by scanner
 */
export interface RepoMetadata {
  repo: string;
  recentCommits: Commit[];
  detectedPatterns: string[];
  claudeSkills: string[];
  privacyLevel: PrivacyLevel;
  suggestedTags: string[];
  suggestedTitle: string;
  techStack: string[];
  lastUpdated: string; // ISO date string
}

/**
 * Git commit information
 */
export interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
}

/**
 * Knowledge graph node
 */
export interface Node {
  id: string;
  type: NodeType;
  title: string;
  tags: string[];
  path: string; // URL path
  date?: string; // For posts
}

/**
 * Knowledge graph edge
 */
export interface Edge {
  from: string; // node id
  to: string; // node id
  type: EdgeType;
  strength: number; // 0.0 - 1.0
  reason?: string; // Why this connection exists (for debugging)
}

/**
 * Complete knowledge graph structure
 */
export interface Graph {
  nodes: Node[];
  edges: Edge[];
  lastUpdated: string; // ISO date string
}

/**
 * Parsed markdown content
 */
export interface ParsedContent {
  frontmatter: PostFrontmatter;
  content: string;
  slug: string;
  filePath: string;
}

/**
 * Edge detection result
 */
export interface ConnectionScore {
  nodeA: string;
  nodeB: string;
  strength: number;
  reasons: string[];
  type: EdgeType;
}

/**
 * Scanner configuration
 */
export interface ScannerConfig {
  rootDir: string;
  outputDir: string;
  daysBack: number;
  minCommits: number;
  excludePatterns: string[];
}

/**
 * Graph builder configuration
 */
export interface GraphBuilderConfig {
  contentDir: string;
  outputPath: string;
  minStrength: number; // Minimum edge strength to include
  includeInternalPosts: boolean;
}
