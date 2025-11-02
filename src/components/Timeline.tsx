/**
 * Timeline Component
 *
 * Chronological view of content
 */

import type { Node } from '../types/content';

interface TimelineProps {
  nodes: Node[];
}

export default function Timeline({ nodes }: TimelineProps) {
  // Filter and sort nodes by date
  const sortedNodes = nodes
    .filter((node) => node.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  // Group by month
  const byMonth = sortedNodes.reduce(
    (acc, node) => {
      const date = new Date(node.date!);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(node);
      return acc;
    },
    {} as Record<string, Node[]>
  );

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Timeline</h2>
      <div className="space-y-8">
        {Object.entries(byMonth).map(([monthKey, monthNodes]) => {
          const [year, month] = monthKey.split('-');
          const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString(
            'en-US',
            { month: 'long', year: 'numeric' }
          );

          return (
            <div key={monthKey}>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">{monthName}</h3>
              <div className="space-y-2 pl-4 border-l-2 border-gray-700">
                {monthNodes.map((node) => (
                  <a
                    key={node.id}
                    href={node.path}
                    className="block p-3 hover:bg-gray-800 rounded transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            node.type === 'post'
                              ? 'bg-mycelium-400'
                              : node.type === 'skill'
                                ? 'bg-mycelium-500'
                                : 'bg-mycelium-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-mycelium-400 group-hover:text-mycelium-300 transition-colors font-medium">
                          {node.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          {node.type} • {new Date(node.date!).toLocaleDateString()}
                        </div>
                        {node.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {node.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
