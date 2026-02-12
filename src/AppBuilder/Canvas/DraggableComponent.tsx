import React from "react";
import { useDrag } from "react-dnd";

import "../AppBuilder.css";
import { ComponentType } from "@/lib/types";
import { useBuilderStore } from "@/lib/store";

interface DraggableComponentProps {
  type: ComponentType;
  label: string;
  icon: React.ReactNode | string;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  type,
  label,
  icon,
}) => {
  const sideDrawerOpen = useBuilderStore((state) => state.sideDrawerOpen);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const divRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (divRef.current) {
      drag(divRef.current);
    }
  }, [drag]);

  return (
    <div
      ref={divRef}
      className={
        sideDrawerOpen
          ? `draggable-component${isDragging ? " dragging" : ""}`
          : "draggable-component-collapsed"
      }
      title={!sideDrawerOpen ? label : undefined}
    >
      {!sideDrawerOpen ? (
        <div className="draggableComponent-icon">{icon}</div>
      ) : (
        <>
          <div>{icon}</div>
          <span className="draggable-label">{label}</span>
        </>
      )}
    </div>
  );
};
