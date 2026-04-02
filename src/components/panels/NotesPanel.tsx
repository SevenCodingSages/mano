import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useManoStore } from '../../store';
import { ManoNodeData, ManoTag, CitationData } from '../../types';

interface ToolbarBtnProps {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  darkMode?: boolean;
}
const ToolbarBtn: React.FC<ToolbarBtnProps> = ({ active, onClick, title, children, darkMode }) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${active
      ? 'bg-saffron text-white'
      : darkMode ? 'text-gray-300 hover:bg-stone-600' : 'text-gray-600 hover:bg-gray-200'}`}
    style={active ? { background: '#E8651A', color: 'white' } : {}}
  >
    {children}
  </button>
);

const RELATIONSHIPS = ['causes', 'supports', 'contradicts', 'precedes', 'belongs to', 'references', 'leads to', 'yes', 'no'];
const TAG_COLORS = ['#E8651A', '#1A6B5A', '#2563EB', '#DC2626', '#9333EA', '#CA8A04', '#0891B2', '#be185d'];

export const NotesPanel: React.FC = () => {
  const { nodes, edges, selectedNodeId, darkMode, updateNodeData, deleteNode, duplicateNode } = useManoStore();

  const node = nodes.find(n => n.id === selectedNodeId);
  const nodeData = node?.data as unknown as ManoNodeData | undefined;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: nodeData?.notes || '',
    onUpdate: ({ editor }) => {
      if (selectedNodeId) {
        updateNodeData(selectedNodeId, { notes: editor.getHTML() });
      }
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
        style: `color: ${darkMode ? '#f1f5f9' : '#1c1917'}`,
      },
    },
  });

  useEffect(() => {
    if (editor && nodeData) {
      const current = editor.getHTML();
      if (current !== nodeData.notes) {
        editor.commands.setContent(nodeData.notes || '');
      }
    }
  }, [selectedNodeId]);

  const addTag = useCallback(() => {
    if (!selectedNodeId || !nodeData) return;
    const name = prompt('Tag name:');
    if (!name?.trim()) return;
    const color = TAG_COLORS[nodeData.tags.length % TAG_COLORS.length];
    const newTag: ManoTag = { id: `tag-${Date.now()}`, name: name.trim(), color };
    updateNodeData(selectedNodeId, { tags: [...nodeData.tags, newTag] });
  }, [selectedNodeId, nodeData, updateNodeData]);

  const removeTag = useCallback((tagId: string) => {
    if (!selectedNodeId || !nodeData) return;
    updateNodeData(selectedNodeId, { tags: nodeData.tags.filter(t => t.id !== tagId) });
  }, [selectedNodeId, nodeData, updateNodeData]);

  const updateCitation = useCallback((field: keyof CitationData, value: string) => {
    if (!selectedNodeId || !nodeData?.citationData) return;
    updateNodeData(selectedNodeId, {
      citationData: { ...nodeData.citationData, [field]: value }
    });
  }, [selectedNodeId, nodeData, updateNodeData]);

  if (!selectedNodeId || !node) return null;

  const bg = darkMode ? 'bg-stone-800 border-stone-600' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSec = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputCls = `w-full rounded border px-2 py-1 text-sm ${darkMode ? 'bg-stone-700 border-stone-500 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} outline-none focus:border-orange-400`;

  return (
    <div
      className={`fixed right-0 top-12 bottom-0 w-80 ${bg} border-l shadow-xl flex flex-col z-20 overflow-y-auto`}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? 'border-stone-600' : 'border-gray-200'}`}>
        <span className={`font-semibold text-sm ${textPrimary}`}>
          {nodeData?.isCitation ? '📄 Citation Card' : '📝 Node Notes'}
        </span>
        <div className="flex gap-1">
          <button
            title="Duplicate node"
            onClick={() => duplicateNode(selectedNodeId)}
            className={`px-2 py-1 rounded text-xs ${darkMode ? 'hover:bg-stone-600 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >⧉</button>
          <button
            title="Delete node"
            onClick={() => deleteNode(selectedNodeId)}
            className="px-2 py-1 rounded text-xs hover:bg-red-100 text-red-500"
          >✕</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label */}
        <div>
          <label className={`block text-xs font-medium mb-1 ${textSec}`}>Label</label>
          <input
            className={inputCls}
            value={nodeData?.label || ''}
            onChange={e => updateNodeData(selectedNodeId, { label: e.target.value })}
          />
        </div>

        {/* Shape selector for regular nodes */}
        {!nodeData?.isCitation && (
          <div>
            <label className={`block text-xs font-medium mb-1 ${textSec}`}>Shape</label>
            <select
              className={inputCls}
              value={nodeData?.shape || 'rounded'}
              onChange={e => updateNodeData(selectedNodeId, { shape: e.target.value as any })}
            >
              {['rounded', 'rectangle', 'ellipse', 'diamond', 'parallelogram', 'hexagon', 'cylinder', 'cloud', 'circle'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        )}

        {/* Colors */}
        {!nodeData?.isCitation && (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={`block text-xs font-medium mb-1 ${textSec}`}>Fill</label>
              <input type="color" className="w-full h-8 rounded cursor-pointer border border-gray-300"
                value={nodeData?.color || '#ffffff'}
                onChange={e => updateNodeData(selectedNodeId, { color: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className={`block text-xs font-medium mb-1 ${textSec}`}>Border</label>
              <input type="color" className="w-full h-8 rounded cursor-pointer border border-gray-300"
                value={nodeData?.borderColor || '#E8651A'}
                onChange={e => updateNodeData(selectedNodeId, { borderColor: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Citation fields */}
        {nodeData?.isCitation && nodeData.citationData && (
          <div className="space-y-2">
            {(Object.entries(nodeData.citationData) as [keyof CitationData, string][]).map(([field, value]) => (
              <div key={field}>
                <label className={`block text-xs font-medium mb-1 ${textSec}`}>
                  {field === 'doi' ? 'DOI / URL' : field === 'volumeIssuePages' ? 'Vol / Issue / Pages' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field === 'notes' ? (
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={value}
                    onChange={e => updateCitation(field, e.target.value)}
                  />
                ) : (
                  <input className={inputCls} value={value} onChange={e => updateCitation(field, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-xs font-medium ${textSec}`}>Tags</label>
            <button onClick={addTag} className="text-xs text-orange-500 hover:text-orange-600 font-medium">+ Add</button>
          </div>
          <div className="flex flex-wrap gap-1">
            {nodeData?.tags.map(tag => (
              <span key={tag.id}
                style={{ background: tag.color + '22', border: `1px solid ${tag.color}`, color: tag.color }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {tag.name}
                <button onClick={() => removeTag(tag.id)} className="hover:opacity-70">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes editor */}
        <div>
          <label className={`block text-xs font-medium mb-1 ${textSec}`}>Notes</label>

          {/* Toolbar */}
          {editor && (
            <div className={`flex flex-wrap gap-0.5 mb-1 p-1 rounded border ${darkMode ? 'bg-stone-700 border-stone-600' : 'bg-gray-50 border-gray-200'}`}>
              <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold" darkMode={darkMode}><b>B</b></ToolbarBtn>
              <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic" darkMode={darkMode}><i>I</i></ToolbarBtn>
              <ToolbarBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline" darkMode={darkMode}><u>U</u></ToolbarBtn>
              <ToolbarBtn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1" darkMode={darkMode}>H1</ToolbarBtn>
              <ToolbarBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2" darkMode={darkMode}>H2</ToolbarBtn>
              <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list" darkMode={darkMode}>•≡</ToolbarBtn>
              <ToolbarBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list" darkMode={darkMode}>1≡</ToolbarBtn>
              <ToolbarBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote" darkMode={darkMode}>"</ToolbarBtn>
              <ToolbarBtn active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code" darkMode={darkMode}>{`</>`}</ToolbarBtn>
            </div>
          )}

          <div className={`rounded border p-2 min-h-32 text-sm ${darkMode ? 'bg-stone-700 border-stone-600 text-gray-200' : 'bg-white border-gray-300'}`}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};
