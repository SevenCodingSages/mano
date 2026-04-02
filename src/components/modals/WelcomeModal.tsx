import React from 'react';
import { useManoStore } from '../../store';
import { TemplateType } from '../../types';

interface Props { onClose: () => void; }

export const WelcomeModal: React.FC<Props> = ({ onClose }) => {
  const { darkMode, resetToTemplate } = useManoStore();
  const bg = darkMode ? 'bg-stone-900 text-gray-100' : 'bg-stone-50 text-gray-900';

  const templates: { id: TemplateType; label: string; desc: string; icon: string; color: string }[] = [
    {
      id: 'blank', label: 'Blank Canvas', icon: '✦',
      desc: 'Start from scratch with an empty canvas.',
      color: '#E8651A',
    },
    {
      id: 'research', label: 'Research Map', icon: '🔬',
      desc: 'Central concept with citation cards, research gaps, and a theme container.',
      color: '#1A6B5A',
    },
    {
      id: 'story', label: 'Story Outline', icon: '📖',
      desc: "A hero's journey structure with protagonist, stages, and story arc nodes.",
      color: '#7C3AED',
    },
    {
      id: 'game', label: 'Game Design', icon: '🎮',
      desc: 'Skill tree with character class, branching paths, and unlock conditions.',
      color: '#2563EB',
    },
  ];

  const handleTemplate = (id: TemplateType) => {
    resetToTemplate(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className={`${bg} rounded-2xl shadow-2xl w-[560px] p-8`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: 'linear-gradient(135deg, #E8651A, #1A6B5A)' }}>
              म
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#E8651A' }}>Mano</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>मनो — Mind, Intellect, Thought</div>
            </div>
          </div>
          <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            A local-first mind mapping &amp; logic flow tool. All data stays on your device.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => handleTemplate(t.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${darkMode ? 'bg-stone-800 border-stone-600 hover:border-stone-400' : 'bg-white border-gray-200 hover:border-gray-300'}`}
              style={{ borderColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = t.color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="font-semibold text-sm mb-1" style={{ color: t.color }}>{t.label}</div>
              <div className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.desc}</div>
            </button>
          ))}
        </div>

        <div className={`text-center text-xs mt-5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          No login required · Works offline · All data stored locally
        </div>
      </div>
    </div>
  );
};
