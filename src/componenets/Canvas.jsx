import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Copy, MousePointerClick, BookOpen } from 'lucide-react';
import BlockRenderer from './BlockRenderer';

const TYPE_COLORS = {
  header:   { stripe: '#8b7355', badge: '#8b7355', badgeBg: '#f5f0ea' },
  text:     { stripe: '#5a6e7f', badge: '#5a6e7f', badgeBg: '#eef2f5' },
  image:    { stripe: '#6b8068', badge: '#6b8068', badgeBg: '#eef3ed' },
  markdown: { stripe: '#7b6b8a', badge: '#7b6b8a', badgeBg: '#f1eef5' },
};

export default function Canvas({ blocks, onDragEnd, updateBlock, deleteBlock, duplicateBlock }) {
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
        {/* Empty state icon */}
        <div className="mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: '#f0ece6', animation: 'pulse 3s ease-in-out infinite' }}
          >
            <BookOpen size={32} style={{ color: '#8b7355' }} />
          </div>
        </div>

        <h3
          className="text-2xl font-bold mb-2 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: '#2d2a26' }}
        >
          Start Building
        </h3>
        <p className="text-[15px] text-center max-w-sm leading-relaxed px-4" style={{ color: '#a09a92' }}>
          Select a component from the palette to begin composing your page.
        </p>

        <div
          className="flex items-center gap-2 mt-7 text-[13px] font-medium px-4 py-2 rounded-lg"
          style={{ color: '#8b7355', background: '#f5f0ea', border: '1px solid #e8e0d4' }}
        >
          <MousePointerClick size={15} />
          Click a component to add it
        </div>
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
            className="pb-20 min-h-[300px] transition-colors duration-300 rounded-xl"
            style={{
              background: droppableSnapshot.isDraggingOver ? 'rgba(139,115,85,0.04)' : 'transparent',
            }}
          >
            {blocks.map((block, index) => {
              const colors = TYPE_COLORS[block.type] || TYPE_COLORS.text;

              return (
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
                        className="relative mb-5 rounded-xl transition-all duration-200"
                        style={{
                          background: '#ffffff',
                          border: snapshot.isDragging
                            ? `2px solid ${colors.stripe}`
                            : '1px solid #e8e4dd',
                          boxShadow: snapshot.isDragging
                            ? '0 12px 40px rgba(0,0,0,0.1)'
                            : '0 1px 3px rgba(0,0,0,0.03)',
                          transform: snapshot.isDragging ? 'scale(1.01)' : 'scale(1)',
                          animation: !snapshot.isDragging
                            ? `blockEnter 0.35s ease-out ${index * 0.04}s both`
                            : undefined,
                        }}
                      >
                        {/* Toolbar */}
                        <div
                          className={`absolute -top-3.5 right-4 flex items-center gap-1 z-10 transition-opacity duration-200 ${
                            snapshot.isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="p-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110"
                            style={{
                              background: '#fff',
                              border: '1px solid #e0dcd5',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                              color: '#b5b0a8',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = colors.stripe; e.currentTarget.style.borderColor = colors.stripe; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#b5b0a8'; e.currentTarget.style.borderColor = '#e0dcd5'; }}
                            title="Drag to reorder"
                          >
                            <GripVertical size={13} />
                          </div>
                          <button
                            onClick={() => duplicateBlock(block.id)}
                            className="p-1.5 rounded-lg transition-all duration-150 hover:scale-110"
                            style={{
                              background: '#fff',
                              border: '1px solid #e0dcd5',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                              color: '#b5b0a8',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#5a6e7f'; e.currentTarget.style.borderColor = '#5a6e7f'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#b5b0a8'; e.currentTarget.style.borderColor = '#e0dcd5'; }}
                            title="Duplicate"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            onClick={() => deleteBlock(block.id)}
                            className="p-1.5 rounded-lg transition-all duration-150 hover:scale-110"
                            style={{
                              background: '#fff',
                              border: '1px solid #e0dcd5',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                              color: '#b5b0a8',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#c0564b'; e.currentTarget.style.borderColor = '#c0564b'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#b5b0a8'; e.currentTarget.style.borderColor = '#e0dcd5'; }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Top accent line */}
                        <div
                          className="h-[3px] rounded-t-xl"
                          style={{ background: colors.stripe }}
                        />

                        {/* Badge + index */}
                        <div className="px-6 pt-3 pb-0 flex items-center justify-between">
                          <span
                            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                            style={{ color: colors.badge, background: colors.badgeBg }}
                          >
                            {block.type}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: '#d0ccc4' }}>
                            #{index + 1}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="px-6 pt-3 pb-6">
                          <BlockRenderer block={block} updateBlock={updateBlock} />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}