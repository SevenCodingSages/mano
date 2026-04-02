// Mano .mano file format — JSON schema documented here
// Root: { version, metadata, nodes, edges, groups, viewport }
// Node: { id, type, shape, position, size, label, color, borderColor, tags, notes, citationData }
// Edge: { id, source, target, type, label, relationship, color, strokeStyle, arrowType }
// Group: { id, label, color, nodeIds, position, size, collapsed }

export type NodeShape =
  | 'rounded'
  | 'rectangle'
  | 'ellipse'
  | 'diamond'
  | 'parallelogram'
  | 'hexagon'
  | 'cylinder'
  | 'cloud'
  | 'circle';

export type EdgeType = 'straight' | 'bezier' | 'step' | 'smoothstep';
export type ArrowType = 'none' | 'target' | 'source' | 'both';
export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export type EdgeRelationship =
  | 'causes' | 'supports' | 'contradicts' | 'precedes'
  | 'belongs to' | 'references' | 'leads to' | 'yes' | 'no' | '';

export interface ManoTag {
  id: string;
  name: string;
  color: string;
}

export interface CitationData {
  title: string;
  authors: string;
  year: string;
  journal: string;
  volumeIssuePages: string;
  doi: string;
  notes: string;
}

export interface ManoNodeData extends Record<string, unknown> {
  label: string;
  shape: NodeShape;
  color: string;
  borderColor: string;
  tags: ManoTag[];
  notes: string; // HTML from TipTap
  isCitation: boolean;
  citationData?: CitationData;
  groupId?: string;
}

export interface ManoEdgeData extends Record<string, unknown> {
  relationship: EdgeRelationship;
  color: string;
  strokeStyle: StrokeStyle;
  arrowType: ArrowType;
  edgeType: EdgeType;
}

export interface ManoGroup {
  id: string;
  label: string;
  color: string;
  nodeIds: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  collapsed: boolean;
}

export interface ManoViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface ManoFile {
  version: '1.0';
  metadata: {
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  nodes: any[];
  edges: any[];
  groups: ManoGroup[];
  viewport: ManoViewport;
}

export type TemplateType = 'blank' | 'research' | 'story' | 'game';

export interface ContextMenuState {
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
}
