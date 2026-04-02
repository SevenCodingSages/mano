import React, { useState } from 'react';
import { useManoStore } from '../../store';
import { generateBibliography, BibFormat } from '../../utils/bibliography';

interface Props { onClose: () => void; }

export const BibliographyModal: React.FC<Props> = ({ onClose }) => {
  const { nodes, darkMode } = useManoStore();
  const [format, setFormat] = useState<BibFormat>('apa7');
  const [copied, setCopied] = useState(false);

  const citationNodes = nodes.filter(n => (n.data as any).isCitation);
  const bib = generateBibliography(citationNodes, format);

  const bg = darkMode ? 'bg-stone-800 text-gray-200' : 'bg-white text-gray-800';
  const inputCls = `rounded border px-2 py-1.5 text-sm ${darkMode ? 'bg-stone-700 border-stone-500 text-gray-200' : 'bg-white border-gray-300'} outline-none focus:border-orange-400`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([bib], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bibliography.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`${bg} rounded-2xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col p-6`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Bibliography Export</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Format:</label>
          <select className={inputCls} value={format} onChange={e => setFormat(e.target.value as BibFormat)}>
            <option value="apa7">APA 7th Edition</option>
            <option value="mla9">MLA 9th Edition</option>
            <option value="chicago17">Chicago 17th Edition</option>
            <option value="plain">Plain Text</option>
          </select>
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{citationNodes.length} citation{citationNodes.length !== 1 ? 's' : ''}</span>
        </div>

        {citationNodes.length === 0 ? (
          <div className={`flex-1 flex items-center justify-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No citation cards on the canvas yet.<br />
            Add citation cards from the left toolbar.
          </div>
        ) : (
          <textarea
            readOnly
            className={`flex-1 rounded-lg border p-3 text-sm font-mono resize-none ${darkMode ? 'bg-stone-700 border-stone-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
            value={bib}
          />
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={copyToClipboard}
            disabled={!bib}
            className={`flex-1 px-3 py-2 rounded-lg text-sm border font-medium transition-colors ${darkMode ? 'border-stone-500 text-gray-300 hover:bg-stone-700 disabled:opacity-40' : 'border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40'}`}
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={downloadTxt}
            disabled={!bib}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
            style={{ background: '#1A6B5A' }}
          >
            Download .txt
          </button>
          <button onClick={onClose} className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'text-gray-400 hover:bg-stone-700' : 'text-gray-500 hover:bg-gray-50'}`}>Close</button>
        </div>
      </div>
    </div>
  );
};
