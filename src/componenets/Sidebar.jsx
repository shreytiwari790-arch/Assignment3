import React from 'react';
import { Heading, Type, ImagePlus, FileCode, Plus, BookOpen } from 'lucide-react';

const TOOLS = [
  {
    type: 'header',
    label: 'Heading',
    desc: 'H1 – H6 titles',
    icon: <Heading size={18} />,
    accent: '#8b7355',
    bgClass: 'bg-[#f5f0ea]',
    borderClass: 'border-[#e8e0d4]',
    textClass: 'text-[#8b7355]',
  },
  {
    type: 'text',
    label: 'Paragraph',
    desc: 'Rich text content',
    icon: <Type size={18} />,
    accent: '#5a6e7f',
    bgClass: 'bg-[#f0f3f6]',
    borderClass: 'border-[#dce3e9]',
    textClass: 'text-[#5a6e7f]',
  },
  {
    type: 'image',
    label: 'Image',
    desc: 'Drag & drop or URL',
    icon: <ImagePlus size={18} />,
    accent: '#6b8068',
    bgClass: 'bg-[#f0f4ef]',
    borderClass: 'border-[#d8e2d6]',
    textClass: 'text-[#6b8068]',
  },
  {
    type: 'markdown',
    label: 'Markdown',
    desc: 'Write in markdown',
    icon: <FileCode size={18} />,
    accent: '#7b6b8a',
    bgClass: 'bg-[#f3f0f6]',
    borderClass: 'border-[#e0dae6]',
    textClass: 'text-[#7b6b8a]',
  },
];

export default function Sidebar({ onAdd, blockCount }) {
  return (
    <aside className="w-[272px] min-w-[272px] bg-[#faf9f7] border-r border-[#e8e4dd] h-screen sticky top-0 flex flex-col">
      {/* Sidebar Header */}
      <div className="px-6 pt-7 pb-5 border-b border-[#e8e4dd]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
            <BookOpen size={14} className="text-[#faf9f7]" />
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-[#1a1a1a] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Components
            </h2>
          </div>
        </div>
        <p className="text-[11px] text-[#a8a29e] font-normal mt-2 ml-11">Click to add to canvas</p>
        {blockCount > 0 && (
          <div className="flex items-center gap-2 mt-3 ml-11">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#6b8068]" />
            <span className="text-[11px] font-medium text-[#6b8068]">
              {blockCount} {blockCount === 1 ? 'block' : 'blocks'} active
            </span>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
        {TOOLS.map((tool, index) => (
          <button
            key={tool.type}
            onClick={() => onAdd(tool.type)}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border ${tool.borderClass} ${tool.bgClass} hover:shadow-md transition-all duration-250 group text-left active:scale-[0.98]`}
            style={{ animation: `slideIn 0.35s ease-out ${index * 0.06}s both` }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-transform duration-250 group-hover:scale-105"
              style={{ backgroundColor: tool.accent }}
            >
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-[13px] ${tool.textClass}`}>{tool.label}</div>
              <div className="text-[11px] text-[#a8a29e] mt-0.5">{tool.desc}</div>
            </div>
            <div className="w-6 h-6 rounded-md border border-[#e0dcd5] bg-white/80 flex items-center justify-center group-hover:border-[#c5bfb5] transition-all">
              <Plus size={12} className="text-[#c5bfb5] group-hover:text-[#8b8580] transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="px-4 pb-5 pt-3 border-t border-[#e8e4dd]">
        <div className="rounded-lg px-4 py-3 bg-[#f5f3ef] text-center">
          <p className="text-[10px] text-[#b5b0a8] font-medium leading-relaxed tracking-wide uppercase">
            Drag to reorder · Click to edit
          </p>
          <p className="text-[10px] text-[#c5c0b8] mt-1">
            Auto-saved locally
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </aside>
  );
}