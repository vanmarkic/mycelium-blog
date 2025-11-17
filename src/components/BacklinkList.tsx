/**
 * Backlink List Component
 *
 * Displays bidirectional links to related content
 */

import type { Node, Edge } from '../types/content';

interface BacklinkListProps {
  nodeId: string;
  connections: {
    nodes: Node[];
    edges: Edge[];
  };
}

export default function BacklinkList({ nodeId, connections }: BacklinkListProps) {
  if (connections.nodes.length === 0) {
    return null;
  }

  // Group connections by type
  const byType = connections.nodes.reduce(
    (acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    },
    {} as Record<string, Node[]>
  );

  // Get connection strength for each node
  const getStrength = (targetNodeId: string): number => {
    const edge = connections.edges.find(
      (e) =>
        (e.from === nodeId && e.to === targetNodeId) || (e.from === targetNodeId && e.to === nodeId)
    );
    return edge?.strength || 0;
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">🍄 Mycelium Links</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Connected through shared concepts, tools, and patterns</p>

      <div className="space-y-6">
        {Object.entries(byType).map(([type, nodes]) => (
          <div key={type}>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 capitalize">
              {type === 'post' ? 'Related Posts' : `Related ${type}s`}
            </h3>
            <div className="space-y-2">
              {nodes
                .sort((a, b) => getStrength(b.id) - getStrength(a.id))
                .map((node) => {
                  const strength = getStrength(node.id);
                  const edge = connections.edges.find(
                    (e) =>
                      (e.from === nodeId && e.to === node.id) ||
                      (e.from === node.id && e.to === nodeId)
                  );

                  return (
                    <a
                      key={node.id}
                      href={node.path}
                      className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-750 hover:border-mycelium-600 border border-transparent transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-mycelium-600 dark:text-mycelium-400 group-hover:text-mycelium-700 dark:group-hover:text-mycelium-300 transition-colors font-medium">
                            {node.title}
                          </h4>
                          {edge?.reason && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              Connected by: {edge.reason}
                            </p>
                          )}
                          {node.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {node.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div
                            className="w-16 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden"
                            title={`Connection strength: ${(strength * 100).toFixed(0)}%`}
                          >
                            <div
                              className="h-full bg-mycelium-500"
                              style={{ width: `${strength * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block text-right">
                            {(strength * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
