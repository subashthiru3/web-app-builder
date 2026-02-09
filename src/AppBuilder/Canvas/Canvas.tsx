"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { useBuilderStore } from "@/lib/store";
import { ComponentType, CanvasComponent } from "@/lib/types";
import { CanvasComponentRenderer } from "./CanvasComponentRenderer";
import { Trash2, Copy } from "lucide-react";

import "./Canvas.css";
// import { usePagesStore } from "@/lib/pagesStore";

export const Canvas: React.FC = () => {
  const {
    componentsByPage,
    selectedComponentId,
    addComponent,
    selectComponent,
    duplicateComponent,
    removeComponent,
  } = useBuilderStore();
  const selectedView = useBuilderStore((state) => state.selectedView);
  // const selectedTabLabel = useBuilderStore((state) => state.selectedTabLabel);
  // Page functionality removed

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item: { type: ComponentType }) => {
      addComponent(item.type);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Create a ref for the canvas div
  const canvasRef = React.useRef<HTMLDivElement>(null);

  let canvasClass = "canvasDefault";
  if (selectedView === "Lap View") canvasClass = "canvasFull";
  else if (selectedView === "Mobile View") canvasClass = "canvasMobile";
  else if (selectedView === "Tablet View") canvasClass = "canvasTablet";

  // Attach drop to the ref
  React.useEffect(() => {
    if (canvasRef.current) {
      drop(canvasRef.current);
    }
  }, [drop]);

  // Use default page id 1 for all components
  const pageComponents = (componentsByPage[1]?.components || []) as typeof componentsByPage[1]["components"];
  console.log("Rendering Canvas with components:", pageComponents);
  return (
    <div ref={canvasRef} className={`canvas ${canvasClass}`}>
      <div className={`canvas-inner ${isOver ? "canvas-inner-over" : ""}`}>
        {pageComponents.length === 0 ? (
          <div className="canvas-empty-message">
            No components found. Drag components to start building.
          </div>
        ) : (
          pageComponents.map((component: CanvasComponent) => (
            <div
              key={component.id}
              className={`canvas-component-wrapper${
                selectedComponentId === component.id
                  ? " canvas-component-selected"
                  : ""
              }`}
              onClick={() => selectComponent(component.id)}
            >
              <CanvasComponentRenderer component={component} />

              {selectedComponentId === component.id && (
                <div className="canvas-component-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateComponent(component.id);
                    }}
                    className="properties-panel-header-btn"
                    title="Duplicate component"
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeComponent(component.id);
                    }}
                    className="properties-panel-header-btn delete"
                    title="Delete component"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
