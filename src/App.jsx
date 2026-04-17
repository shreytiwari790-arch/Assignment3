import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './componenets/Sidebar';
import Canvas from './componenets/Canvas';
import PreviewModal from './componenets/PreviewModal';
import { usePersistentState } from './hooks/usePersistentState';
import { Eye, RotateCcw, PenTool } from 'lucide-react';

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
    <div className="flex min-h-screen bg-[#f8f6f3]">
      <Sidebar onAdd={addBlock} blockCount={blocks.length} />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-[#faf9f7]/90 backdrop-blur-lg border-b border-[#e8e4dd]">
          <div className=" mx-auto px-8 lg:px-12 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-full h-9 rounded-lg bg-[#2d2a26] flex items-center justify-center">
                <PenTool size={15} className="text-[#f8f6f3]" />
              </div>
              <div>
                <h1
                  className="text-[17px] font-bold text-[#2d2a26] tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  BuilderX
                </h1>
                <p className="text-[10px] text-[#b5b0a8] font-medium -mt-0.5 tracking-wide uppercase">
                  Content Builder
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              {blocks.length > 0 && (
                <span className="text-[11px] font-semibold text-[#8b7355] bg-[#f5f0ea] px-3 py-1.5 rounded-lg border border-[#e8e0d4]">
                  {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
                </span>
              )}
              <button
                onClick={clearAll}
                disabled={blocks.length === 0}
                className="p-2 rounded-lg text-[#b5b0a8] hover:text-[#c0564b] hover:bg-[#fdf0ee] border border-transparent hover:border-[#f0cdc8] transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:text-[#b5b0a8] disabled:hover:bg-transparent disabled:hover:border-transparent"
                title="Clear all blocks"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setShowPreview(true)}
                disabled={blocks.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d2a26] text-[#f8f6f3] text-[13px] font-semibold hover:bg-[#3d3a36] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#2d2a26]"
              >
                <Eye size={14} />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className=" mx-auto px-8 lg:px-12 py-10">
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