import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown, Upload, Image as ImageIcon, Link2, Type, X } from 'lucide-react';

// Simple markdown parser (covers bold, italic, code, headings, lists, blockquotes, links)
function parseMarkdown(md) {
  if (!md) return '';
  let html = md
    .replace(/```([\s\S]*?)```/g, '<pre style="background:#2d2a26;color:#c8b89a;padding:16px;border-radius:8px;margin:12px 0;font-size:13px;overflow-x:auto;font-family:JetBrains Mono,monospace">$1</pre>')
    .replace(/`([^`]+)`/g, '<code style="background:#f5f0ea;color:#8b7355;padding:2px 6px;border-radius:4px;font-size:13px;font-family:JetBrains Mono,monospace">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:18px;font-weight:700;color:#2d2a26;margin:16px 0 8px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:20px;font-weight:700;color:#2d2a26;margin:16px 0 8px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:700;color:#2d2a26;margin:16px 0 8px">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="font-style:italic">$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #d0ccc4;padding-left:16px;padding-top:4px;padding-bottom:4px;margin:8px 0;font-style:italic;color:#8b8580">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:16px;list-style:disc;color:#5a5550">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#8b7355;text-decoration:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*(?:<br\s*\/?>)?)+)/g, '<ul style="margin:8px 0">$1</ul>');
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
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all duration-200"
            style={{
              color: '#8b7355',
              background: '#f5f0ea',
              border: '1px solid #e8e0d4',
            }}
          >
            {level.value.toUpperCase()}
            <ChevronDown
              size={11}
              className="transition-transform duration-200"
              style={{ transform: showMenu ? 'rotate(180deg)' : 'rotate(0)' }}
            />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div
                className="absolute top-full left-0 mt-1.5 py-1.5 z-50 min-w-[170px] rounded-lg"
                style={{
                  background: '#fff',
                  border: '1px solid #e8e4dd',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  animation: 'dropIn 0.2s ease-out',
                }}
              >
                {HEADER_LEVELS.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => {
                      updateBlock(block.id, { level: h.value });
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[13px] flex items-center gap-2.5 transition-colors duration-150"
                    style={{
                      color: h.value === block.content.level ? '#8b7355' : '#6b6660',
                      fontWeight: h.value === block.content.level ? 600 : 400,
                      background: h.value === block.content.level ? '#f5f0ea' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (h.value !== block.content.level) e.currentTarget.style.background = '#faf8f5'; }}
                    onMouseLeave={(e) => { if (h.value !== block.content.level) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span
                      className="w-7 h-7 rounded flex items-center justify-center text-[9px] font-black tracking-wider"
                      style={{
                        background: h.value === block.content.level ? '#8b7355' : '#f0ece6',
                        color: h.value === block.content.level ? '#fff' : '#b5b0a8',
                      }}
                    >
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
        className={`w-full bg-transparent outline-none font-bold placeholder-[#d0ccc4] ${level.size} transition-colors duration-200`}
        style={{ color: '#2d2a26', fontFamily: "'Playfair Display', serif" }}
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
    <div
      className="relative rounded-lg transition-all duration-200"
      style={{ outline: isFocused ? '2px solid rgba(90,110,127,0.15)' : 'none', outlineOffset: '2px' }}
    >
      <textarea
        className="w-full bg-transparent outline-none leading-relaxed text-[15px] min-h-[120px] resize-none p-1 transition-colors duration-200"
        style={{ color: '#5a5550', '::placeholder': { color: '#d0ccc4' } }}
        value={block.content.text}
        placeholder="Write your paragraph here..."
        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="flex items-center justify-end mt-1">
        <span className="text-[10px] font-medium" style={{ color: '#d0ccc4' }}>
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
    <div className="space-y-4">
      {/* Image Preview / Drop Zone */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-300"
        style={{
          outline: isDragOver ? '2px solid #6b8068' : 'none',
          outlineOffset: isDragOver ? '2px' : '0',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imgError || !block.content.url ? (
          <div
            className="w-full min-h-[200px] flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer transition-all duration-300"
            style={{
              border: `2px dashed ${isDragOver ? '#6b8068' : '#ddd8d0'}`,
              background: isDragOver ? 'rgba(107,128,104,0.06)' : '#faf8f5',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: isDragOver ? 'rgba(107,128,104,0.12)' : '#f0ece6',
                transform: isDragOver ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {isDragOver ? (
                <Upload size={24} style={{ color: '#6b8068' }} />
              ) : (
                <ImageIcon size={24} style={{ color: '#b5b0a8' }} />
              )}
            </div>
            <div className="text-center px-4">
              <p className="text-[13px] font-medium" style={{ color: isDragOver ? '#6b8068' : '#8b8580' }}>
                {isDragOver ? 'Drop your image here' : 'Drag & drop an image'}
              </p>
              <p className="text-[11px] mt-1" style={{ color: '#c0bbb3' }}>
                or <span style={{ color: '#6b8068', fontWeight: 500 }}>click to browse</span> · PNG, JPG, GIF, SVG
              </p>
            </div>
          </div>
        ) : (
          <div className="relative group/img">
            <img
              src={block.content.url}
              alt={block.content.alt || 'Block image'}
              className="w-full h-auto max-h-[380px] object-cover rounded-xl"
              onError={() => setImgError(true)}
              onLoad={() => setImgError(false)}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a26]/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-between p-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.92)', color: '#2d2a26' }}
              >
                <Upload size={12} /> Replace
              </button>
              <button
                onClick={clearImage}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                style={{ background: 'rgba(192,86,75,0.9)', color: '#fff' }}
              >
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Tabs & Inputs */}
      <div className="space-y-2.5">
        <div className="flex gap-0.5 p-0.5 rounded-lg w-fit" style={{ background: '#f0ece6' }}>
          <button
            onClick={() => setActiveTab('url')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200"
            style={{
              background: activeTab === 'url' ? '#fff' : 'transparent',
              color: activeTab === 'url' ? '#6b8068' : '#b5b0a8',
              boxShadow: activeTab === 'url' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Link2 size={11} /> URL
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200"
            style={{
              background: activeTab === 'details' ? '#fff' : 'transparent',
              color: activeTab === 'details' ? '#6b8068' : '#b5b0a8',
              boxShadow: activeTab === 'details' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Type size={11} /> Details
          </button>
        </div>

        {activeTab === 'url' ? (
          <div className="flex items-center gap-2.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded whitespace-nowrap"
              style={{ color: '#6b8068', background: '#eef3ed', border: '1px solid #d8e2d6' }}
            >
              URL
            </span>
            <input
              className="flex-1 rounded-lg px-3.5 py-2 text-[13px] outline-none transition-all"
              style={{ background: '#faf8f5', border: '1px solid #e8e4dd', color: '#2d2a26' }}
              value={block.content.url}
              placeholder="https://example.com/image.jpg"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#6b8068'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e8e4dd'; }}
              onChange={(e) => {
                setImgError(false);
                updateBlock(block.id, { url: e.target.value });
              }}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded whitespace-nowrap"
                style={{ color: '#b5b0a8', background: '#f0ece6', border: '1px solid #e8e4dd' }}
              >
                Alt
              </span>
              <input
                className="flex-1 rounded-lg px-3.5 py-2 text-[13px] outline-none transition-all"
                style={{ background: '#faf8f5', border: '1px solid #e8e4dd', color: '#2d2a26' }}
                value={block.content.alt || ''}
                placeholder="Image description"
                onFocus={(e) => { e.currentTarget.style.borderColor = '#6b8068'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e8e4dd'; }}
                onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded whitespace-nowrap"
                style={{ color: '#b5b0a8', background: '#f0ece6', border: '1px solid #e8e4dd' }}
              >
                Caption
              </span>
              <input
                className="flex-1 rounded-lg px-3.5 py-2 text-[13px] outline-none transition-all"
                style={{ background: '#faf8f5', border: '1px solid #e8e4dd', color: '#2d2a26' }}
                value={block.content.caption || ''}
                placeholder="Optional caption"
                onFocus={(e) => { e.currentTarget.style.borderColor = '#6b8068'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e8e4dd'; }}
                onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MarkdownBlock({ block, updateBlock }) {
  const [tab, setTab] = useState('write');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-0.5 mb-4 p-0.5 rounded-lg w-fit" style={{ background: '#f0ece6' }}>
        <button
          onClick={() => setTab('write')}
          className="px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-200"
          style={{
            background: tab === 'write' ? '#fff' : 'transparent',
            color: tab === 'write' ? '#7b6b8a' : '#b5b0a8',
            boxShadow: tab === 'write' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          Write
        </button>
        <button
          onClick={() => setTab('preview')}
          className="px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-200"
          style={{
            background: tab === 'preview' ? '#fff' : 'transparent',
            color: tab === 'preview' ? '#7b6b8a' : '#b5b0a8',
            boxShadow: tab === 'preview' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          Preview
        </button>
      </div>

      {tab === 'write' ? (
        <div
          className="relative rounded-lg transition-all duration-200"
          style={{
            outline: isFocused ? '2px solid rgba(123,107,138,0.15)' : 'none',
            outlineOffset: '2px',
          }}
        >
          <textarea
            className="w-full rounded-lg p-4 outline-none text-[13px] min-h-[200px] resize-none transition-all leading-relaxed"
            style={{
              background: '#faf8f5',
              border: '1px solid #e8e4dd',
              color: '#3d3a36',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            value={block.content.text}
            placeholder="Write markdown here..."
            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[10px] font-medium" style={{ color: '#d0ccc4' }}>
              Supports **bold**, *italic*, `code`, # headings, - lists
            </span>
            <span className="text-[10px] font-medium" style={{ color: '#d0ccc4' }}>
              {(block.content.text || '').split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>
      ) : (
        <div
          className="max-w-none rounded-lg p-5 min-h-[200px] text-[14px] leading-relaxed"
          style={{
            background: '#faf8f5',
            border: '1px solid #e8e4dd',
            color: '#3d3a36',
          }}
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
      return <p style={{ color: '#c0564b' }}>Unknown block type: {block.type}</p>;
  }
}