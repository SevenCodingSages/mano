import React, { useState } from 'react';
import { useManoStore } from '../../store';
import { exportMarkdown, saveToFile } from '../../utils/saveLoad';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props { onClose: () => void; }

type Format = 'png' | 'jpeg' | 'pdf' | 'json' | 'markdown';
type PaperSize = 'a0' | 'a1' | 'a2' | 'a3' | 'a4';

const PAPER_DPI = 150;
const PAPER_SIZES_MM: Record<PaperSize, [number, number]> = {
  a0: [841, 1189], a1: [594, 841], a2: [420, 594], a3: [297, 420], a4: [210, 297],
};

export const ExportModal: React.FC<Props> = ({ onClose }) => {
  const { darkMode, nodes, edges, mapName } = useManoStore();
  const [format, setFormat] = useState<Format>('png');
  const [paper, setPaper] = useState<PaperSize>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [exporting, setExporting] = useState(false);

  const bg = darkMode ? 'bg-stone-800 text-gray-200' : 'bg-white text-gray-800';
  const inputCls = `w-full rounded border px-2 py-1.5 text-sm ${darkMode ? 'bg-stone-700 border-stone-500 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} outline-none focus:border-orange-400`;
  const btnPrimary = 'px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50';

  const doExport = async () => {
    setExporting(true);
    try {
      const canvas = document.querySelector('.react-flow') as HTMLElement;
      if (!canvas) return;

      if (format === 'json') {
        const { groups, viewport } = useManoStore.getState();
        saveToFile({ nodes, edges, groups, viewport, mapName, metadata: { name: mapName, createdAt: '', updatedAt: '' } });
        onClose();
        return;
      }

      if (format === 'markdown') {
        const md = exportMarkdown(nodes, edges);
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${mapName}.md`; a.click();
        URL.revokeObjectURL(url);
        onClose();
        return;
      }

      // Image / PDF export
      const [w_mm, h_mm] = orientation === 'portrait' ? PAPER_SIZES_MM[paper] : [PAPER_SIZES_MM[paper][1], PAPER_SIZES_MM[paper][0]];
      const px_w = Math.round(w_mm * PAPER_DPI / 25.4);
      const px_h = Math.round(h_mm * PAPER_DPI / 25.4);

      const captured = await html2canvas(canvas, {
        useCORS: true,
        scale: px_w / canvas.clientWidth,
        backgroundColor: darkMode ? '#1C1917' : '#FDFAF6',
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      });

      if (format === 'pdf') {
        const pdf = new jsPDF({ orientation, unit: 'mm', format: paper.toUpperCase() as any });
        const imgData = captured.toDataURL('image/jpeg', 0.92);
        const pages_x = Math.ceil(captured.width / px_w);
        const pages_y = Math.ceil(captured.height / px_h);
        for (let py = 0; py < pages_y; py++) {
          for (let px = 0; px < pages_x; px++) {
            if (py > 0 || px > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', -px * w_mm, -py * h_mm, captured.width * 25.4 / PAPER_DPI, captured.height * 25.4 / PAPER_DPI);
          }
        }
        pdf.save(`${mapName}.pdf`);
      } else {
        const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const url = captured.toDataURL(mime, 0.92);
        const a = document.createElement('a');
        a.href = url; a.download = `${mapName}.${format}`; a.click();
      }
      onClose();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`${bg} rounded-2xl shadow-2xl w-96 p-6`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Export Map</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Format</label>
            <select className={inputCls} value={format} onChange={e => setFormat(e.target.value as Format)}>
              <option value="png">PNG Image</option>
              <option value="jpeg">JPEG Image</option>
              <option value="pdf">PDF Document</option>
              <option value="json">JSON (.mano) — Full Data</option>
              <option value="markdown">Markdown Outline</option>
            </select>
          </div>

          {(format === 'png' || format === 'jpeg' || format === 'pdf') && (
            <>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Paper Size</label>
                <select className={inputCls} value={paper} onChange={e => setPaper(e.target.value as PaperSize)}>
                  <option value="a4">A4</option>
                  <option value="a3">A3</option>
                  <option value="a2">A2</option>
                  <option value="a1">A1</option>
                  <option value="a0">A0</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Orientation</label>
                <select className={inputCls} value={orientation} onChange={e => setOrientation(e.target.value as any)}>
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className={`flex-1 px-4 py-2 rounded-lg text-sm border ${darkMode ? 'border-stone-500 text-gray-300 hover:bg-stone-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            Cancel
          </button>
          <button
            onClick={doExport}
            disabled={exporting}
            className={`flex-1 ${btnPrimary}`}
            style={{ background: '#E8651A' }}
          >
            {exporting ? 'Exporting…' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};
