import React from 'react';
import {
  EdgeProps, getBezierPath, getStraightPath, getSmoothStepPath, EdgeLabelRenderer, BaseEdge
} from '@xyflow/react';
import { ManoEdgeData } from '../../types';

export const ManoEdge: React.FC<EdgeProps> = ({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected, markerEnd, markerStart
}) => {
  const d = data as unknown as ManoEdgeData;
  const edgeType = d?.edgeType || 'bezier';
  const color = d?.color || '#94a3b8';
  const strokeStyle = d?.strokeStyle || 'solid';
  const relationship = d?.relationship || '';
  const arrowType = d?.arrowType || 'target';

  let edgePath = '';
  let labelX = 0, labelY = 0;

  if (edgeType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  } else if (edgeType === 'step' || edgeType === 'smoothstep') {
    [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  } else {
    [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  }

  const strokeDasharray = strokeStyle === 'dashed' ? '8,4' : strokeStyle === 'dotted' ? '2,4' : undefined;

  const markerEndId = arrowType === 'target' || arrowType === 'both' ? `url(#arrow-${id})` : undefined;
  const markerStartId = arrowType === 'source' || arrowType === 'both' ? `url(#arrow-start-${id})` : undefined;

  return (
    <>
      <defs>
        <marker id={`arrow-${id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </marker>
        <marker id={`arrow-start-${id}`} markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
          <polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </marker>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: selected ? 2.5 : 2,
          strokeDasharray,
        }}
        markerEnd={markerEndId}
        markerStart={markerStartId}
      />
      {relationship && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              cursor: 'pointer',
            }}
            className="nodrag nopan"
          >
            <span style={{
              background: 'rgba(255,255,255,0.92)',
              border: `1px solid ${color}`,
              borderRadius: 4,
              padding: '1px 6px',
              fontSize: 11,
              fontWeight: 500,
              color: '#374151',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              {relationship}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
