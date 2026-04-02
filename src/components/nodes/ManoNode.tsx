import React, { useState, useCallback } from 'react';
import { NodeProps, Handle, Position, NodeResizer } from '@xyflow/react';
import { ManoNodeData } from '../../types';
import { NodeShapeRenderer } from './NodeShape';
import { useManoStore } from '../../store';

const DEFAULT_W = 160;
const DEFAULT_H = 60;

export const ManoNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as ManoNodeData;
  const { darkMode, updateNodeData, setSelectedNode, deleteNode } = useManoStore();
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(nodeData.label);

  const width = DEFAULT_W;
  const height = DEFAULT_H;

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditLabel(nodeData.label);
    setEditing(true);
  }, [nodeData.label]);

  const commitEdit = useCallback(() => {
    updateNodeData(id, { label: editLabel });
    setEditing(false);
  }, [id, editLabel, updateNodeData]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(id);
  }, [id, setSelectedNode]);

  const hasNotes = !!nodeData.notes && nodeData.notes.replace(/<[^>]+>/g, '').trim().length > 0;

  return (
    <div
      className="mano-node relative"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ width, height, position: 'relative' }}
    >
      <NodeResizer
        minWidth={80} minHeight={40}
        isVisible={selected}
        lineStyle={{ borderColor: '#E8651A' }}
        handleStyle={{ backgroundColor: '#E8651A', width: 8, height: 8, borderRadius: 2 }}
      />

      {editing ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <input
            autoFocus
            className="w-full h-full text-center text-sm font-medium outline-none border-2 border-saffron rounded-lg bg-white dark:bg-stone-800 dark:text-white px-2"
            style={{ borderColor: '#E8651A' }}
            value={editLabel}
            onChange={e => setEditLabel(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') commitEdit();
              if (e.key === 'Escape') setEditing(false);
            }}
          />
        </div>
      ) : (
        <NodeShapeRenderer
          shape={nodeData.shape || 'rounded'}
          width={width}
          height={height}
          color={nodeData.color || '#ffffff'}
          borderColor={nodeData.borderColor || '#E8651A'}
          label={nodeData.label || 'Node'}
          selected={selected}
          darkMode={darkMode}
          hasNotes={hasNotes}
          tags={nodeData.tags}
        />
      )}

      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
};
