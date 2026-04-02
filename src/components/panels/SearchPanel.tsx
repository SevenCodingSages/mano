import React, { useRef, useEffect } from 'react';
import { useManoStore } from '../../store';

export const SearchPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { nodes, searchQuery, activeTagFilters, setSearchQuery, toggleTagFilter, clearFilters, darkMode } = useManoStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Collect all unique tags from all nodes
  const allTags: { id: string; name: string; color: string }[] = [];
  const seen = new Set<string>();
  nodes.forEach(n => {
    const data = n.data as any;
    (data.tags || []).forEach((t: any) => {
      if (!seen.has(t.name)) {
        seen.add(t.name);
        allTags.push(t);
      }
    });
  });

  const bg = darkMode ? 'bg-stone-800 border-stone-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800';
  const inputCls = `flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`;

  return (
    <div className={`absolute top-14 left-1/2 -translate-x-1/2 w-96 ${bg} rounded-xl border shadow-2xl z-50 p-4`}
      onClick={e => e.stopPropagation()}
    >
      <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 mb-3 ${darkMode ? 'border-stone-500' : 'border-gray-300'}`}>
        <span className="text-gray-400 text-sm">🔍</span>
        <input
          ref={inputRef}
          className={inputCls}
          placeholder="Search nodes and notes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {(searchQuery || activeTagFilters.length > 0) && (
          <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium">Clear</button>
        )}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold ml-1">✕</button>
      </div>

      {allTags.length > 0 && (
        <div>
          <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filter by tag:</div>
          <div className="flex flex-wrap gap-1">
            {allTags.map(tag => {
              const active = activeTagFilters.includes(tag.name);
              return (
                <button
                  key={tag.name}
                  onClick={() => toggleTagFilter(tag.name)}
                  style={{
                    background: active ? tag.color : tag.color + '22',
                    border: `1px solid ${tag.color}`,
                    color: active ? 'white' : tag.color,
                  }}
                  className="px-2 py-0.5 rounded-full text-xs font-medium transition-colors"
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={`text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {searchQuery ? `Searching "${searchQuery}" across all nodes` : 'Type to search node labels and notes'}
      </div>
    </div>
  );
};
