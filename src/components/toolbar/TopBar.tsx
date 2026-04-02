import React, { useState } from 'react';
import { useManoStore } from '../../store';
import { saveToFile, openFile } from '../../utils/saveLoad';

interface Props {
  onNew: () => void;
  onSearch: () => void;
  onExport: () => void;
  onBibliography: () => void;
  onLayout: () => void;
}

export const TopBar: React.FC<Props> = ({ onNew, onSearch, onExport, onBibliography, onLayout }) => {
  const {
    darkMode, setDarkMode, gridSnap, setGridSnap, showMinimap, setShowMinimap,
    mapName, setMapName, nodes, edges, groups, viewport, undo, redo, past, future
  } = useManoStore();

  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(mapName);
  const [fileOpen, setFileOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const handleSave = () => {
    saveToFile({ nodes, edges, groups, viewport, mapName, metadata: { name: mapName, createdAt: '', updatedAt: '' } });
  };

  const handleOpen = async () => {
    try {
      const file = await openFile();
      useManoStore.getState().loadFromFile(file);
    } catch (e) { /* cancelled */ }
  };

  const bg = darkMode ? 'bg-stone-900 border-stone-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800';
  const btnCls = `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-gray-100'}`;
  const menuCls = `absolute top-full mt-1 left-0 min-w-36 ${darkMode ? 'bg-stone-800 border-stone-600' : 'bg-white border-gray-200'} border rounded-xl shadow-xl py-1 z-50`;
  const menuItemCls = `px-4 py-2 text-sm cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-stone-700' : 'text-gray-700 hover:bg-gray-50'}`;

  return (
    <div className={`flex items-center h-12 px-3 border-b ${bg} gap-2 relative z-30 shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #E8651A, #1A6B5A)' }}>
            म
          </div>
          <span className="font-bold text-base" style={{ color: '#E8651A' }}>Mano</span>
          <span className="text-xs text-gray-400 ml-0.5 hidden sm:inline">मनो</span>
        </div>
      </div>

      {/* Map name */}
      {editingName ? (
        <input
          autoFocus
          className={`px-2 py-1 rounded border text-sm font-medium ${darkMode ? 'bg-stone-700 border-stone-500 text-gray-200' : 'bg-white border-gray-300'} outline-none focus:border-orange-400`}
          value={nameVal}
          onChange={e => setNameVal(e.target.value)}
          onBlur={() => { setMapName(nameVal); setEditingName(false); }}
          onKeyDown={e => {
            if (e.key === 'Enter') { setMapName(nameVal); setEditingName(false); }
            if (e.key === 'Escape') { setEditingName(false); }
          }}
        />
      ) : (
        <button
          className={`px-2 py-1 rounded text-sm font-medium max-w-48 truncate ${darkMode ? 'hover:bg-stone-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
          onDoubleClick={() => { setNameVal(mapName); setEditingName(true); }}
          title="Double-click to rename"
        >
          {mapName}
        </button>
      )}

      <div className="w-px h-5 bg-gray-300 dark:bg-stone-600 mx-1" />

      {/* File menu */}
      <div className="relative">
        <button className={btnCls} onClick={() => { setFileOpen(!fileOpen); setViewOpen(false); }}>
          File ▾
        </button>
        {fileOpen && (
          <div className={menuCls} onMouseLeave={() => setFileOpen(false)}>
            <div className={menuItemCls} onClick={() => { onNew(); setFileOpen(false); }}>New Map</div>
            <div className={menuItemCls} onClick={() => { handleOpen(); setFileOpen(false); }}>Open… (Ctrl+O)</div>
            <div className={`border-t my-1 ${darkMode ? 'border-stone-600' : 'border-gray-100'}`} />
            <div className={menuItemCls} onClick={() => { handleSave(); setFileOpen(false); }}>Save (Ctrl+S)</div>
          </div>
        )}
      </div>

      {/* Export */}
      <button className={btnCls} onClick={onExport}>Export</button>

      {/* Bibliography */}
      <button className={btnCls} onClick={onBibliography}>Bibliography</button>

      {/* View menu */}
      <div className="relative">
        <button className={btnCls} onClick={() => { setViewOpen(!viewOpen); setFileOpen(false); }}>
          View ▾
        </button>
        {viewOpen && (
          <div className={menuCls} onMouseLeave={() => setViewOpen(false)}>
            <div className={`${menuItemCls} flex items-center justify-between gap-4`}
              onClick={() => setDarkMode(!darkMode)}>
              <span>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            </div>
            <div className={`${menuItemCls} flex items-center justify-between gap-4`}
              onClick={() => setGridSnap(!gridSnap)}>
              <span>Grid Snap</span>
              <span>{gridSnap ? '✓' : ''}</span>
            </div>
            <div className={`${menuItemCls} flex items-center justify-between gap-4`}
              onClick={() => setShowMinimap(!showMinimap)}>
              <span>Minimap</span>
              <span>{showMinimap ? '✓' : ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Auto-layout */}
      <button className={btnCls} onClick={onLayout}>⊞ Layout</button>

      <div className="flex-1" />

      {/* Undo/Redo */}
      <button
        title="Undo (Ctrl+Z)"
        className={`${btnCls} ${past.length === 0 ? 'opacity-30' : ''}`}
        onClick={undo}
        disabled={past.length === 0}
      >↩</button>
      <button
        title="Redo (Ctrl+Y)"
        className={`${btnCls} ${future.length === 0 ? 'opacity-30' : ''}`}
        onClick={redo}
        disabled={future.length === 0}
      >↪</button>

      {/* Search */}
      <button title="Search (Ctrl+F)" className={btnCls} onClick={onSearch}>🔍</button>

      {/* Help */}
      <button
        title="Keyboard shortcuts"
        className={`${btnCls} text-gray-400`}
        onClick={() => alert(
          'Keyboard Shortcuts:\n\n' +
          'Ctrl+Z — Undo\n' +
          'Ctrl+Y / Ctrl+Shift+Z — Redo\n' +
          'Ctrl+C / Ctrl+V — Copy / Paste\n' +
          'Ctrl+D — Duplicate\n' +
          'Ctrl+A — Select All\n' +
          'Ctrl+S — Save\n' +
          'Ctrl+O — Open\n' +
          'Ctrl+F — Search\n' +
          'Delete / Backspace — Delete selected\n' +
          'Escape — Deselect / close panels\n' +
          'Double-click canvas — New node\n' +
          'Double-click node — Edit label'
        )}
      >?</button>
    </div>
  );
};
