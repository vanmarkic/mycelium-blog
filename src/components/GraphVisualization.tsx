/**
 * Graph Visualization Component
 *
 * Interactive D3.js force-directed graph visualization
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Graph, Node, Edge } from '../types/content';

interface GraphVisualizationProps {
  graph: Graph;
  width?: number;
  height?: number;
  highlightedNode?: string | null;
}

interface SimulationNode extends Node, d3.SimulationNodeDatum {}
interface SimulationLink extends Edge {
  source: SimulationNode;
  target: SimulationNode;
}

export default function GraphVisualization({
  graph,
  width = 800,
  height = 600,
  highlightedNode = null,
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || graph.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Create container for zoom/pan
    const g = svg.append('g');

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Create simulation nodes and links
    const nodes: SimulationNode[] = graph.nodes.map((node) => ({ ...node }));
    const links: SimulationLink[] = graph.edges.map((edge) => ({
      ...edge,
      source: nodes.find((n) => n.id === edge.from)!,
      target: nodes.find((n) => n.id === edge.to)!,
    }));

    // Set up force simulation
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(links)
          .id((d) => d.id)
          .distance((d) => 100 / (d.strength || 0.5))
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Draw links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#4ade80')
      .attr('stroke-opacity', (d) => 0.2 + d.strength * 0.6)
      .attr('stroke-width', (d) => 1 + d.strength * 3);

    // Draw nodes
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => {
        window.location.href = d.path;
      })
      .on('mouseenter', (_event, d) => {
        setHoveredNode(d.id);
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
      })
      .call(
        d3
          .drag<SVGGElement, SimulationNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => {
        const baseSize = 8;
        const connectionCount = links.filter(
          (l) => l.source.id === d.id || l.target.id === d.id
        ).length;
        return baseSize + Math.min(connectionCount * 2, 12);
      })
      .attr('fill', (d) => {
        const colors = {
          post: '#4ade80',
          skill: '#22c55e',
          pattern: '#16a34a',
          repo: '#15803d',
        };
        return colors[d.type];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels
    node
      .append('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .text((d) => d.title)
      .attr('font-size', '12px')
      .attr('fill', '#e5e7eb')
      .attr('pointer-events', 'none');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimulationNode).x!)
        .attr('y1', (d) => (d.source as SimulationNode).y!)
        .attr('x2', (d) => (d.target as SimulationNode).x!)
        .attr('y2', (d) => (d.target as SimulationNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Highlight connected nodes on hover
    if (hoveredNode) {
      const connectedNodeIds = new Set<string>();
      connectedNodeIds.add(hoveredNode);

      links.forEach((link) => {
        if (link.source.id === hoveredNode) connectedNodeIds.add(link.target.id);
        if (link.target.id === hoveredNode) connectedNodeIds.add(link.source.id);
      });

      node.selectAll('circle').attr('opacity', (d) => (connectedNodeIds.has(d.id) ? 1 : 0.2));

      link.attr('opacity', (d) =>
        d.source.id === hoveredNode || d.target.id === hoveredNode ? 1 : 0.1
      );
    } else {
      node.selectAll('circle').attr('opacity', 1);
      link.attr('opacity', 1);
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graph, width, height, hoveredNode, highlightedNode]);

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-gray-900 rounded-lg border border-gray-800"
      />
      <div className="mt-4 flex gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#4ade80]"></div>
          <span>Posts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
          <span>Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#16a34a]"></div>
          <span>Patterns</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Drag nodes to rearrange • Scroll to zoom • Click to navigate
      </div>
    </div>
  );
}
