import React, { useEffect, useRef, useState } from 'react';
import { X, Eye, ChevronDown, Heading, Type, ImageIcon, FileCode } from 'lucide-react';

// Simple markdown parser (same as in BlockRenderer)
function parseMarkdown(md) {
  if (!md) return '';
  let html = md
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-xl my-3 text-sm overflow-x-auto font-mono">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-800 mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-indigo-300 pl-4 py-1 my-2 italic text-gray-500">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-600">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-500 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*(?:<br\s*\/?>)?)+)/g, '<ul class="my-2 space-y-1">$1</ul>');
  return html;
}

const HEADER_SIZES = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
};

function PreviewBlock({ block, index }) {
  switch (block.type) {
    case 'header': {
      const Tag = block.content.level || 'h2';
      const sizeClass = HEADER_SIZES[Tag] || 'text-3xl';
      return (
        <div style={{ animation: `previewBlockIn 0.4s ease-out ${index * 0.08}s both` }}>
          <Tag className={`${sizeClass} font-extrabold text-gray-900 leading-tight`}>
            {block.content.text}
          </Tag>
        </div>
      );
    }
    case 'text':
      return (
        <div style={{ animation: `previewBlockIn 0.4s ease-out ${index * 0.08}s both` }}>
          <p className="text-gray-600 leading-relaxed text-base whitespace-pre-wrap">
            {block.content.text}
          </p>
        </div>
      );
    case 'image':
      return (
        <figure className="space-y-3" style={{ animation: `previewBlockIn 0.4s ease-out ${index * 0.08}s both` }}>
          {block.content.url && (
            <img
              src={block.content.url}
              alt={block.content.alt || 'Image'}
              className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-sm"
            />
          )}
          {block.content.caption && (
            <figcaption className="text-sm text-gray-400 text-center italic">
              {block.content.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'markdown':
      return (
        <div
          className="prose prose-sm max-w-none text-gray-700"
          style={{ animation: `previewBlockIn 0.4s ease-out ${index * 0.08}s both` }}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(block.content.text) }}
        />
      );
    default:
      return <p className="text-red-400">Unknown block type: {block.type}</p>;
  }
}

export default function PreviewModal({ blocks, onClose }) {
  const contentRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setShowScrollHint(el.scrollHeight > el.clientHeight);
    }

    // Close on Escape key
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleScroll = () => {
    const el = contentRef.current;
    if (el) {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
      setShowScrollHint(!nearBottom);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: 'modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-white via-indigo-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <Eye size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Page Preview</h2>
              <p className="text-[11px] text-gray-400 font-medium -mt-0.5">
                {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'} · Read-only view
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-10 py-10 space-y-8 bg-white relative"
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-sm font-medium">No blocks to preview</p>
            </div>
          ) : (
            blocks.map((block, index) => (
              <PreviewBlock key={block.id} block={block} index={index} />
            ))
          )}
        </div>

        {/* Scroll hint */}
        {showScrollHint && (
          <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-10" style={{ animation: 'bounceHint 1.5s ease-in-out infinite' }}>
            <div className="w-8 h-8 rounded-full bg-gray-100/90 backdrop-blur-sm flex items-center justify-center shadow-md">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-medium">Press Esc to close</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] transition-all duration-200"
          >
            Close Preview
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes previewBlockIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceHint {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(4px); }
        }
      `}</style>
    </div>
  );
}
