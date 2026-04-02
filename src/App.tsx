import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, BackgroundVariant,
  useReactFlow, ReactFlowProvider, NodeChange, EdgeChange, Connection,
  SelectionMode, Panel,
} from '@xyflow/react';
import { useManoStore } from './store';
import { ManoNode } from './components/nodes/ManoNode';
import { CitationNode } from './components/nodes/CitationNode';
import { ManoEdge } from './components/edges/ManoEdge';
import { NotesPanel } from './components/panels/NotesPanel';
import { SearchPanel } from './components/panels/SearchPanel';
import { ContextMenu } from './components/panels/ContextMenu';
import { TopBar } from './components/toolbar/TopBar';
import { LeftBar } from './components/toolbar/LeftBar';
import { ExportModal } from './components/modals/ExportModal';
import { BibliographyModal } from './components/modals/BibliographyModal';
import { LayoutModal } from './components/modals/LayoutModal';
import { WelcomeModal } from './components/modals/WelcomeModal';
import { ContextMenuState, ManoNodeData, NodeShape } from './types';
import { Node } from '@xyflow/react';

const nodeTypes = {
  manoNode: ManoNode,
  citationNode: CitationNode,
};

const edgeTypes = {
  manoEdge: ManoEdge,
};

function getNodeId() { return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

const ManoCanvas: React.FC = () => {
  const {
    nodes, edges, darkMode, gridSnap, showMinimap,
    onNodesChange, onEdgesChange, onConnect,
    setSelectedNode, selectedNodeId, searchQuery, activeTagFilters,
    addNode, deleteNode, duplicateNode, setViewport,
    undo, redo, loadAutoSave,
  } = useManoStore();

  const { screenToFlowPosition, fitView } = useReactFlow();

  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showBib, setShowBib] = useState(false);
  const [showLayout, setShowLayout] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [copiedNodes, setCopiedNodes] = useState<Node<ManoNodeData>[]>([]);

  // Load auto-save on mount, show welcome if nothing
  useEffect(() => {
    loadAutoSave().then(loaded => {
      if (!loaded) setShowWelcome(true);
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
      if (ctrl && e.key === 's') { e.preventDefault(); document.querySelector<HTMLButtonElement>('[data-save]')?.click(); }
      if (ctrl && e.key === 'o') { e.preventDefault(); document.querySelector<HTMLButtonElement>('[data-open]')?.click(); }
      if (ctrl && e.key === 'f') { e.preventDefault(); setShowSearch(s => !s); }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setContextMenu(null);
        if (!isInput) setSelectedNode(null);
      }

      if (!isInput) {
        if (ctrl && e.key === 'a') {
          e.preventDefault();
          // Select all - done via ReactFlow's selectAll
        }
        if (ctrl && e.key === 'c') {
          const sel = nodes.filter(n => n.selected);
          if (sel.length) setCopiedNodes(sel as any);
        }
        if (ctrl && e.key === 'v') {
          if (copiedNodes.length) {
            copiedNodes.forEach(n => {
              addNode({
                ...JSON.parse(JSON.stringify(n)),
                id: getNodeId(),
                position: { x: n.position.x + 30, y: n.position.y + 30 },
                selected: false,
              });
            });
          }
        }
        if (ctrl && e.key === 'd') {
          e.preventDefault();
          const sel = nodes.filter(n => n.selected);
          sel.forEach(n => duplicateNode(n.id));
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nodes, copiedNodes, undo, redo, addNode, duplicateNode, setSelectedNode]);

  // Double-click on canvas to create node
  const handlePaneDoubleClick = useCallback((e: React.MouseEvent) => {
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const id = getNodeId();
    addNode({
      id,
      type: 'manoNode',
      position: { x: pos.x - 80, y: pos.y - 30 },
      data: {
        label: 'New Node',
        shape: 'rounded',
        color: '#ffffff',
        borderColor: '#E8651A',
        tags: [],
        notes: '',
        isCitation: false,
      },
    } as any);
    setSelectedNode(id);
  }, [screenToFlowPosition, addNode, setSelectedNode]);

  // Add node from left bar
  const handleAddNode = useCallback((shape: NodeShape, isCitation = false) => {
    const { x, y, zoom } = useManoStore.getState().viewport;
    // Place in center of viewport
    const vw = window.innerWidth / 2;
    const vh = window.innerHeight / 2;
    const pos = screenToFlowPosition({ x: vw, y: vh });
    const id = getNodeId();

    addNode({
      id,
      type: isCitation ? 'citationNode' : 'manoNode',
      position: { x: pos.x - 80, y: pos.y - 30 },
      data: {
        label: isCitation ? 'Citation Card' : 'New Node',
        shape,
        color: isCitation ? '#F0F9FF' : '#ffffff',
        borderColor: isCitation ? '#1A6B5A' : '#E8651A',
        tags: [],
        notes: '',
        isCitation,
        ...(isCitation ? {
          citationData: {
            title: '', authors: '', year: '', journal: '',
            volumeIssuePages: '', doi: '', notes: '',
          }
        } : {}),
      },
    } as any);
    setSelectedNode(id);
  }, [screenToFlowPosition, addNode, setSelectedNode]);

  // Context menu
  const handleNodeContextMenu = useCallback((e: React.MouseEvent, node: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id });
  }, []);

  const handleEdgeContextMenu = useCallback((e: React.MouseEvent, edge: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, edgeId: edge.id });
  }, []);

  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Node visibility for search/filter
  const getNodeStyle = useCallback((node: any) => {
    const data = node.data as ManoNodeData;
    const q = searchQuery.toLowerCase();
    const tagMatch = activeTagFilters.length === 0 ||
      data.tags.some(t => activeTagFilters.includes(t.name));
    const searchMatch = !q ||
      data.label.toLowerCase().includes(q) ||
      (data.notes || '').toLowerCase().includes(q);
    const visible = tagMatch && searchMatch;
    return visible ? {} : { opacity: 0.15, transition: 'opacity 0.2s' };
  }, [searchQuery, activeTagFilters]);

  const bg = darkMode ? '#1C1917' : '#FDFAF6';
  const dotColor = darkMode ? '#3d3733' : '#e2ded8';

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'dark' : ''}`} style={{ background: bg }}>
      <TopBar
        onNew={() => setShowWelcome(true)}
        onSearch={() => setShowSearch(s => !s)}
        onExport={() => setShowExport(true)}
        onBibliography={() => setShowBib(true)}
        onLayout={() => setShowLayout(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <LeftBar onAddNode={handleAddNode} />

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes.map(n => ({
              ...n,
              style: getNodeStyle(n),
            }))}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange as any}
            onEdgesChange={onEdgesChange as any}
            onConnect={onConnect}
            onPaneClick={handlePaneClick}
            onPaneContextMenu={e => e.preventDefault()}
            onNodeContextMenu={handleNodeContextMenu}
            onEdgeContextMenu={handleEdgeContextMenu}
            onDoubleClick={handlePaneDoubleClick}
            snapToGrid={gridSnap}
            snapGrid={[20, 20]}
            selectionMode={SelectionMode.Partial}
            selectionOnDrag={true}
            panOnDrag={[1, 2]}
            deleteKeyCode={['Delete', 'Backspace']}
            multiSelectionKeyCode="Shift"
            fitView
            fitViewOptions={{ padding: 0.2 }}
            onMoveEnd={(_, vp) => setViewport(vp)}
            style={{ background: bg }}
            minZoom={0.1}
            maxZoom={4}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color={dotColor}
            />
            <Controls
              style={{
                background: darkMode ? '#292524' : '#fff',
                border: '1px solid ' + (darkMode ? '#44403c' : '#e5e7eb'),
                borderRadius: 8,
              }}
            />
            {showMinimap && (
              <MiniMap
                style={{
                  background: darkMode ? '#292524' : '#f5f4f1',
                  border: '1px solid ' + (darkMode ? '#44403c' : '#e5e7eb'),
                }}
                nodeColor={n => (n.data as any)?.borderColor || '#E8651A'}
                maskColor={darkMode ? 'rgba(28,25,23,0.7)' : 'rgba(253,250,246,0.7)'}
              />
            )}

            {/* Fit to screen button */}
            <Panel position="bottom-left">
              <button
                title="Fit to screen"
                onClick={() => fitView({ padding: 0.2 })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow border ${darkMode ? 'bg-stone-800 border-stone-600 text-gray-300 hover:bg-stone-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                ⊡
              </button>
            </Panel>
          </ReactFlow>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`text-center ${darkMode ? 'text-stone-600' : 'text-stone-300'}`}>
                <div className="text-5xl mb-3 opacity-50">मनो</div>
                <div className="text-lg font-medium mb-1">Double-click to create a node</div>
                <div className="text-sm">or choose a template from File → New</div>
              </div>
            </div>
          )}
        </div>

        {/* Notes panel (right side) */}
        {selectedNodeId && (
          <div className="relative z-20">
            <NotesPanel />
          </div>
        )}
      </div>

      {/* Overlays */}
      {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
      {contextMenu && <ContextMenu menu={contextMenu} onClose={() => setContextMenu(null)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showBib && <BibliographyModal onClose={() => setShowBib(false)} />}
      {showLayout && <LayoutModal onClose={() => setShowLayout(false)} />}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
    </div>
  );
};

const App: React.FC = () => (
  <ReactFlowProvider>
    <ManoCanvas />
  </ReactFlowProvider>
);

export default App;
