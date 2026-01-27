"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { useBuilderStore } from "@/lib/store";
import { ComponentType } from "@/lib/types";
import { CanvasComponentRenderer } from "./CanvasComponentRenderer";

import "./Canvas.css";

export const Canvas: React.FC = () => {
  const { components, selectedComponentId, addComponent, selectComponent } =
    useBuilderStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item: { type: ComponentType }) => {
      addComponent(item.type);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`canvas ${isOver ? "canvasOver" : "canvasDefault"}`}
    >
      <div
        className={`canvas-inner ${isOver ? "canvas-inner-over" : ""}`}
      >
        {components.length === 0 ? (
          <div className="canvas-empty-message">
            <div>
              <p className="canvas-empty-title">Drop components here</p>
              <p className="canvas-empty-desc">Drag components from the left sidebar</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map((component) => (
              <div
                key={component.id}
                className={`canvas-component-wrapper${
                  selectedComponentId === component.id ? " canvas-component-selected" : ""
                }`}
                onClick={() => selectComponent(component.id)}
              >
                <CanvasComponentRenderer component={component} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
