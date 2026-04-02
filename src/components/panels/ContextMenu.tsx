import React, { useEffect, useRef } from 'react';
import { useManoStore } from '../../store';
import { ContextMenuState } from '../../types';

interface Props {
  menu: ContextMenuState;
  onClose: () => void;
}

export const ContextMenu: React.FC<Props> = ({ menu, onClose }) => {
  const { darkMode, deleteNode, deleteEdge, duplicateNode, updateNodeData, nodes } = useManoStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  const node = menu.nodeId ? nodes.find(n => n.id === menu.nodeId) : null;
  const nodeData = node?.data as any;

  const bg = darkMode ? 'bg-stone-800 border-stone-600' : 'bg-white border-gray-200';
  const itemCls = `px-4 py-2 text-sm cursor-pointer flex items-center gap-2 ${darkMode ? 'text-gray-200 hover:bg-stone-700' : 'text-gray-700 hover:bg-gray-50'}`;
  const divider = <div className={`border-t my-1 ${darkMode ? 'border-stone-600' : 'border-gray-100'}`} />;

  const shapes = ['rounded', 'rectangle', 'ellipse', 'diamond', 'parallelogram', 'hexagon', 'cylinder', 'cloud', 'circle'];

  return (
    <div
      ref={ref}
      className={`context-menu fixed z-50 min-w-44 ${bg} border rounded-xl shadow-xl py-1 overflow-hidden`}
      style={{ left: menu.x, top: menu.y }}
      onClick={e => e.stopPropagation()}
    >
      {menu.nodeId && (
        <>
          <div className={itemCls} onClick={() => { duplicateNode(menu.nodeId!); onClose(); }}>
            <span>⧉</span> Duplicate
          </div>
          <div className="px-4 py-1">
            <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shape</div>
            <div className="flex flex-wrap gap-1">
              {shapes.map(s => (
                <button
                  key={s}
                  className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${nodeData?.shape === s
                    ? 'bg-orange-500 text-white border-orange-500'
                    : darkMode ? 'border-stone-500 text-gray-300 hover:bg-stone-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => { updateNodeData(menu.nodeId!, { shape: s as any }); onClose(); }}
                >
                  {s.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          {divider}
          <div
            className={`${itemCls} text-red-500 hover:bg-red-50`}
            style={darkMode ? { color: '#f87171' } : {}}
            onClick={() => { deleteNode(menu.nodeId!); onClose(); }}
          >
            <span>🗑</span> Delete Node
          </div>
        </>
      )}

      {menu.edgeId && (
        <div
          className={`${itemCls} text-red-500`}
          onClick={() => { deleteEdge(menu.edgeId!); onClose(); }}
        >
          <span>🗑</span> Delete Edge
        </div>
      )}
    </div>
  );
};
