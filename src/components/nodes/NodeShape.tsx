import React from 'react';
import { NodeShape as NodeShapeType } from '../../types';

interface Props {
  shape: NodeShapeType;
  width: number;
  height: number;
  color: string;
  borderColor: string;
  label: string;
  selected?: boolean;
  darkMode?: boolean;
  hasNotes?: boolean;
  tags?: { id: string; name: string; color: string }[];
}

export const NodeShapeRenderer: React.FC<Props> = ({
  shape, width, height, color, borderColor, label, selected, darkMode, hasNotes, tags = []
}) => {
  const fill = color || (darkMode ? '#2a2a2a' : '#ffffff');
  const stroke = selected ? '#E8651A' : borderColor;
  const strokeW = selected ? 2.5 : 1.5;
  const textColor = darkMode ? '#f1f5f9' : '#1c1917';

  const textEl = (
    <foreignObject x={8} y={8} width={width - 16} height={height - 16}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 500,
          color: textColor,
          fontFamily: 'inherit',
          wordBreak: 'break-word',
          textAlign: 'center',
          lineHeight: 1.3,
          padding: '2px 4px',
          userSelect: 'none',
        }}
      >
        {label}
      </div>
    </foreignObject>
  );

  const indicators = (
    <>
      {hasNotes && (
        <text x={width - 12} y={14} fontSize={10} fill="#E8651A" textAnchor="middle">📝</text>
      )}
      {tags.length > 0 && (
        <g>
          {tags.slice(0, 3).map((tag, i) => (
            <circle key={tag.id} cx={10 + i * 12} cy={height - 8} r={4} fill={tag.color} />
          ))}
        </g>
      )}
    </>
  );

  switch (shape) {
    case 'rectangle':
      return (
        <svg width={width} height={height} overflow="visible">
          <rect x={1} y={1} width={width - 2} height={height - 2} rx={0} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );

    case 'ellipse':
      return (
        <svg width={width} height={height} overflow="visible">
          <ellipse cx={width / 2} cy={height / 2} rx={(width - 2) / 2} ry={(height - 2) / 2} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );

    case 'diamond': {
      const cx = width / 2, cy = height / 2;
      const points = `${cx},1 ${width - 1},${cy} ${cx},${height - 1} 1,${cy}`;
      return (
        <svg width={width} height={height} overflow="visible">
          <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );
    }

    case 'parallelogram': {
      const skew = 15;
      const points = `${skew},1 ${width - 1},1 ${width - skew - 1},${height - 1} 1,${height - 1}`;
      return (
        <svg width={width} height={height} overflow="visible">
          <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );
    }

    case 'hexagon': {
      const s = height / 2;
      const w4 = width * 0.25;
      const points = `${w4},1 ${width - w4},1 ${width - 1},${s} ${width - w4},${height - 1} ${w4},${height - 1} 1,${s}`;
      return (
        <svg width={width} height={height} overflow="visible">
          <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );
    }

    case 'cylinder': {
      const ry = 10;
      return (
        <svg width={width} height={height} overflow="visible">
          <rect x={1} y={ry} width={width - 2} height={height - ry * 2} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          <ellipse cx={width / 2} cy={ry} rx={(width - 2) / 2} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          <ellipse cx={width / 2} cy={height - ry} rx={(width - 2) / 2} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );
    }

    case 'cloud': {
      const cx = width / 2, cy = height / 2;
      return (
        <svg width={width} height={height} overflow="visible">
          <path
            d={`M ${cx * 0.3},${cy + 10}
              a ${cy * 0.4},${cy * 0.4} 0 0,1 ${cx * 0.1 - cx * 0.3},${-cy * 0.3}
              a ${cy * 0.45},${cy * 0.45} 0 0,1 ${cx * 0.55},${-cy * 0.5}
              a ${cy * 0.4},${cy * 0.4} 0 0,1 ${cx * 0.7},${cy * 0.2}
              a ${cy * 0.35},${cy * 0.35} 0 0,1 ${cx * 0.1},${cy * 0.6}
              Z`}
            fill={fill} stroke={stroke} strokeWidth={strokeW}
            transform={`scale(${width / 160}, ${height / 80}) translate(0, 0)`}
          />
          {textEl}{indicators}
        </svg>
      );
    }

    case 'circle': {
      const r = Math.min(width, height) / 2 - 1;
      return (
        <svg width={width} height={height} overflow="visible">
          <circle cx={width / 2} cy={height / 2} r={r} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );
    }

    default: // rounded
      return (
        <svg width={width} height={height} overflow="visible">
          <rect x={1} y={1} width={width - 2} height={height - 2} rx={8} fill={fill} stroke={stroke} strokeWidth={strokeW} />
          {textEl}{indicators}
        </svg>
      );
  }
};
