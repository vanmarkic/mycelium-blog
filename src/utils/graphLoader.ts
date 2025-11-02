/**
 * Graph Loader Utility
 *
 * Loads and queries the knowledge graph
 */

import type { Graph, Node, Edge } from '../types/content';

let cachedGraph: Graph | null = null;

/**
 * Loads the graph from the JSON file
 */
export async function loadGraph(): Promise<Graph> {
  if (cachedGraph) {
    return cachedGraph;
  }

  try {
    const response = await fetch('/graph.json');
    if (!response.ok) {
      throw new Error(`Failed to load graph: ${response.statusText}`);
    }
    cachedGraph = await response.json();
    return cachedGraph;
  } catch (error) {
    console.error('Error loading graph:', error);
    return { nodes: [], edges: [], lastUpdated: new Date().toISOString() };
  }
}

/**
 * Gets all connections for a specific node
 */
export function getConnections(graph: Graph, nodeId: string): { nodes: Node[]; edges: Edge[] } {
  const connectedEdges = graph.edges.filter(
    (edge) => edge.from === nodeId || edge.to === nodeId
  );

  const connectedNodeIds = new Set<string>();
  for (const edge of connectedEdges) {
    connectedNodeIds.add(edge.from === nodeId ? edge.to : edge.from);
  }

  const connectedNodes = graph.nodes.filter((node) => connectedNodeIds.has(node.id));

  return {
    nodes: connectedNodes,
    edges: connectedEdges,
  };
}

/**
 * Finds the shortest path between two nodes using BFS
 */
export function findPath(graph: Graph, startId: string, endId: string): string[] | null {
  if (startId === endId) return [startId];

  const adjacencyList = new Map<string, string[]>();

  // Build adjacency list
  for (const edge of graph.edges) {
    if (!adjacencyList.has(edge.from)) adjacencyList.set(edge.from, []);
    if (!adjacencyList.has(edge.to)) adjacencyList.set(edge.to, []);

    adjacencyList.get(edge.from)!.push(edge.to);
    adjacencyList.get(edge.to)!.push(edge.from);
  }

  // BFS
  const queue: { nodeId: string; path: string[] }[] = [{ nodeId: startId, path: [startId] }];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;

    if (nodeId === endId) {
      return path;
    }

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ nodeId: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null; // No path found
}

/**
 * Gets nodes by type
 */
export function getNodesByType(graph: Graph, type: Node['type']): Node[] {
  return graph.nodes.filter((node) => node.type === type);
}

/**
 * Gets the most connected nodes (hubs)
 */
export function getHubs(graph: Graph, limit: number = 5): Node[] {
  const connectionCounts = new Map<string, number>();

  for (const edge of graph.edges) {
    connectionCounts.set(edge.from, (connectionCounts.get(edge.from) || 0) + 1);
    connectionCounts.set(edge.to, (connectionCounts.get(edge.to) || 0) + 1);
  }

  const sorted = [...connectionCounts.entries()].sort((a, b) => b[1] - a[1]);

  return sorted
    .slice(0, limit)
    .map(([nodeId]) => graph.nodes.find((n) => n.id === nodeId)!)
    .filter(Boolean);
}

/**
 * Gets nodes by tag
 */
export function getNodesByTag(graph: Graph, tag: string): Node[] {
  return graph.nodes.filter((node) => node.tags.includes(tag));
}

/**
 * Gets all unique tags from the graph
 */
export function getAllTags(graph: Graph): string[] {
  const tags = new Set<string>();
  for (const node of graph.nodes) {
    for (const tag of node.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

/**
 * Searches nodes by title
 */
export function searchNodes(graph: Graph, query: string): Node[] {
  const lowerQuery = query.toLowerCase();
  return graph.nodes.filter((node) => node.title.toLowerCase().includes(lowerQuery));
}

/**
 * Gets graph statistics
 */
export function getGraphStats(graph: Graph): {
  nodeCount: number;
  edgeCount: number;
  avgConnections: number;
  strongConnections: number;
  isolatedNodes: number;
} {
  const connectionCounts = new Map<string, number>();

  for (const edge of graph.edges) {
    connectionCounts.set(edge.from, (connectionCounts.get(edge.from) || 0) + 1);
    connectionCounts.set(edge.to, (connectionCounts.get(edge.to) || 0) + 1);
  }

  const isolatedNodes = graph.nodes.filter((node) => !connectionCounts.has(node.id)).length;
  const strongConnections = graph.edges.filter((edge) => edge.strength > 0.7).length;

  return {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    avgConnections: graph.nodes.length > 0 ? (graph.edges.length * 2) / graph.nodes.length : 0,
    strongConnections,
    isolatedNodes,
  };
}
