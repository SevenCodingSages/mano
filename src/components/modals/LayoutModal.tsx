import React, { useState } from 'react';
import { useManoStore } from '../../store';
import { applyAutoLayout } from '../../utils/autoLayout';

interface Props { onClose: () => void; }

type LayoutType = 'topdown' | 'leftright' | 'force';

export const LayoutModal: React.FC<Props> = ({ onClose }) => {
  const { nodes, edges, darkMode } = useManoStore();
  const [layoutType, setLayoutType] = useState<LayoutType>('topdown');
  const [applying, setApplying] = useState(false);

  const bg = darkMode ? 'bg-stone-800 text-gray-200' : 'bg-white text-gray-800';

  const doLayout = async () => {
    setApplying(true);
    try {
      const newNodes = await applyAutoLayout(nodes, edges, layoutType);
      useManoStore.getState().pushHistory();
      useManoStore.setState({ nodes: newNodes as any });
      onClose();
    } catch (e) {
      console.error('Layout failed:', e);
    } finally {
      setApplying(false);
    }
  };

  const options: { value: LayoutType; label: string; desc: string; icon: string }[] = [
    { value: 'topdown', label: 'Top-Down Tree', desc: 'Hierarchical layout flowing downward. Best for flowcharts.', icon: '⬇' },
    { value: 'leftright', label: 'Left-Right Tree', desc: 'Hierarchical layout flowing rightward. Great for timelines.', icon: '➡' },
    { value: 'force', label: 'Force-Directed', desc: 'Organic, web-like layout. Great for mind maps.', icon: '✦' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`${bg} rounded-2xl shadow-2xl w-96 p-6`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Auto Layout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
        </div>

        <div className="space-y-2 mb-5">
          {options.map(opt => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${layoutType === opt.value
                ? 'border-orange-400 bg-orange-50/50' + (darkMode ? ' bg-orange-950/20' : '')
                : darkMode ? 'border-stone-600 hover:border-stone-500' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <input type="radio" name="layout" value={opt.value} checked={layoutType === opt.value}
                onChange={() => setLayoutType(opt.value)} className="mt-1 accent-orange-500" />
              <div>
                <div className="font-medium text-sm flex items-center gap-1.5">
                  <span>{opt.icon}</span> {opt.label}
                </div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className={`flex-1 px-4 py-2 rounded-lg text-sm border ${darkMode ? 'border-stone-500 text-gray-300 hover:bg-stone-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            Cancel
          </button>
          <button
            onClick={doLayout}
            disabled={applying}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: '#E8651A' }}
          >
            {applying ? 'Arranging…' : 'Apply Layout'}
          </button>
        </div>
      </div>
    </div>
  );
};
