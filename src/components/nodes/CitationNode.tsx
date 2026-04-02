import React, { useCallback } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { ManoNodeData } from '../../types';
import { useManoStore } from '../../store';

export const CitationNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as ManoNodeData;
  const cd = nodeData.citationData;
  const { darkMode, setSelectedNode } = useManoStore();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(id);
  }, [id, setSelectedNode]);

  const bg = darkMode ? '#1e293b' : '#F0F9FF';
  const border = selected ? '#E8651A' : '#1A6B5A';
  const textPrimary = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#475569';

  return (
    <div
      onClick={handleClick}
      style={{
        width: 240,
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 8,
        padding: '8px 10px',
        boxShadow: selected ? '0 0 0 2px rgba(232,101,26,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 12,
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: '#1A6B5A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          📄 Citation
        </span>
      </div>

      {/* Fields */}
      {[
        ['Title', cd?.title],
        ['Authors', cd?.authors],
        ['Year', cd?.year],
        ['Journal', cd?.journal],
        ['Vol/Issue/Pages', cd?.volumeIssuePages],
        ['DOI / URL', cd?.doi],
      ].map(([label, value]) => value ? (
        <div key={label as string} style={{ marginBottom: 3 }}>
          <span style={{ color: textSecondary, fontSize: 10 }}>{label}: </span>
          <span style={{ color: textPrimary, fontWeight: label === 'Title' ? 600 : 400 }}>{value}</span>
        </div>
      ) : null)}

      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
};
