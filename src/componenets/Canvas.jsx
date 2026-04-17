import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Copy, MousePointerClick, Layers, Sparkles } from 'lucide-react';
import BlockRenderer from './BlockRenderer';

export default function Canvas({ blocks, onDragEnd, updateBlock, deleteBlock, duplicateBlock }) {
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center" style={{ animation: 'pulse 3s ease-in-out infinite' }}>
            <Layers size={36} className="text-indigo-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-200/50" style={{ animation: 'floatBadge 2s ease-in-out infinite' }}>
            <Sparkles size={14} className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-3 tracking-tight">Start Building</h3>
        <p className="text-gray-400 text-base text-center max-w-md leading-relaxed px-4">
          Pick a component from the palette on the left to begin composing your personal content page.
        </p>
        <div className="flex items-center gap-2 mt-8 text-indigo-500 text-sm font-semibold bg-indigo-50/80 px-5 py-2.5 rounded-full border border-indigo-100">
          <MousePointerClick size={16} />
          Click a component to add it
        </div>

        <style>{`
          @keyframes floatBadge {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-4px) rotate(8deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="canvas-area">
        {(provided, droppableSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`pb-20 transition-all duration-300 rounded-2xl min-h-[300px] ${
              droppableSnapshot.isDraggingOver ? 'bg-indigo-50/40' : ''
            }`}
          >
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                    className={`group relative transition-all duration-200 ${
                      snapshot.isDragging ? 'z-50' : ''
                    }`}
                  >
                    <div
                      className={`relative bg-white rounded-2xl border-2 transition-all duration-300 mb-6 ${
                        snapshot.isDragging
                          ? 'shadow-2xl ring-2 ring-indigo-400/60 border-transparent scale-[1.02] rotate-[0.5deg]'
                          : 'border-gray-100/80 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50'
                      }`}
                      style={{
                        boxShadow: snapshot.isDragging ? undefined : '0 1px 4px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)',
                        animation: !snapshot.isDragging ? `blockIn 0.4s ease-out ${index * 0.05}s both` : undefined,
                      }}
                    >
                      {/* Block toolbar */}
                      <div className={`absolute -top-4 right-4 flex items-center gap-1.5 transition-all duration-200 z-10 ${
                        snapshot.isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div
                          {...provided.dragHandleProps}
                          className="p-2 bg-white rounded-xl border border-gray-200 shadow-lg cursor-grab active:cursor-grabbing text-gray-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all hover:scale-110"
                          title="Drag to reorder"
                        >
                          <GripVertical size={14} />
                        </div>
                        <button
                          onClick={() => duplicateBlock(block.id)}
                          className="p-2 bg-white rounded-xl border border-gray-200 shadow-lg text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all hover:scale-110"
                          title="Duplicate block"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="p-2 bg-white rounded-xl border border-gray-200 shadow-lg text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-all hover:scale-110"
                          title="Delete block"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Colored top accent stripe */}
                      <div className={`h-1 rounded-t-2xl ${
                        block.type === 'header' ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400' :
                        block.type === 'text' ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400' :
                        block.type === 'image' ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400' :
                        block.type === 'markdown' ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400' :
                        'bg-gray-300'
                      }`} />

                      {/* Block type badge + index */}
                      <div className="px-7 pt-3 pb-0 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          block.type === 'header' ? 'text-amber-600 bg-amber-50' :
                          block.type === 'text' ? 'text-blue-600 bg-blue-50' :
                          block.type === 'image' ? 'text-emerald-600 bg-emerald-50' :
                          block.type === 'markdown' ? 'text-violet-600 bg-violet-50' :
                          'text-gray-500 bg-gray-100'
                        }`}>
                          {block.type}
                        </span>
                        <span className="text-[10px] text-gray-300 font-medium">#{index + 1}</span>
                      </div>

                      {/* Block content */}
                      <div className="px-7 pt-4 pb-7">
                        <BlockRenderer block={block} updateBlock={updateBlock} />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <style>{`
        @keyframes blockIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DragDropContext>
  );
}