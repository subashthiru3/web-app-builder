import React from 'react';
import { useDrag } from 'react-dnd';

import './AppBuilder.css';
import { ComponentType } from '@/lib/types';

interface DraggableComponentProps {
  type: ComponentType;
  label: string;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  type,
  label,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`draggable-component${isDragging ? ' dragging' : ''}`}
    >
      <span className="draggable-label">{label}</span>
    </div>
  );
};
