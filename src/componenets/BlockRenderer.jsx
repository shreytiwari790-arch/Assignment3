import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown, ImageOff, Upload, Image as ImageIcon, Link2, Type, X } from 'lucide-react';

// Simple markdown parser (covers bold, italic, code, headings, lists, blockquotes, links)
function parseMarkdown(md) {
  if (!md) return '';
  let html = md
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-xl my-3 text-sm overflow-x-auto font-mono">$1</pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-800 mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-indigo-300 pl-4 py-1 my-2 italic text-gray-500">$1</blockquote>')
    // Unordered list
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-600">$1</li>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-500 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*(?:<br\s*\/?>)?)+)/g, '<ul class="my-2 space-y-1">$1</ul>');
  return html;
}

const HEADER_LEVELS = [
  { value: 'h1', label: 'Heading 1', size: 'text-4xl', preview: 'H1' },
  { value: 'h2', label: 'Heading 2', size: 'text-3xl', preview: 'H2' },
  { value: 'h3', label: 'Heading 3', size: 'text-2xl', preview: 'H3' },
  { value: 'h4', label: 'Heading 4', size: 'text-xl', preview: 'H4' },
  { value: 'h5', label: 'Heading 5', size: 'text-lg', preview: 'H5' },
  { value: 'h6', label: 'Heading 6', size: 'text-base', preview: 'H6' },
];

function HeaderBlock({ block, updateBlock }) {
  const [showMenu, setShowMenu] = useState(false);
  const level = HEADER_LEVELS.find((h) => h.value === block.content.level) || HEADER_LEVELS[1];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl hover:bg-amber-100 hover:border-amber-300 transition-all duration-200 shadow-sm"
          >
            {level.value.toUpperCase()} <ChevronDown size={12} className={`transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200/80 rounded-2xl shadow-2xl py-2 z-50 min-w-[180px] backdrop-blur-xl" style={{ animation: 'dropdownIn 0.2s ease-out' }}>
                {HEADER_LEVELS.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => {
                      updateBlock(block.id, { level: h.value });
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-all duration-150 flex items-center gap-3 ${
                      h.value === block.content.level ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'text-gray-600'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black tracking-wider ${
                      h.value === block.content.level
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {h.preview}
                    </span>
                    {h.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <input
        className={`w-full bg-transparent outline-none font-extrabold text-gray-900 placeholder-gray-300 ${level.size} transition-all duration-200 focus:placeholder-gray-400`}
        value={block.content.text}
        placeholder="Type your heading..."
        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
      />
    </div>
  );
}

function TextBlock({ block, updateBlock }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-200 rounded-xl ${isFocused ? 'ring-2 ring-blue-100' : ''}`}>
      <textarea
        className="w-full bg-transparent outline-none text-gray-600 leading-relaxed text-base min-h-[140px] resize-none placeholder-gray-300 p-1 transition-colors duration-200 focus:text-gray-700"
        value={block.content.text}
        placeholder="Write your paragraph here..."
        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="flex items-center justify-end mt-1 opacity-60">
        <span className="text-[10px] text-gray-400 font-medium">
          {(block.content.text || '').length} characters
        </span>
      </div>
    </div>
  );
}

function ImageBlock({ block, updateBlock }) {
  const [imgError, setImgError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState('url');
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgError(false);
      updateBlock(block.id, { url: e.target.result, alt: file.name });
    };
    reader.readAsDataURL(file);
  }, [block.id, updateBlock]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
  }, [handleFile]);

  const clearImage = useCallback(() => {
    setImgError(false);
    updateBlock(block.id, { url: '', alt: '', caption: '' });
  }, [block.id, updateBlock]);

  return (
    <div className="space-y-5">
      {/* Image Preview / Drop Zone */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isDragOver
            ? 'ring-2 ring-emerald-400 ring-offset-2 shadow-lg shadow-emerald-100'
            : 'shadow-sm'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imgError || !block.content.url ? (
          <div
            className={`w-full min-h-[220px] flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
              isDragOver
                ? 'border-emerald-400 bg-emerald-50/60'
                : 'border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100/50 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragOver
                ? 'bg-emerald-100 scale-110'
                : 'bg-gray-100'
            }`}>
              {isDragOver ? (
                <Upload size={28} className="text-emerald-500 animate-bounce" />
              ) : (
                <ImageIcon size={28} className="text-gray-400" />
              )}
            </div>
            <div className="text-center px-4">
              <p className={`text-sm font-semibold transition-colors duration-200 ${isDragOver ? 'text-emerald-600' : 'text-gray-500'}`}>
                {isDragOver ? 'Drop your image here' : 'Drag & drop an image here'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or <span className="text-emerald-500 font-medium hover:underline">click to browse</span> · PNG, JPG, GIF, SVG
              </p>
            </div>
          </div>
        ) : (
          <div className="relative group/img">
            <img
              src={block.content.url}
              alt={block.content.alt || 'Block image'}
              className="w-full h-auto max-h-[400px] object-cover rounded-2xl"
              onError={() => setImgError(true)}
              onLoad={() => setImgError(false)}
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-between p-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-semibold text-gray-700 hover:bg-white transition-all shadow-lg"
              >
                <Upload size={13} /> Replace
              </button>
              <button
                onClick={clearImage}
                className="w-8 h-8 flex items-center justify-center bg-red-500/90 backdrop-blur-sm rounded-xl text-white hover:bg-red-600 transition-all shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* URL / Details Tabs */}
      <div className="space-y-3">
        <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'url'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Link2 size={12} /> URL
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'details'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Type size={12} /> Details
          </button>
        </div>

        {activeTab === 'url' ? (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg whitespace-nowrap">URL</span>
            <input
              className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
              value={block.content.url}
              placeholder="https://example.com/image.jpg"
              onChange={(e) => {
                setImgError(false);
                updateBlock(block.id, { url: e.target.value });
              }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 border border-gray-200/50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">Alt</span>
              <input
                className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                value={block.content.alt || ''}
                placeholder="Image description"
                onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 border border-gray-200/50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">Caption</span>
              <input
                className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                value={block.content.caption || ''}
                placeholder="Optional caption"
                onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function MarkdownBlock({ block, updateBlock }) {
  const [tab, setTab] = useState('write');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <div className="flex gap-1 mb-5 bg-gray-100/80 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('write')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'write'
              ? 'bg-white text-violet-700 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          ✍️ Write
        </button>
        <button
          onClick={() => setTab('preview')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'preview'
              ? 'bg-white text-violet-700 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          👁️ Preview
        </button>
      </div>

      {tab === 'write' ? (
        <div className={`relative rounded-xl transition-all duration-200 ${isFocused ? 'ring-2 ring-violet-100' : ''}`}>
          <textarea
            className="w-full bg-gray-50 rounded-xl p-5 outline-none font-mono text-sm text-gray-700 min-h-[220px] resize-none border border-gray-200 focus:border-violet-400 transition-all leading-relaxed"
            value={block.content.text}
            placeholder="Write markdown here..."
            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-gray-400 font-medium">
              Supports **bold**, *italic*, `code`, # headings, - lists
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {(block.content.text || '').split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>
      ) : (
        <div
          className="prose prose-sm max-w-none bg-gray-50 rounded-xl p-5 min-h-[220px] border border-gray-200 text-gray-700"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(block.content.text) }}
        />
      )}
    </div>
  );
}

export default function BlockRenderer({ block, updateBlock }) {
  switch (block.type) {
    case 'header':
      return <HeaderBlock block={block} updateBlock={updateBlock} />;
    case 'text':
      return <TextBlock block={block} updateBlock={updateBlock} />;
    case 'image':
      return <ImageBlock block={block} updateBlock={updateBlock} />;
    case 'markdown':
      return <MarkdownBlock block={block} updateBlock={updateBlock} />;
    default:
      return <p className="text-red-400">Unknown block type: {block.type}</p>;
  }
}