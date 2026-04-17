import React, { useEffect, useRef, useState } from 'react';
import { X, Eye, ChevronDown } from 'lucide-react';

// Simple markdown parser (same as in BlockRenderer)
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

const HEADER_SIZES = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
};

function PreviewBlock({ block, index }) {
  const animStyle = { animation: `fadeInUp 0.4s ease-out ${index * 0.07}s both` };

  switch (block.type) {
    case 'header': {
      const Tag = block.content.level || 'h2';
      const sizeClass = HEADER_SIZES[Tag] || 'text-3xl';
      return (
        <div style={animStyle}>
          <Tag
            className={`${sizeClass} font-bold leading-tight`}
            style={{ color: '#2d2a26', fontFamily: "'Playfair Display', serif" }}
          >
            {block.content.text}
          </Tag>
        </div>
      );
    }
    case 'text':
      return (
        <div style={animStyle}>
          <p className="leading-relaxed text-[15px] whitespace-pre-wrap" style={{ color: '#5a5550' }}>
            {block.content.text}
          </p>
        </div>
      );
    case 'image':
      return (
        <figure className="space-y-2.5" style={animStyle}>
          {block.content.url && (
            <img
              src={block.content.url}
              alt={block.content.alt || 'Image'}
              className="w-full h-auto max-h-[480px] object-cover rounded-xl"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            />
          )}
          {block.content.caption && (
            <figcaption className="text-[13px] text-center italic" style={{ color: '#b5b0a8' }}>
              {block.content.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'markdown':
      return (
        <div
          className="max-w-none text-[14px] leading-relaxed"
          style={{ ...animStyle, color: '#3d3a36' }}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(block.content.text) }}
        />
      );
    default:
      return <p style={{ color: '#c0564b' }}>Unknown block type: {block.type}</p>;
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
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: 'rgba(45,42,38,0.45)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl"
        style={{
          background: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
          animation: 'modalEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-4"
          style={{ borderBottom: '1px solid #e8e4dd' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#2d2a26' }}
            >
              <Eye size={14} className="text-[#f8f6f3]" />
            </div>
            <div>
              <h2
                className="text-[16px] font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif", color: '#2d2a26' }}
              >
                Page Preview
              </h2>
              <p className="text-[10px] font-medium -mt-0.5" style={{ color: '#b5b0a8' }}>
                {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'} · Read-only
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ background: '#f0ece6', color: '#8b8580' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fdf0ee'; e.currentTarget.style.color = '#c0564b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f0ece6'; e.currentTarget.style.color = '#8b8580'; }}
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-9 py-9 space-y-7"
          style={{ background: '#fff' }}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-[13px] font-medium" style={{ color: '#b5b0a8' }}>No blocks to preview</p>
            </div>
          ) : (
            blocks.map((block, index) => (
              <PreviewBlock key={block.id} block={block} index={index} />
            ))
          )}
        </div>

        {/* Scroll hint */}
        {showScrollHint && (
          <div
            className="absolute bottom-[62px] left-1/2 -translate-x-1/2 z-10"
            style={{ animation: 'bounceHint 1.5s ease-in-out infinite' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(240,236,230,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              <ChevronDown size={14} style={{ color: '#8b8580' }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-7 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid #e8e4dd', background: '#faf9f7' }}
        >
          <span className="text-[10px] font-medium" style={{ color: '#c0bbb3' }}>
            Press Esc to close
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200"
            style={{ background: '#2d2a26', color: '#f8f6f3' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#3d3a36'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2d2a26'; }}
          >
            Close Preview
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounceHint {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(3px); }
        }
      `}</style>
    </div>
  );
}
