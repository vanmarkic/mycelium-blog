/**
 * Graph Builder
 *
 * Builds a knowledge graph by detecting connections between posts, skills, and patterns
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type {
  Graph,
  Node,
  Edge,
  ConnectionScore,
  PostFrontmatter,
  EdgeType,
} from '../src/types/content.js';

interface BuildConfig {
  contentDir: string;
  outputPath: string;
  minStrength: number;
  includeInternalPosts: boolean;
}

const DEFAULT_CONFIG: BuildConfig = {
  contentDir: path.join(process.cwd(), 'content'),
  outputPath: path.join(process.cwd(), 'public', 'graph.json'),
  minStrength: 0.3,
  includeInternalPosts: true,
};

/**
 * Loads all content files and creates nodes
 */
async function loadContent(contentDir: string): Promise<Node[]> {
  const nodes: Node[] = [];

  const contentTypes = ['posts', 'skills', 'patterns'];

  for (const type of contentTypes) {
    const dir = path.join(contentDir, type);

    try {
      const files = await fs.readdir(dir);
      const markdownFiles = files.filter((f) => f.endsWith('.md'));

      for (const file of markdownFiles) {
        const filePath = path.join(dir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(content);

        const frontmatter = data as PostFrontmatter;
        const slug = path.basename(file, '.md');

        nodes.push({
          id: slug,
          type: type.slice(0, -1) as 'post' | 'skill' | 'pattern',
          title: frontmatter.title,
          tags: frontmatter.tags || [],
          path: `/${type}/${slug}`,
          date: frontmatter.date,
        });
      }
    } catch (error) {
      // Directory might not exist
      console.warn(`Could not load ${type}:`, error);
    }
  }

  return nodes;
}

/**
 * Calculates connection strength between two nodes based on shared attributes
 */
function calculateConnection(
  nodeA: Node,
  nodeB: Node,
  allContent: Map<string, PostFrontmatter>
): ConnectionScore | null {
  if (nodeA.id === nodeB.id) return null;

  const reasons: string[] = [];
  let totalStrength = 0;

  const frontmatterA = allContent.get(nodeA.id);
  const frontmatterB = allContent.get(nodeB.id);

  if (!frontmatterA || !frontmatterB) return null;

  // 1. Tag overlap (0.0 - 1.0)
  const tagsA = new Set(nodeA.tags);
  const tagsB = new Set(nodeB.tags);
  const sharedTags = [...tagsA].filter((tag) => tagsB.has(tag));

  if (sharedTags.length > 0) {
    const minTags = Math.min(tagsA.size, tagsB.size);
    const tagStrength = sharedTags.length / minTags;
    totalStrength += tagStrength * 0.4; // 40% weight
    reasons.push(`${sharedTags.length} shared tags`);
  }

  // 2. Shared repos (0.7 strength)
  const reposA = new Set(frontmatterA.repos || []);
  const reposB = new Set(frontmatterB.repos || []);
  const sharedRepos = [...reposA].filter((repo) => reposB.has(repo));

  if (sharedRepos.length > 0) {
    totalStrength += 0.7 * 0.3; // 30% weight
    reasons.push(`shared repos: ${sharedRepos.join(', ')}`);
  }

  // 3. Shared skills (1.0 strength - explicit connection)
  const skillsA = new Set(frontmatterA.skills || []);
  const skillsB = new Set(frontmatterB.skills || []);
  const sharedSkills = [...skillsA].filter((skill) => skillsB.has(skill));

  if (sharedSkills.length > 0) {
    totalStrength += 1.0 * 0.2; // 20% weight
    reasons.push(`shared skills: ${sharedSkills.join(', ')}`);
  }

  // 4. Shared patterns (0.8 strength)
  const patternsA = new Set(frontmatterA.patterns || []);
  const patternsB = new Set(frontmatterB.patterns || []);
  const sharedPatterns = [...patternsA].filter((pattern) => patternsB.has(pattern));

  if (sharedPatterns.length > 0) {
    totalStrength += 0.8 * 0.25; // 25% weight
    reasons.push(`shared patterns: ${sharedPatterns.join(', ')}`);
  }

  // 5. Temporal proximity (if both have dates)
  if (nodeA.date && nodeB.date) {
    const dateA = new Date(nodeA.date);
    const dateB = new Date(nodeB.date);
    const daysDiff = Math.abs(dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff < 30) {
      const temporalStrength = 1 - daysDiff / 30; // Decay over 30 days
      totalStrength += temporalStrength * 0.1; // 10% weight
      reasons.push('recent proximity');
    }
  }

  // Determine edge type based on node types
  let edgeType: EdgeType = 'related';
  if (nodeA.type === 'post' && nodeB.type === 'skill') edgeType = 'uses';
  if (nodeA.type === 'post' && nodeB.type === 'pattern') edgeType = 'implements';
  if (nodeA.type === 'pattern' && nodeB.type === 'pattern') edgeType = 'extends';

  if (totalStrength > 0) {
    return {
      nodeA: nodeA.id,
      nodeB: nodeB.id,
      strength: Math.min(totalStrength, 1.0),
      reasons,
      type: edgeType,
    };
  }

  return null;
}

/**
 * Builds edges between all nodes
 */
function buildEdges(
  nodes: Node[],
  allContent: Map<string, PostFrontmatter>,
  minStrength: number
): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const connection = calculateConnection(nodes[i], nodes[j], allContent);

      if (connection && connection.strength >= minStrength) {
        edges.push({
          from: connection.nodeA,
          to: connection.nodeB,
          type: connection.type,
          strength: connection.strength,
          reason: connection.reasons.join(', '),
        });
      }
    }
  }

  return edges;
}

/**
 * Updates frontmatter with relatedTo connections
 */
async function updateFrontmatter(contentDir: string, edges: Edge[]): Promise<void> {
  const relatedMap = new Map<string, string[]>();

  // Build map of connections
  for (const edge of edges) {
    if (!relatedMap.has(edge.from)) relatedMap.set(edge.from, []);
    if (!relatedMap.has(edge.to)) relatedMap.set(edge.to, []);

    relatedMap.get(edge.from)!.push(edge.to);
    relatedMap.get(edge.to)!.push(edge.from);
  }

  // Update files
  const contentTypes = ['posts', 'skills', 'patterns'];

  for (const type of contentTypes) {
    const dir = path.join(contentDir, type);

    try {
      const files = await fs.readdir(dir);
      const markdownFiles = files.filter((f) => f.endsWith('.md'));

      for (const file of markdownFiles) {
        const slug = path.basename(file, '.md');
        const related = relatedMap.get(slug) || [];

        if (related.length > 0) {
          const filePath = path.join(dir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const { data, content: markdown } = matter(content);

          data.relatedTo = related;

          const updated = matter.stringify(markdown, data);
          await fs.writeFile(filePath, updated, 'utf-8');

          console.log(`✓ Updated ${slug} with ${related.length} connections`);
        }
      }
    } catch (error) {
      console.warn(`Could not update ${type}:`, error);
    }
  }
}

/**
 * Main graph builder function
 */
async function buildGraph(config: BuildConfig = DEFAULT_CONFIG): Promise<void> {
  console.log('🕸️  Building knowledge graph...\n');

  // Load all content
  const nodes = await loadContent(config.contentDir);
  console.log(`Found ${nodes.length} nodes\n`);

  // Load frontmatter for all content
  const allContent = new Map<string, PostFrontmatter>();
  const contentTypes = ['posts', 'skills', 'patterns'];

  for (const type of contentTypes) {
    const dir = path.join(config.contentDir, type);
    try {
      const files = await fs.readdir(dir);
      for (const file of files.filter((f) => f.endsWith('.md'))) {
        const content = await fs.readFile(path.join(dir, file), 'utf-8');
        const { data } = matter(content);
        const slug = path.basename(file, '.md');
        allContent.set(slug, data as PostFrontmatter);
      }
    } catch {
      // Directory doesn't exist
    }
  }

  // Build edges
  const edges = buildEdges(nodes, allContent, config.minStrength);
  console.log(`Generated ${edges.length} connections\n`);

  // Create graph object
  const graph: Graph = {
    nodes,
    edges,
    lastUpdated: new Date().toISOString(),
  };

  // Write graph to file
  await fs.mkdir(path.dirname(config.outputPath), { recursive: true });
  await fs.writeFile(config.outputPath, JSON.stringify(graph, null, 2), 'utf-8');
  console.log(`✓ Graph written to ${config.outputPath}\n`);

  // Update frontmatter with connections
  console.log('Updating frontmatter with connections...\n');
  await updateFrontmatter(config.contentDir, edges);

  console.log('\n✅ Graph build complete!');

  // Print statistics
  console.log('\n📊 Statistics:');
  console.log(`  Nodes: ${nodes.length}`);
  console.log(`  Edges: ${edges.length}`);
  console.log(`  Avg connections per node: ${(edges.length * 2 / nodes.length).toFixed(1)}`);

  const strongEdges = edges.filter((e) => e.strength > 0.7).length;
  console.log(`  Strong connections (>0.7): ${strongEdges}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildGraph().catch(console.error);
}

export { buildGraph, calculateConnection, buildEdges };
