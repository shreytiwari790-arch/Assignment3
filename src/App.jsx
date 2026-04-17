import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './componenets/Sidebar';
import Canvas from './componenets/Canvas';
import PreviewModal from './componenets/PreviewModal';
import { usePersistentState } from './hooks/usePersistentState';
import { Layers, Eye, RotateCcw, Sparkles } from 'lucide-react';

const BLOCK_DEFAULTS = {
  header: { text: 'New Section Heading', level: 'h2' },
  text: { text: 'Start writing your content here. Click to edit this paragraph block and add your own text.' },
  image: { url: '', alt: '', caption: '' },
  markdown: { text: '## Hello Markdown!\n\nYou can write **bold**, *italic*, and `inline code`.\n\n- List item one\n- List item two\n\n> This is a blockquote' },
};

export default function App() {
  const [blocks, setBlocks] = usePersistentState('builderx-layout', []);
  const [showPreview, setShowPreview] = useState(false);

  const addBlock = (type) => {
    const newBlock = {
      id: uuidv4(),
      type,
      content: JSON.parse(JSON.stringify(BLOCK_DEFAULTS[type])),
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, content) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...content } } : b)));
  };

  const duplicateBlock = (id) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const idx = blocks.indexOf(block);
    const newBlock = { ...block, id: uuidv4(), content: { ...block.content } };
    const newBlocks = [...blocks];
    newBlocks.splice(idx + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const clearAll = () => {
    if (blocks.length === 0) return;
    if (window.confirm('Clear all blocks? This cannot be undone.')) {
      setBlocks([]);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(blocks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setBlocks(items);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <Sidebar onAdd={addBlock} blockCount={blocks.length} />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
          <div className="max-w-4xl mx-auto px-8 lg:px-12 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                  <Layers size={18} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm" style={{ animation: 'pulse 2s infinite' }}>
                  <Sparkles size={8} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">BuilderX</h1>
                <p className="text-[11px] text-gray-400 -mt-0.5 font-medium">Personal Content Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {blocks.length > 0 && (
                <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-100">
                  {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
                </span>
              )}
              <button
                onClick={clearAll}
                disabled={blocks.length === 0}
                className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:hover:border-transparent"
                title="Clear all blocks"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setShowPreview(true)}
                disabled={blocks.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
              >
                <Eye size={15} />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="max-w-4xl mx-auto px-8 lg:px-12 py-10">
          <Canvas
            blocks={blocks}
            onDragEnd={onDragEnd}
            updateBlock={updateBlock}
            deleteBlock={deleteBlock}
            duplicateBlock={duplicateBlock}
          />
        </div>
      </main>

      {showPreview && (
        <PreviewModal blocks={blocks} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}