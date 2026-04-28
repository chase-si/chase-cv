export type SkillTreeNode = {
  id: string;
  children?: SkillTreeNode[];
};

export type GraphNode = {
  id: string;
  depth: number;
  group: string;
};

export type GraphLink = {
  source: string;
  target: string;
};

export function flattenTreeToGraph(root: SkillTreeNode): {
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

export function buildTree(): SkillTreeNode {
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