"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { useBuilderStore } from "@/lib/store";
import { ComponentType, CanvasComponent } from "@/lib/types";
import { CanvasComponentRenderer } from "./CanvasComponentRenderer";
import { Trash2, Copy } from "lucide-react";

import "./Canvas.css";
import { usePagesStore } from "@/lib/pagesStore";

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
  const { pages, activePageId, addPage, setActivePage } = usePagesStore();

  // const selectedTabLabel = useBuilderStore((state) => state.selectedTabLabel);
  // Page functionality removed

  const dropEnabled = pages.length > 0 && activePageId !== 0;
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "component",
      drop: dropEnabled
        ? (item: { type: ComponentType }) => {
            addComponent(item.type, activePageId);
          }
        : undefined,
      collect: (monitor) => ({
        isOver: dropEnabled && !!monitor.isOver(),
      }),
    }),
    [dropEnabled, activePageId, addComponent],
  );

  // Create a ref for the canvas div
  const canvasRef = React.useRef<HTMLDivElement>(null);

  let canvasClass = "canvasDefault";
  if (selectedView === "Lap View") canvasClass = "canvasFull";
  else if (selectedView === "Mobile View") canvasClass = "canvasMobile";
  else if (selectedView === "Tablet View") canvasClass = "canvasTablet";

  // Attach drop to the ref
  React.useEffect(() => {
    if (canvasRef.current && dropEnabled) {
      drop(canvasRef.current);
    }
  }, [drop, dropEnabled]);

  const pageComponents = (componentsByPage[activePageId]?.components ||
    []) as CanvasComponent[];
  return (
    <div ref={canvasRef} className={`canvas ${canvasClass}`}>
      <div className={`canvas-inner ${isOver ? "canvas-inner-over" : ""}`}>
        {pages.length === 0 || activePageId === 0 ? (
          <div className="canvas-empty-message">
            No pages found. Please add a page to enable drag & drop.
          </div>
        ) : pageComponents.length === 0 ? (
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
                      duplicateComponent(component.id, activePageId);
                    }}
                    className="properties-panel-header-btn"
                    title="Duplicate component"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeComponent(component.id, activePageId);
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
