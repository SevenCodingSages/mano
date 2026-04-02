import React from 'react';
import { useManoStore } from '../../store';
import { ManoNodeData, NodeShape } from '../../types';
import { Node } from '@xyflow/react';

type ManoNode = Node<ManoNodeData>;

interface Props {
  onAddNode: (shape: NodeShape, isCitation?: boolean) => void;
}

interface ToolBtn {
  icon: string;
  title: string;
  action: () => void;
}

export const LeftBar: React.FC<Props> = ({ onAddNode }) => {
  const { darkMode } = useManoStore();

  const bg = darkMode ? 'bg-stone-900 border-stone-700' : 'bg-white border-gray-200';
  const btnCls = `w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-stone-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`;

  const sections: { label: string; buttons: ToolBtn[] }[] = [
    {
      label: 'Nodes',
      buttons: [
        { icon: '⬜', title: 'Add rounded node', action: () => onAddNode('rounded') },
        { icon: '▭', title: 'Add rectangle', action: () => onAddNode('rectangle') },
        { icon: '⬭', title: 'Add ellipse', action: () => onAddNode('ellipse') },
        { icon: '⬧', title: 'Add diamond (decision)', action: () => onAddNode('diamond') },
        { icon: '⬡', title: 'Add hexagon', action: () => onAddNode('hexagon') },
      ],
    },
    {
      label: 'Flow',
      buttons: [
        { icon: '◯', title: 'Start/End (oval)', action: () => onAddNode('ellipse') },
        { icon: '□', title: 'Process (rectangle)', action: () => onAddNode('rectangle') },
        { icon: '◇', title: 'Decision (diamond)', action: () => onAddNode('diamond') },
        { icon: '⟨⟩', title: 'Input/Output (parallelogram)', action: () => onAddNode('parallelogram') },
        { icon: '●', title: 'Connector (circle)', action: () => onAddNode('circle') },
      ],
    },
    {
      label: 'Tools',
      buttons: [
        { icon: '📄', title: 'Add Citation Card', action: () => onAddNode('rounded', true) },
        { icon: 'T', title: 'Add text label', action: () => onAddNode('rounded') },
      ],
    },
  ];

  return (
    <div className={`flex flex-col w-14 border-r ${bg} pt-2 pb-4 shrink-0 z-10`}>
      {sections.map(section => (
        <div key={section.label} className="mb-3">
          <div className={`text-center text-[9px] font-semibold mb-1 ${darkMode ? 'text-stone-500' : 'text-gray-400'} uppercase tracking-wide`}>
            {section.label}
          </div>
          <div className="flex flex-col items-center gap-1">
            {section.buttons.map(btn => (
              <button
                key={btn.title}
                title={btn.title}
                className={btnCls}
                onClick={btn.action}
              >
                {btn.icon}
              </button>
            ))}
          </div>
          <div className={`border-t mx-2 mt-2 ${darkMode ? 'border-stone-700' : 'border-gray-100'}`} />
        </div>
      ))}
    </div>
  );
};
