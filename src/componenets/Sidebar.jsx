import React from 'react';
import { Heading, Type, ImagePlus, FileCode, Plus, Layers, Zap } from 'lucide-react';

const TOOLS = [
  {
    type: 'header',
    label: 'Heading',
    desc: 'H1 – H6 titles',
    icon: <Heading size={20} />,
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50/80',
    border: 'border-amber-200/80',
    hoverBorder: 'hover:border-amber-400',
    text: 'text-amber-600',
    glow: 'hover:shadow-amber-100',
  },
  {
    type: 'text',
    label: 'Paragraph',
    desc: 'Rich text content',
    icon: <Type size={20} />,
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50/80',
    border: 'border-blue-200/80',
    hoverBorder: 'hover:border-blue-400',
    text: 'text-blue-600',
    glow: 'hover:shadow-blue-100',
  },
  {
    type: 'image',
    label: 'Image',
    desc: 'Drag & drop or URL',
    icon: <ImagePlus size={20} />,
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-200/80',
    hoverBorder: 'hover:border-emerald-400',
    text: 'text-emerald-600',
    glow: 'hover:shadow-emerald-100',
  },
  {
    type: 'markdown',
    label: 'Markdown',
    desc: 'Write in markdown',
    icon: <FileCode size={20} />,
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50/80',
    border: 'border-violet-200/80',
    hoverBorder: 'hover:border-violet-400',
    text: 'text-violet-600',
    glow: 'hover:shadow-violet-100',
  },
];

export default function Sidebar({ onAdd, blockCount }) {
  return (
    <aside className="w-[280px] min-w-[280px] bg-white border-r border-gray-200/60 h-screen sticky top-0 flex flex-col shadow-sm">
      {/* Sidebar Header */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-gray-800 tracking-tight">Components</h2>
            <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Drag or click to add</p>
          </div>
        </div>
        {blockCount > 0 && (
          <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/60" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
            <Zap size={12} className="text-indigo-500" />
            <span className="text-[11px] font-semibold text-indigo-600">
              {blockCount} {blockCount === 1 ? 'block' : 'blocks'} on canvas
            </span>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        {TOOLS.map((tool, index) => (
          <button
            key={tool.type}
            onClick={() => onAdd(tool.type)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${tool.border} ${tool.bg} ${tool.hoverBorder} ${tool.glow} hover:shadow-lg transition-all duration-200 group text-left active:scale-[0.97]`}
            style={{ animation: `sidebarItemIn 0.3s ease-out ${index * 0.06}s both` }}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:rotate-[-3deg] transition-all duration-200`}>
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm ${tool.text}`}>{tool.label}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{tool.desc}</div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/70 border border-gray-200/50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm group-hover:scale-110 transition-all">
              <Plus size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-100">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl p-4 text-center">
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
            Drag blocks to reorder · Click to edit
          </p>
          <p className="text-[10px] text-gray-300 mt-1.5">
            ✨ Auto-saved to local storage
          </p>
        </div>
      </div>

      <style>{`
        @keyframes sidebarItemIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </aside>
  );
}