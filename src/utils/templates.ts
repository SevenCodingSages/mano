import { Node, Edge } from '@xyflow/react';
import { ManoNodeData, ManoEdgeData, TemplateType, NodeShape } from '../types';

type ManoNode = Node<ManoNodeData>;
type ManoEdge = Edge<ManoEdgeData>;

function makeNode(id: string, label: string, x: number, y: number, shape: NodeShape = 'rounded', color = '#FFFFFF', borderColor = '#E8651A', extra: Partial<ManoNodeData> = {}): ManoNode {
  return {
    id,
    type: 'manoNode',
    position: { x, y },
    data: {
      label,
      shape,
      color,
      borderColor,
      tags: [],
      notes: '',
      isCitation: false,
      ...extra,
    },
  };
}

function makeEdge(id: string, source: string, target: string, label = '', color = '#94a3b8'): ManoEdge {
  return {
    id,
    source,
    target,
    type: 'manoEdge',
    data: { relationship: label as any, color, strokeStyle: 'solid', arrowType: 'target', edgeType: 'bezier' },
  };
}

export function createTemplateNodes(template: TemplateType): ManoNode[] {
  if (template === 'blank') return [];

  if (template === 'research') {
    return [
      makeNode('n1', 'Central Concept', 400, 300, 'rounded', '#FFF7ED', '#E8651A'),
      {
        id: 'c1', type: 'citationNode', position: { x: 100, y: 100 },
        data: {
          label: 'Citation Card', shape: 'rounded', color: '#F0F9FF', borderColor: '#1A6B5A',
          tags: [], notes: '', isCitation: true,
          citationData: { title: 'Paper Title Here', authors: 'Author, A. & Author, B.', year: '2024', journal: 'Journal of Examples', volumeIssuePages: '12(3), 45–67', doi: 'https://doi.org/10.xxxx', notes: '' }
        },
      } as ManoNode,
      {
        id: 'c2', type: 'citationNode', position: { x: 600, y: 100 },
        data: {
          label: 'Citation Card', shape: 'rounded', color: '#F0F9FF', borderColor: '#1A6B5A',
          tags: [], notes: '', isCitation: true,
          citationData: { title: 'Another Key Paper', authors: 'Researcher, C.', year: '2023', journal: 'Annual Review', volumeIssuePages: '8(1), 1–20', doi: 'https://doi.org/10.yyyy', notes: '' }
        },
      } as ManoNode,
      {
        id: 'c3', type: 'citationNode', position: { x: 350, y: 520 },
        data: {
          label: 'Citation Card', shape: 'rounded', color: '#F0F9FF', borderColor: '#1A6B5A',
          tags: [], notes: '', isCitation: true,
          citationData: { title: 'Foundational Study', authors: 'Scholar, D.', year: '2021', journal: 'Proceedings of X', volumeIssuePages: '(2021), 100–115', doi: '', notes: '' }
        },
      } as ManoNode,
      makeNode('g1', 'Research Gap 1', 700, 320, 'diamond', '#FEF9C3', '#CA8A04', { tags: [{ id: 't1', name: 'Gap', color: '#CA8A04' }] }),
      makeNode('g2', 'Research Gap 2', 800, 420, 'diamond', '#FEF9C3', '#CA8A04', { tags: [{ id: 't1', name: 'Gap', color: '#CA8A04' }] }),
    ];
  }

  if (template === 'story') {
    const stageColor = (s: string) => {
      const m: Record<string, [string, string]> = {
        'Setup': ['#FFF7ED', '#E8651A'],
        'Rising': ['#F0FDF4', '#16A34A'],
        'Climax': ['#FEF2F2', '#DC2626'],
        'Resolution': ['#EFF6FF', '#2563EB'],
      };
      return m[s] || ['#F5F5F4', '#78716C'];
    };
    const s = (stage: string) => ({ tags: [{ id: stage, name: stage, color: stageColor(stage)[1] }] });

    return [
      makeNode('protagonist', 'Protagonist', 400, 280, 'ellipse', '#FFF7ED', '#E8651A'),
      makeNode('ordinary', 'Ordinary World', 150, 150, 'rounded', ...stageColor('Setup'), s('Setup')),
      makeNode('call', 'Call to Adventure', 630, 150, 'rounded', ...stageColor('Rising'), s('Rising')),
      makeNode('trials', 'Trials & Growth', 750, 300, 'rounded', ...stageColor('Rising'), s('Rising')),
      makeNode('climax', 'Climax', 600, 450, 'rounded', ...stageColor('Climax'), s('Climax')),
      makeNode('resolution', 'Resolution', 200, 450, 'rounded', ...stageColor('Resolution'), s('Resolution')),
    ];
  }

  if (template === 'game') {
    return [
      makeNode('class', 'Character Class', 400, 50, 'rectangle', '#F5F3FF', '#7C3AED'),
      makeNode('path1', 'Warrior Path', 150, 200, 'rectangle', '#FEF2F2', '#DC2626'),
      makeNode('path2', 'Mage Path', 400, 200, 'rectangle', '#EFF6FF', '#2563EB'),
      makeNode('path3', 'Rogue Path', 650, 200, 'rectangle', '#F0FDF4', '#16A34A'),
      makeNode('w1', 'Sword Mastery', 50, 370, 'rounded', '#FEF2F2', '#DC2626'),
      makeNode('w2', 'Shield Block', 200, 370, 'rounded', '#FEF2F2', '#DC2626'),
      makeNode('m1', 'Fireball', 320, 370, 'rounded', '#EFF6FF', '#2563EB'),
      makeNode('m2', 'Frost Nova', 460, 370, 'rounded', '#EFF6FF', '#2563EB'),
      makeNode('r1', 'Backstab', 580, 370, 'rounded', '#F0FDF4', '#16A34A'),
      makeNode('r2', 'Shadow Step', 720, 370, 'rounded', '#F0FDF4', '#16A34A'),
      makeNode('unlock1', 'Lv 5?', 130, 285, 'diamond', '#FAFAF9', '#78716C'),
      makeNode('unlock2', 'Lv 5?', 385, 285, 'diamond', '#FAFAF9', '#78716C'),
      makeNode('unlock3', 'Lv 5?', 635, 285, 'diamond', '#FAFAF9', '#78716C'),
    ];
  }

  return [];
}

export function createTemplateEdges(template: TemplateType): ManoEdge[] {
  if (template === 'blank') return [];

  if (template === 'research') {
    return [
      makeEdge('e1', 'n1', 'c1', 'references'),
      makeEdge('e2', 'n1', 'c2', 'references'),
      makeEdge('e3', 'n1', 'c3', 'references'),
      makeEdge('e4', 'n1', 'g1', 'leads to'),
      makeEdge('e5', 'n1', 'g2', 'leads to'),
    ];
  }

  if (template === 'story') {
    return [
      makeEdge('e1', 'protagonist', 'ordinary', 'begins'),
      makeEdge('e2', 'ordinary', 'call', 'leads to'),
      makeEdge('e3', 'call', 'trials', 'leads to'),
      makeEdge('e4', 'trials', 'climax', 'leads to'),
      makeEdge('e5', 'climax', 'resolution', 'leads to'),
      makeEdge('e6', 'protagonist', 'climax', 'faces'),
    ];
  }

  if (template === 'game') {
    return [
      makeEdge('e1', 'class', 'path1', 'choose'),
      makeEdge('e2', 'class', 'path2', 'choose'),
      makeEdge('e3', 'class', 'path3', 'choose'),
      makeEdge('e4', 'path1', 'unlock1', ''),
      makeEdge('e5', 'unlock1', 'w1', 'yes'),
      makeEdge('e6', 'unlock1', 'w2', 'yes'),
      makeEdge('e7', 'path2', 'unlock2', ''),
      makeEdge('e8', 'unlock2', 'm1', 'yes'),
      makeEdge('e9', 'unlock2', 'm2', 'yes'),
      makeEdge('e10', 'path3', 'unlock3', ''),
      makeEdge('e11', 'unlock3', 'r1', 'yes'),
      makeEdge('e12', 'unlock3', 'r2', 'yes'),
    ];
  }

  return [];
}
