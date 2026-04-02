import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from '@xyflow/react';

const elk = new ELK();

type LayoutType = 'topdown' | 'leftright' | 'force';

export async function applyAutoLayout(
  nodes: Node[],
  edges: Edge[],
  layoutType: LayoutType = 'topdown'
): Promise<Node[]> {
  const elkOptions: Record<string, string> = {
    'elk.algorithm': layoutType === 'force' ? 'stress' : 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    'elk.spacing.nodeNode': '60',
    'elk.direction': layoutType === 'leftright' ? 'RIGHT' : 'DOWN',
  };

  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map(n => ({
      id: n.id,
      width: (n.measured?.width || n.width || 160) as number,
      height: (n.measured?.height || n.height || 60) as number,
    })),
    edges: edges.map(e => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const result = await elk.layout(graph);

  return nodes.map(node => {
    const elkNode = result.children?.find(c => c.id === node.id);
    if (!elkNode?.x || !elkNode?.y) return node;
    return { ...node, position: { x: elkNode.x, y: elkNode.y } };
  });
}
