"use client";

import React from "react";
import "../../styles/PropertiesPanel.css";

import { useBuilderStore } from "@/lib/store";
import { usePagesStore } from "@/lib/pagesStore";
import type { CanvasComponent } from "@/lib/types";
import type { RowData } from "@/lib/types";
import { getComponentSchema } from "@/lib/componentRegistry";
import { PropertyEditor } from "./PropertyEditor";

export const PropertiesPanel: React.FC = () => {
  const { activePageId } = usePagesStore();
  const { componentsByPage, selectedComponentId, updateComponentProps } =
    useBuilderStore();
  const components = componentsByPage[activePageId]?.components || [];
  const selectedComponent = components.find(
    (c: CanvasComponent) => c.id === selectedComponentId,
  );

  if (!selectedComponent) {
    return (
      <div className="properties-panel-root properties-panel-empty">
        <div className="properties-panel-empty-text">
          <p className="properties-panel-empty-title">No component selected</p>
          <p className="properties-panel-empty-desc">
            Select a component on the canvas to edit
          </p>
        </div>
      </div>
    );
  }

  const schema = getComponentSchema(selectedComponent.type);

  return (
    <div className="properties-panel-root">
      <div className="properties-panel-header">
        <div className="properties-panel-header-row">
          <h3 className="properties-panel-title">{schema.label} Properties</h3>
          {/* <div className="properties-panel-header-actions">
            <button
              onClick={() => duplicateComponent(selectedComponentId)}
              className="properties-panel-header-btn"
              title="Duplicate component"
            >
              <Copy size={18} className="properties-panel-header-icon" />
            </button>
            <button
              onClick={() => removeComponent(selectedComponentId)}
              className="properties-panel-header-btn delete"
              title="Delete component"
            >
              <Trash2
                size={18}
                className="properties-panel-header-icon delete"
              />
            </button>
          </div> */}
        </div>
        <div className="properties-panel-info">ID: {selectedComponentId}</div>
      </div>

      <div className="properties-panel-content">
        <div className="properties-panel-fields">
          {schema.editableFields.map((fieldName) => {
            const fieldValue =
              selectedComponent.props[
                fieldName as keyof typeof selectedComponent.props
              ];
            console.log("[WAB] Field:", fieldName, "Value:", fieldValue);
            return (
              <PropertyEditor
                key={fieldName}
                fieldName={fieldName}
                value={fieldValue}
                onChange={(value) => {
                  console.log("[WAB] Updating", fieldName, "to", value);
                  // Special handling for grid rowData to ensure unique ids and valid array
                  let newValue = value;
                  if (fieldName === "rowData") {
                    if (Array.isArray(value)) {
                      newValue = value.map((row: RowData, idx: number) => {
                        if (
                          row &&
                          (row.id === undefined ||
                            row.id === null ||
                            row.id === "")
                        ) {
                          return { ...row, id: idx + 1 };
                        }
                        return row;
                      });
                    } else {
                      // If not a valid array, do not update
                      return;
                    }
                  }
                  updateComponentProps(
                    selectedComponentId!,
                    { ...selectedComponent.props, [fieldName]: newValue },
                    activePageId,
                  );
                }}
                componentType={selectedComponent.type}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
