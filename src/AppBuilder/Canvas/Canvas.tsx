"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { useBuilderStore } from "@/lib/store";
import { ComponentType, CanvasComponent } from "@/lib/types";
import { CanvasComponentRenderer } from "./CanvasComponentRenderer";
import { Trash2, Copy } from "lucide-react";

import "./Canvas.css";
import { usePagesStore } from "@/lib/pagesStore";

const parseResolution = (
  subView: string,
): { width: number; height: number } | null => {
  if (!subView) return null;

  const idMatch = /(\d+)x(\d+)/i.exec(subView);
  if (idMatch) {
    return {
      width: Number(idMatch[1]),
      height: Number(idMatch[2]),
    };
  }

  const titleMatch = /\((\d+)\s*x\s*(\d+)\)/i.exec(subView);
  if (titleMatch) {
    return {
      width: Number(titleMatch[1]),
      height: Number(titleMatch[2]),
    };
  }

  return null;
};

const getEffectiveView = (selectedView: string, selectedSubView: string) => {
  if (selectedSubView.startsWith("mobile-")) return "Mobile View";
  if (selectedSubView.startsWith("tablet-")) return "Tablet View";
  if (selectedSubView.startsWith("laptop-")) return "Lap View";
  return selectedView;
};

const getCanvasClass = (view: string) => {
  if (view === "Lap View") return "canvasFull";
  if (view === "Mobile View") return "canvasMobile";
  if (view === "Tablet View") return "canvasTablet";
  return "canvasDefault";
};

export const Canvas: React.FC = () => {
  const {
    componentsByPage,
    selectedComponentId,
    addComponent,
    selectComponent,
    duplicateComponent,
    removeComponent,
    canvasSettings,
  } = useBuilderStore();
  const selectedView = useBuilderStore((state) => state.selectedView);
  const selectedSubView = useBuilderStore((state) => state.selectedSubView);
  const { pages, activePageId } = usePagesStore();

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

  const resolution = parseResolution(selectedSubView);
  const effectiveView = getEffectiveView(selectedView, selectedSubView);
  const canvasClass = getCanvasClass(effectiveView);

  // Build inline style from canvasSettings
  const canvasStyle: React.CSSProperties = {
    padding: canvasSettings.padding,
    backgroundColor: canvasSettings.backgroundColor || undefined,
    border: canvasSettings.border
      ? `${canvasSettings.borderSize} solid ${canvasSettings.borderColor}`
      : undefined,
    borderRadius: canvasSettings.borderRadius,
    boxShadow: canvasSettings.shadow ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
    opacity: canvasSettings.visibility
      ? parseInt(canvasSettings.visibility) / 100
      : 1,
    width: resolution ? `${resolution.width}px` : undefined,
    minHeight: resolution ? `${resolution.height}px` : undefined,
    maxWidth: resolution ? "none" : undefined,
    // width removed
  };

  // Attach drop to the ref
  React.useEffect(() => {
    if (canvasRef.current && dropEnabled) {
      drop(canvasRef.current);
    }
  }, [drop, dropEnabled]);

  const pageComponents = (componentsByPage[activePageId]?.components ||
    []) as CanvasComponent[];

  console.log("selectedComponentId:", selectedComponentId);

  return (
    <div
      ref={canvasRef}
      className={`canvas ${canvasClass}`}
      style={canvasStyle}
      onClick={() => selectComponent(null)}
    >
      <div
        className={`canvas-inner ${isOver ? "canvas-inner-over" : ""}`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${canvasSettings.columns}, 1fr)`,
          gap: "16px",
        }}
      >
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
              style={{
                width: component.width ? `${component.width}px` : "auto",
                height: component.height ? `${component.height}px` : "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectComponent(component.id);
              }}
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
