import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges,
  NodeChange, EdgeChange, Connection
} from '@xyflow/react';
import { ManoNodeData, ManoEdgeData, ManoGroup, ManoViewport, TemplateType } from './types';
import localforage from 'localforage';
import { createTemplateNodes, createTemplateEdges } from './utils/templates';

const AUTO_SAVE_KEY = 'mano_autosave';
const THEME_KEY = 'mano_theme';

type ManoNode = Node<ManoNodeData>;
type ManoEdge = Edge<ManoEdgeData>;

interface HistoryEntry {
  nodes: ManoNode[];
  edges: ManoEdge[];
  groups: ManoGroup[];
}

interface ManoState {
  nodes: ManoNode[];
  edges: ManoEdge[];
  groups: ManoGroup[];
  viewport: ManoViewport;
  mapName: string;
  darkMode: boolean;
  gridSnap: boolean;
  showMinimap: boolean;
  selectedNodeId: string | null;
  searchQuery: string;
  activeTagFilters: string[];
  past: HistoryEntry[];
  future: HistoryEntry[];

  // Actions
  onNodesChange: (changes: NodeChange<ManoNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<ManoEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  setViewport: (vp: ManoViewport) => void;
  setSelectedNode: (id: string | null) => void;
  addNode: (node: ManoNode) => void;
  updateNodeData: (id: string, data: Partial<ManoNodeData>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  updateEdgeData: (id: string, data: Partial<ManoEdgeData>) => void;
  deleteEdge: (id: string) => void;
  addGroup: (group: ManoGroup) => void;
  updateGroup: (id: string, partial: Partial<ManoGroup>) => void;
  deleteGroup: (id: string) => void;
  toggleGroupCollapse: (id: string) => void;
  setDarkMode: (val: boolean) => void;
  setGridSnap: (val: boolean) => void;
  setShowMinimap: (val: boolean) => void;
  setSearchQuery: (q: string) => void;
  toggleTagFilter: (tag: string) => void;
  clearFilters: () => void;
  loadFromFile: (file: any) => void;
  resetToTemplate: (template: TemplateType) => void;
  setMapName: (name: string) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  autoSave: () => void;
  loadAutoSave: () => Promise<boolean>;
}

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleAutoSave(get: () => ManoState) {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    get().autoSave();
  }, 30000);
}

export const useManoStore = create<ManoState>()(
  immer((set, get) => ({
    nodes: [],
    edges: [],
    groups: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    mapName: 'Untitled Map',
    darkMode: localStorage.getItem(THEME_KEY) === 'dark',
    gridSnap: false,
    showMinimap: true,
    selectedNodeId: null,
    searchQuery: '',
    activeTagFilters: [],
    past: [],
    future: [],

    pushHistory: () => {
      set(state => {
        const entry: HistoryEntry = {
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges)),
          groups: JSON.parse(JSON.stringify(state.groups)),
        };
        state.past.push(entry);
        if (state.past.length > 50) state.past.shift();
        state.future = [];
      });
    },

    undo: () => {
      const { past, nodes, edges, groups } = get();
      if (!past.length) return;
      set(state => {
        const prev = state.past.pop()!;
        state.future.unshift({ nodes, edges, groups } as HistoryEntry);
        state.nodes = prev.nodes as any;
        state.edges = prev.edges as any;
        state.groups = prev.groups;
      });
    },

    redo: () => {
      const { future, nodes, edges, groups } = get();
      if (!future.length) return;
      set(state => {
        const next = state.future.shift()!;
        state.past.push({ nodes, edges, groups } as HistoryEntry);
        state.nodes = next.nodes as any;
        state.edges = next.edges as any;
        state.groups = next.groups;
      });
    },

    onNodesChange: (changes) => {
      // Push history only for position/deletion changes
      const significant = changes.some(c => c.type === 'remove' || c.type === 'position');
      if (significant) get().pushHistory();
      set(state => {
        state.nodes = applyNodeChanges(changes, state.nodes) as ManoNode[];
      });
      scheduleAutoSave(get);
    },

    onEdgesChange: (changes) => {
      const significant = changes.some(c => c.type === 'remove');
      if (significant) get().pushHistory();
      set(state => {
        state.edges = applyEdgeChanges(changes, state.edges) as ManoEdge[];
      });
      scheduleAutoSave(get);
    },

    onConnect: (connection) => {
      get().pushHistory();
      set(state => {
        const newEdge: ManoEdge = {
          ...connection,
          id: `e-${Date.now()}`,
          data: {
            relationship: '',
            color: '#94a3b8',
            strokeStyle: 'solid',
            arrowType: 'target',
            edgeType: 'bezier',
          },
          type: 'manoEdge',
        } as ManoEdge;
        state.edges = addEdge(newEdge, state.edges) as ManoEdge[];
      });
      scheduleAutoSave(get);
    },

    setViewport: (vp) => set(state => { state.viewport = vp; }),

    setSelectedNode: (id) => set(state => { state.selectedNodeId = id; }),

    addNode: (node) => {
      get().pushHistory();
      set(state => { state.nodes.push(node); });
      scheduleAutoSave(get);
    },

    updateNodeData: (id, data) => {
      set(state => {
        const node = state.nodes.find(n => n.id === id);
        if (node) Object.assign(node.data, data);
      });
      scheduleAutoSave(get);
    },

    deleteNode: (id) => {
      get().pushHistory();
      set(state => {
        state.nodes = state.nodes.filter(n => n.id !== id);
        state.edges = state.edges.filter(e => e.source !== id && e.target !== id);
        state.groups.forEach(g => { g.nodeIds = g.nodeIds.filter(nid => nid !== id); });
        if (state.selectedNodeId === id) state.selectedNodeId = null;
      });
      scheduleAutoSave(get);
    },

    duplicateNode: (id) => {
      get().pushHistory();
      set(state => {
        const node = state.nodes.find(n => n.id === id);
        if (!node) return;
        const newNode: ManoNode = {
          ...JSON.parse(JSON.stringify(node)),
          id: `node-${Date.now()}`,
          position: { x: node.position.x + 40, y: node.position.y + 40 },
          selected: false,
        };
        state.nodes.push(newNode);
      });
    },

    updateEdgeData: (id, data) => {
      set(state => {
        const edge = state.edges.find(e => e.id === id);
        if (edge) Object.assign(edge.data!, data);
      });
    },

    deleteEdge: (id) => {
      get().pushHistory();
      set(state => { state.edges = state.edges.filter(e => e.id !== id); });
    },

    addGroup: (group) => {
      get().pushHistory();
      set(state => { state.groups.push(group); });
    },

    updateGroup: (id, partial) => {
      set(state => {
        const g = state.groups.find(g => g.id === id);
        if (g) Object.assign(g, partial);
      });
    },

    deleteGroup: (id) => {
      get().pushHistory();
      set(state => {
        state.groups = state.groups.filter(g => g.id !== id);
        state.nodes.forEach(n => { if (n.data.groupId === id) n.data.groupId = undefined; });
      });
    },

    toggleGroupCollapse: (id) => {
      set(state => {
        const g = state.groups.find(g => g.id === id);
        if (g) g.collapsed = !g.collapsed;
      });
    },

    setDarkMode: (val) => {
      localStorage.setItem(THEME_KEY, val ? 'dark' : 'light');
      set(state => { state.darkMode = val; });
    },

    setGridSnap: (val) => set(state => { state.gridSnap = val; }),
    setShowMinimap: (val) => set(state => { state.showMinimap = val; }),
    setSearchQuery: (q) => set(state => { state.searchQuery = q; }),

    toggleTagFilter: (tag) => {
      set(state => {
        const i = state.activeTagFilters.indexOf(tag);
        if (i === -1) state.activeTagFilters.push(tag);
        else state.activeTagFilters.splice(i, 1);
      });
    },

    clearFilters: () => set(state => { state.activeTagFilters = []; state.searchQuery = ''; }),

    setMapName: (name) => set(state => { state.mapName = name; }),

    loadFromFile: (file) => {
      get().pushHistory();
      set(state => {
        state.nodes = file.nodes || [];
        state.edges = file.edges || [];
        state.groups = file.groups || [];
        state.viewport = file.viewport || { x: 0, y: 0, zoom: 1 };
        state.mapName = file.metadata?.name || 'Untitled Map';
        state.selectedNodeId = null;
      });
    },

    resetToTemplate: (template) => {
      set(state => {
        state.nodes = createTemplateNodes(template);
        state.edges = createTemplateEdges(template);
        state.groups = [];
        state.viewport = { x: 0, y: 0, zoom: 1 };
        state.mapName = template === 'blank' ? 'Untitled Map'
          : template === 'research' ? 'Research Map'
          : template === 'story' ? 'Story Outline'
          : 'Game Design';
        state.selectedNodeId = null;
        state.past = [];
        state.future = [];
      });
    },

    autoSave: async () => {
      const { nodes, edges, groups, viewport, mapName } = get();
      const data = {
        version: '1.0',
        metadata: { name: mapName, updatedAt: new Date().toISOString() },
        nodes, edges, groups, viewport,
      };
      await localforage.setItem(AUTO_SAVE_KEY, data);
    },

    loadAutoSave: async () => {
      try {
        const data: any = await localforage.getItem(AUTO_SAVE_KEY);
        if (!data) return false;
        set(state => {
          state.nodes = data.nodes || [];
          state.edges = data.edges || [];
          state.groups = data.groups || [];
          state.viewport = data.viewport || { x: 0, y: 0, zoom: 1 };
          state.mapName = data.metadata?.name || 'Untitled Map';
        });
        return true;
      } catch {
        return false;
      }
    },
  }))
);
