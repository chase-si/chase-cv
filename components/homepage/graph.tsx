"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

type SkillTreeNode = {
  id: string;
  children?: SkillTreeNode[];
};

type GraphNode = {
  id: string;
  depth: number;
  group: string;
} & d3.SimulationNodeDatum;

type GraphLink = {
  source: string | GraphNode;
  target: string | GraphNode;
};

function buildTree(): SkillTreeNode {
  return {
    id: "Chase",
    children: [
      {
        id: "Skills",
        children: [
          {
            id: "Frontend",
            children: [{ id: "React" }, { id: "Vue" }],
          },
          { id: "Backend" },
          { id: "Mobile" },
        ],
      },
      {
        id: "Project",
        children: [{ id: "Aladia" }, { id: "CV website" }],
      },
    ],
  };
}

function flattenTreeToGraph(root: SkillTreeNode): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const walk = (
    node: SkillTreeNode,
    parent: SkillTreeNode | null,
    depth: number,
    group: string,
  ) => {
    const resolvedGroup =
      depth === 0 ? "root" : depth === 1 ? node.id : group;

    nodes.push({
      id: node.id,
      depth,
      group: resolvedGroup,
    });

    if (parent) {
      links.push({ source: parent.id, target: node.id });
    }

    for (const child of node.children ?? []) {
      walk(child, node, depth + 1, resolvedGroup);
    }
  };

  walk(root, null, 0, "root");

  return { nodes, links };
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const cr = entry.contentRect;
      setSize({
        width: Math.max(0, Math.floor(cr.width)),
        height: Math.max(0, Math.floor(cr.height)),
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, size };
}

function nodeRadius(depth: number) {
  if (depth === 0) return 18;
  if (depth === 1) return 14;
  if (depth === 2) return 11;
  return 9;
}

function getCssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

export function HomepageGraph() {
  const tree = useMemo(() => buildTree(), []);
  const { nodes, links } = useMemo(() => flattenTreeToGraph(tree), [tree]);

  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(
    null,
  );

  useEffect(() => {
    const svgEl = svgRef.current;
    const containerEl = containerRef.current;
    if (!svgEl || !containerEl) return;
    if (size.width === 0 || size.height === 0) return;

    const stroke = getCssVar("--color-zinc-900", "#18181b");
    const strokeMuted = getCssVar("--color-zinc-900-10", "rgba(24,24,27,0.12)");
    const text = getCssVar("--color-zinc-900", "#18181b");
    const fillRoot = getCssVar("--color-indigo-600", "#4f46e5");
    const fillSkills = getCssVar("--color-emerald-500", "#10b981");
    const fillProject = getCssVar("--color-sky-500", "#0ea5e9");
    const fillOther = getCssVar("--color-zinc-400", "#a1a1aa");

    const colorFor = (d: GraphNode) => {
      if (d.depth === 0) return fillRoot;
      if (d.group === "Skills") return fillSkills;
      if (d.group === "Project") return fillProject;
      return fillOther;
    };

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${size.width} ${size.height}`)
      .attr("width", size.width)
      .attr("height", size.height);

    const rootG = svg.append("g").attr("class", "viewport");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 2.4])
      .on("zoom", (event) => {
        rootG.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    const linkSel = rootG
      .append("g")
      .attr("stroke", strokeMuted)
      .attr("stroke-width", 1.2)
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(links)
      .join("line");

    const nodeG = rootG
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g");

    nodeG
      .append("circle")
      .attr("r", (d) => nodeRadius(d.depth))
      .attr("fill", colorFor)
      .attr("stroke", stroke)
      .attr("stroke-opacity", 0.25)
      .attr("stroke-width", 1);

    nodeG
      .append("text")
      .text((d) => d.id)
      .attr("x", (d) => nodeRadius(d.depth) + 8)
      .attr("y", 4)
      .attr("font-size", (d) => (d.depth <= 1 ? 12 : 11))
      .attr("fill", text)
      .attr("opacity", 0.92)
      .style("paint-order", "stroke")
      .style("stroke", getCssVar("--color-background", "#ffffff"))
      .style("stroke-width", "3px")
      .style("stroke-linejoin", "round");

    const drag = d3
      .drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.2).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeG.call(drag);
    nodeG.style("cursor", "grab");
    nodeG.on("mousedown", () => nodeG.style("cursor", "grabbing"));
    nodeG.on("mouseup", () => nodeG.style("cursor", "grab"));

    const sim = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((l) => {
            const s = l.source as GraphNode;
            const t = l.target as GraphNode;
            const base = 66;
            if (s.depth === 0 || t.depth === 0) return base + 18;
            if (s.depth === 1 || t.depth === 1) return base + 10;
            return base;
          })
          .strength(0.9),
      )
      .force("charge", d3.forceManyBody().strength(-260))
      .force("collide", d3.forceCollide<GraphNode>().radius((d) => nodeRadius(d.depth) + 18))
      .force("center", d3.forceCenter(size.width / 2, size.height / 2));

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0);

      nodeG.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    simulationRef.current = sim;

    // initial settle
    sim.alpha(1).restart();

    return () => {
      svg.on(".zoom", null);
      nodeG.on("mousedown", null).on("mouseup", null);
      sim.stop();
      simulationRef.current = null;
    };
  }, [containerRef, links, nodes, size.height, size.width]);

  // Keep centered when container resizes
  useEffect(() => {
    const sim = simulationRef.current;
    if (!sim) return;
    if (size.width === 0 || size.height === 0) return;
    sim.force("center", d3.forceCenter(size.width / 2, size.height / 2));
    sim.alpha(0.3).restart();
  }, [size.height, size.width]);

  return (
    <div ref={containerRef} className="relative h-[420px] w-full">
      <svg ref={svgRef} className="h-full w-full select-none" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-zinc-900/10 bg-white/70 px-3 py-2 text-[11px] text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-300">
        拖拽节点 · 滚轮缩放
      </div>
    </div>
  );
}

