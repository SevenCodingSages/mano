// Mano .mano file format v1.0
// JSON structure:
// {
//   "version": "1.0",
//   "metadata": { "name": string, "createdAt": string, "updatedAt": string },
//   "nodes": Node[],   // @xyflow/react Node with ManoNodeData
//   "edges": Edge[],   // @xyflow/react Edge with ManoEdgeData
//   "groups": ManoGroup[],
//   "viewport": { "x": number, "y": number, "zoom": number }
// }

import { ManoFile } from '../types';

export function saveToFile(data: Omit<ManoFile, 'version'> & { mapName?: string }) {
  const file: ManoFile = {
    version: '1.0',
    metadata: {
      name: data.mapName || data.metadata?.name || 'Untitled Map',
      createdAt: data.metadata?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    nodes: data.nodes,
    edges: data.edges,
    groups: data.groups,
    viewport: data.viewport,
  };
  const json = JSON.stringify(file, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${file.metadata.name.replace(/[^a-z0-9]/gi, '_')}.mano`;
  a.click();
  URL.revokeObjectURL(url);
}

export function openFile(): Promise<ManoFile> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mano,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return reject(new Error('No file selected'));
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.version || !data.nodes) throw new Error('Invalid .mano file');
        resolve(data as ManoFile);
      } catch (err) {
        reject(err);
      }
    };
    input.click();
  });
}

export function exportMarkdown(nodes: any[], edges: any[]): string {
  const lines: string[] = ['# Mind Map Export\n'];
  // Build adjacency list
  const childMap: Record<string, string[]> = {};
  edges.forEach(e => {
    if (!childMap[e.source]) childMap[e.source] = [];
    childMap[e.source].push(e.target);
  });
  const nodeMap: Record<string, any> = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // Find roots (nodes with no incoming edges)
  const hasIncoming = new Set(edges.map((e: any) => e.target));
  const roots = nodes.filter(n => !hasIncoming.has(n.id));

  function renderNode(id: string, depth: number): void {
    const node = nodeMap[id];
    if (!node) return;
    const indent = '  '.repeat(depth);
    const bullet = depth === 0 ? '##' : '-';
    const label = node.data?.label || 'Untitled';
    lines.push(`${indent}${bullet} **${label}**`);
    if (node.data?.notes) {
      const plain = node.data.notes.replace(/<[^>]+>/g, '').trim();
      if (plain) lines.push(`${indent}  > ${plain}`);
    }
    const children = childMap[id] || [];
    children.forEach(cid => renderNode(cid, depth + 1));
  }

  roots.forEach(r => renderNode(r.id, 0));

  // Any remaining nodes
  const visited = new Set<string>();
  roots.forEach(r => visited.add(r.id));
  nodes.filter(n => !visited.has(n.id)).forEach(n => renderNode(n.id, 0));

  return lines.join('\n');
}
