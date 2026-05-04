import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Section {
  id: string;
  title: string;
  content: string;
}

const initialSections: Section[] = [
  { id: 'sec-1', title: 'Summary', content: 'Experienced software engineer...' },
  { id: 'sec-2', title: 'Experience', content: 'Google, Senior Engineer...' },
  { id: 'sec-3', title: 'Education', content: 'MIT, Computer Science...' },
  { id: 'sec-4', title: 'Skills', content: 'React, Node.js, AI...' },
];

export const DragDropBuilder: React.FC = () => {
  const [sections, setSections] = useState(initialSections);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Resume Layout Builder</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="resume-sections">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-4"
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 bg-white border rounded-lg shadow-sm flex items-center gap-4 transition-colors ${snapshot.isDragging ? 'bg-blue-50 border-blue-300' : 'hover:border-gray-300'}`}
                    >
                      <div className="cursor-grab text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{section.title}</h3>
                        <p className="text-gray-500 text-sm truncate">{section.content}</p>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
